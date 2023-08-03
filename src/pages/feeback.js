import React from 'react';
import {
  StyleSheet,
  Modal,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { View } from 'react-native-animatable';
import FeebackMenu from '../../Assets/Images/menu_blackfeedback.png';
import itemImg from '../../Assets/Images/feedback-icon.png';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AppBase from '../AppBase';
import CustomText from '../helper/customView/CustomText';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { decode as atob, encode as btoa } from 'base-64';
import strings from '../LanguageFiles/LocalizedStrings';

export default class Feedback extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      detail: '',
      page: 1,
      pageSize: 10,
      modal: false,
      feedbackList: [],
      Data: [
        {
          id: 1,
          title: 'feedback1',
        },
        {
          id: 2,
          title: 'feedback2',
        },
      ],
      refreshing: false,
      loadingCounter: 0,
    };
  }

  componentDidMount = () => {
    console.log('CALLING FEEDBACK LIST');
    this.setState({
      feedbackList: [],
      page: 1,
    });
    this.getFeedback();
  };

  getFeedback = () => {
    let params = {
      searchText: '',
      pageNo: this.state.page,
      pageSize: this.state.pageSize,
    };
    this.setState({ loadingCounter: this.state.loadingCounter + 1 }, () => {
      console.log('Start Indicator = ' + this.state.loadingCounter);

      API.postRequest('api/AppMaster/getuserfeedback', params)
        .then((enc) => {
          API.decrypt(enc.jsonResponse)
            .then((data) => {
              this.setState(
                {
                  refreshing: false,
                  loadingCounter: this.state.loadingCounter - 1,
                },
                () => {
                  console.log(
                    'Hidden Indicator = ' + this.state.loadingCounter,
                  );
                  if (data.data.length > 0) {
                    this.setState(
                      {
                        feedbackList:
                          this.state.page === 1
                            ? data.data
                            : [...this.state.feedbackList, ...data.data],
                        page: this.state.page + 1,
                      },
                      () => {
                        this.setState({
                          feedbackList: Object.values(
                            this.state.feedbackList.reduce(
                              (acc, cur) =>
                                Object.assign(acc, { [cur.reportID]: cur }),
                              {},
                            ),
                          ),
                        });
                        // console.log(Object.values(this.state.feedbackList.reduce((acc, cur) => Object.assign(acc, { [cur.title]: cur }), {})))
                      },
                    );
                  }
                },
              );
            })
            .catch((error) => {
              this.setState({
                refreshing: false,
                loadingCounter: this.state.loadingCounter - 1,
              });
              if (err.jsonResponse.status == false) {
                this.showAlertMessage(err.jsonResponse.message);
              }
            });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            refreshing: false,
            loadingCounter: this.state.loadingCounter - 1,
          });
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    });
  };

  onRefresh = () => {
    //set isRefreshing to true
    this.setState({
      refreshing: true
    }, () => {
      this.getFeedback();
    })
    // and set isRefreshing to false at the end of your callApiMethod()
  }

  addFeedback = () => {
    let params = {
      ReportType: 0,
      Title: this.state.title,
      Message: this.state.detail,
      selectedCategory: '',
    };
    if (this.state.title.length <= 0) {
      this.showAlertMessage(strings.Please_enter_title);
    } else if (this.state.detail.length <= 0) {
      this.showAlertMessage(strings.Please_enter_detail);
    } else {
      const strReq = btoa(API.encrpt(JSON.stringify(params)));
      API.postRequest(
        'api/AppMaster/savereportwithtype',
        API.encryptedString(strReq),
      )
        .then((enc) => {
          API.decrypt(enc.jsonResponse)
            .then((data) => {
              // console.log(data)
              this.setState(
                {
                  refreshing: false,
                  modal: false,
                  page: 1,
                  feedbackList: [],
                  title: '',
                  detail: '',
                },
                () => {
                  setTimeout(() => {
                    this.getFeedback();
                  }, 1000);
                },
              );
              // this.showAlertMessage(data.message);
            })
            .catch((error) => {
              //console.log(error);
              this.setState({
                refreshing: false,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    }
  };

  RenderImage = (Data) => {
    return <Image source={itemImg} style={styles.productIMG} />;
  };

  RenderTitle = (Data) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemName}
        text={Data.item.title}
      />
    );
  };

  RenderDesc = (Data) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.reviewtxt}
        text={Data.item.message}
      />
    );
  };

  FeedbackListItem = (item, index) => {
    // console.log(item);
    return (
      <View
        key={index}
        easing={'ease-in-out'}
        delay={index * 50}
        animation={'fadeInUp'}
        duration={500}>
        <AnimatedButton
          onPress={() => {
            // this.props.navigation.push('medicinedetail', { navParams: storeData.item });
          }}>
          <View style={styles.listItem}>
            {this.RenderImage(item)}

            <View style={{ alignItems: 'flex-start', marginLeft: 10 }}>
              {this.RenderTitle(item)}
              {this.RenderDesc(item)}
            </View>
          </View>
        </AnimatedButton>
      </View>
    );
  };

  renderBottomLoader = () => {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={AppTheme.APPCOLOR.PRIMARY} />
        <CustomText
          text={strings.Please_wait}
          textcolor={AppTheme.APPCOLOR.PRIMARY}
          textsize={13}
        />
      </View>
    );
  };

  render() {
    return (
      <BaseView>
        <CustomLoadingView
          isShowModal={this.state.loadingCounter > 0 ? true : false}
        />
        <Modal
          style={styles.modalcss}
          animationType={'slide'}
          transparent={true}
          backdropOpacity={0.1}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modal: false });
          }}>
          {/* <TouchableOpacity
            style={styles.modalmainview}
            onPress={() => {
              this.setState({ modal: false });
            }}> */}
          <View style={styles.modalmainview}>
            <View style={styles.boxview}>
              <View style={styles.centerContent}>
                <Image source={FeebackMenu} style={styles.modalimage} />
              </View>

              <CustomTextInput
                ref={(ref) => (this.titleInputTextRef = ref)}
                name={'title'}
                style={styles.textinput}
                returnKeyType={'next'}
                placeholder={strings.TITLE}
                placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                onChangeText={(value) => this.setState({ title: value })}
              />

              <CustomTextInput
                ref={(ref) => (this.detailInputTextRef = ref)}
                name={'detail'}
                style={styles.textinput}
                returnKeyType={'done'}
                placeholder={strings.DETAILS}
                placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                onChangeText={(value) => this.setState({ detail: value })}
              />

              <View
                style={[
                  styles.centerContent,
                  { borderRadius: 0, borderWidth: 0 },
                ]}>
                <View style={{ flexDirection: 'row' }}>
                  <AnimatedButton
                    onPress={() => {
                      this.addFeedback();
                    }}
                    style={styles.savebtn}>
                    <CustomText
                      text={strings.SAVE}
                      customStyle={styles.savetxt}
                    />
                  </AnimatedButton>
                  <AnimatedButton
                    onPress={() => {
                      this.setState({ modal: false });
                    }}
                    style={styles.savebtn}>
                    <CustomText
                      text={strings.CANCEL}
                      customStyle={styles.savetxt}
                    />
                  </AnimatedButton>
                </View>
              </View>
              {/* <View style={styles.centerContent}>
                <AnimatedButton
                  onPress={() => {
                    this.addFeedback();
                  }}
                  style={styles.savebtn}>
                  <CustomText
                    text={strings.SAVE}
                    customStyle={styles.savetxt}
                  />
                </AnimatedButton>
              </View> */}
            </View>
          </View>
          {/* </TouchableOpacity> */}
        </Modal>

        <View style={styles.container}>
          <FlatList
            // Pagination ----------
            onEndReachedThreshold={0.5}
            onEndReached={({ }) => {
              console.warn('onEndReached');
              this.getFeedback();
            }}
            ListFooterComponent={
              this.state.isShowModal ? this.renderBottomLoader : null
            }
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            // Pagination ----------
            contentContainerStyle={{ paddingVertical: 8 }}
            data={this.state.feedbackList}
            extraData={this.state.feedbackList}
            key={this.FeedbackListItem}
            renderItem={this.FeedbackListItem}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <CustomText
                customStyle={{
                  marginTop: 16,
                  flex: 1,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                text={
                  this.state.refreshing
                    ? strings.Please_wait
                    : strings.No_Record_Found
                }
              />
            }
          />

          <AnimatedButton
            onPress={() => {
              //this.addLead();
              this.setState({
                modal: true,
              });
            }}
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              position: 'absolute',
              bottom: 10,
              right: 10,
              height: 50,
              backgroundColor: AppTheme.APPCOLOR.WHITE,
              borderRadius: 100,
              backgroundColor: AppTheme.APPCOLOR.PRIMARY,
            }}>
            <IconMaterialIcons
              name="add"
              size={30}
              color={AppTheme.APPCOLOR.WHITE}
            />
          </AnimatedButton>
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productIMG: {
    width: 40,
    height: 40,
  },
  itemName: {
    fontSize: 20,
    color: AppTheme.APPCOLOR.PRIMARY,
    fontWeight: '700',
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // width: '90%'
    // padding: 10,
    marginRight: 30,
  },
  reviewtxt: {
    fontSize: 13,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
    marginRight: 30,
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    flex: 1,
    backgroundColor: AppTheme.APPCOLOR.SILVER,
    borderRadius: 10,
  },
  modalcss: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    backgroundColor: 'red',
  },
  modalmainview: {
    flex: 1,
    backgroundColor: '#00000080',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxview: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalimage: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  textinput: {
    borderBottomColor: AppTheme.APPCOLOR.GRAY,
    borderBottomWidth: 1,
  },
  savebtn: {
    justifyContent: 'center',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    alignItems: 'center',
    height: 44,
    margin: 20,
    borderRadius: 10,
    width: 100,
  },
  savetxt: {
    color: 'white',
    textAlign: 'center',
  },
});
