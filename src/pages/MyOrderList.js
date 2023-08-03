import React from 'react';
import { SafeAreaView, StyleSheet, FlatList } from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import strings from '../LanguageFiles/LocalizedStrings';
import StarRating from 'react-native-star-rating';
import Moment from 'moment';
import { View } from 'react-native-animatable';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import CustomText from '../helper/customView/CustomText';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import AppBase from '../AppBase';
import Singleton from '../helper/Singleton';
import Swiper from 'react-native-swiper';
import Card from '../helper/customView/Card';

export default class MyOrderList extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingCounter: 0,
      orderList: [],
      starCount: 0,
      remark: '',
    };
  }

  componentDidMount = () => {
    this.getOrderList();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        // orderList: [],
      }, () => {
        // this.getOrderList();
      });
    });
  };

  getOrderList = () => {
    this.setState(
      { loadingCounter: this.state.loadingCounter + 1 },
      () => {
        API.getRequest('api/cart/getorderslist')
          .then((data) => {
            // console.log(data.jsonResponse.data);
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            });
            if (
              data &&
              data.jsonResponse &&
              data.jsonResponse.data &&
              data.jsonResponse.data.length > 0
            ) {
              this.setState({
                orderList: data.jsonResponse.data,
              });
            }
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
      },
    );
  };

  onRefresh = () => {
    //set isRefreshing to true
    this.setState({
      refreshing: true
    }, () => {
      this.getOrderList();
    })
    // and set isRefreshing to false at the end of your callApiMethod()
  }

  saveRating = (item) => {
    if (!item.ratings) {
      this.showAlertMessage(strings.SELECT_RATING);
    } else if (!item.remark) {
      this.showAlertMessage(strings.SELECT_REVIEW);
    } else {
      let params = {
        OrderId: item.orderId,
        Ratings: item.ratings,
        Review: item.remark,
      };
      console.log(params);

      this.setState(
        { loadingCounter: this.state.loadingCounter + 1, refreshing: true },
        () => {
          API.postRequest('api/cart/saveratingsandreview', params)
            .then((data) => {
              // console.log(data);
              this.setState({
                refreshing: false,
                loadingCounter: this.state.loadingCounter - 1,
              });
              this.showAlertMessage(data.jsonResponse.message);
              if (data.jsonResponse.status) {
                this.getOrderList();
              }
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
        },
      );
    }
  };

  RenderOrderNo = (orderData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemorderName}
        text={strings.Order_No + " "}
      />
    );
  };

  RenderOrderNoValue = (orderData) => {
    // console.log(orderData)
    return (
      <CustomText
        numberOfLines={1}
        customStyle={styles.itemValue}
        text={orderData.orderId.toString()}
      />
    );
  };

  RenderOrderDeliveryDate = (orderData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemorderName}
        text={strings.Order_Delivery}
      />
    );
  };

  RenderOrderDeliveryDateValue = (orderData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemValue}
        text={Moment(orderData.deliveryDate).format('DD/MM/YYYY')}
      />
    );
  };

  RenderOrderDate = (orderData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemorderName}
        text={strings.Order_Date}
      />
    );
  };

  RenderOrderDateValue = (orderData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemValue}
        text={Moment(orderData.orderDate).format('DD/MM/YYYY')}
      />
    );
  };

  RenderOrderAmount = (orderData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemorderName}
        text={strings.Order_Amount}
      />
    );
  };

  RenderOrderAmountValue = (orderData) => {
    return (
      <CustomText
        numberOfLines={1}
        customStyle={styles.itemValue}
        text={'\u20B9 ' + this.parsePrice(orderData.finalAmount)}
      />
    );
  };

  RenderButton = (orderData) => {
    let color = Singleton.getInstance().getBadgeColor(orderData);
    return (
      <CustomText
        customStyle={[styles.itemBadge, { backgroundColor: color }]}
        text={orderData.orderStatus}
      />
    );
  };

  RenderRateView = (orderData) => {
    return <CustomText text={strings.Rate} />;
  };

  RenderRatingStar = (orderData, index) => {
    return (
      <View style={styles.row}>
        <StarRating
          disabled={orderData.isReviewDone ? true : false}
          maxStars={5}
          starSize={25}
          // halfStarEnabled={true} //Enable half star ratings
          fullStarColor={AppTheme.APPCOLOR.GREEN}
          emptyStarColor={AppTheme.APPCOLOR.PRIMARY}
          rating={orderData.ratings}
          selectedStar={(rating) => {
            var newitem = this.state.orderList;
            newitem[index].ratings = rating;
            this.setState({
              orderList: newitem,
            });
          }}
        />
      </View>
    );
  };

  RenderRatingInput = (orderData, index) => {
    return (
      <CustomTextInput
        ref={(ref) => (this.rateTextRef = ref)}
        name={'remark'}
        editable={orderData.isReviewDone ? false : true}
        style={styles.rateinput}
        returnKeyType={'done'}
        multiline={true}
        value={orderData.userReview}
        placeholder={strings.Write_Review}
        placeholderTextColor={AppTheme.APPCOLOR.TEXT}
        onChangeText={(value) => {
          var newitem = this.state.orderList;
          newitem[index].remark = value;
          this.setState({
            orderList: newitem,
          });
        }}
      />
    );
  };

  RenderSubmitBtn = (orderData) => {
    return (
      <AnimatedButton
        disabled={orderData.isReviewDone ? true : false}
        onPress={() => {
          this.saveRating(orderData);
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          position: 'absolute',
          bottom: 10,
          right: 10,
          height: 50,
          borderRadius: 100,
          backgroundColor: AppTheme.APPCOLOR.PRIMARY,
        }}>
        <IconMaterialIcons
          name="send"
          size={15}
          color={AppTheme.APPCOLOR.WHITE}
        />
      </AnimatedButton>
    );
  };

  OrderListItem = ({ item, index }) => {
    return (
      <View
        easing={'ease-in-out'}
        delay={index * 50}
        animation={'fadeInUp'}
        duration={500}>
        <Card style={styles.listItem}>
          <AnimatedButton
            onPress={() => {
              this.props.navigation.push('OrderDetail', { navParams: item });
            }}>
            <View style={styles.containerProducts}>
              {this.RenderOrderNo(item)}
              {this.RenderOrderNoValue(item)}
            </View>

            <View style={styles.containerProducts}>
              {this.RenderOrderDate(item)}
              {this.RenderOrderDateValue(item)}
            </View>

            {item.deliveryDate ? (
              <View style={styles.containerProducts}>
                {this.RenderOrderDeliveryDate(item)}
                {this.RenderOrderDeliveryDateValue(item)}
              </View>
            ) : null}

            <View style={styles.containerProducts}>
              {this.RenderOrderAmount(item)}
              {this.RenderOrderAmountValue(item)}
            </View>

            <View style={{ flex: 1 }}>{this.RenderButton(item)}</View>
          </AnimatedButton>

          <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>
            {this.RenderRateView(item)}
            {this.RenderRatingStar(item, index)}
          </View>

          <View style={styles.containerProducts}>
            {this.RenderRatingInput(item, index)}
            {item.isReviewDone ? null : this.RenderSubmitBtn(item)}
          </View>
        </Card>
      </View>
    );
  };

  render() {
    return (
      <BaseView>
        <CustomLoadingView
          isShowModal={this.state.loadingCounter > 0 ? true : false}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            contentContainerStyle={{ paddingVertical: 8 }}
            data={this.state.orderList}
            extraData={this.state.orderList}
            key={this.OrderListItem}
            renderItem={this.OrderListItem}
            showsHorizontalScrollIndicator={false}
            // renderFooter={this.renderFooter.bind(this)}
            ListEmptyComponent={
              <CustomText
                customStyle={{
                  marginTop: 16,
                  flex: 1,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                text={
                  this.state.orderList.length == 0 && this.state.loadingCounter <= 0
                    ? strings.No_Record_Found
                    : null
                }
              />
            }
          />
        </SafeAreaView>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    // alignSelf: "center",
    // flexDirection: "row",
    padding: 5,
    // backgroundColor: AppTheme.APPCOLOR.SILVER,
    borderRadius: 10,
    margin: 10,
    // borderBottomColor: AppTheme.APPCOLOR.GRAY,
    // borderBottomWidth: 1,
    // marginBottom: 30,
  },
  itemorderName: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '500',
    alignSelf: 'flex-start',
    width: '50%',
    // textAlign: 'left'
  },
  containerProducts: {
    // paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  itemValue: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '500',
    width: '50%',
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  itemBadge: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    margin: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 5,
    overflow: 'hidden',
    width: 100,
    alignSelf: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  rateinput: {
    borderBottomColor: AppTheme.APPCOLOR.GRAY,
    borderBottomWidth: 1,
    width: '80%',
    marginBottom: 10,
  },
});
