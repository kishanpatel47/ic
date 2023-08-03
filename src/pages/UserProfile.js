import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Share,
  Modal,
  Image,
  Switch,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import NoImage from '../../Assets/Images/noimage.png';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'; //https://oblador.github.io/react-native-vector-icons/
import { View } from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconEdit from '../../Assets/Images/edit-icon.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import CustomText from '../helper/customView/CustomText';
import BaseView from '../helper/customView/BaseView';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import API from '../connection/http-utils';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AppBase from '../AppBase';
import { decode as atob, encode as btoa } from 'base-64';
import TextAvatar from 'react-native-text-thumbnail';
import strings from '../LanguageFiles/LocalizedStrings';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import DeviceInfo from 'react-native-device-info';
import Singleton from '../helper/Singleton';
import * as ImagePicker from "react-native-image-picker"
import ActionSheet from '../helper/customView/ActionSheet';
export default class UserProfile extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      todayString: moment(new Date()).format('DD-MMM-YYYY'),
      userInfo: '',
      modal: false,
      loadingCounter: false,
      userName: '',
      userMobile: '',
      userEmail: '',
      userAddress: '',
      userCity: '',
      userState: '',
      userZip: '',
      userCountry: '',
      statesList: [],
      cityList: [],
      isSoundOff: Singleton.getInstance().isSoundOff,
      resourcePath: {},
      actionSheet: false,
      actionItems: [
        {
          id: 1,
          label: strings.CAM,
          onPress: () => this.cameraLaunch()
        },
        {
          id: 2,
          label: strings.GAL,
          onPress: () => this.imageGalleryLaunch()
        }
      ],
      imagedata: '',
      base64Image: ''
    };
  }

  getUserData = async () => {
    console.log('isSoundOff = ' + Singleton.getInstance().isSoundOff);
    this.setState(
      {
        loadingCounter: true,
        isSoundOff: Singleton.getInstance().isSoundOff,
      },
      () => {
        API.getRequest('api/Account/getuserprofile')
          .then((dataenc) => {
            const data = API.decrpt(dataenc.jsonResponse);
            console.log(data.data);
            setTimeout(() => {
              this.setState({
                loadingCounter: false,
                userInfo: data.data,
                userName:
                  data.data && data.data.firstName ? data.data.firstName : '',
                userMobile:
                  data.data && data.data.mobileNo ? data.data.mobileNo : '',
                userEmail:
                  data.data && data.data.email ? data.data.email : '',
                userAddress:
                  data.data && data.data.address1 ? data.data.address1 : '',
                userCity:
                  data.data && data.data.city ? parseInt(data.data.city) : 0,
                userState:
                  data.data && data.data.userState
                    ? parseInt(data.data.userState)
                    : 0,
                userZip:
                  data.data && data.data.zipcode ? data.data.zipcode : '',
                imagedata: data.data && data.data.docPath ? data.data.docPath : '',
              }, () => {
                this.getStates();
              });
            }, 1000);
          }).catch((err) => {
            this.setState({
              loadingCounter: false,
            });
            console.log(err);
          });
      }).catch((err) => {
        this.setState({
          loadingCounter: false,
        });
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  getStates = () => {
    this.setState({
      loadingCounter: true,
    }, () => {
      API.getRequest('api/user/statecity')
        .then((data) => {
          this.setState({
            loadingCounter: false,
          });
          var _statesList = [];
          var _tempData = data.jsonResponse.data;
          // console.log(_tempData);
          if (_tempData.length > 0) {
            _tempData.map((stateItem) => {
              _statesList.push({ label: stateItem.name, value: stateItem.id });
            });
            this.setState(
              {
                statesList: _statesList,
              },
              () => {
                if (this.state.userState) {
                  this.getCity(this.state.userState);
                }
              },
            );
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
  };

  getCity = (userState) => {
    this.setState({
      loadingCounter: true,
    }, () => {
      API.getRequest('api/user/statecity?sid=' + userState)
        .then((data) => {
          var _cityList = [];
          var _tempData = data.jsonResponse.data;
          // console.log(_tempData);
          this.setState({
            loadingCounter: false,
          });
          if (_tempData.length > 0) {
            _tempData.map((stateItem) => {
              _cityList.push({ label: stateItem.name, value: stateItem.id });
            });
            this.setState({
              cityList: _cityList,
            });
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
  };

  logoutCall = () => {
    this.setState({
      loadingCounter: true,
    }, () => {
      API.getRequest('api/Account/resetfcmtocken')
        .then((data) => {
          console.log('Logout data response');
          console.log(data);
          // API.decrpt(data.jsonResponse);
          this.setState({
            loadingCounter: false,
          });
          if (data.jsonResponse.success) {
            AsyncStorage.removeItem('userInfo');
            AsyncStorage.removeItem('access_token');
            AsyncStorage.removeItem('loginData');
            this.props.navigation.replace('login');
          } else {
            this.showAlertMessage(data.jsonResponse.message);
            AsyncStorage.removeItem('userInfo');
            AsyncStorage.removeItem('access_token');
            AsyncStorage.removeItem('loginData');
            this.props.navigation.replace('login');

          }
        })
        .catch((err) => {
          this.setState({
            loadingCounter: false,
          });
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    });
  }
  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUserData();
    });
  };

  processToLogOut = () => {
    this.logoutCall();
  };

  goAddressList = () => {
    this.props.navigation.push('addressList');
  };

  goFavorite = () => {
    this.props.navigation.push('favorite');
  };

  goLanguage = () => {
    this.props.navigation.push('selectLanguage');
  };

  goAboutUs = () => {
    this.props.navigation.push('about');
  };

  goFeedback = () => {
    this.props.navigation.push('feedback');
  };

  goContactUs = () => {
    this.props.navigation.push('contact');
  };

  editProfile = () => {
    if (this.state.statesList.length > 0) {
      this.setState({
        modal: true,
      });
    }
  };

  updateProfile = () => {
    if (this.state.userName.length <= 0) {
      this.showAlertMessage(strings.Valid_User_Name);
    } else if (!this.validateEmail(this.state.userEmail)) {
      this.showAlertMessage(strings.Valid_Email);
    } else if (!this.validateZip(this.state.userZip)) {
      this.showAlertMessage(strings.Valid_Zip);
    } else {
      var params = {
        userName: this.state.userMobile,
        firstName: this.state.userName,
        email: this.state.userEmail,
        address1: this.state.userAddress,
        city: this.state.userCity,
        userState: this.state.userState,
        zipcode: this.state.userZip,
      };
      var strReq = btoa(API.encrpt(JSON.stringify(params)));
      API.postRequest(
        'api/Account/updateprofilenew',
        API.encryptedString(strReq),
      )
        .then((dataenc) => {
          var data = API.decrpt(dataenc.jsonResponse);
          if (
            (data && data.message == 'Invalid Request') ||
            data.message == 'User not found'
          ) {
            this.showAlertMessage(data.message);
            this.setState({
              loadingCounter: false,
            });
          } else {
            // this.showAlertMessage(data.message);
            this.showToastMessage(data.message);
            this.setState(
              {
                modal: false,
              },
              () => {
                if (this.state.base64Image) {
                  this.updatePhoto(this.state.base64Image);
                }
                else {
                  this.getUserData();
                }
              },
            );
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

  shareApp = async () => {
    try {
      await API.getRequest('api/AppMaster/getshareappdetail')
        .then((data) => {
          // console.log(data.jsonResponse.status)
          if (data.jsonResponse.success) {
            const result = Share.share({
              message:
                data.jsonResponse.data.shareAppText +
                '\n' +
                data.jsonResponse.data.shareLink,
              title: data.jsonResponse.data.shareAppSubject,
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
                console.log(result.activityType);
              } else {
                // shared
                console.log('Shared Success');
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
              console.log('Shared Dismiss');
            }
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    } catch (error) {
      alert(error.message);
    }
  };

  logoutAlertMessage = (message) => {
    Alert.alert(
      'Alert',
      message,
      [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: strings.LOGOUT,
          style: 'destructive',
          onPress: () => {
            console.log('OK Pressed');
            this.processToLogOut();
          },
        },
      ],
      { cancelable: true },
    );
  };

  updatePhoto = (base64) => {
    var params = {
      Base64Document: base64,
      DocName: this.state.userMobile + '.jpg',
      RefType: "UserImage"
    };
    this.setState({
      loadingCounter: true
    });
    // var strReq = btoa(API.encrpt(JSON.stringify(params)));
    API.postRequest('api/common/uploaduserimage', params).then((response) => {
      this.setState({
        // loadingCounter: false,
        base64Image: ''
      }, () => {
        this.getUserData();
      });
      if (!response.jsonResponse.status) {
        this.showAlertMessage(response.jsonResponse.message);
      } else {
        this.showToastMessage(response.jsonResponse.message);
      }
      // console.log(response.jsonResponse);
    }).catch((err) => {
      this.setState({
        loadingCounter: false,
      });
      console.log(err);
      if (err.jsonResponse.status == false) {
        this.showAlertMessage(err.jsonResponse.message);
      }
    });
  }

  cameraLaunch = () => {
    this.closeActionSheet();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.3,
      includeBase64: true
    };
    setTimeout(() => {
      ImagePicker.launchCamera(options, (res) => {
        // console.log('Response = ', res.assets[0].base64);
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          // console.log(res.assets[0].uri);
          this.setState({
            imagedata: res.assets[0].uri,
            base64Image: res.assets[0].base64
          }, () => {
            // this.updatePhoto(res.assets[0].base64);
          });
        }
      });
    }, 500);

  }

  imageGalleryLaunch = () => {
    this.closeActionSheet();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.3,
      includeBase64: true
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      // console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        console.log(res.assets[0].uri);
        this.setState({
          imagedata: res.assets[0].uri,
          base64Image: res.assets[0].base64
        }, () => {
          // this.updatePhoto(res.assets[0].base64);
        });
      }
    });
  }

  setActionSheet = () => {
    console.log('SHOW ACTIONSHEET');
    this.setState({
      // modal: false,
      actionSheet: true
    })
  }

  closeActionSheet = () => {
    this.setState({
      actionSheet: false
    })
  }


  render() {
    return (
      <BaseView style={{ flex: 1 }}>
        <CustomLoadingView
          isShowModal={this.state.loadingCounter ? true : false}
        />

        <Modal
          style={[styles.modalcss, { zIndex: 99 }]}
          animationType={'slide'}
          transparent={true}
          backdropOpacity={0.1}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modal: false });
          }}>
          <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 50}
            enabled={Platform.OS === "ios" ? true : false} style={styles.modalmainview}>
            <View style={styles.boxview}>
              <ScrollView>
                <View style={styles.centerContent}>
                  <TouchableOpacity onPress={() => this.setActionSheet()} >
                    <View style={styles.whitecircle}>
                      <View style={styles.circleImage}>
                        {this.state.imagedata ? (
                          <Image
                            source={{
                              uri: this.state.imagedata + "?date=" + moment().valueOf(),
                              cache: "reload",
                              headers: {
                                Pragma: "no-cache"
                              }
                            }}
                            key={new Date()}
                            style={styles.productIMG}
                            resizeMode={"stretch"}
                          />
                        ) : (
                          <Image source={NoImage} style={styles.productIMG} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <CustomTextInput
                  ref={(ref) => (this.nameInputTextRef = ref)}
                  name={'Name'}
                  maxLength={35}
                  value={this.state.userName}
                  style={styles.textinput}
                  maxLength={20}
                  returnKeyType={'next'}
                  placeholder={strings.NAME}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) => this.setState({ userName: value })}
                />

                <CustomTextInput
                  ref={(ref) => (this.mobileInputTextRef = ref)}
                  name={'Mobile'}
                  maxLength={10}
                  value={this.state.userMobile}
                  editable={false}
                  style={styles.textinput}
                  returnKeyType={'next'}
                  placeholder={strings.MOBILE}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) => this.setState({ userMobile: value })}
                />

                <CustomTextInput
                  ref={(ref) => (this.emailInputTextRef = ref)}
                  name={'Email'}
                  keyboardType={'email-address'}
                  value={this.state.userEmail}
                  style={styles.textinput}
                  returnKeyType={'next'}
                  placeholder={strings.EMAIL}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) => this.setState({ userEmail: value })}
                />

                <CustomTextInput
                  ref={(ref) => (this.addressInputTextRef = ref)}
                  name={'Address'}
                  value={this.state.userAddress}
                  style={styles.textinput}
                  returnKeyType={'done'}
                  maxLength={50}
                  multiline={true}
                  placeholder={strings.ADDRESS}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) => this.setState({ userAddress: value })}
                />
                {this.state.statesList.length > 0 ? (
                  <DropDownPicker
                    zIndex={2000}
                    items={this.state.statesList}
                    placeholder={strings.STATE}
                    style={styles.textinput}
                    activeLabelStyle={{ color: AppTheme.APPCOLOR.PRIMARY }}
                    defaultValue={
                      this.state.userState ? this.state.userState : null
                    }
                    containerStyle={{ height: 40, marginTop: 15 }}
                    style={{ backgroundColor: AppTheme.APPCOLOR.WHITE }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{ backgroundColor: AppTheme.APPCOLOR.WHITE }}
                    onChangeItem={(item) => {
                      this.setState({
                        userState: item.value,
                        userCity: '',
                      });
                      this.getCity(item.value);
                    }}
                  />
                ) : null}

                {this.state.userState && this.state.cityList.length > 0 ? (
                  <DropDownPicker
                    zIndex={1000}
                    items={this.state.cityList}
                    placeholder={strings.CITY}
                    style={styles.textinput}
                    activeLabelStyle={{ color: AppTheme.APPCOLOR.PRIMARY }}
                    defaultValue={
                      this.state.userCity ? this.state.userCity : null
                    }
                    containerStyle={{ height: 40, marginTop: 15 }}
                    style={{ backgroundColor: AppTheme.APPCOLOR.WHITE }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{ backgroundColor: AppTheme.APPCOLOR.WHITE }}
                    onChangeItem={(item) => {
                      this.setState({
                        userCity: item.value,
                      });
                      console.log(item.label, item.value);
                    }}
                  />
                ) : null}

                <CustomTextInput
                  ref={(ref) => (this.zipInputTextRef = ref)}
                  name={'Zip'}
                  value={this.state.userZip.toString()}
                  style={styles.textinput}
                  keyboardType={'phone-pad'}
                  maxLength={6}
                  returnKeyType={'done'}
                  placeholder={strings.ZIP}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) => this.setState({ userZip: value })}
                />

                <View
                  style={[
                    styles.centerContent,
                    { borderRadius: 0, borderWidth: 0 },
                  ]}>
                  <View style={{ flexDirection: 'row' }}>
                    <AnimatedButton
                      onPress={() => {
                        this.updateProfile();
                      }}
                      style={styles.savebtn}>
                      <CustomText
                        text={strings.UPDATE}
                        customStyle={styles.savetxt}
                      />
                    </AnimatedButton>
                    <AnimatedButton
                      onPress={() => {
                        this.setState({ modal: false }, () => this.getUserData());
                      }}
                      style={styles.savebtn}>
                      <CustomText
                        text={strings.CANCEL}
                        customStyle={styles.savetxt}
                      />
                    </AnimatedButton>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
          <Modal
            style={{ justifyContent: 'flex-end', margin: 0, zIndex: 999 }}
            animationType={'slide'}
            transparent={true}
            backdropOpacity={0.1}
            visible={this.state.actionSheet}
          >
            <View style={styles.actionsheet_containerStyle}>
              <View style={styles.actionsheet_content}>
                <ActionSheet
                  actionItems={this.state.actionItems}
                  onCancel={this.closeActionSheet}
                />
              </View>
            </View>

          </Modal>
        </Modal>

        <SafeAreaView
          style={{ backgroundColor: AppTheme.APPCOLOR.PRIMARY, flex: 1 }}>
          <ScrollView
            style={{ backgroundColor: AppTheme.APPCOLOR.WHITE, flex: 1 }}>
            <View style={styles.headerbox}>
              <View style={styles.row}>
                <View style={{ flex: 0.3, alignItems: 'center' }}>
                  <View style={styles.whitecircle}>
                    <View style={styles.circleImage}>
                      {
                        this.state.imagedata ?
                          <Image
                            source={{
                              uri: this.state.imagedata + "?date=" + moment().valueOf(),
                              cache: "reload",
                              headers: {
                                Pragma: "no-cache"
                              }
                            }}
                            key={new Date()}
                            style={styles.profilePic}
                            resizeMode={"stretch"}
                          />
                          :
                          <TextAvatar
                            backgroundColor={AppTheme.APPCOLOR.WHITE}
                            textColor={AppTheme.APPCOLOR.PRIMARY}
                            size={70}
                            type={'circle'}>
                            {this.state.userInfo.firstName
                              ? this.state.userInfo.firstName
                              : 'NA'}
                          </TextAvatar>
                      }
                    </View>
                  </View>
                </View>

                <View style={{ flex: 0.7 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <CustomText
                      customStyle={[styles.userName]}
                      text={
                        this.state.userInfo.firstName
                          ? this.state.userInfo.firstName
                          : 'NA'
                      }
                    />
                    <AnimatedButton
                      style={styles.editAnimatedButton}
                      onPress={() => {
                        this.editProfile();
                      }}>
                      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Image
                          source={IconEdit}
                          resizeMode="cover"
                          style={styles.editicon}
                        />
                        <CustomText
                          customStyle={[styles.editText]}
                          text={
                            strings.Edit
                          }
                        />
                      </View>
                    </AnimatedButton>

                  </View>

                  <CustomText
                    customStyle={[styles.userMobile]}
                    text={
                      this.state.userInfo.mobileNo
                        ? this.state.userInfo.mobileNo
                        : 'NA'
                    }
                  />
                </View>
              </View>
            </View>

            <View style={styles.centercontent}>
              <View style={styles.menuItemContainer}>
                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.goAboutUs();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="info"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.ABOUTUS}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>

                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.goFavorite();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="favorite"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.FAVORITE}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>

                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.goAddressList();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="place"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.ADDRESS_TITLE}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>

                {/* <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.goLanguage();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="language"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.LANGUAGE}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton> */}

                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.goFeedback();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="feedback"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.FEEDBACK}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>

                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.shareApp();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="share"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.SHAREAPP}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>

                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.goContactUs();
                  }}>
                  <View style={styles.menuItemBox}>
                    <IconMaterialIcons
                      name="email"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.CONTACTUS}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>

                <View style={styles.menuItem}>
                  <View style={[styles.menuItemBox, { flex: 2 }]}>
                    <IconMaterialIcons
                      name={this.state.isSoundOff === false
                        ? 'volume-up'
                        : 'volume-off'}
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />
                    <CustomText
                      text={strings.SOUND}
                      customStyle={[styles.textstyle, { flex: 1.6 }]}
                    />
                    <Switch
                      trackColor={{ false: AppTheme.APPCOLOR.GREEN, true: AppTheme.APPCOLOR.PRIMARY }}
                      thumbColor={AppTheme.APPCOLOR.GREY}
                      // ios_backgroundColor={AppTheme.APPCOLOR.GREEN}
                      onValueChange={() => {
                        this.setState({ isSoundOff: !this.state.isSoundOff }, () => {
                          Singleton.getInstance().turnSoundOnOff(
                            this.state.isSoundOff,
                          );
                        });
                      }}
                      style={{ flex: 0.4 }}
                      value={!this.state.isSoundOff}
                    />
                  </View>
                </View>

                <AnimatedButton
                  style={styles.menuItem}
                  onPress={() => {
                    this.logoutAlertMessage(strings.LOGOUT_CONFIRMATION);
                  }}>
                  <View style={{ flexDirection: 'row', padding: 15 }}>
                    <IconMaterialIcons
                      name="logout"
                      size={25}
                      color={AppTheme.APPCOLOR.GREEN}
                      style={styles.itemicon}
                    />

                    <CustomText
                      text={strings.LOGOUT}
                      customStyle={styles.textstyle}
                    />
                  </View>
                </AnimatedButton>
              </View>

              <View style={{ paddingTop: 20 }}>
                <CustomText
                  text={
                    strings.VERSION +
                    ' ' +
                    DeviceInfo.getVersion() +
                    ' (' +
                    DeviceInfo.getBuildNumber() +
                    ')'
                  }
                  customStyle={{
                    fontFamily: 'verdana',
                    fontWeight: '500',
                    color: 'gray',
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  actionsheet_containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#00000080',
    // backgroundColor: AppTheme.APPCOLOR.PRIMARY
  },
  actionsheet_content: {
    width: '99%',
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    top: 10,
    flex: 1,
  },
  col: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userName: {
    textAlign: 'left',
    color: AppTheme.APPCOLOR.WHITE,
    fontSize: 22,
    fontWeight: '700',
    // left: 10,
    // flex:0.5,
    width: '70%',
  },
  editText: {
    textAlign: 'center',
    color: AppTheme.APPCOLOR.WHITE,
    fontWeight: '500',
  },
  userMobile: {
    textAlign: 'left',
    color: AppTheme.APPCOLOR.WHITE,
    fontSize: 15,
    fontWeight: '500',
    // left: 10,
  },
  menuItemContainer: {
    width: '95%',
    backgroundColor: AppTheme.APPCOLOR.WHITE,
    marginTop: -30,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    elevation: 5,
  },
  menuItemBox: {
    flexDirection: 'row',
    borderBottomColor: AppTheme.APPCOLOR.GRAY,
    borderBottomWidth: 1,
    padding: 15,
    // flex:1
  },
  editAnimatedButton: {
    borderColor: AppTheme.APPCOLOR.WHITE,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    // paddingHorizontal: 10,
  },
  menuItem: {
    color: AppTheme.APPCOLOR.PRIMARY,
    fontWeight: 'bold',
    fontSize: 4,
    // flex:0.5

    // marginLeft: 20
  },
  textstyle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    // width: '100%',
  },
  headerbox: {
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    height: 150,
    // paddingLeft: 20
  },
  editicon: {
    alignSelf: 'center',
    height: 20,
    width: 20,
    margin: 5,
    // marginLeft: 20,
  },
  itemicon: {
    alignSelf: 'center',
    height: 25,
    width: 25,
  },
  centercontent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalcss: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100%',
    flex: 1,
    margin: 10,
  },
  modalmainview: {
    flex: 1,
    width: '100%',
    backgroundColor: '#00000080',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxview: {
    width: '95%',
    // margin: '5%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.APPCOLOR.WHITE,
    // padding: 20,
  },
  centerContent: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  modalimage: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  textinput: {
    borderBottomColor: AppTheme.APPCOLOR.GRAY,
    borderBottomWidth: 1,
    width: '100%'
  },
  savebtn: {
    justifyContent: 'center',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    alignItems: 'center',
    height: 44,
    margin: 20,
    borderRadius: 10,
    width: 130,
  },
  savetxt: {
    color: 'white',
    textAlign: 'center',
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  circleImage: {
    elevation: 5,
    borderRadius: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 2,
  },
  whitecircle: {
    elevation: 5,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: AppTheme.APPCOLOR.WHITE,
    borderWidth: 3,
  },
  productIMG: {
    width: 70,
    height: 70,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 50
  }
});
