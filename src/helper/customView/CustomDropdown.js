import React, {Component} from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/AntDesign'; //https://oblador.github.io/react-native-vector-icons/

export default class CustomDropDown extends Component {
  static propTypes = {
    text: PropTypes.string,
    textcolor: PropTypes.string,
    textsize: PropTypes.string,
    customStyle: PropTypes.style,
  };

  render() {
    const {textcolor, fontSize, text, onPress, customStyle} = this.props;
    return (
      <TouchableOpacity
        disabled={false}
        onPress={onPress}
        style={[
          customStyle,
          {flexDirection: 'row', height: 50, alignItems: 'center'},
        ]}>
        <CustomText
          text={text}
          fontSize={fontSize}
          customStyle={[styles.title, {color: textcolor}]}
        />

        <Icon
          name="caretdown"
          size={30}
          color={AppTheme.APPCOLOR.PRIMARY}
          style={{marginRight: 8}}
        />

        {/* <Image
          source={require('./../../../Assets/Images/icon-dropdown.png')}
          style={{
            resizeMode: 'contain',
            width: 20,
            marginRight: 15,
          }}
        /> */}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: AppTheme.APP_FONTS.REGULAR,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    fontSize: 17,
  },
});
