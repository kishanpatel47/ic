import React from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppBase from '../AppBase';

import CustomText from '../helper/customView/CustomText';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AnimatedButton from '../helper/customView/AnimatedButton';
import AppTheme from '../helper/AppTheme';
import IconUser from '../../Assets/Images/user.png';
import IconPassword from '../../Assets/Images/icon_lock.png';
import IconMail from '../../Assets/Images/mail.png';
import IconMobile from '../../Assets/Images/contact-no.png';
import loginBG from '../../Assets/Images/login.jpg';
import loginBoxBG from '../../Assets/Images/login-box-img.png';
import API from '../connection/http-utils';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import { decode as atob, encode as btoa } from 'base-64';
import strings from '../LanguageFiles/LocalizedStrings';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

export default class Registration extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isMobileVerified: false,
      isOTPVerified: false,
      isOTPSent: false,
      userName: '',
      userEmail: '',
      userMobile: '',
      userOTP: '',
      deviceID: 'test Firebase Device ID',
      loadingCounter: false,
    };
  }

  componentDidMount() {
    this.getToken();
  }

  goLogin = () => {
    this.props.navigation.navigate('login');
  };

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

  verifyMobile = () => {
    if (!this.validateMobile(this.state.userMobile)) {
      this.showAlertMessage(strings.Valid_Mobile);
    } else {
      this.setState({
        loadingCounter: true,
      });
      let params = {
        UserName: this.state.userMobile,
      };

      API.simplePostRequest('/api/Account/verifyuserandsendotp', params)
        .then((data) => {
          this.setState({
            loadingCounter: false,
          });
          console.log(data.jsonResponse);
          if (data.jsonResponse.success) {
            if (data.jsonResponse.data.isuserActive) {
              this.showAlertMessage(strings.USER_EXIST);
              this.props.navigation.navigate('login');
            } else {
              this.setState({
                isMobileVerified: true,
                isOTPSent: true,
              });
            }
          } else {
            this.showAlertMessage(data.jsonResponse.message);
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
    }
  };

  verifyOTP = () => {
    if (!this.validateMobile(this.state.userMobile)) {
      this.showAlertMessage(strings.Valid_Mobile);
    } else if (this.state.userOTP.length <= 0) {
      this.showAlertMessage(strings.Valid_OTP);
    } else {
      this.setState({
        loadingCounter: true,
      });
      let params = {
        UserName: this.state.userMobile,
        Password: this.state.userOTP,
      };
      let strReq = btoa(API.encrpt(JSON.stringify(params)));
      console.log(">>>>>>>");
      console.log(strReq);
      API.simplePostRequest(
        'api/Account/validateotpnew',
        API.encryptedString(strReq),
      )
        .then((dataenc) => {
          this.setState({
            loadingCounter: false,
          });
          var data = API.decrpt(dataenc.jsonResponse);
          console.log(data);
          if (data.data.isValidate == 0) {
            this.setState({
              isOTPVerified: true,
            });
          } else {
            if (data.data.isValidate > 4) {
              this.showAlertMessage(strings.MULTI_ATTEMPTS);
            } else {
              this.showAlertMessage(data.message);
            }
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
    }
  };

  doRegistration = () => {
    if (this.state.userName.length <= 0) {
      this.showAlertMessage(strings.Valid_User_Name);
    } else if (!this.validateMobile(this.state.userMobile)) {
      this.showAlertMessage(strings.Valid_Mobile);
    } else if (!this.validateEmail(this.state.userEmail)) {
      this.showAlertMessage(strings.Valid_Email);
    } else {
      this.setState({
        loadingCounter: true,
      });
      let params = {
        UserName: this.state.userMobile,
        FirstName: this.state.userName,
        Email: this.state.userEmail,
        Mobiledeviceid: this.state.deviceID
      };
      console.log('SIGNUP PARAMS - ', params);
      API.simplePostRequest('api/Account/signupuser', params)
        .then((data) => {
          this.setState({
            loadingCounter: false,
          });
          console.log(data);
          if (data.jsonResponse.success) {
            this.doLogin();
          } else {
            this.showAlertMessage(data.jsonResponse.message);
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
    }
  };

  doLogin = () => {
    let loginParam = JSON.parse(
      JSON.stringify({
        username: this.state.userMobile,
        password: this.state.userOTP,
      }),
    );
    let upwd = API.getUserPassword(this.state.userMobile, this.state.userOTP);
    API.encrypt(upwd.user)
      .then((encUsername) => {
        // console.log(encUsername);
        loginParam.username = btoa(encUsername);
        API.encrypt(upwd.pwd).then((encPassword) => {
          loginParam.password = btoa(encPassword);
          console.log('LOGIN PARAMS - ', loginParam);
          this.setState({
            loadingCounter: true,
          });
          API.authApi(loginParam)
            .then((data) => {
              console.log(data);
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

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={false}
          backgroundColor={AppTheme.APPCOLOR.PRIMARY}
          barStyle={'light-content'}
        />
        <CustomLoadingView isShowModal={this.state.loadingCounter} />
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
                <View
                  style={{
                    // flex:1,
                    borderBottomLeftRadius: 100,
                    // backgroundColor: 'royalblue',
                    flex: 1,
                    marginTop: '2%',
                    height: 225,
                    justifyContent: 'flex-end',
                  }}>
                  <CustomText
                    text={strings.Sign_Up}
                    customStyle={{
                      paddingLeft: 25,
                      fontSize: 30,
                      fontWeight: '800',
                      textAlign: 'left',
                      color: 'white',
                      // backgroundColor:'red',
                      marginBottom: '1%',
                    }}
                  />
                </View>

                <View
                  style={{
                    alignSelf: 'center',
                    paddingTop: 20,
                    borderRadius: 15,
                    elevation: 5,
                    justifyContent: 'center',
                    width: '90%',
                    flex: 1,
                    marginBottom: '2%',
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
                      source={IconMobile}
                      resizeMode="cover"
                      style={{
                        alignSelf: 'center',
                        // backgroundColor: 'red',
                        height: 25,
                        width: 25,
                      }}
                    />
                    <CustomTextInput
                      ref={(ref) => (this.mobileInputTextRef = ref)}
                      name={'mobile'}
                      style={[{ flex: 1 }]}
                      maxLength={10}
                      returnKeyType={'next'}
                      placeholder={strings.MOBILE}
                      keyboardType={'phone-pad'}
                      placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                      onChangeText={(value) =>
                        this.setState({ userMobile: value })
                      }
                    />
                  </View>

                  {this.state.isMobileVerified && !this.state.isOTPVerified ? (
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
                        maxLength={6}
                        ref={(ref) => (this.passwordInputTextRef = ref)}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        secureTextEntry={true}
                        style={[{ flex: 1 }]}
                        returnKeyType={'done'}
                        placeholder={strings.OTP}
                        placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                        onChangeText={(value) =>
                          this.setState({ userOTP: value })
                        }
                      />
                    </View>
                  ) : null}

                  {this.state.isMobileVerified && this.state.isOTPVerified ? (
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
                        ref={(ref) => (this.nameInputTextRef = ref)}
                        name={'name'}
                        maxLength={35}
                        style={[{ flex: 1 }]}
                        returnKeyType={'next'}
                        placeholder={strings.NAME}
                        keyboardType={'default'}
                        placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                        onChangeText={(value) =>
                          this.setState({ userName: value })
                        }
                      />
                    </View>
                  ) : null}

                  {this.state.isMobileVerified && this.state.isOTPVerified ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        margin: 15,
                        marginTop: 5,
                      }}>
                      <Image
                        source={IconMail}
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
                        name={'email'}
                        style={[{ flex: 1 }]}
                        returnKeyType={'done'}
                        placeholder={strings.EMAIL}
                        keyboardType={'email-address'}
                        placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                        onChangeText={(value) =>
                          this.setState({ userEmail: value })
                        }
                      />
                    </View>
                  ) : null}

                  {this.state.isOTPSent &&
                    !this.state.isOTPVerified &&
                    this.state.userMobile ? (
                    <View style={{ margin: 5 }}>
                      <AnimatedButton
                        style={{ alignItem: 'flex-end', marginVertical: 5 }}
                        onPress={() => {
                          this.verifyMobile();
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
                      bottom: 0,
                    }}
                    source={loginBoxBG}>
                    {!this.state.isMobileVerified &&
                      !this.state.isOTPVerified ? (
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
                          this.verifyMobile();
                        }}>
                        <CustomText
                          text={strings.Next}
                          customStyle={{
                            fontSize: 18,
                            fontWeight: '600',
                            textAlign: 'center',
                            color: AppTheme.APPCOLOR.TEXT,
                          }}
                        />
                      </AnimatedButton>
                    ) : null}

                    {this.state.isMobileVerified &&
                      !this.state.isOTPVerified ? (
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
                          this.verifyOTP();
                        }}>
                        <CustomText
                          text={strings.Verify}
                          customStyle={{
                            fontSize: 18,
                            fontWeight: '600',
                            textAlign: 'center',
                            color: AppTheme.APPCOLOR.TEXT,
                          }}
                        />
                      </AnimatedButton>
                    ) : null}

                    {this.state.isMobileVerified && this.state.isOTPVerified ? (
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
                          this.doRegistration();
                        }}>
                        <CustomText
                          text={strings.Sign_Up}
                          customStyle={{
                            fontSize: 18,
                            fontWeight: '600',
                            textAlign: 'center',
                            color: AppTheme.APPCOLOR.TEXT,
                          }}
                        />
                      </AnimatedButton>
                    ) : null}
                  </ImageBackground>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
        <View style={styles.footer}>
          <CustomText
            text={strings.Already_ACT}
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
              this.goLogin();
            }}>
            <CustomText
              text={strings.Login}
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
    borderRadius: 15,
    alignItems: 'center',
    height: 95,
  },
});
