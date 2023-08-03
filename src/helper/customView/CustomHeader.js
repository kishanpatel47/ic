import React, {Component} from 'react';
import {View, TouchableOpacity, Image, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';

import CustomText from './CustomText';
import AppTheme from './../AppTheme';
import PropTypes from 'prop-types';
import CheckConnectivity from '../CheckConnectivity';
import Singleton from '../Singleton';
import AnimatedButton from './AnimatedButton';
const IconBack = './../../../Assets/Images/icon-back.png';

export default class CustomHeader extends Component {
  static propTypes = {
    titleFontSize: PropTypes.number,

    titleText: PropTypes.string,
    navigationRef: PropTypes.navigation,
    leftComponent: PropTypes.Component,
    leftComponentWidth: PropTypes.number,

    rightComponent: PropTypes.Component,
  };

  render() {
    const {
      titleFontSize = 21,
      navigationRef,
      titleText,
      backPressed,
      // Left Component
      leftComponent,
      leftComponentWidth,

      // Right Component
      rightComponent,
    } = this.props;

    return (
      <LinearGradient
        colors={AppTheme.GRADIENT_COLORS}
        style={{
          paddingTop: DeviceInfo.hasNotch() ? 44 : 20,
          width: '100%',
          justifyContent: 'center',
          // height: DeviceInfo.hasNotch() ? 84 : 84,
        }}>
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: DeviceInfo.hasNotch() ? 44 : 44,
          }}>
          {/* Center */}
          <View
            style={{
              position: 'absolute',
              left: 55,
              right: 34 * 2,
              top: 0,
              bottom: 0,
              marginHorizontal: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            <CustomText
              numberOfLines={1}
              text={titleText}
              fontSize={titleFontSize}
              customStyle={{
                alignSelf: 'center',
                textAlign: Platform.OS == 'ios' ? 'center' : 'left',
                fontFamily: AppTheme.APP_FONTS.MACKLIN_LIGHT_ITALIC,
                color: 'white',
                fontSize: 20,
              }}
            />
          </View>

          {/* Left */}
          <View
            style={{
              overflow: 'hidden',
              paddingLeft: 20,
              maxWidth: 34 * 2,
              //backgroundColor:'red',
              justifyContent: 'center',
              //width:leftComponentWidth ? leftComponentWidth : 44
            }}>
            {leftComponent ? (
              leftComponent
            ) : (
              <AnimatedButton
                animationScale={0.7}
                onPress={
                  navigationRef ? () => navigationRef.goBack() : backPressed
                }>
                <Image
                  source={require(IconBack)}
                  style={{
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </AnimatedButton>
            )}
          </View>

          {/* Right */}
          <View
            style={{
              paddingRight: 8,
              // maxWidth: 34 * 2,
              //backgroundColor: 'green',
              justifyContent: 'center',
            }}>
            {rightComponent}
          </View>
        </View>
        {/* <CheckConnectivity /> */}
      </LinearGradient>
    );
  }
}
