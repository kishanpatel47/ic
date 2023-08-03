import debounce from 'lodash/debounce';
import AllInOneSDKManager from 'paytm_allinone_react-native';
import React from 'react';
import { Alert, BackHandler, FlatList, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import RNPgReactNativeSDK from 'react-native-pg-react-native-sdk';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //https://oblador.github.io/react-native-vector-icons/
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'; //https://oblador.github.io/react-native-vector-icons/
import minBtn from '../../Assets/Images/minus-qty.png';
import NoImage from '../../Assets/Images/noimage.png';
import plsBtn from '../../Assets/Images/plus-icon.png';
import AppBase from '../AppBase';
import API from '../connection/http-utils';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import Card from '../helper/customView/Card';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import CustomText from '../helper/customView/CustomText';
import FailModal from '../helper/customView/FailModal';
import SuccessModal from '../helper/customView/SuccessModal';
import Singleton from '../helper/Singleton';
import strings from '../LanguageFiles/LocalizedStrings';
const iconCart = './../../Assets/Images/cart.png';

const STAGURL = 'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=';
const PRODURL = 'https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=';
const mid = 'OEGSeA31102301820552';
const isStaging = true;
const restrictAppInvoke = true;
const apiKeyCashFree = "125201d0de10313b51a7399b1c102521";
const payUsingIciciPayment = true;
export default class Cart extends AppBase {

  constructor(props) {
    super(props);
    this.state = {
      cartlist: [],
      transactionData: {},
      orderData: {},
      address: {},
      userInfo: '',
      page: 1,
      pageSize: 10,
      qty: 1,
      refreshing: false,
      loadingCounter: 0,
      carttotal: 0,
      totalamnt: 0.0,
      payStatus: 0,
      orderId: '',
      emptyString: strings.Please_wait,
    };

  }

  componentDidMount = () => {
    // this.interval = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000 * 60);


    this.placeOrder = debounce(this.placeOrder.bind(this), 500);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      Singleton.getInstance().getBadges(this.props.navigation);
      this.setState({
        cartlist: [],
        address: this.props.route.params && this.props.route.params.selectedAddress ? this.props.route.params.selectedAddress : null
      }, () => {
        // console.log('GET SELECTED ADDRESS');
        // console.log(this.state.address)
        this.getUserData();
      },
      );
    });
  };

  getUserData = async () => {
    console.log('ADDRESS PROFILE DATA');
    Singleton.getInstance().getUserProfile().then((data) => {
      this.setState({
        userInfo: data,
      }, () => {
        this.getCartList();
      });
    }).catch((err) => {
      console.log(err);
      if (err.jsonResponse.status == false) {
        this.showAlertMessage(err.jsonResponse.message);
      }
    });
  };

  getCartList = () => {
    this.setState({
      refreshing: false,
      loadingCounter: this.state.loadingCounter + 1,
    }, () => {
      API.getRequest('api/cart/cartitemlist').then((data) => {
        console.log(data.jsonResponse);
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
        }, () => {
          if (
            data &&
            data.jsonResponse &&
            data.jsonResponse.data &&
            data.jsonResponse.data.cartItems
          ) {
            console.log("Selected Address is");
            console.log(data.jsonResponse.data);
            this.setState({
              emptyString: data.jsonResponse.data.cartItems.length > 0 ? strings.Please_wait : strings.EMPTY_CART,
              cartlist: data.jsonResponse.data.cartItems,
              carttotal: data.jsonResponse.data.carttoal,

              address: this.state.address == null && data.jsonResponse.data.address ? data.jsonResponse.data.address : this.state.address
            }, () => {
              this.setState({
                totalamnt: this.state.carttotal.finalAmount
                // / Math.round((this.state.carttotal.netAmt + this.state.carttotal.taxAmt + this.state.carttotal.shippingCharge + Number.EPSILON) * 100) / 100,
              }, () => {
                console.log("order amount = " + this.state.totalamnt);
              });
            });
          }
          else {
            this.setState({
              emptyString: strings.EMPTY_CART,
            })
          }
        });
      }).catch((err) => {
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
          emptyString: strings.EMPTY_CART,
        }, () => {
          this.showAlertMessage(err.jsonResponse.message);
        });
      });
    });

  };

  addToCart = (item) => {
    console.log(item.medicineId, item.qty);
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
    }, () => {
      API.addItemToCart(item.medicineId, item.qty).then((data) => {
        this.setState({
          loadingCounter: this.state.loadingCounter - 1,
        });
        if (data && data.jsonResponse && data.jsonResponse.status) {
          Singleton.getInstance().getBadges(this.props.navigation);
          this.showToastMessage(data.jsonResponse.message);
          this.getCartList();
        } else {
          this.showAlertMessage(data.jsonResponse.message);
        }
      }).catch((err) => {
        this.setState({
          loadingCounter: this.state.loadingCounter - 1,
        });
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
    });
  };

  selectAddress = () => {
    this.props.navigation.push('SelectAddress', { selectedAddress: this.state.address });
  };


  componentWillUnmount() {
    // clearInterval(this.interval)
    // this.handler.remove()
    // BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }

  // startTransaction = () => {
  //   this.setState({
  //     loadingCounter: this.state.loadingCounter + 1,
  //     refreshing: false
  //   }, () => {
  //     var params = { amount: this.state.carttotal.netAmt.toString(), orderId: this.state.orderData.orderNo };
  //     API.genTransRequest(params)
  //       .then((data) => {
  //         console.log(data.jsonResponse);
  //         this.setState({
  //           refreshing: false,
  //           loadingCounter: this.state.loadingCounter - 1,
  //         });
  //         if (
  //           data &&
  //           data.jsonResponse &&
  //           data.jsonResponse.data
  //         ) {
  //           this.setState({
  //             transactionData: JSON.parse(data.jsonResponse.data)
  //           }, () => {
  //             console.log(this.state.transactionData);
  //             if (this.state.transactionData.body.resultInfo.resultStatus == 'S' && this.state.transactionData.body.resultInfo.resultCode == '0000') {
  //               // this.payNow(params);
  //             } else {
  //               this.showAlertMessage(this.state.transactionData.body.resultInfo.resultMsg);
  //             }
  //           });
  //         }
  //       }).catch((err) => {
  //         this.setState({
  //           refreshing: false,
  //           loadingCounter: this.state.loadingCounter - 1,
  //         });
  //         if (err.jsonResponse.status == false) {
  //           this.showAlertMessage(err.jsonResponse.message);
  //         }
  //       });
  //   });
  // };

  //disable hardware back button


  updatePayment = (params) => {
    // this.state({
    //   paytmBackButton: false
    // })
    console.log("received params");
    console.log(params);
    console.log("Update Payment API Called >>>>>>>>>>>");
    // console.log(params.hasOwnProperty("orderId"));
    if (this.state.transactionData != null) {
      this.setState({
        loadingCounter: this.state.loadingCounter + 1
      }, () => {
        var param;
        console.log(params);
        console.log("params.orderId");
        console.log(JSON.parse(params).orderId);
        if (JSON.parse(params).txStatus == 'SUCCESS') {
          // Response Received by Paytm & Order ID Found
          console.log("Order ID Found" + JSON.stringify(params));
          param = {
            OrderNo: JSON.parse(params).orderId ? JSON.parse(params).orderId : "",
            PaymentMode: JSON.parse(params).paymentMode ? JSON.parse(params).paymentMode : '',
            TxnDate: JSON.parse(params).txTime ? JSON.parse(params).txTime : '',
            TxnStatus: JSON.parse(params).txStatus,
            ResultMessage: JSON.parse(params).txMsg,
            // PaymentStatus: "2",
            PaymentJson: JSON.stringify(JSON.parse(params)),
          };
        }
        else if (JSON.parse(params).txStatus == 'FAILED') {

          console.log("fail payment params" + + JSON.stringify(params));
          // Response not received from paytm side
          // {"response": "Transaction has been canceled"}
          // ["Error:"onBackPressedCancelTransaction"]
          // var errorMessage = "";
          // if (Array.isArray(params)) {
          //   errorMessage = params[0].hasOwnProperty("Error");
          // }
          // else if (params.hasOwnProperty("Error")) {
          //   errorMessage = params.Error;
          // }
          // else if (params.hasOwnProperty("RESPMSG")) {
          //   errorMessage = params.RESPMSG;
          // }
          // else {
          //   errorMessage = "NA";
          // }
          param = {
            OrderNo: JSON.parse(params).orderId ? JSON.parse(params).orderId : "",
            PaymentMode: JSON.parse(params).paymentMode ? JSON.parse(params).paymentMode : '',
            TxnDate: JSON.parse(params).txTime ? JSON.parse(params).txTime : '',
            TxnStatus: JSON.parse(params).txStatus,
            ResultMessage: JSON.parse(params).txMsg,
            // PaymentStatus: "2",
            PaymentJson: JSON.stringify(JSON.parse(params)),
          }
        } else {
          param = {
            OrderNo: JSON.parse(params).orderId ? JSON.parse(params).orderId : "",
            PaymentMode: JSON.parse(params).paymentMode ? JSON.parse(params).paymentMode : '',
            TxnDate: JSON.parse(params).txTime ? JSON.parse(params).txTime : '',
            TxnStatus: JSON.parse(params).txStatus,
            ResultMessage: JSON.parse(params).txMsg ? JSON.parse(params).txMsg : 'NA',
            // PaymentStatus: "2",
            PaymentJson: JSON.stringify(JSON.parse(params)),
          }
        }
        console.log("fail params");
        console.log(param);
        API.postRequest('api/cart/updatepaymentstatus', param).then((data) => {
          console.log("Update Payment API Response >>>>>>>>>>>.");
          console.log(data.jsonResponse);
          // console.log("ORDER ID" + data.jsonResponse.data)
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
            orderId: data.jsonResponse.data
          }, () => {
            if (data && data.jsonResponse && data.jsonResponse.status) {
              console.log("Payment Success Open Success Dialog");
              setTimeout(() => {
                this.setState({
                  payStatus: 'S',
                  // orderId: data.jsonResponse.data...
                });
              }, 750);
            } else {
              console.log("Payment Status Failed Open Failed Dialog");
              setTimeout(() => {
                this.setState({
                  payStatus: 'F'
                });
              }, 750);
              // this.showAlertMessage(data.jsonResponse.message);
            }
          });
        }).catch((err) => {
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          console.log("catch Error Message = " + err);
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
      });
    } else {
      this.showAlertMessage('TRANSACTION FAIL');
    }
  }


  payNow = (params) => {
    // this.state({
    //   paytmBackButton: true
    // })
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
    console.log('PAYING NOW');
    console.log(this.parsePrice(params.Amount));
    // console.log(JSON.parse(this.state.transactionData).body.txnToken);
    AllInOneSDKManager.startTransaction(
      this.state.orderData.orderNo,
      mid,
      JSON.parse(this.state.transactionData).body.txnToken,
      this.parsePrice(params.Amount),
      (isStaging ? STAGURL : PRODURL) + this.state.orderData.orderNo,
      isStaging,
      restrictAppInvoke,
    ).then((result) => {

      console.log("Paytm Result >>>>>>>>>>>>.");
      console.log(result);
      setTimeout(() => {
        this.updatePayment(result);
      }, 500);
      // this.showAlertMessage('TRANSACTION FAIL' + result.toString());
    }).catch((err) => {
      // console.log(jsonS(err))
      this.showAlertMessage('TRANSACTION FAIL' + err.toString());
      console.log("Paytm Error??????????/");
      // // console.log(err["Error"]);
      // let failResult = {
      //   ORDERID: this.state.orderData.orderNo,
      //   PAYMENTMODE: "",
      //   TXNDATE: "",
      //   STATUS: "Failed",
      //   RESPMSG: err["Error"].toString(),
      //   PaymentJson: JSON.stringify(err),
      // }
      // this.setState({
      //   payStatus: 'F'
      // });
      this.updatePayment(err);
      // this.setState({
      //   refreshing: false,
      //   loadingCounter: this.state.loadingCounter - 1,
      // });
      // // this.showAlertMessage(err.Error);
      // this.getUserData();
      console.log(err);
    });
  };

  payUsingCashFreePaymentGateway(params) {
    // Mendatory fields
    /* 
    orderId,
    orderAmount,
    orderCurrency,
    tokenData,
    customerName,
    customerPhone,
    customerEmail, 
    */

    var envirment = "TEST";
    var cfToken = "8x9JCN4MzUIJiOicGbhJCLiQ1VKJiOiAXe0Jye.ls9JiNxQTNxQGN1MWOzIjNiojI0xWYz9lIskjMyUDN1ATN2EjOiAHelJCLiIlTJJiOik3YuVmcyV3QyVGZy9mIsADM0ojI05Wdv1WQyVGZy9mIsISM0EjNwIjMzAjMyAjMiojIklkclRmcvJye.pAoMWJUm_TOQaLWNKSaJQZimgVJeUg9BhXWO5_pldOXSa8DiPwjaY9UZLXyKSqmPlC";

    var cashFreeParams = {
      "orderId": this.state.orderData.orderNo,
      "orderAmount": params.Amount.toString(),
      "appId": apiKeyCashFree,
      "tokenData": this.state.transactionData.cftoken,
      "orderCurrency": "INR",
      "orderNote": "Testing Payment from Mobile Side",
      "notifyUrl": "", //"https://test.gocashfree.com/notify",
      "customerName": this.state.orderData.userName,
      "customerPhone": this.state.orderData.mobileNo,
      "customerEmail": this.state.orderData.email
    }

    console.log(cashFreeParams);

    try {
      RNPgReactNativeSDK.startPaymentWEB(cashFreeParams, envirment, (result) => {
        console.log("Response from ICICI\n\n\n");
        console.log(result);
        setTimeout(() => {
          this.updatePayment(result);
        }, 750);
        // var response = "";
        // var obj = JSON.parse(result, function (key, value) {
        //   console.log(key + "::" + value);
        //   response += key + "::" + value + "\n"
        //   // Do something with the result
        // })
        // console.log("Payment Response = + ", JSON.stringify(response, null, 4));
      });
    } catch (error) {
      // this.changeResponseText(error);
      this.showAlertMessage(error.toString());

    }
  }

  placeOrder = () => {
    console.log('>>>>>>>>>>>>>>' + this.state.totalamnt);
    if (this.state.address != null) {
      if (this.state.totalamnt != null) {
        this.setState({
          loadingCounter: this.state.loadingCounter + 1
        }, () => {
          let params = {
            PaymentMode: 'OnlinePayment',
            Amount: this.state.totalamnt,
            AddressId: this.state.address.addressID
          };
          console.log("api/cart/placeordernew" + JSON.stringify(params));
          API.postRequest('api/cart/placeordernew', params).then((data) => {
            console.log("Place order API called")
            console.log("Place Order Now Response =" + JSON.stringify(data.jsonResponse));
            this.setState({
              loadingCounter: this.state.loadingCounter - 1,
            }, () => {
              if (data && data.jsonResponse && data.jsonResponse.status) {
                this.setState({
                  orderData: data.jsonResponse.data.order,
                  transactionData: data.jsonResponse.data.payment ? data.jsonResponse.data.payment : null
                }, () => {
                  // this.showAlertMessage(data.jsonResponse.message);
                  if (data.jsonResponse.data.payment) {
                    console.log('STARTING TRANSACTION');
                    // this.payNow(params);
                    setTimeout(() => {
                      this.payUsingCashFreePaymentGateway(params);
                    }, 500);

                  } else {
                    this.showAlertMessage('Payment Error');
                  }
                });
              } else {
                this.showAlertMessage(data.jsonResponse.message);
              }
            });

          }).catch((err) => {
            this.setState({
              loadingCounter: this.state.loadingCounter - 1
            });
            console.log(err);
            if (err.jsonResponse.status == false) {
              this.showAlertMessage(err.jsonResponse.message);
            }
          });
        });
      }
    } else {
      // this.showAlertMessage(strings.ADD_NEW_ADDRESS);
      Alert.alert(
        strings.Alert,
        strings.ADD_NEW_ADDRESS,
        [
          // {
          //   text: 'Cancel',
          //   onPress: () => console.log('Cancel Pressed'),
          //   style: 'cancel',
          // },
          {
            text: strings.Add,
            onPress: () => {
              this.props.navigation.push('addressForm', { userInfo: this.state.userInfo, isFromCart: true });
            },
            style: 'cancel',
          },
          {
            text: strings.CANCEL,
            onPress: () => {
              //this.props.navigation.push('addressForm', { userInfo: this.state.userInfo, isFromCart: true });
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  incrementCount(item, index) {
    // index will be the key value
    const items = this.state.cartlist;
    item.qty += 1;

    items.splice(index, 1, item);
    this.setState(
      {
        cartlist: items,
      },
      () => {
        this.addToCart(item);
      },
    );
  }

  decrementCount(item, index) {
    // index will be the key value
    const items = this.state.cartlist;
    item.qty -= 1;
    items.splice(index, 1, item);
    this.setState(
      {
        cartlist: items,
      },
      () => {
        this.addToCart(item);
      },
    );
  }

  CartListItem = ({ item, index }) => {
    return (
      <View
        easing={'ease-in-out'}
        delay={index * 150}
        animation={'fadeInUp'}
        duration={500}>
        <View style={styles.listItem}>
          <AnimatedButton
            onPress={() => {
              this.props.navigation.navigate('medicinedetail', {
                navParams: item,
              });
            }}>
            <View style={styles.whitecircle}>
              <View style={styles.circleImage}>
                {this.RenderProductImage(item)}
              </View>
            </View>
          </AnimatedButton>

          <View style={{ alignItems: 'flex-start', flex: 0.7, marginLeft: 10 }}>
            <AnimatedButton
              onPress={() => {
                this.props.navigation.navigate('medicinedetail', {
                  navParams: item,
                });
              }}>
              {this.RenderProductTitle(item)}
              {this.RenderSubProductOne(item)}
              {this.RenderUnitSize(item)}
              {this.RenderPrice(item)}
            </AnimatedButton>
          </View>

          <View style={{ alignItems: 'flex-end', flex: 0.3, marginLeft: 10 }}>
            {item.qty >= 1 ? this.RenderQuantity(item, index) : null}
            {this.RenderDELBTN(item)}
          </View>
        </View>
      </View>
    );
  };

  addressItem = () => {
    return (
      <View
        width={'100%'}
        easing={'ease-in-out'}
        delay={1 * 150}
        animation={'fadeInUp'}
        duration={500}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <View style={styles.addItem}>
            <View>
              {this.RenderAddressTitle()}
              {this.RenderAddress()}
              {this.state.address.isDefault ? this.RenderDefault() : null}
            </View>
          </View>
        </View>
        <AnimatedButton
          style={styles.btnChangeAddr}
          onPress={() => this.selectAddress()}>
          <CustomText
            text={strings.CHANGE_ADDR}
            customStyle={styles.txtChangeAddr}
          />
        </AnimatedButton>
      </View>
    );
  };

  RenderAddressTitle = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomText
          numberOfLines={10}
          customStyle={styles.itemName}
          text={this.state.address && this.state.address.name ? this.state.address.name : '-'}
        />
        <View
          style={[styles.namechip, { paddingHorizontal: 10 }]}
        >
          <MaterialCommunityIcons
            name={this.state.address && this.state.address.addressType === 1 ? 'home' : 'office-building'}
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
            text={this.state.address && this.state.address.addressType === 1 ? strings.ADDRESS_HOME : strings.ADDRESS_WORK}
            customStyle={{ color: 'white', fontSize: 13 }}
          />
        </View>
      </View>
    );
  };

  RenderAddress = () => {
    return (
      <View>
        <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={this.state.address && this.state.address.address1 ? this.state.address.address1 : '-'}
        />
        {this.state.address && this.state.address.address2 ? <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={this.state.address && this.state.address.address2 ? this.state.address.address2 : '-'}
        /> : null}
        {this.state.address && this.state.address.address3 ? <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={this.state.address && this.state.address.address3 ? this.state.address.address3 : '-'}
        /> : null}
        <CustomText
          numberOfLines={1}
          customStyle={styles.subitem}
          text={this.state.address && this.state.address.city ? this.state.address.city : '' + ', ' + this.state.address && this.state.address.state ? this.state.address.state : '' + ', ' + this.state.address && this.state.address.pinCode ? this.state.address.pinCode : ''}
        />
      </View>
    );
  };

  RenderDefault = () => {
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

  RenderProductImage = (Data) => {
    if (Data.photoPath) {
      return <Image source={{ uri: Data.photoPath }} style={styles.productIMG} />;
    } else {
      return <Image source={NoImage} style={styles.productIMG} />;
    }
  };

  RenderProductTitle = (Data) => {
    return (
      <CustomText
        numberOfLines={10}
        customStyle={styles.itemName}
        text={Data.generic_Name}
      />
    );
  };

  RenderSubProductOne = (Data) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.subitem}
        text={Data.companyName == '' ? 'NA' : Data.companyName}
      />
    );
  };

  RenderUnitSize = (Data) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.subitem}
        text={
          Data.unitSize == '' ? 'NA' : strings.Unit_Size + ': ' + Data.unitSize
        }
      />
    );
  };

  RenderPrice = (Data) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.price}
        text={Data.mrp == '' ? 'NA' : '\u20B9 ' + this.parsePrice(Data.mrp)}
      />
    );
  };

  RenderDELBTN = (Data) => {
    return (
      <AnimatedButton
        onPress={() => {
          Data.qty = 0;
          this.state.loadingCounter > 0 ? null : this.addToCart(Data);
        }}>
        <IconMaterialIcons
          name="delete"
          size={30}
          color={AppTheme.APPCOLOR.PRIMARY}
          style={{ top: 15 }}
        />
      </AnimatedButton>
    );
  };

  RenderQuantity = (Data, index) => {
    return (
      <View style={styles.row}>
        <View style={styles.col}>
          <AnimatedButton
            onPress={() => {
              this.decrementCount(Data, index);
            }}>
            <Image
              source={minBtn}
              resizeMode="contain"
              style={styles.qtyIcon}
            />
          </AnimatedButton>
          <CustomText customStyle={[styles.qty]} text={Data.qty.toString()} />
          <AnimatedButton
            onPress={() => {
              this.incrementCount(Data, index);
            }}>
            <Image
              source={plsBtn}
              resizeMode="contain"
              style={styles.qtyIcon}
            />
          </AnimatedButton>
        </View>
      </View>
    );
  };

  render() {
    return (
      <BaseView>
        <SafeAreaView style={{ flex: 1 }}>
          <CustomLoadingView
            isShowModal={this.state.loadingCounter > 0 ? true : false}
          />
          <SuccessModal isShowModal={this.state.payStatus == 'S' ? true : false} orderId={this.state.orderId.toString()} onClose={() => {
            this.setState({
              payStatus: 0,
              loadingCounter: this.state.loadingCounter > 0 ? this.state.loadingCounter - 1 : 0,
            }, () => {
              setTimeout(() => {
                Singleton.getInstance().getBadges(this.props.navigation);
                this.getCartList();
              }, 750);
            })
          }} onTrack={() => {
            this.setState({
              payStatus: 0,
              loadingCounter: this.state.loadingCounter > 0 ? this.state.loadingCounter - 1 : 0,
            }, () => {
              Singleton.getInstance().getBadges(this.props.navigation);
              console.log('GO TRACK');
              setTimeout(() => {
                // this.props.navigation.push('My Orders', { screen: 'OrderTrack', params: { navParams: { orderId: this.state.orderId.toString() } } });
                this.props.navigation.push('OrderTrack', { navParams: { orderId: this.state.orderId.toString() } });
              }, 1000);
              // this.props.navigation.navigate('OrderTrack', {
              //   navParams: { orderId: this.state.orderData.orderNo.toString() }
              // });
            })
          }} />
          <FailModal isShowModal={this.state.payStatus == 'F' ? true : false} onClose={() => {
            this.setState({
              payStatus: 0,
              loadingCounter: this.state.loadingCounter > 0 ? this.state.loadingCounter - 1 : 0,
            }, () => {
              setTimeout(() => {
                Singleton.getInstance().getBadges(this.props.navigation);
                this.getCartList();
              }, 750);
            })
          }} />
          <ScrollView ref={ref => this.scrollView = ref}>
            <Card>
              <FlatList
                onEndReachedThreshold={0.5}
                onEndReached={({ }) => {
                  console.warn('onEndReached');
                  // this.getCarteList();
                }}
                ListFooterComponent={
                  this.state.isShowModal ? this.renderBottomLoader : null
                }
                onRefresh={() => this.getCartList()}
                refreshing={this.state.refreshing}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={this.state.cartlist}
                extraData={this.state.cartlist}
                key={this.CartListItem}
                renderItem={this.CartListItem}
                showsHorizontalScrollIndicator={false}
                // renderFooter={this.renderFooter.bind(this)}
                ListEmptyComponent={
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={require(iconCart)}
                      style={[
                        {
                          height: 50,
                          width: 50,
                          resizeMode: 'contain',
                          tintColor: AppTheme.APPCOLOR.PRIMARY,
                          // backgroundColor: 'red',
                        },
                      ]}
                    />
                    <CustomText
                      customStyle={{
                        // marginTop: 0,
                        // flex: 1,
                        // justifyContent: 'center',
                        // textAlign: 'center',
                      }}
                      text={
                        this.state.emptyString
                      }
                    />
                  </View>
                }
              />
            </Card>

            {this.state.address != null && this.state.cartlist.length > 0 ?
              <Card>
                {this.addressItem()}
              </Card> : null}
            {this.state.address == null && this.state.cartlist.length > 0 ?
              <Card>
                <View
                  width={'100%'}
                  easing={'ease-in-out'}
                  delay={1 * 150}
                  animation={'fadeInUp'}
                  duration={500}>
                  <AnimatedButton
                    style={styles.btnChangeAddr}
                    onPress={() => {
                      // this.placeOrder();
                      // this.startTransaction();
                      // this.selectAddress();
                      this.props.navigation.push('addressForm', { userInfo: this.state.userInfo, isFromCart: true });
                    }}>
                    <CustomText
                      text={strings.ADD_NEW_ADDRESS}
                      customStyle={styles.txtChangeAddr}
                    />
                  </AnimatedButton>
                </View>
              </Card> : null}

            {this.state.cartlist.length > 0 && this.state.carttotal.netAmt > 0 ? (
              <Card style={{ marginBottom: 10 }}>
                <View style={styles.priceview}>
                  <CustomText customStyle={styles.pricelabel} text={strings.NET_AMOUNT} />
                  <CustomText
                    customStyle={styles.pricelabel}
                    text={'\u20B9 ' + this.parsePrice(this.state.carttotal.netAmt)}
                  />
                </View>

                <View style={styles.priceview}>
                  <CustomText customStyle={styles.pricelabel} text={strings.TAX_AMOUNT} />
                  <CustomText
                    customStyle={styles.pricelabel}
                    text={'\u20B9 ' + this.parsePrice(this.state.carttotal.taxAmt)}
                  />
                </View>

                <View style={styles.priceview}>
                  <CustomText customStyle={styles.pricelabel} text={strings.SHIPPING_CHARGE} />
                  <CustomText
                    customStyle={styles.pricelabel}
                    text={'\u20B9 ' + this.parsePrice(this.state.carttotal.shippingCharge)}
                  />
                </View>
                {this.state.carttotal.roundOff != 0 ? (
                  <View style={styles.priceview}>
                    <CustomText customStyle={styles.pricelabel} text={strings.RoundOff} />
                    <CustomText
                      customStyle={styles.pricelabel}
                      text={'\u20B9 ' + this.parsePrice(this.state.carttotal.roundOff)}
                    />
                  </View>
                ) : null}
              </Card>
            ) : null}
          </ScrollView>

          {this.state.cartlist.length > 0 && this.state.carttotal.netAmt > 0 ? (
            <View
              style={{
                // marginHorizontal: 0,
                // marginVertical: 0,
                backgroundColor: AppTheme.APPCOLOR.PRIMARY,
                minHeight: 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <CustomText
                    numberOfLines={1}
                    customStyle={{
                      color: AppTheme.APPCOLOR.WHITE,
                      fontSize: 15,
                      fontWeight: '300',
                    }}
                    text={strings.Total + ': '}
                  />
                  <CustomText
                    numberOfLines={1}
                    customStyle={{
                      color: AppTheme.APPCOLOR.WHITE,
                      fontSize: 20,
                      fontWeight: '600',
                    }}
                    text={'\u20B9 ' + this.parsePrice(this.state.totalamnt)}
                  />
                  <IconMaterialIcons
                    name={"info"}
                    size={20}
                    color={AppTheme.APPCOLOR.WHITE}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'flex-start',
                      padding: 4,
                      overflow: 'hidden',
                    }}
                    onPress={() => {
                      this.scrollView.scrollToEnd({ animated: true });
                    }}
                  />
                </View>

                <AnimatedButton
                  style={styles.btnPlaceOrder}
                  onPress={() => {
                    this.placeOrder();
                    // if (payUsingIciciPayment == true) {
                    //   // Pay Using ICICI Payment
                    //   this.payUsingCashFreePaymentGateway();
                    // }
                    // else {
                    //   // Pay Using PayTm
                    //   this.placeOrder();
                    // }


                  }}>
                  <CustomText
                    text={strings.PAY_NOW}
                    customStyle={styles.txtPlaceOrder}
                  />
                </AnimatedButton>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginLeft: 10, paddingBottom: 10 }}>
                <CustomText
                  numberOfLines={1}
                  customStyle={{
                    color: AppTheme.APPCOLOR.WHITE,
                    fontSize: 12,
                    fontWeight: '300',
                  }}
                  text={'Net \u20B9' + this.parsePrice(this.state.carttotal.netAmt) + ' + Tax \u20B9' + this.parsePrice(this.state.carttotal.taxAmt) + ' + Shipping Charge \u20B9' + this.parsePrice(this.state.carttotal.shippingCharge)}
                />
              </View>

              {this.state.carttotal.roundOff != 0 ? (<View style={{ flexDirection: 'row', alignItems: 'flex-end', marginLeft: 10, paddingBottom: 10 }}>
                <CustomText
                  numberOfLines={1}
                  customStyle={{
                    color: AppTheme.APPCOLOR.WHITE,
                    fontSize: 12,
                    fontWeight: '300',
                  }}
                  text={' + Roundoff \u20B9' + this.parsePrice(this.state.carttotal.roundOff)}
                />
              </View>)
                : null}
            </View>
          ) : null}
        </SafeAreaView>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: AppTheme.APPCOLOR.BLACK,
    borderBottomWidth: 1,
  },
  addItem: {
    alignSelf: 'flex-end',
    // flexDirection: 'row',
    flex: 5,
    padding: 10,
  },
  addName: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
    textAlign: 'left',
  },
  itemName: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
    textAlign: 'left',
  },
  subitem: {
    fontSize: 13,
    color: AppTheme.APPCOLOR.BLACK,
  },
  price: {
    fontSize: 13,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
  },
  circleImage: {
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 2,
  },
  productIMG: {
    width: 70,
    height: 70,
  },
  whitecircle: {
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: AppTheme.APPCOLOR.WHITE,
    borderWidth: 3,
    width: 80,
    height: 80,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  col: {
    flexDirection: 'row',
    width: '50 %',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  qty: {
    color: AppTheme.APPCOLOR.BLACK,
    marginLeft: 5,
    marginRight: 5,
  },
  qtyIcon: {
    alignItems: 'center',
    tintColor: AppTheme.APPCOLOR.APPCOLOR,
    height: 25,
    width: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  footertxt: {
    color: AppTheme.APPCOLOR.WHITE,
  },
  btnPlaceOrder: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  btnChangeAddr: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 5,
  },
  txtPlaceOrder: {
    // padding: 10,
    color: AppTheme.APPCOLOR.WHITE,
  },
  txtChangeAddr: {
    color: AppTheme.APPCOLOR.WHITE,
  },
  priceview: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  pricelabel: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '600'
  },
  namechip: {
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 3,
    borderColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    flexDirection: 'row'
  },
});
