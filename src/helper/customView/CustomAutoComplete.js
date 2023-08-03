import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import AppTheme from './../AppTheme';
import PropTypes from 'prop-types';
import Autocomplete from 'react-native-autocomplete-input';

export default class CustomTextInput extends Component {
  static propTypes = {
    // placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.color,
    style: PropTypes.style,
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
    const { style, ...otherProps } = this.props;
    return (
      <Autocomplete
        // listContainerStyle={{  }}
        // flatListProps={{ style: Platform.OS == 'ios' ? styles.listStyle_iOS : styles.listStyle }}
        style={[styles.title, style]}
        listStyle={{ position: 'relative', fontSize: 17 }}
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        placeholderTextColor={AppTheme.APPCOLOR.TEXT}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  listStyle: {
    flex: 1,
  },
  listStyle_iOS: {
    height: 100,
    flex: 1
  },
  containerStyle: {
    // borderColor: 'black',
    // borderWidth: 1,
    // borderBottomColor: AppTheme.APPCOLOR.GRAY,
    // borderBottomWidth: 1,
    borderLeftWidth: 0,

    marginHorizontal: 16,
    marginVertical: 10,
    fontSize: 17,
    color: AppTheme.APPCOLOR.DANGER,
    borderWidth: 0
  },
  title: {
    fontFamily: AppTheme.APP_FONTS.REGULAR,
    fontSize: 17,
    height: 50,
    padding: 8,
  },
  inputContainerStyle: {
    borderWidth: 0
  }
});
