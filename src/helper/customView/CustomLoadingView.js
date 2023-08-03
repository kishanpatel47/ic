import React, { Component } from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';
// import LottieView from 'lottie-react-native';
// import { BlurView } from '@react-native-community/blur';
const AnimateFile =
  './../../../Assets/AnimationsFiles/14767-palapala-loading.json';
//14767-palapala-loading.json'; bubble
//15193-como-funciona-01.json'; search medicine
// //https://hackernoon.com/diyairbnb-clone-with-react-native-part-5-loading-modal-implementation-aa1b3325g

export default class CustomLoadingView extends Component {
  static propTypes = {
    isShowModal: PropTypes.bool.isRequired,
  };

  render() {
    const { isShowModal } = this.props;

    return (
      <Modal
        visible={isShowModal}
        transparent={true}
        style={{
          alignItem: 'center',
          position: 'absolute',
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: 'red',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            shadowOffset: { width: 0, height: 0 },
            shadowColor: 'light-gray',
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}>
          {/* <BlurView
            blurType="light"
            blurAmount={20}
            blurRadius={25}
            reducedTransparencyFallbackColor="white"
            style={{
              backgroundColor: 'rgba(255,255,255,0.50)',
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: 50,
            }}> */}
          <ActivityIndicator
            color={AppTheme.APPCOLOR.WHITE}
            size={'large'}
            style={{
              alignSelf: 'center',
              elevation: 15,
              height: 25,
              width: 25,
              backgroundColor: AppTheme.APPCOLOR.PRIMARY,
              borderRadius: 50,
              padding: 25,
            }}
          />
          {/* <LottieView
              speed={1.25}
              style={{ alignSelf: 'center', height: 200, width: 200 }}
              source={require(AnimateFile)}
              autoPlay
              loop
            /> */}
          {/* </BlurView> */}
        </View>
      </Modal>
    );
  }
}

// CustomLoadingView.prototype = {
//   isShowModal: PropTypes.bool
// }

// const styles = StyleSheet.create({
//   title: {
//     // backgroundColor:'blue',
//     fontFamily: AppTheme.APP_FONTS.BOLD,
//     color: AppTheme.APPCOLOR.PRIMARY,
//     fontSize: 17,
//     // alignSelf: 'center',
//   },
// });
