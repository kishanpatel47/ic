import { Component, useCallback } from 'react';
import { Alert, Platform, View } from 'react-native';
import Toast from 'react-native-root-toast';

// html-entities ----------------------------------------------
// const Entities = require('html-entities').AllHtmlEntities;
// const entities = new Entities();
// html-entities ----------------------------------------------
let toast;
export default class AppBase extends Component {
  constructor(props) {
    super(props);
    // state = {
    //   isConnected: true,
    //   unsubscribe: '',
    //   // isVisibleSearch:false,
    // };
  }

  componentDidMount() {
    console.log('Connectivity');
    // this.state.unsubscribe = NetInfo.addEventListener(state => {
    //   console.log('Connectivity' + state.isConnected);
    //   this.handleConnectivityChange(state.isConnected);
    // });
  }

  handleConnectivityChange = (isConnected) => {
    // this.setState({isConnected}, () => {
    //   // Alert.alert(isConnected ? 'You are Online' : 'You are Offline');
    // });
  };

  isEmptyString = (value) => {
    return (
      value == null ||
      value == 'null' ||
      value.length <= 0 ||
      value.toString() == ''
    );
  };

  validateMobile = (value) => {
    let userMobile = value;
    console.log(userMobile);
    let reg = /^[0]?[6789]\d{9}$/;
    if (reg.test(userMobile) === false) {
      console.log('Mobile is Not Correct');
      return false;
    } else {
      return true;
    }
  };

  validateZip = (value) => {
    let userZip = value;
    console.log(userZip);
    let reg = /^[0]?[0-9]\d{5}$/;
    if (reg.test(userZip) === false) {
      console.log('Zipcode is Not Correct');
      return false;
    } else {
      return true;
    }
  };

  validateEmail = (value) => {
    let userEmail = value;
    console.log(userEmail);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(userEmail) === false) {
      console.log('Email is Not Correct');
      return false;
    } else {
      return true;
    }
  };

  parsePrice = (amt) => {
    if (!this.isEmptyString(amt)) {
      // set 2 digit decimal
      amt = parseFloat(amt).toFixed(2);

      // set format like add comma after 3 digit
      return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '0';
    }
  };

  // GetFilename(url) {
  //   console.warn('File Name URL is ' + url);
  //   if (url) {
  //     var m = url.toString().match(/.*\/(.+?)\./);
  //     if (m && m.length > 1) {
  //       console.warn('File Name is ' + m[1]);
  //       return m[1];
  //     }
  //   }
  //   return 'Temp';
  // }

  // GetFilenameExtension(url) {
  //     var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
  //     if (matches.length > 1) {
  //       return matches[1];
  //     }
  //     return null;
  // }

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

  showAlert = (title, message) => {
    Alert.alert(
      title,
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

  showToastMessage = (tostMessage) => {
    // Toast.hide(toast);
    toast = Toast.show(tostMessage.toString(), {
      visible: true,
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => { },
      onShown: () => { },
      onHide: () => { },
      onHidden: () => { },
    });
  };
  // decodeHTML = string => {
  //   return entities.decode(string);
  // };
  // getGridColumns = () => {
  //   if (Platform.isPad) {
  //     // iPad
  //     // return 500
  //     GridColumns = 4
  //     return 4
  //   }
  //   else {
  //     if (Platform.OS == 'android' && DeviceInfo.isTablet) {
  //       // tablet
  //       // return 500
  //       GridColumns = 4
  //       return 4
  //     }
  //     else {
  //       //iPhone
  //         // return 250
  //         GridColumns = 2
  //         return 2
  //     }
  //   }
  // }
}
