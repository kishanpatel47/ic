import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import AppTheme from './../AppTheme';
import PropTypes from 'prop-types';

export default class CustomText extends Component {
  static propTypes = {
    text: PropTypes.string,
    textcolor: PropTypes.string,
    fontSize: PropTypes.string,
    fontweight: PropTypes.string,
    bottomlinecolor: PropTypes.string,
    bottomlineheight: PropTypes.string,
    numberOfLines: PropTypes.number,
    customStyle: PropTypes.style,
  };

  render() {
    const {
      textcolor,
      fontSize,
      text,
      fontweight,
      customStyle,
      numberOfLines,
    } = this.props;
    return (
      <Text
        allowFontScaling={false}
        ellipsizeMode={'tail'}
        numberOfLines={numberOfLines} //noOfLines
        // adjustsFontSizeToFit={true}
        minimumFontScale={0.5}
        style={[
          styles.title,
          {fontWeight: fontweight},
          fontSize ? {fontSize: fontSize} : null,
          textcolor ? {color: textcolor} : null,
          customStyle,
        ]}>
        {text}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    // backgroundColor:'blue',
    // fontFamily: AppTheme.APP_FONTS.BOLD,
    color: AppTheme.APPCOLOR.PRIMARY,
    fontSize: 17,
    // alignSelf: 'center',
  },
});
