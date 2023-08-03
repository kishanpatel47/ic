import React from 'react';
import HTML from 'react-native-render-html';

import {StyleSheet, Text, Dimensions} from 'react-native';
import {View} from 'react-native-animatable';
import AppTheme from '../helper/AppTheme';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import Swiper from 'react-native-swiper';
import AppBase from '../AppBase';

export default class About extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      aboutData: '',
      aboutbppiData: '',
    };
  }

  componentDidMount = () => {
    console.log('CALLING ABOUT DATA');
    this.getAboutData();
    this.getAboutBPPIData();
  };

  getAboutData = () => {
    API.getRequest('api/AppMaster/getaboutus')
      .then((data) => {
        if (data && data.jsonResponse && data.jsonResponse.data) {
          this.setState({
            aboutData: data.jsonResponse.data.about_JAS,
          });
          console.log(data.jsonResponse.data.about_JAS);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  getAboutBPPIData = () => {
    API.getRequest('api/AppMaster/getaboutbppi')
      .then((data) => {
        if (data && data.jsonResponse && data.jsonResponse.data) {
          this.setState({
            aboutbppiData: data.jsonResponse.data.about_BPPI,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  render() {
    return (
      <BaseView style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.container}>
          <Swiper
            style={styles.wrapper}
            loop={true}
            showsButtons={true}
            nextButton={<Text style={styles.buttonRight}>›</Text>}
            prevButton={<Text style={styles.buttonLeft}>‹</Text>}
            showsPagination={false}>
            <View style={styles.slide1}>
              <HTML
                html={this.state.aboutData}
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
            <View style={styles.slide1}>
              <HTML
                html={this.state.aboutbppiData}
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
          </Swiper>
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  img_bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  wrapper: {
    top: 50,
  },
  slide1: {
    flex: 1,
    padding: 35,
  },
  buttonLeft: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    fontSize: 30,
    color: AppTheme.APPCOLOR.WHITE,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 12,
    paddingTop: 5,
  },
  buttonRight: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    fontSize: 30,
    color: AppTheme.APPCOLOR.WHITE,
    paddingHorizontal: 4,
    paddingVertical: 12,
    paddingTop: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
