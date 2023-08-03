import React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import Email from '../../Assets/Images/mail-icon.png';
import Earth from '../../Assets/Images/website-icon.png';
import AppTheme from '../helper/AppTheme';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomText from '../helper/customView/CustomText';
import {Linking} from 'react-native';
import AppBase from '../AppBase';

export default class Contact extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      contactData: '',
      refreshing: false,
      loadingCounter: 0,
    };
  }

  componentDidMount = () => {
    console.log('CALLING Contact');
    this.getContactData();
  };

  getContactData = () => {
    this.setState(
      {loadingCounter: this.state.loadingCounter + 1, refreshing: true},
      () => {
        API.getRequest('api/chat/help')
          .then((data) => {
            console.log(data);
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            });
            if (data && data.jsonResponse) {
              this.setState({
                contactData: data.jsonResponse,
              });
            }
          })
          .catch((err) => {
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            });
            console.log(err);
            if (err.jsonResponse.status == false) {
              this.showAlertMessage(err.jsonResponse.message);
            }
          });
      },
    );
  };

  render() {
    return (
      <BaseView>
        <CustomLoadingView
          isShowModal={this.state.loadingCounter > 0 ? true : false}
        />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('mailto:' + this.state.contactData.support_Email)
            }
            style={styles.viewcss}>
            <Image
              source={Email}
              resizeMode="contain"
              style={styles.emailstyle}
            />
            <CustomText
              text={this.state.contactData.support_Email}
              customStyle={styles.emailtext}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https:/' + this.state.contactData.support_WebSite,
              )
            }
            style={styles.viewcss}>
            <Image
              source={Earth}
              resizeMode="contain"
              style={styles.emailstyle}
            />
            <CustomText
              text={this.state.contactData.support_WebSite}
              customStyle={styles.websitetext}
            />
          </TouchableOpacity>
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menustyle: {
    // marginTop: 15,
    alignItems: 'flex-start',
    height: 30,
    width: 30,
    left: 10,
  },
  emailstyle: {
    // marginTop: 15,
    alignItems: 'flex-start',
    height: 50,
    width: 50,
  },
  text: {
    color: AppTheme.APPCOLOR.GREEN,
    fontSize: 30,
    // top: 30,
    left: 10,
    fontWeight: '700',
  },
  emailtext: {
    color: AppTheme.APPCOLOR.GREEN,
    fontSize: 15,
    left: 20,
    fontWeight: '700',
    // marginTop: 15,
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  websitetext: {
    fontSize: 15,
    left: 20,
    fontWeight: '700',
    // marginTop: 15,
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  viewcss: {
    margin: 10,
    flexDirection: 'row',
    // top: 10,
    alignItems: 'center',
    borderBottomColor: AppTheme.APPCOLOR.GREEN,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});
