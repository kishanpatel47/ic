import React from 'react';
import {Component} from 'react';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashBackground from '../../Assets/Images/splash.jpg';
import {View, StatusBar, Image} from 'react-native';
import AppTheme from '../helper/AppTheme';
import Singleton from '../helper/Singleton';

export default class Splash extends Component {
  constructor(props) {
    super(props);
    state = {
      isConnected: true,
    };
  }

  componentDidMount = () => {
    Singleton.getInstance().LocationPermission();
    // console.disableYellowBox = false;
    LogBox.ignoreAllLogs(true);
    // LogBox.ignoreAllLogs(true)
    setTimeout(() => {
      //   this.props.navigation.navigate('Auth');
      this.buttonPressed();
    }, 3000);

    this.checkSound();
  };

  checkSound = async () => {
    try {
      var isSoundOff = await AsyncStorage.getItem('soundOff');
      Singleton.getInstance().isSoundOff = isSoundOff === 'true' ? true : false;
    } catch (e) {
      // read error
      console.log('Error = ' + e.message);
    }
  };

  buttonPressed = () => {
    //this.props.navigation.push('login')

    Singleton.getInstance()
      .getUserInfo()
      .then((jsonValue) => {
        if (jsonValue == null) {
          console.log('USER NOT LOGGED IN');
          var jsonObject = JSON.parse(jsonValue);
          this.props.navigation.replace('login');
        } else {
          console.log('USER LOGGED IN');
          this.props.navigation.replace('dashboard');
          // AsyncStorage.getItem('isNotification').then((jsonValue) => {
          //   console.log(jsonValue);
          //   if (jsonValue == 'true') {
          //     this.props.navigation.navigate('NotificationList', {});
          //   } else {
          //     this.props.navigation.replace('dashboard');
          //   }
          // });
        }
      });
  };

  render() {
    const BackgroundImage = (
      <Image
        source={SplashBackground}
        resizeMode="cover"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      />
    );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AppTheme.APPCOLOR.PRIMARY,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StatusBar
          translucent={false}
          backgroundColor={AppTheme.APPCOLOR.PRIMARY}
          barStyle={'default'}
        />
        {BackgroundImage}
      </View>
    );
  }
}
