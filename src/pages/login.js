import React from 'react';
import {
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppBase from '../AppBase';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomText from '../helper/customView/CustomText';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AnimatedButton from '../helper/customView/AnimatedButton';
import AppTheme from '../helper/AppTheme';
import IconUser from '../../Assets/Images/icon_user.png';
import IconPassword from '../../Assets/Images/icon_lock.png';
import loginBG from '../../Assets/Images/login.jpg';
import loginBoxBG from '../../Assets/Images/login-box-img.png';
import API from '../connection/http-utils';
import HTML from 'react-native-render-html';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import { decode as atob, encode as btoa } from 'base-64';
import strings from '../LanguageFiles/LocalizedStrings';

export default class Login extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isOTPSent: false,
      userIdText: '',
      passwordText: '',
      deviceID: 'test Firebase Device ID',
      loadingCounter: false,
      modal: false,
      disclaimerData: '',
      icon: 'visibility-off',
      hidePassword: true
    };
  }

  async componentDidMount() {
    AsyncStorage.getItem('isDisclaimer').then((data) => {
      console.log(data);
      if (!data) {
        this.getDisclaimer();
      } else {
        this.setState({
          modal: false,
        });
      }
    });
    this.checkPermission();
    await messaging().requestPermission({
      sound: false,
      announcement: true,
      // ... other permission settings
    });
  }

  getDisclaimer = () => {
    API.simpleGetRequest('api/Account/disclaimer')
      .then((data) => {
        if (data.jsonResponse.status && data.jsonResponse.data.length > 0) {
          this.setState({ disclaimerData: data.jsonResponse.data });
          this.setState({
            modal: true,
          });
        } else {
          this.setState({
            modal: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          modal: false,
        });
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  async registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  async checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      this.registerAppWithFCM();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  // 3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('fcmToken', fcmToken);
        this.setState({
          deviceID: fcmToken,
        });
        //   await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  // 2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  registerUser = () => {
    this.props.navigation.navigate('registration');
  };

  sendOTP = () => {
    if (this.validateMobile(this.state.userIdText)) {
      this.showAlertMessage(strings.OTPSend_Successfully);
      this.setState({ isOTPSent: true, loadingCounter: true });
      const strUser = btoa(
        API.encrpt(
          JSON.stringify({
            UserName: this.state.userIdText,
            MobileDeviceId: this.state.deviceID,
          }),
        ),
      );
      // this.disableResend();
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log(API.encryptedString(strUser))
      API.simplePostRequest('api/Account/login', API.encryptedString(strUser))
        .then((dataenc) => {
          // const res = API.decrpt(dataenc.jsonResponse._bodyBlob.headers.ok);
          console.log(dataenc.jsonResponse);
          this.setState({ isOTPSent: true, loadingCounter: false });
          // if (res.data.isValidate) {
          //   this.setState({ isOTPSent: true });
          // console.log(this.isOTPSent);
          // }
        })
        .catch((err) => {
          this.setState({ loadingCounter: false });
          console.log(err);
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    } else {
      this.showAlertMessage(strings.Valid_Mobile);
    }
  };

  doLogin = () => {
    if (!this.validateMobile(this.state.userIdText)) {
      this.showAlertMessage(strings.Valid_Mobile);
    } else if (this.state.passwordText.length <= 0) {
      this.showAlertMessage(strings.Valid_OTP);
    } else {
      this.setState({
        loadingCounter: true,
      });
      let loginParam = JSON.parse(
        JSON.stringify({
          username: this.state.userIdText,
          password: this.state.passwordText,
        }),
      );
      const upwd = API.getUserPassword(
        this.state.userIdText,
        this.state.passwordText,
      );
      API.encrypt(upwd.user)
        .then((encUsername) => {
          // console.log(encUsername);
          loginParam.username = btoa(encUsername);
          API.encrypt(upwd.pwd).then((encPassword) => {
            loginParam.password = btoa(encPassword);
            // console.log('loginParam', loginParam);
            API.authApi(loginParam)
              .then((data) => {
                this.setState({
                  loadingCounter: false,
                });
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                console.log(data.jsonResponse);
                if (data.jsonResponse.access_token) {
                  this.SaveUserInfo(data.jsonResponse);
                  this.saveToken(data.jsonResponse.access_token);
                  this.props.navigation.replace('dashboard');
                } else {
                  this.showAlertMessage(data.jsonResponse.error_description);
                }
              })
              .catch((err) => {
                this.setState({
                  loadingCounter: false,
                });
                console.log(err);
                if (err.jsonResponse.status == false) {
                  this.showAlertMessage(err.jsonResponse.message);
                }
              });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  SaveUserInfo = async (value) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(value));
    } catch (e) {
      // save error
      console.log('error = ' + e.message);
    }
  };

  saveToken = async (value) => {
    try {
      await AsyncStorage.setItem('access_token', value);
    } catch (e) {
      // save error
      console.log('error = ' + e.message);
    }
  };

  _changeIcon = () => {
    this.setState({
      icon: this.state.icon !== "visibility-off" ? "visibility-off" : "visibility",
      hidePassword: this.state.hidePassword ? false : true
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={false}
          backgroundColor={AppTheme.APPCOLOR.PRIMARY}
          barStyle={'light-content'}
        />
        <CustomLoadingView isShowModal={this.state.loadingCounter} />
        <Modal
          style={styles.modalcss}
          animationType={'slide'}
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            //   Alert.alert('Modal has now been closed.');
          }}>
          <View style={styles.modalmainview}>
            <View style={styles.boxview}>
              <CustomText
                numberOfLines={3}
                customStyle={styles.sortbylabel}
                text={strings.Disclaimer}
              />
              <ScrollView>
                <HTML
                  html={this.state.disclaimerData}
                  tagsStyles={{
                    p: {
                      marginTop: 0,
                      marginBottom: 5,
                      fontSize: 15,
                      textAlign: 'left',
                    },
                  }}
                  imagesMaxWidth={Dimensions.get('window').width / 4}
                />
              </ScrollView>
              <AnimatedButton
                style={{ marginVertical: 7 }}
                onPress={() => {
                  AsyncStorage.setItem('isDisclaimer', 'true');
                  this.setState({
                    modal: false,
                  });
                }}>
                <CustomText
                  text={strings.Accept}
                  customStyle={{
                    padding: 5,
                    borderRadius: 5,
                    elevation: 5,
                    textAlign: 'center',
                    justifyContent: 'center',
                    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
                    color: AppTheme.APPCOLOR.WHITE,
                  }}
                />
              </AnimatedButton>
            </View>
            {/* </View> */}
          </View>
        </Modal>
        <ImageBackground source={loginBG} style={styles.image}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : null}
            style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <CustomLoadingView
                isShowModal={this.state.loadingCounter > 0 ? true : false}
              />
              <ScrollView
                keyboardDismissMode={'on-drag'}
                keyboardShouldPersistTaps={'handled'}>
                {/* {BackgroundImage} */}
                <View
                  style={{
                    marginTop: Platform.OS === 'ios' ? 20 : 0,
                    // flex:1,
                    // borderBottomLeftRadius: 100,
                    // backgroundColor: 'royalblue',
                    flex: 1,
                    // height: '100%',
                    height: 250,
                    justifyContent: 'flex-end',
                  }}>
                  <CustomText
                    text={strings.Login}
                    customStyle={{
                      paddingLeft: 25,
                      fontSize: 30,
                      fontWeight: '800',
                      textAlign: 'left',
                      color: 'white',
                      // backgroundColor:'red',
                      marginBottom: '5%',
                    }}
                  />
                </View>

                <View
                  style={{
                    marginTop: Platform.OS === 'ios' ? 20 : 0,
                    alignSelf: 'center',
                    paddingTop: 32,
                    borderRadius: 25,
                    elevation: 5,
                    justifyContent: 'center',
                    width: '90%',
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,1)',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomColor: 'black',
                      borderBottomWidth: 1,
                      margin: 15,
                      marginTop: 5,
                    }}>
                    <Image
                      source={IconUser}
                      resizeMode="cover"
                      style={{
                        alignSelf: 'center',
                        // backgroundColor: 'red',
                        height: 25,
                        width: 25,
                      }}
                    />
                    <CustomTextInput
                      ref={(ref) => (this.emailInputTextRef = ref)}
                      name={'mobile'}
                      maxLength={10}
                      style={[{ flex: 1 }]}
                      returnKeyType={'done'}
                      placeholder={strings.MOBILE}
                      keyboardType={'phone-pad'}
                      placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                      onChangeText={(value) =>
                        this.setState({ userIdText: value })
                      }
                    />
                  </View>
                  {this.state.isOTPSent && this.state.userIdText ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: AppTheme.APPCOLOR.TEXT,
                        borderBottomWidth: 1,
                        margin: 15,
                      }}>
                      <Image
                        source={IconPassword}
                        resizeMode="cover"
                        style={{
                          alignSelf: 'center',
                          // backgroundColor: 'red',
                          height: 25,
                          width: 25,
                        }}
                      />
                      <CustomTextInput
                        name={'otp'}
                        textContentType='oneTimeCode'
                        autoComplete='sms-otp'
                        maxLength={6}
                        ref={(ref) => (this.passwordInputTextRef = ref)}
                        onSubmitEditing={() => {
                          this.doLogin()
                          Keyboard.dismiss()
                        }}
                        secureTextEntry={this.state.hidePassword}
                        style={[{ flex: 1 }]}
                        keyboardType={"numeric"}
                        returnKeyType={'done'}
                        placeholder={strings.OTP}
                        placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                        onChangeText={(value) =>
                          this.setState({ passwordText: value })
                        }
                      />
                      <IconMaterialIcons
                        name={this.state.icon}
                        size={20}
                        onPress={() => this._changeIcon()}
                        style={{
                          marginTop: 12
                        }}
                      />
                    </View>
                  ) : null}

                  {this.state.isOTPSent && this.state.userIdText ? (
                    <View style={{ margin: 5 }}>
                      <AnimatedButton
                        style={{ alignItem: 'flex-end', marginVertical: 5 }}
                        onPress={() => {
                          this.sendOTP();
                        }}>
                        <CustomText
                          text={strings.Resend_OTP}
                          customStyle={{
                            marginHorizontal: 8,
                            // marginVertical:20,
                            // fontSize: 30,  
                            fontWeight: '700',
                            textAlign: 'right',
                            color: 'black',
                            // backgroundColor: 'red',
                            // height:50,
                          }}
                        />
                      </AnimatedButton>
                    </View>
                  ) : null}

                  <ImageBackground
                    style={styles.backgroundImage}
                    imageStyle={{
                      bottom: 0, // Whatever offset you want from the bottom
                    }}
                    source={loginBoxBG}>
                    <AnimatedButton
                      style={{
                        borderRadius: 20,
                        elevation: 5,
                        // marginHorizontal: 16,
                        margin: 25,
                        height: 50,
                        width: 150,
                        backgroundColor: AppTheme.APPCOLOR.YELLOW,
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                      onPress={() => {
                        if (this.state.isOTPSent && this.state.userIdText) {
                          this.doLogin();
                        } else {
                          this.sendOTP();
                        }
                      }}>
                      <CustomText
                        text={
                          this.state.isOTPSent && this.state.userIdText
                            ? strings.Login
                            : strings.SEND_OTP
                        }
                        customStyle={{
                          fontSize: 18,
                          fontWeight: '600',
                          textAlign: 'center',
                          color: AppTheme.APPCOLOR.TEXT,
                        }}
                      />
                    </AnimatedButton>
                  </ImageBackground>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>

        <View style={styles.footer}>
          <CustomText
            text={strings.Dont_account}
            customStyle={{
              marginHorizontal: 8,
              marginVertical: 16,
              // fontSize: 30,
              fontWeight: '500',
              textAlign: 'right',
              color: AppTheme.APPCOLOR.TEXT,
              // backgroundColor: 'red',
              // height:50,
            }}
          />
          <AnimatedButton
            style={{ justifyContent: 'center', marginVertical: 16 }}
            onPress={() => {
              this.registerUser();
            }}>
            <CustomText
              text={strings.Sign_Up}
              customStyle={{
                marginHorizontal: 8,
                // marginVertical:20,
                // fontSize: 30,
                fontWeight: '500',
                textAlign: 'right',
                color: AppTheme.APPCOLOR.PRIMARY,
                // backgroundColor: 'red',
                // height:50,
              }}
            />
          </AnimatedButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // position: 'relative',
  },
  bottom_image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    // marginBottom: 15,
  },
  backgroundImage: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  modalcss: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalmainview: {
    flex: 1,
    backgroundColor: '#00000080',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxview: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 20,
  },
  sortbylabel: {
    color: AppTheme.APPCOLOR.BLACK,
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
});
