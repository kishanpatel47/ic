import React, { Component, useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Modal } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
// import LottieView from 'lottie-react-native';
const NoInternetFile =
  '../../Assets/AnimationsFiles/12907-no-connection.json';
// import NoInternetFile from '../../Assets/AnimationsFiles/12907-no-connection.json'
import CustomText from './customView/CustomText';
import strings from '../LanguageFiles/LocalizedStrings';
const { width } = Dimensions.get('window');

// const netInfo = useNetInfo();

function MiniOfflineSign() {
  // const netInfo = useNetInfo();
  return (
    <Modal
      //visible={!netInfo.isConnected}
      visible={!this.state.isConnected}
      transparent={true}
      // animationType={'fade'}
      animated={true}
      style={{
        flex: 1,
        justifyContent: 'center',
        // alignItem: 'center',
        // position: 'absolute',
        // flex: 1,
        // width: '100%',
        // height: '100%',
        // justifyContent: 'center',
        // alignContent:'center'
      }}>
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <View style={{
          backgroundColor: 'orange',
          borderRadius: 25,
          shadowOffset: { width: 5, height: 5 },
          shadowColor: 'light-gray',
          shadowOpacity: 0.5,
          shadowRadius: 5,
          alignSelf: 'center',
          padding: 16,
        }}>
          {/* <LottieView
            speed={1.25}
            style={{alignSelf: 'center', height: 200, width: 200}}
            source={require(NoInternetFile)}
            autoPlay
            loop
          /> */}
          <CustomText
            customStyle={{
              // backgroundColor: 'blue',
              textAlign: 'center',
              justifyContent: 'center',
              color: 'black',
              marginTop: 20,
              fontWeight: '600',
            }}
            text={strings.NO_INTERNET}
          />
        </View>
      </View>
    </Modal>
  );
}


class NoInternetConnection extends Component {
  state = {
    isConnected: true,
    unsubscribe: '',
  };

  componentDidMount() {
    this.state.unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      this.handleConnectivityChange(state.isConnected);
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  };

  render() {
    const { isConnection } = this.props;
    return <MiniOfflineSign />;
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    // height: 60, //DeviceInfo.hasNotch() ? 60 : 60,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width,
    // flex: 1,
    // position: 'absolute',
    // top: 30
  },
  offlineText: { color: '#fff' },
});

export default NoInternetConnection;
