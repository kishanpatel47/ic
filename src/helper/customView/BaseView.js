import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';
// import CheckConnectivity from '../CheckConnectivity';
import NoInternetConnection from '../NoInternetConnection';
// import CustomHeader from './CustomHeader';

import DashboardBG from './../../../Assets/Images/grey-bg.jpg';

import CustomText from './CustomText';

export default class BaseView extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    style: PropTypes.style,
  };

  componentWillMount = () => {
    this.forceUpdate();
    this.animatedValue = new Animated.Value(1);
  };

  render() {
    const {style} = this.props;
    return (
      <ImageBackground
        source={DashboardBG}
        style={{
          flex: 1,
          width: null,
          height: null,
        }}>
        <View style={[{flex: 1}, this.props.style]}>
          <StatusBar
            translucent={false}
            backgroundColor={AppTheme.APPCOLOR.PRIMARY}
            barStyle={'light-content'}
          />
          {/* <CheckConnectivity /> */}
          <NoInternetConnection />
          {this.props.children}

          {/* <View style={{
            backgroundColor: 'lightgray',
            height: DeviceInfo.hasNotch() ? 50 : 50,
          }}
          >
            <View style={{
              // backgroundColor: 'red',
              flexDirection: 'row',
              height: 50,
            }}>
              <CustomText
                text={'v ' + DeviceInfo.getVersion() + ' (' + DeviceInfo.getBuildNumber() + ')'}
                customStyle={{
                  alignSelf: 'center',
                  marginLeft: 32,
                  flex: 1,
                  fontSize: 15,
                  // fontWeight: '800',
                  textAlign: 'left',
                  color: 'black',
                  // backgroundColor:'blue'
                }}
              />
            </View>
          </View> */}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({});
