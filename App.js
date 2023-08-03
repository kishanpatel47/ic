/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet
} from 'react-native';
import Router from './src/Router';
import strings from './src/LanguageFiles/LocalizedStrings';
import { getLng, setLng } from './src/helper/changeLanguage';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from './src/helper/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const selectLanguage = async () => {
  //https://www.youtube.com/watch?v=JvDcCAw5qnE
  const lngData = await getLng();
  if (lngData) {
    strings.setLanguage(lngData);
  }
};

const App = () => {
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Notification');
  selectLanguage();

  useEffect(() => {
    //below codes is necessary to create channel for receiving foreground notification
    PushNotification.createChannel(
      {
        channelId: '915057312228', // (required)
        channelName: 'com.di.customerapp', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        soundName: "default",
        importance: 4, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      //below code used for to display foreground notification
      PushNotification.localNotification({
        channelId: '915057312228',
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title
      });
    });

    //below code used for tap event of foreground notification
    PushNotification.configure({
      onNotification: function (notification) {
        const { data } = notification;
        // V: Note: Comment Below code because "in ios open notification screen while arrive notification."
        // RootNavigation.navigate('Notification', {});
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      console.log("data is", remoteMessage.data);
      console.log("data is", remoteMessage.data.ordertrack);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      console.log('>>>>>');
      console.log("data is", remoteMessage.data);
      // console.log("data is", remoteMessage.data.ordertrack);
      // // Router.navigate('Notification', {});
      // if (remoteMessage.data.ordertrack) {
      //   RootNavigation.navigate('My Orders', { screen: 'OrderTrack', params: { navParams: { orderId: '102' } } }); //code will used for navigate to ORDERTRACK page
      //   // RootNavigation.navigate('OrderTrack', {});
      // } else {
      //   RootNavigation.navigate('Notification', {});
      // }
      Alert.alert(remoteMessage.data.toString());
      RootNavigation.navigate('Notification', {});

      // navigation.push('Notification');
      // navigation.navigate();
      // setInitialRoute(remoteMessage.notification);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // RootNavigation.navigate('Notification', {});
          // setInitialRoute('Notification'); // e.g. "Settings"
          AsyncStorage.setItem('isNotification', 'true');
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }
  // <PushController />
  return <Router />;
};

const styles = StyleSheet.create({});

export default App;
