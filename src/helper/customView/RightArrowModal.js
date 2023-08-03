import React, {Component} from 'react';
import {View, TouchableOpacity, Image, Platform, Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import {DrawerActions} from 'react-navigation-drawer';

import CustomText from './CustomText';
import AppTheme from './../AppTheme';
import PropTypes from 'prop-types';
import IconArrowRight from './../../../Assets/Images/icon_right_white.png';

export default class RightArrowModal extends Component {
  static propTypes = {
    isShowRightIcon: PropTypes.bool,
    navigation: PropTypes.navigation,
  };

  render() {
    const {isShowRightIcon, navigation} = this.props;

    // console.warn("Return Value :"+JSON.stringify(this.props.navigation))

    return (
      <View
        style={{
          justifyContent: 'center',
          height: '100%',
          width: 20,
          backgroundColor: 'rgba(0,255,0,0)',
          position: 'absolute',
          // top: 0,
          // left: 0,
        }}>
        <TouchableOpacity
          style={{
            // width:26,
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
            backgroundColor: 'rgba(0,0,0,0.80)',
            borderWidth: 1,
            borderColor: 'white',
          }}
          onPress={() => {
            console.warn('open drawer' + JSON.stringify(this.props.navigation));
            this.props.navigation.dispatch(DrawerActions.toggleDrawer());
            // this.refs.filterModalRef.openFilterScreen();
          }}>
          <Image
            source={IconArrowRight}
            style={{height: 26}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
