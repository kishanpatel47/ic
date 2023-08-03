import React from 'react';
import { StyleSheet, FlatList, ScrollView, Image, Alert } from 'react-native';
import { View } from 'react-native-animatable';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import NoImage from '../../Assets/Images/noimage.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import AppBase from '../AppBase';
import CustomText from '../helper/customView/CustomText';
import Moment from 'moment';
import strings from '../LanguageFiles/LocalizedStrings';
import Singleton from '../helper/Singleton';
import Card from '../helper/customView/Card';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class OrderDetail extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      orderDetail: [],
      itemOrderDetail: [],
      userInfo: '',
      userName: '',
      userMobile: '',
      userEmail: '',
      canCancelOrder: false,
      canReturnOrder: false,
      setShowBox: false,
      emptyMessage: strings.Please_wait,
      orderaddress: []
    };

    this.state.orderDetail = this.props.route.params.navParams;
    this.state.orderId = this.props.route.params.navParams.orderId;
    console.log(this.props.route.params.navParams);
    console.log('.....');
    console.log(this.state.orderDetail)
  }

  componentDidMount = () => {
    console.log('CALLING Order Detail');
    console.log('Order Details = ' + this.state.orderDetail);
    this.getOrderDetail();
    this.getUserData();
    this.getOrderStatus();
  };

  getOrderDetail = () => {
    API.getRequest('api/cart/medicinebyorderid?id=' + this.state.orderId)
      .then((data) => {
        console.log('ORDER DETAIL')
        console.log(data.jsonResponse.data);
        if (data && data.jsonResponse && data.jsonResponse.data) {
          this.setState({
            itemOrderDetail: data.jsonResponse.data.medicineList,
            orderaddress: data.jsonResponse.data.addressdetail
          });
          // console.log(this.state.itemOrderDetail)
        }
        else {
          this.setState({
            emptyMessage: strings.No_Record_Found
          })

        }
      })
      .catch((err) => {
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  getUserData = async () => {
    Singleton.getInstance().getUserProfile().then((data) => {
      console.log(data);
      this.setState({
        userInfo: data,
        userName: data && data.firstName ? data.firstName : '',
        userMobile: data && data.mobileNo ? data.mobileNo : '',
        userEmail: data && data.email ? data.email : '',
      }, () => {
        // this.getAddressList();
      });
    }).catch((err) => {
      console.log(err);
      if (err.jsonResponse.status == false) {
        this.showAlertMessage(err.jsonResponse.message);
      }
    });
    // API.getRequest('api/Account/getuserprofile')
    //   .then((dataenc) => {
    //     const data = API.decrpt(dataenc.jsonResponse);
    //     this.setState({
    //       userInfo: data.data,
    //       userName: data.data && data.data.firstName ? data.data.firstName : '',
    //       userMobile: data.data && data.data.mobileNo ? data.data.mobileNo : '',
    //       userEmail: data.data && data.data.email ? data.data.email : '',
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     if (err.jsonResponse.status == false) {
    //       this.showAlertMessage(err.jsonResponse.message);
    //     }
    //   });
  };

  getOrderStatus = async () => {
    API.getRequest('api/common/getreturnandcancelordervalue?Id=' + this.state.orderId)
      .then((data) => {
        console.log('ORDER STATUS DETAIL')
        console.log(data.jsonResponse.data[0]);
        if (data && data.jsonResponse && data.jsonResponse.data) {
          this.setState({
            canCancelOrder: data.jsonResponse.data[0].canCancelOrder,
            canReturnOrder: data.jsonResponse.data[0].canReturnOrder
          });
          // console.log(this.state.itemOrderDetail)
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  }

  RenderOrderNo = () => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemorderName}
        text={strings.Order_No}
      />
    );
  };

  RenderOrderNoValue = () => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemValue}
        text={this.state.orderDetail.orderId}
      />
    );
  };

  RenderOrderDate = () => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemorderName}
        text={strings.Order_Date}
      />
    );
  };

  RenderOrderDateValue = () => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={[styles.itemValue, { marginBottom: 20 }]}
        text={Moment(this.state.orderDetail.orderDate).format('DD/MM/YYYY')}
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
        text={Moment(this.state.orderDetail.deliveryDate).format('DD/MM/YYYY')}
      />
    );
  };

  RenderAmount = () => {
    return (
      <CustomText
        customStyle={[styles.itemBadge]}
        text={'\u20B9 ' + this.parsePrice(this.state.orderDetail.finalAmount)}
      />
    );
  };

  OrderItems = (item, index) => {
    // console.log(item.item.photoPath);
    // console.log(NoImage);
    return (
      <View
        key={index}
        easing={'ease-in-out'}
        delay={index * 50}
        animation={'fadeInUp'}
        duration={300}>
        <Card
          style={{
            flexDirection: 'row',
            backgroundColor: AppTheme.APPCOLOR.WHITE,
            borderRadius: 10,
            marginVertical: 3,
            padding: 8,
            // borderColor: AppTheme.APPCOLOR.SILVER,
          }}>
          {item.item.photoPath ? (
            <Image
              source={{ uri: item.item.photoPath }}
              style={styles.productIMG}
            />
          ) : (
            <Image source={NoImage} style={styles.productIMG} />
          )}
          <View style={{ alignItems: 'flex-start', flex: 1, marginLeft: 10 }}>
            <CustomText
              numberOfLines={5}
              customStyle={styles.itemName}
              text={item.item.generic_Name}
            />
            <CustomText
              numberOfLines={5}
              customStyle={styles.itemName}
              text={strings.QTY + ': ' + item.item.quantity}
            />
            <CustomText
              numberOfLines={5}
              customStyle={styles.itemName}
              text={'\u20B9 ' + this.parsePrice(item.item.mrp)}
            />
          </View>
        </Card>
      </View>
    );
  };

  cancelOrder = () => {
    let params = {
      Orderid: this.state.orderId
    };
    API.postRequest('api/cart/cancelorder', params)
      .then((data) => {
        console.log('ORDER CANCEL - ' + this.state.orderId);
        console.log(data.jsonResponse);
        if (data.jsonResponse.status) {
          this.setState({
            orderDetail: data.jsonResponse.data[0]
          })
        }
        this.getOrderStatus();
      })
      .catch((err) => {
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  }

  showConfirmDialog = (action) => {
    return Alert.alert(
      strings.Are_you_sure,
      action == 1 ? strings.Cancel_This_Order : strings.Return_This_Order,
      [
        // The "Yes" button
        {
          text: strings.Yes,
          style: 'destructive',
          onPress: () => {
            if (action == 1) {
              this.cancelOrder();
            } else if (action == 2) {
              this.returnOrder();
            }
            this.setState({
              setShowBox: true
            })
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: strings.No,
        },
      ]
    );
  };
  RenderAddressTitle = (Data) => {
    return (
      <View style={{ alignSelf: 'flex-end', }}>
        <CustomText
          numberOfLines={10}
          customStyle={styles.itemName}
          text={Data.name ? Data.name : '-'}
        />

      </View>

    );
  };

  RenderAddress = (Data) => {
    return (
      <View style={{
        marginTop: 5,
        marginBottom: 5,
      }}>
        <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={Data.name ? Data.name : '-'}
        />
        <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={Data.address1 ? Data.address1 : '-'}
        />
        {Data.address2 ? <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={Data.address2 ? Data.address2 : '-'}
        /> : null}
        {Data.address3 ? <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={Data.address3 ? Data.address3 : '-'}
        /> : null}
        <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={Data.city + ', ' + Data.state + ', ' + Data.pinCode}
        />
        <View
          style={[styles.namechip, { paddingHorizontal: 0, alignItems: 'flex-end' }]}
        >
          <MaterialCommunityIcons
            name={Data.addressType === 1 ? 'home' : 'office-building'}
            size={15}
            color={AppTheme.APPCOLOR.WHITE}
            style={{
              alignSelf: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden',
              paddingHorizontal: 3
            }}
          />
          <CustomText
            text={Data.addressType === 1 ? strings.ADDRESS_HOME : strings.ADDRESS_WORK}
            customStyle={{ color: 'white', fontSize: 13, marginRight: 5 }}
          />
        </View>
      </View>
    );
  };

  RenderDefault = (Data) => {
    return (
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={"Default Address"}
        />
        <MaterialCommunityIcons
          name="checkbox-marked-circle"
          size={17}
          color={AppTheme.APPCOLOR.GREEN}
          style={{
            alignSelf: 'center',
            alignItems: 'flex-start',
            padding: 4,
            overflow: 'hidden',
          }}
        />
      </View>
    );
  };


  render() {
    return (
      <BaseView contentContainerStyle={{ flexGrow: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.listItem}>
              <View style={styles.pricecss}>
                {this.RenderOrderNo()}
                {this.RenderOrderNoValue()}
              </View>

              <View style={styles.containerProducts}>
                {this.RenderOrderDate()}
                {this.RenderOrderDateValue()}
              </View>

              {this.state.orderDetail.deliveryDate ? (
                <View style={styles.containerProducts}>
                  {this.RenderOrderDeliveryDate(item)}
                  {this.RenderOrderDeliveryDateValue(item)}
                </View>
              ) : null}

              <View style={{ marginRight: 15 }}>{this.RenderAmount()}</View>
            </View>

            <View style={styles.containerProducts}>

              <View style={[{ flexDirection: 'row', justifyContent: 'space-between', flex: 2 }, styles.orderStatus]}>
                <IconMaterialIcons
                  name="check"
                  size={25}
                  color={AppTheme.APPCOLOR.GREEN}
                />
                <CustomText
                  text={this.state.orderDetail.orderStatus}
                  numberOfLines={3}
                  customStyle={{
                    color: AppTheme.APPCOLOR.GREEN,
                    fontWeight: '700',
                    flex: 1.8,
                    paddingHorizontal: 5
                    // fontSize: 15
                    // width: '100%',
                  }}
                />
              </View>

              <AnimatedButton
                onPress={() => {
                  // console.log('GET ORDER DETAIL');
                  // console.log(this.state.orderDetail);
                  this.props.navigation.push('OrderTrack', { navParams: this.state.orderDetail });
                }}
                style={styles.btnClickContain}
                underlayColor='#042417'>
                <View
                  style={styles.btnContainer}>
                  <IoniconsIcons
                    name="md-locate"
                    size={25}
                    style={{ color: AppTheme.APPCOLOR.WHITE, }}
                  />
                  <CustomText
                    text={strings.Track_Order}
                    customStyle={{
                      color: AppTheme.APPCOLOR.WHITE,
                      fontWeight: '700',
                      fontSize: 15
                      // width: '100%',
                    }}
                  />
                </View>
              </AnimatedButton>

            </View>

            <View style={styles.orderItem}>
              <View>
                <CustomText
                  customStyle={styles.orderdetaillabel}
                  text={strings.Order_Details}
                />
              </View>

              <View style={styles.containerProducts}>
                <CustomText customStyle={styles.usertext} text={strings.NAME} />
                <CustomText
                  customStyle={styles.usertext}
                  text={this.state.itemOrderDetail.length > 0 ? this.state.itemOrderDetail[0].customerName : "-"}
                />
              </View>

              <View style={styles.containerProducts}>
                <CustomText
                  customStyle={styles.usertext}
                  text={strings.MOBILE}
                />
                <CustomText
                  customStyle={styles.usertext}
                  text={this.state.userMobile}
                />
              </View>

              <View style={styles.containerProducts}>
                <CustomText
                  customStyle={styles.usertext}
                  text={strings.EMAIL}
                />
                <CustomText
                  customStyle={styles.usertext}
                  text={this.state.userEmail}
                />
              </View>

              {this.state.orderaddress.length != 0 ? (
                <View style={styles.containerProducts}>
                  <CustomText
                    customStyle={styles.usertext}
                    text={strings.ADDRESS}
                  />
                  {this.RenderAddress(this.state.orderaddress)}
                </View>
              ) : null}



              <View>
                <CustomText
                  customStyle={styles.itemslabel}
                  text={strings.Items}
                />
              </View>

              <FlatList
                contentContainerStyle={{ paddingVertical: 8 }}
                data={this.state.itemOrderDetail}
                extraData={this.state.itemOrderDetail}
                key={this.OrderItems}
                renderItem={this.OrderItems}
                ListEmptyComponent={
                  <CustomText
                    customStyle={{
                      marginTop: 16,
                      flex: 1,
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                    text={this.state.emptyMessage}
                  />
                }
              />
              <View style={styles.pricecss}>
                <CustomText
                  customStyle={styles.ordertextlabel}
                  text={strings.Sub_Total}
                />
                <CustomText
                  customStyle={styles.ordertextvalue}
                  text={
                    '\u20B9 ' +
                    this.parsePrice(this.state.orderDetail.total)
                  }
                />
              </View>
              {this.state.orderDetail.tax > 0 ? (
                <View style={styles.containerProducts}>
                  <CustomText
                    customStyle={styles.ordertextlabel}
                    text={strings.Tax}
                  />
                  <CustomText
                    customStyle={styles.ordertextvalue}
                    text={'\u20B9 ' + this.state.orderDetail.tax}
                  />
                </View>
              ) : null}
              {this.state.orderDetail.shippingCharge > 0 ? (
                <View style={styles.containerProducts}>
                  <CustomText
                    customStyle={styles.ordertextlabel}
                    text={strings.SHIPPING_CHARGE}
                  />
                  <CustomText
                    customStyle={styles.ordertextvalue}
                    text={
                      '\u20B9 ' + this.parsePrice(this.state.orderDetail.shippingCharge)
                    }
                  />
                </View>
              ) : null}
              {this.state.orderDetail.roundOff != 0 ? (
                <View style={styles.containerProducts}>
                  <CustomText
                    customStyle={styles.ordertextlabel}
                    text={strings.RoundOff}
                  />
                  <CustomText
                    customStyle={styles.ordertextvalue}
                    text={
                      '\u20B9 ' + this.parsePrice(this.state.orderDetail.roundOff)
                    }
                  />
                </View>
              ) : null}
              <View style={styles.containerProducts}>
                <CustomText
                  customStyle={styles.ordertextlabel}
                  text={strings.Total}
                />
                <CustomText
                  customStyle={styles.ordertextvalue}
                  text={
                    '\u20B9 ' + this.parsePrice(this.state.orderDetail.finalAmount)
                  }
                />
              </View>
            </View>

            {/* <View style={styles.centerContent}>
              <AnimatedButton
                onPress={() => {
                  // this.addFeedback();
                }}
                style={styles.savebtn}>
                <CustomText
                  text={strings.Continue}
                  customStyle={styles.savetxt}
                />
              </AnimatedButton>
            </View> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              {this.state.canCancelOrder ?
                <AnimatedButton
                  style={styles.btnOrderCancel}
                  onPress={() => {
                    this.showConfirmDialog(1)
                  }}>
                  <CustomText
                    text={strings.ORDERCANCEL}
                    customStyle={{ color: 'white' }}
                  />
                </AnimatedButton>
                : null}
              {this.state.canReturnOrder ?
                <AnimatedButton
                  style={styles.btnOrderReturn}
                  onPress={() => {
                    this.showConfirmDialog(2)
                  }}>
                  <CustomText
                    text={strings.ORDERRETURN}
                    customStyle={{ color: 'white' }}
                  />
                </AnimatedButton>
                : null}
              <AnimatedButton
                style={styles.btnRaiseComplaint}
                onPress={() => {
                  this.props.navigation.push('RaiseComplain', { orderdetail: this.state.orderDetail });
                  // this.props.navigation.push('RaiseComplain');
                }}>
                <CustomText
                  text={strings.RAISECOMPLAIN}
                  customStyle={{ color: 'white' }}
                />
              </AnimatedButton>
            </View>

          </View>
        </ScrollView>
      </BaseView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    paddingBottom: 15,
    paddingTop: 15,
    // padding: 25,
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 10,
    margin: 10,
    // height: 100,
  },
  containerProducts: {
    // paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricecss: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
  },
  itemorderName: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.WHITE,
    fontWeight: '500',
    alignSelf: 'flex-start',
    width: '50%',

    // textAlign: 'left'
  },
  itemValue: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.WHITE,
    fontWeight: '500',
    width: '50%',
    textAlign: 'right',
  },
  itemBadge: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: AppTheme.APPCOLOR.PRIMARY,
    backgroundColor: AppTheme.APPCOLOR.SILVER,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    elevation: 5,
  },
  orderItem: {
    backgroundColor: AppTheme.APPCOLOR.SILVER,
    borderRadius: 10,
    margin: 10,
    padding: 5,
  },
  usertext: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    marginTop: 5,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '300',
    width: '100%',
    // textAlign: 'left'
  },
  productIMG: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderColor: AppTheme.APPCOLOR.SILVER,
  },
  ordertextlabel: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: '700',
    width: '50%',
  },
  ordertextvalue: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: '700',
    width: '50%',
    textAlign: 'right',
  },
  orderStatus: {
    // justifyContent: 'center',
    alignItems: 'center',
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemslabel: {
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    fontWeight: '700',
  },
  orderdetaillabel: {
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    borderBottomColor: AppTheme.APPCOLOR.PRIMARY,
    borderBottomWidth: 1,
    fontWeight: '700',
  },
  btnClickContain: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 5,
    padding: 5,
    marginTop: 3,
    marginBottom: 3,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  btnIcon: {
    height: 25,
    width: 25,
  },
  btnText: {
    fontSize: 18,
    color: '#FAFAFA',
    marginLeft: 10,
    marginTop: 2,
  },

  btnOrderCancel: {
    backgroundColor: 'red',
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 20,
    height: 40,
    justifyContent: 'center',
    flex: 1,
  },

  btnOrderReturn: {
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 20,
    height: 40,
    justifyContent: 'center',
    flex: 1,
  },
  btnRaiseComplaint: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 20,
    height: 40,
    justifyContent: 'center',
    flex: 1,
  },
  namechip: {
    backgroundColor: AppTheme.APPCOLOR.GRAY,
    // // borderWidth: 3,
    borderColor: AppTheme.APPCOLOR.GRAY,
    borderRadius: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 5,
    // flexDirection: 'row'
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  subitem: {
    fontSize: 13,
    color: AppTheme.APPCOLOR.BLACK,
    alignSelf: 'flex-end',
  },
});
