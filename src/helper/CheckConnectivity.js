import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
const { width } = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

class CheckConnectivity extends Component {
  state = {
    isConnected: true,
    unsubscribe: '',
  };

  componentDidMount() {
    NetInfo.fetch().then((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
    });

    // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    this.state.unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      this.handleConnectivityChange(state.isConnected);
    });

    // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    this.state.unsubscribe();
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  };

  render() {
    const { isConnection } = this.props;
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    // position: 'absolute',
    // top: 30
  },
  offlineText: { color: '#fff' },
});

export default CheckConnectivity;
