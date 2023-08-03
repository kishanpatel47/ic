import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import AppTheme from './../AppTheme';
import PropTypes from 'prop-types';
import Singleton from '../Singleton';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// Import the react-native-sound module

export default class AnimatedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      disable: false,
    };

    this.handlePressIn = this.handlePressIn.bind(this);
    this.handlePressOut = this.handlePressOut.bind(this);
  }

  static propTypes = {
    style: PropTypes.style,
    activeOpacity: PropTypes.number,
    animationScale: PropTypes.number,
  };

  handlePressIn() {
    // https://codedaily.io/tutorials/87/Animate-the-Scale-of-a-React-Native-Button-using-Animatedspring
    Animated.spring(this.animatedValue, {
      tension: 40,
      toValue: this.props.animationScale ? this.props.animationScale : 0.9,
      useNativeDriver: true,
    }).start();
  }

  handlePressOut = () => {
    setTimeout(() => {
      Animated.spring(this.animatedValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  componentWillMount = () => {
    this.animatedValue = new Animated.Value(1);
  };

  onPressedMethod = () => {
    console.log("Press")
    if (this.state.disable == true) return
    this.setState({ disable: true }, () => {
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(() => {
        this.setState({ disable: false })
      }, 1000);
    })
    this.props.onPress();

  };

  render() {
    const { style, onPress, activeOpacity, animationScale } = this.props;

    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };

    return (
      <TouchableWithoutFeedback
        disabled={this.state.disable}
        activeOpacity={activeOpacity}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        onPress={() => {
          this.onPressedMethod();
          Singleton.getInstance().playSound();
        }}>
        <Animated.View style={[style, animatedStyle]}>
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({});
