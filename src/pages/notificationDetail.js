import React from 'react';
import HTML from 'react-native-render-html';
import { StyleSheet, Dimensions } from 'react-native';
import CustomText from '../helper/customView/CustomText';
import { View } from 'react-native-animatable';
import AppTheme from '../helper/AppTheme';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import AppBase from '../AppBase';
import Singleton from '../helper/Singleton';

export default class NotificationDetail extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
    };

    this.state.Data = this.props.route.params.navParams
      ? this.props.route.params.navParams
      : {};
    console.log(this.state.Data);
  }

  componentDidMount = () => {
    this.markRead();
  };

  markRead = () => {
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
      refreshing: true
    }, () => {
      API.postRequest(
        'api/notification/markasread?notificationId=' +
        this.state.Data.notificationId,
        {},
      ).then((data) => {
        console.log(data.jsonResponse);
        Singleton.getInstance().getBadges(this.props.navigation);
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
        });
      }).catch((err) => {
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
        });
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
    });
  };

  render() {
    return (
      <BaseView>
        <View style={{ flex: 1, alignItems: 'center', top: 20 }}>
          <CustomText
            text={this.state.Data.title}
            textcolor={AppTheme.APPCOLOR.PRIMARY}
            fontSize={25}
            customStyle={{ fontWeight: '600' }}
          />

          <HTML
            html={this.state.Data.body}
            tagsStyles={{
              p: {
                marginTop: 0,
                marginBottom: 8,
                fontSize: 15,
                textAlign: 'justify',
              },
            }}
            imagesMaxWidth={Dimensions.get('window').width / 4}
          />
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({});
