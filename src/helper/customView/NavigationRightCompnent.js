import React, {Component} from 'react';
import {
  Image,
  // TouchableOpacity,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';
import CustomText from './CustomText';
import TouchableOpacity from './../../helper/customView/AnimatedButton';

import Consts from './../Const';
import Singleton from '../Singleton';

const iconSearchWhite = './../../../Assets/Images/home-icon-search-white.png';
const iconFilter = './../../../Assets/Images/icon-top-filter.png';

export default class NavigationRightComponent extends Component {
  constructor(props) {
    super(props);
    // this.handlePressIn = this.handlePressIn.bind(this);
    // this.handlePressOut = this.handlePressOut.bind(this);

    // this.handlePressInFilter = this.handlePressInFilter.bind(this);
    // this.handlePressOutFilter = this.handlePressOutFilter.bind(this);
  }

  static propTypes = {
    navigationRef: PropTypes.navigation,
  };

  // handlePressIn() {
  //   // https://codedaily.io/tutorials/87/Animate-the-Scale-of-a-React-Native-Button-using-Animatedspring
  //   Animated.spring(this.animatedValue, {
  //     toValue: 0.5,
  //     useNativeDriver: true,
  //   }).start();
  // }

  // handlePressInFilter() {
  //   Animated.spring(this.animatedValueFilter, {
  //     toValue: 0.5,
  //     useNativeDriver: true,
  //   }).start();
  // }

  // handlePressOutFilter() {
  //   Animated.spring(this.animatedValueFilter, {
  //     toValue: 1,
  //     friction: 3,
  //     tension: 40,
  //     useNativeDriver: true,
  //   }).start();
  // }

  // handlePressOut() {
  //   Animated.spring(this.animatedValue, {
  //     toValue: 1,
  //     friction: 3,
  //     tension: 40,
  //     useNativeDriver: true,
  //   }).start();
  // }

  componentWillMount = () => {
    // this.animatedValue = new Animated.Value(1);
    // this.animatedValueFilter = new Animated.Value(1);
  };

  render() {
    const {searchPressed, filterPressed, navigationRef} = this.props;
    // const animatedStyle = {
    //   transform: [{scale: this.animatedValue}],
    // };
    // const animatedStyleFilter = {
    //   transform: [{scale: this.animatedValueFilter}],
    // };

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //backgroundColor: 'green',
        }}>
        <TouchableOpacity
          animationScale={0.7}
          activeOpacity={1}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          onPress={searchPressed}
          style={{
            // backgroundColor: 'red',
            minWidth: 34,
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require(iconSearchWhite)}
            style={[
              {
                width: 20,
                resizeMode: 'contain',
                // backgroundColor:'blue',
              },
              // animatedStyle,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          animationScale={0.7}
          activeOpacity={1}
          onPressIn={this.handlePressInFilter}
          onPressOut={this.handlePressOutFilter}
          onPress={() => {
            filterPressed();
            navigationRef
              ? navigationRef.navigate(Consts.SCREEN_TITLES.FILTER)
              : null;
          }}
          style={[
            {
              height: '100%',
              // backgroundColor: 'gold',
              minWidth: 34,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Image
            source={require(iconFilter)}
            style={[
              {
                width: 20,
                resizeMode: 'contain',
                // backgroundColor:'red',
              },
              // animatedStyleFilter,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
