import React from 'react';
import { StyleSheet, Image, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'; //https://oblador.github.io/react-native-vector-icons/
import { View } from 'react-native-animatable';
import IconDava from '../../Assets/Images/davaindia-logo.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import CustomText from '../helper/customView/CustomText';
import BaseView from '../helper/customView/BaseView';
import Moment from 'moment'; //https://medium.com/better-programming/using-moment-js-in-react-native-d1b6ebe226d4
import Singleton from '../helper/Singleton';
import API from '../connection/http-utils';
import strings from '../LanguageFiles/LocalizedStrings';
import AppBase from '../AppBase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

let OCount = 0;
let GCount = 0;
export default class NotificationList extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      arrNotification: [],
      brodcast_pageNo: 1,
      order_pageNo: 1,
      tabIndex: 0,
      pageSize: 20,
      refreshing: false,
      showBottomLoader: false,
      loadingCounter: 0,
      index: 0,
      broadcastNotification: [],
      orderNotification: [],
      routes: [
        { key: 'G', title: 'GENERAL(' + GCount + ')' },
        { key: 'O', title: 'ORDER(' + OCount + ')' },
      ],
    };
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'G':
        return (<FlatList
          // Pagination ----------
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          onEndReachedThreshold={0.5}
          onEndReached={({ }) => {
            if (!this.onEndReachedCalledDuringMomentum) {
              console.warn('onEndReached');
              this.onEndReachedCalledDuringMomentum = true;
              this.getBroadCastNotifications();
            }
          }}
          ListFooterComponent={
            this.state.showBottomLoader ? this.renderBottomLoader : null
          }
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          // Pagination ----------
          contentContainerStyle={{ paddingVertical: 8 }}
          data={this.state.broadcastNotification}
          // extraData={this.state.arrNotification}
          key={this.NotificationItem}
          renderItem={this.NotificationItem}
          showsHorizontalScrollIndicator={false}
          renderFooter={this.renderFooter.bind(this)}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          ListEmptyComponent={
            <CustomText
              customStyle={{
                marginTop: 16,
                flex: 1,
                justifyContent: 'center',
                textAlign: 'center',
              }}
              text={
                this.state.broadcastNotification.length == 0 && this.state.loadingCounter <= 0
                  ? strings.No_Record_Found
                  : null
              }
            />
          }
        />);
      case 'O':
        return (<FlatList
          // Pagination ----------
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          onEndReachedThreshold={0.5}
          onEndReached={({ }) => {
            if (!this.onEndReachedCalledDuringMomentum) {
              console.warn('onEndReached');
              this.onEndReachedCalledDuringMomentum = true;
              this.getOrderNotifications();
            }
          }}
          ListFooterComponent={
            this.state.showBottomLoader ? this.renderBottomLoader : null
          }
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          // Pagination ----------
          contentContainerStyle={{ paddingVertical: 8 }}
          data={this.state.orderNotification}
          // extraData={this.state.arrNotification}
          key={this.NotificationItem}
          renderItem={this.NotificationItem}
          showsHorizontalScrollIndicator={false}
          renderFooter={this.renderFooter.bind(this)}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          ListEmptyComponent={
            <CustomText
              customStyle={{
                marginTop: 16,
                flex: 1,
                justifyContent: 'center',
                textAlign: 'center',
              }}
              text={
                this.state.orderNotification.length == 0 && this.state.loadingCounter <= 0
                  ? strings.No_Record_Found
                  : null
              }
            />
          }
        />);
      default:
        return null;
    }
  };

  updateTabCount = () => {
    Singleton.getInstance().getBadges(this.props.navigation);
    setTimeout(() => {
      this.setState({
        routes: [
          { key: 'G', title: 'GENERAL(' + Singleton.getInstance().GeneralCount + ')' },
          { key: 'O', title: 'ORDER(' + Singleton.getInstance().OrderCount + ')' },
        ],
      });
    }, 1000)
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.state.brodcast_pageNo = 1;
      this.state.order_pageNo = 1;
      this.getBroadCastNotifications();
      this.updateTabCount();
      this.getOrderNotifications();
      // Singleton.getInstance().NotificationCounter = 0;
      // this.props.navigation.setParams();
      AsyncStorage.setItem('isNotification', 'false');
    });
  };

  getBroadCastNotifications = () => {
    this.setState({
      showBottomLoader: true,
      loadingCounter: this.state.loadingCounter + 1,
      // refreshing: true
    }, () => {
      let params = {
        pageNo: this.state.brodcast_pageNo,
        pageSize: this.state.pageSize,
        NotificationType: "BroadCast"
      };
      // console.log('NOTIFICATION BroadCast LIST')
      // console.log(params)
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      API.postRequest('api/notification/getnotificationlist', params).then((data) => {
        this.setState({
          showBottomLoader: false,
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1
        });
        if (
          data &&
          data.jsonResponse &&
          data.jsonResponse.data
        ) {
          console.log('NOTIFICATION General LIST')
          // console.log(data.jsonResponse.data);
          // console.log(data.jsonResponse.data.length);
          if (data.jsonResponse.data.length > 0) {
            console.log('-------------')
            this.setState({
              broadcastNotification:
                this.state.brodcast_pageNo === 1
                  ? data.jsonResponse.data
                  : [
                    ...this.state.broadcastNotification,
                    ...data.jsonResponse.data,
                  ],
              brodcast_pageNo: this.state.brodcast_pageNo + 1,

            }, () => {
              const newArrayList = [];
              this.state.broadcastNotification.forEach(obj => {
                if (!newArrayList.some(o => o.notificationId === obj.notificationId)) {
                  newArrayList.push({ ...obj });
                }
              });
              this.setState({
                broadcastNotification: newArrayList
              });


            });
          }
        }
      }).catch((err) => {
        this.setState({
          showBottomLoader: false,
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


  getOrderNotifications = () => {
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
      // refreshing: true
      showBottomLoader: true,
    }, () => {
      let params = {
        pageNo: this.state.order_pageNo,
        pageSize: this.state.pageSize,
        NotificationType: "Order"
      };
      API.postRequest('api/notification/getnotificationlist', params).then((data) => {
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
          showBottomLoader: false
        });
        if (
          data &&
          data.jsonResponse &&
          data.jsonResponse.data
        ) {
          console.log('NOTIFICATION Order LIST')
          console.log(data.jsonResponse.data);
          console.log(data.jsonResponse.data.length);
          if (data.jsonResponse.data.length > 0) {
            OCount = data.jsonResponse.data.length;
            console.log('-------------')
            this.setState({
              orderNotification:
                this.state.order_pageNo === 1
                  ? data.jsonResponse.data
                  : [
                    ...this.state.orderNotification,
                    ...data.jsonResponse.data,
                  ],
              order_pageNo: this.state.order_pageNo + 1
            }, () => {
              const newArrayList = [];
              this.state.orderNotification.forEach(obj => {
                if (!newArrayList.some(o => o.notificationId === obj.notificationId)) {
                  newArrayList.push({ ...obj });
                }
              });
              this.setState({
                orderNotification: newArrayList
              });
            });
          }
        }
      }).catch((err) => {
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
          showBottomLoader: false,
        });
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
    });
  };

  renderFooter() {
    return this.state.showBottomLoader ? (
      <View>
        <Text>{strings.Loading}</Text>
      </View>
    ) : null;
  }

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

  NotificationItem = ({ item, index }) => {
    return (
      <AnimatedButton
        onPress={() => {
          this.props.navigation.push('NotificationDetail', {
            navParams: item,
          });
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 16,
            marginVertical: 8,
            backgroundColor: '',
          }}>
          <Image source={IconDava} resizeMode="contain" style={styles.icon} />

          <View style={{ flex: 1, marginLeft: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '',
                alignItems: 'center',
              }}>
              <CustomText
                text={item.title}
                textcolor={AppTheme.APPCOLOR.PRIMARY}
                fontSize={15}
                numberOfLines={2}
                customStyle={{ flex: 1, fontWeight: item.isRead ? '300' : '700' }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '',
                // alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <CustomText
                text={strings.READMORE}
                textcolor={AppTheme.APPCOLOR.TEXT}
                numberOfLines={2}
                fontSize={10}
                style={{
                  alignItems: 'flex-start',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                <IconAntDesign
                  name="clockcircleo"
                  size={13}
                  color={AppTheme.APPCOLOR.GRAY}
                  style={{
                    marginRight: 5,
                  }}
                />
                <CustomText
                  text={Moment(item.notificationTime).format('DD/MM/YYYY')}
                  textcolor={AppTheme.APPCOLOR.GRAY}
                  fontSize={12}
                />
              </View>
            </View>
          </View>

          <View style={{ justifyContent: 'center', left: 10 }}>
            <IconAntDesign
              name="right"
              size={20}
              color={AppTheme.APPCOLOR.PRIMARY}
            />
          </View>
        </View>
      </AnimatedButton>
    );
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          // width: "100%",
          backgroundColor: AppTheme.APPCOLOR.BLACK,
        }}
      />
    );
  };

  onRefresh() {
    this.setState({ refreshing: true, isFetching: true }, () => {
      if (this.state.tabIndex == 0) {
        this.getBroadCastNotifications();
      }

      if (this.state.tabIndex == 1) {
        this.getOrderNotifications();
      }

    });
  }

  _handleIndexChange = index => {
    console.log("index changed " + index)
    this.setState({ tabIndex: index })
    this.updateTabCount();
    if (index == 1) {
      this.setState({
        // refreshing: true
        showBottomLoader: true,
      })
      this.getOrderNotifications();
    }

    if (index == 0) {
      this.setState({
        // refreshing: true,
        showBottomLoader: true,
      })
      this.getBroadCastNotifications();
    }
  };

  render() {
    return (
      <BaseView style={{ justifyContent: 'center' }}>
        <TabView
          // lazy
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this._handleIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => <TabBar {...props} style={{
            backgroundColor: AppTheme.APPCOLOR.PRIMARY
          }}
            indicatorStyle={{ height: 4, color: 'red', backgroundColor: AppTheme.APPCOLOR.GREEN }}
          />}
        />
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
  },
  footer: {
    alignSelf: 'center',
  }
});
