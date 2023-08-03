import { Alert, Linking, Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiParams from '../connection/api-urls';
import Geolocation from '@react-native-community/geolocation';
import GetLocation from 'react-native-get-location';
var Sound = require('react-native-sound');
import API from '../connection/http-utils';
import moment from 'moment'; //https://medium.com/better-programming/using-moment-js-in-react-native-d1b6ebe226d4
import AppTheme from './AppTheme';

// https://stackoverflow.com/questions/44719103/singleton-object-in-react-native
export default class Singleton {
  static myInstance = null;
  HTTP_Cookie = '';
  // UserCurrentLocation = GeolocationResponse();
  UserCurrentLatitude = 0.0;
  UserCurrentLongitude = 0.0;
  AccessToken = '';
  CartCount = null;
  NotificationCounter = null;
  isSoundOff = false;
  GeneralCount = 0;
  OrderCount = 0;
  /**
   * @returns {Singleton}
   */
  static getInstance() {
    if (Singleton.myInstance == null) {
      // console.warn('Create new instance');
      Singleton.myInstance = new Singleton();
    }

    return this.myInstance;
  }

  getLoginData = async () => {
    try {
      var jsonValue = await AsyncStorage.getItem('loginData');
      // console.log('userData = ' + jsonValue)
      return jsonValue === null ? null : jsonValue;
    } catch (e) {
      // read error
      console.log('Error = ' + e.message);
    }
  };

  getUserInfo = async () => {
    try {
      var jsonValue = await AsyncStorage.getItem('userInfo');
      console.log('userData = ' + jsonValue)
      return jsonValue === null ? null : jsonValue;
    } catch (e) {
      // read error
      console.log('Error = ' + e.message);
    }
  };

  getUserProfile = async () => {
    try {
      var jsonValue = await AsyncStorage.getItem('userProfile');
      // console.log('userProfile = ' + jsonValue)
      return jsonValue === null ? null : JSON.parse(jsonValue);
    } catch (e) {
      // read error
      console.log('Error = ' + e.message);
    }
  };

  getToken = async () => {
    try {
      var jsonValue = await AsyncStorage.getItem('access_token');
      this.AccessToken = 'Bearer ' + jsonValue;
      return jsonValue === null ? null : 'Bearer ' + jsonValue;
    } catch (e) {
      // read error
      console.log('Error = ' + e.message);
    }
  };

  LocationPermission = () => {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization('');
      this.GetCurrentPosition();
    } else {
      // Android
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.GetCurrentPosition();
      }
    }
  };

  GetCurrentPosition = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        this.UserCurrentLatitude = location.latitude;
        this.UserCurrentLongitude = location.longitude;
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
        Alert.alert('Location Error', JSON.stringify(error));
      });
  };

  getImageURL = (modalName, recordId, fieldName) => {
    // http://115.124.111.239:8090/web/image?model=res.partner&field=image_128&id=1643
    // console.log("getImageURL = " + ApiParams.API_URLS.LIVE + 'web/image?model=' + modalName + "&field=" + fieldName + "&id=" + recordId)
    return (
      ApiParams.API_URLS.LIVE +
      'web/image?model=' +
      modalName +
      '&field=' +
      fieldName +
      '&id=' +
      recordId
    );
  };

  getBadgeColor = (item) => {
    let badgeColor = AppTheme.APPCOLOR.PRIMARY;
    // console.log(item);
    if (item != false) {
      switch (item.orderStatusID) {
        case 1://Order Placed
          {
            badgeColor = AppTheme.APPCOLOR.SUCCESS;
          }
          break;
        case 2://payment Confirmation Pending
          {
            badgeColor = AppTheme.APPCOLOR.TabBarInactiveColor;
          }
          break;
        case 3://Order Accepted
          {
            badgeColor = AppTheme.APPCOLOR.SUCCESS;
          }
          break;
        case 4://Order Shipped
          {
            badgeColor = AppTheme.APPCOLOR.SUCCESS;
          }
          break;
        case 5://Delivered
          {
            badgeColor = AppTheme.APPCOLOR.GREEN;
          }
          break;
        case 6://Cancelled
          {
            badgeColor = AppTheme.APPCOLOR.DANGER;
          }
          break;
        case 7://Payment Failed
          {
            badgeColor = AppTheme.APPCOLOR.RED;
          }
          break;
        default:
          {
            badgeColor = AppTheme.APPCOLOR.PRIMARY;
          }
          break;
      }
    }
    return badgeColor;
  };

  isCheckError = (jsonResponse, navigationRef) => {
    if (jsonResponse.hasOwnProperty('error')) {
      console.warn('error found');
      const sessionExpired = 'Session expired'.toLowerCase();
      const errorString = JSON.stringify(
        jsonResponse.error.message,
      ).toLowerCase();
      console.warn('sessionExpired' + sessionExpired); //Odoo Server Error,
      console.warn('errorString' + errorString); //Odoo Server Error,

      if (errorString.includes(sessionExpired)) {
        console.warn('Session expired'); //Odoo Server Error,
        navigationRef.replace('login');
      }
    } else if (jsonResponse.error) {
      console.log('Error');
      this.showAlertMessage(JSON.stringify(jsonResponse.error.data.name));
    } else if (jsonResponse.result) {
      console.log('Success');
      return false;
    } else if (jsonResponse.status) {
      console.log('Success == true');
      return false;
    } else {
      console.log('Error else');
      this.showAlertMessage(JSON.stringify(jsonResponse));
    }
    return true;
  };

  showAlertMessage = (message) => {
    Alert.alert(
      'Alert',
      message,
      [
        // {
        //   text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        //   style: 'cancel',
        // },
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: false },
    );
  };

  playSound = () => {
    //https://github.com/zmxv/react-native-sound
    if (this.isSoundOff) {
      // No Need to play sound.
    } else {
      var whoosh = new Sound('buttontap.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          // console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        // console.log(
        //   'duration in seconds: ' +
        //   whoosh.getDuration() +
        //   'number of channels: ' +
        //   whoosh.getNumberOfChannels(),
        // );

        // Play the sound with an onEnd callback
        whoosh.play((success) => {
          if (success) {
            // console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    }
  };

  // getToken = async () => {
  //   try {
  //     var jsonValue = await AsyncStorage.getItem('access_token');

  turnSoundOnOff = async (value) => {
    try {
      var jsonValue = await AsyncStorage.setItem(
        'soundOff',
        value === true ? 'true' : 'false',
      );
      this.isSoundOff = value;
    } catch (e) {
      // read error
      console.log('Error = ' + e.message);
    }
  };

  makePhoneCall = (phone) => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      // phoneNumber = `telprompt:${phone}`;
      // iOS
      phoneNumber = 'tel:' + phone;
      // const url = 'telprompt:5551231234';
    } else {
      phoneNumber = 'tel:' + phone;
    }
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.log('Error : ' + err));
  };

  openMapWithLatLong = (name, latitude, longitude) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    console.log('map URL = ' + url);
    Linking.openURL(url);
  };

  cartBadgeCounterUpdate(navigation) {
    // console.log('REFLECTING COUNT');
    navigation.setParams();
  }

  getBadges(navigation) {
    API.getRequest('api/notification/unreadnotification').then((data) => {
      // console.log("Counter Status");
      // console.log(data)
      if (data.jsonResponse.status) {
        this.NotificationCounter = data.jsonResponse.data && data.jsonResponse.data.allNotificationUnreadCount > 0 ? data.jsonResponse.data.allNotificationUnreadCount : null;
        this.CartCount = data.jsonResponse.data && data.jsonResponse.data.cartItemsCount > 0 ? data.jsonResponse.data.cartItemsCount : null;
        this.GeneralCount = data.jsonResponse.data && data.jsonResponse.data.generalnotificationunReadCount > 0 ? data.jsonResponse.data.generalnotificationunReadCount : 0;
        this.OrderCount = data.jsonResponse.data && data.jsonResponse.data.orderNotificationUnreadCount > 0 ? data.jsonResponse.data.orderNotificationUnreadCount : 0;
        this.cartBadgeCounterUpdate(navigation);
      }
    }).catch((err) => {
      console.log(err);
      // if (err.jsonResponse.status == false) {
      // this.showAlertMessage(err.jsonResponse.message);
      // }
    });
  }
}
