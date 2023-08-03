import React from 'react';
import AppBase from '../AppBase';

import { StyleSheet, View, Image, Keyboard } from 'react-native';

import CustomText from '../helper/customView/CustomText';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AnimatedButton from '../helper/customView/AnimatedButton';
import AppTheme from '../helper/AppTheme';
import IconUser from '../../Assets/Images/icon_user.png';
import IconPassword from '../../Assets/Images/icon_lock.png';
import API from '../connection/http-utils';
import strings from '../LanguageFiles/LocalizedStrings';

export default class ForgotPassword extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      userIdText: '',
      passwordText: '',
      repasswordText: '',
    };
  }

  signInPressed = () => {
    this.props.navigation.pop();
  };

  loginPressed = () => { };

  CallWS_ChangePassword = () => {
    // console.log(this.state.userIdText)
    if (this.state.userIdText.length <= 0) {
      this.showAlertMessage(strings.Valid_Email);
    } else if (this.state.passwordText.length <= 0) {
      this.showAlertMessage(strings.Valid_pass);
    } else if (this.state.repasswordText.length <= 0) {
      this.showAlertMessage(strings.Valid_cpass);
    } else if (this.state.passwordText != this.state.repasswordText) {
      this.showAlertMessage(strings.Valid_pass_cpass);
    } else {
      // const params = {
      //     db: 'zota_odoo',
      //     login: this.state.userIdText,
      //     password: this.state.passwordText
      // }

      const params = {
        model: 'res.users',
        method: 'reset_password',
        args: [null, this.state.userIdText, this.state.passwordText],
        kwargs: {},
      };
      // console.warn("getLoginData" + JSON.stringify(params))
      API.changePassword(params).then((jsonResponse) => {
        if (
          !Singleton.getInstance().isCheckError(
            jsonResponse,
            this.props.navigation,
          )
        ) {
          this.showAlertMessage(
            'changePassword = ' + JSON.stringify(jsonResponse),
          );
          // if (!Singleton.getInstance().isCheckError(jsonResponse)) {
          //     console.log("getUserInfo = " + JSON.stringify(jsonResponse))
          //     if (jsonResponse.result.records.length > 0) {
          //         this.SaveUserInfo(jsonResponse.result.records[0])
          //     }
          // }
        }
      });
    }
  };

  render() {
    // const BackgroundImage = (
    //     <Image
    //         source={SplashBackground}
    //         resizeMode="cover"
    //         style={{
    //             position: 'relative',
    //             width: '100%', height: '100%'
    //         }}
    //     />
    // );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '',
        }}>
        {/* {BackgroundImage} */}
        <View
          style={{
            // flex:1,
            borderBottomLeftRadius: 100,
            backgroundColor: 'royalblue',
            height: '25%',
            justifyContent: 'flex-end',
          }}>
          <CustomText
            text={'Forgot password'}
            customStyle={{
              fontSize: 30,
              fontWeight: '800',
              textAlign: 'center',
              color: 'white',
              // backgroundColor:'red',
              marginBottom: '10%',
            }}
          />
        </View>

        <View
          style={{
            alignSelf: 'center',
            paddingVertical: 32,
            borderRadius: 30,
            justifyContent: 'center',
            width: '90%',
            // flex: 1,
            // backgroundColor: 'rgba(0,0,0,0.15)'
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
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
              style={[styles.textFieldStyle, { flex: 1 }]}
              returnKeyType={'next'}
              placeholder={strings.ENTER_EMAIL}
              placeholderTextColor={'black'}
              onChangeText={(value) => this.setState({ userIdText: value })}
              onSubmitEditing={(value) => {
                console.warn(value);
                this.passwordInputTextRef.focus();
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
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
              name={'password'}
              ref={(ref) => (this.passwordInputTextRef = ref)}
              style={[styles.textFieldStyle, { flex: 1 }]}
              returnKeyType={'next'}
              secureTextEntry={true}
              placeholder={strings.ENTER_NEW_PASS}
              placeholderTextColor={'black'}
              onChangeText={(value) => this.setState({ passwordText: value })}
              onSubmitEditing={(value) => {
                console.warn(value);
                this.repasswordInputTextRef.focus();
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
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
              name={'password'}
              ref={(ref) => (this.repasswordInputTextRef = ref)}
              style={[styles.textFieldStyle, { flex: 1 }]}
              returnKeyType={'done'}
              placeholder={strings.ENTER_NEW_CPASS}
              placeholderTextColor={'black'}
              onChangeText={(value) => this.setState({ repasswordText: value })}
              onSubmitEditing={(value) => {
                console.warn(value);
                Keyboard.dismiss();
              }}
            />
          </View>

          <AnimatedButton
            style={{
              borderRadius: 25,
              marginHorizontal: 16,
              marginTop: 16,
              height: 50,
              backgroundColor: AppTheme.APPCOLOR.PRIMARY,
              justifyContent: 'center',
            }}
            onPress={() => {
              this.CallWS_ChangePassword();
            }}>
            <CustomText
              text={strings.SEND}
              customStyle={{
                fontSize: 22,
                fontWeight: '800',
                textAlign: 'center',
                color: 'white',
              }}
            />
          </AnimatedButton>

          {/* <View style={{ flexDirection: 'row' }}>
                        <AnimatedButton
                            style={{ justifyContent: 'center', marginVertical: 16 }}
                            onPress={() => {
                                this.signInPressed();
                            }}>
                            <CustomText
                                text={'Sign In'}
                                customStyle={{
                                    marginHorizontal: 8,
                                    // marginVertical:20,
                                    // fontSize: 30,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    color: AppTheme.APPCOLOR.PRIMARY,
                                    // backgroundColor: 'red',
                                    // height:50,
                                }}
                            />
                        </AnimatedButton>
                    </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textFieldStyle: {
    fontFamily: AppTheme.APP_FONTS.REGULAR,
    color: AppTheme.APPCOLOR.PRIMARY,
    fontSize: 17,
    height: 50,
    padding: 8,
    // backgroundColor:'red',
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
  },
});
