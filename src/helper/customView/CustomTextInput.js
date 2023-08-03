import React, { Component } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import AppTheme from './../AppTheme';
import PropTypes from 'prop-types';

export default class CustomTextInput extends Component {
  static propTypes = {
    // placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.color,
    // style: PropTypes.style,
  };

  constructor(props) {
    super(props);
    this.state = {
      enterText: '',
      isFocused: false,
    };
  }

  onSubmitPressed() {
    //navigationRef
    // Custom method call for any other operation.
  }

  focus = () => this.textInputRef.focus();

  render() {
    const {
      style,
      // customStyle,
      placeholderTextColor,
      ...otherProps
    } = this.props;
    return (
      <TextInput
        //ref={ref}
        autoCorrect={false}
        ref={(ref) => (this.textInputRef = ref)}
        underlineColorAndroid={'transparent'}
        placeholderTextColor={placeholderTextColor}
        clearButtonMode={'while-editing'}
        selectionColor={AppTheme.APPCOLOR.PRIMARY} //
        autoCapitalize="none"
        multiline={false}
        onFocus={() => this.setState({ isFocused: true })}
        onBlur={() => this.setState({ isFocused: false })}
        style={[
          styles.title,
          // customStyle,
          style,
        ]}
        {...otherProps}
      // keyboardType={'number-pad'}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    // backgroundColor:'blue',
    // fontFamily: AppTheme.APP_FONTS.BOLD,
    fontFamily: AppTheme.APP_FONTS.REGULAR,
    color: AppTheme.APPCOLOR.BLACK,
    fontSize: 17,
    height: 50,
    padding: 8,
    // backgroundColor:'red',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    // alignSelf: 'center',
  },
});
