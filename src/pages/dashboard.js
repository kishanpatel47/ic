import React from 'react';
import {
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { View } from 'react-native-animatable';
import BaseView from '../helper/customView/BaseView';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'; //https://oblador.github.io/react-native-vector-icons/
import IconDavaWhite from '../../Assets/Images/davaindia-white-logo.png';
import DashboardBG from '../../Assets/Images/grey-bg.jpg';
import NoImage from '../../Assets/Images/noimage.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import CustomText from '../helper/customView/CustomText';
import moment from 'moment'; //https://medium.com/better-programming/using-moment-js-in-react-native-d1b6ebe226d4
import API from '../connection/http-utils';
import Swiper from 'react-native-swiper';
import strings from '../LanguageFiles/LocalizedStrings';
import AppBase from '../AppBase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Singleton from '../helper/Singleton';

export default class Dashboard extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      loadingCounter: 0,
      refreshing: true,
      isConnected: true,
      todayString: moment(new Date()).format('DD-MMM-YYYY'),
      userName: '',
      userImageURL: '',
      userCheckin: 'Start Day',
      isStartday: '',
      categoryList: [],
      sliderData: [],
      bestSelling: [],
      newArrivals: [],

      // isModalVisible: false,
    };
  }

  // componentDidMount = () => {
  //   console.log('CALLING DASHBOARD DATA');
  //   AsyncStorage.getItem('isNotification').then((jsonValue) => {
  //     if (jsonValue == 'true') {
  //       this.props.navigation.navigate('Notification');
  //     }
  //   });
  //   setTimeout(() => {
  //     this.getUserData();
  //     this.getSliderData();
  //   }, 500);
  //   this._unsubscribe = this.props.navigation.addListener('focus', () => {
  //     setTimeout(() => {
  //       Singleton.getInstance().getBadges(this.props.navigation);
  //     }, 1000);
  //     // this.setState(
  //     //   {
  //     //     bestSelling: [],
  //     //     newArrivals: [],
  //     //   },
  //     //   () => {
  //     //     // alert("1")
  //     //     // this.getProductData();
  //     //   },
  //     // );
  //   });
  // };

  componentWillMount() {
    this.setState({
      bestSelling: [],
      newArrivals: [],
    }, () => {
      setTimeout(() => {
        this.getUserData();
        this.getSliderData();
      }, 500);
      // this.getProductData();
    });
  }

  componentDidMount = () => {
    console.log('CALLING DASHBOARD DATA');
    this.getUserData();
    AsyncStorage.getItem('isNotification').then((jsonValue) => {
      if (jsonValue == 'true') {
        this.props.navigation.navigate('Notification');
      }
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      setTimeout(() => {
        Singleton.getInstance().getBadges(this.props.navigation);
      }, 1000);
    });
  };

  getCategoryList = () => {
    this.setState({ loadingCounter: this.state.loadingCounter + 1 }, () => {
      API.getRequest('api/catagory/getcatagory')
        .then((data) => {
          if (data && data.jsonResponse && data.jsonResponse.length > 0) {
            this.setState({
              categoryList: data.jsonResponse,
            });
          }
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          this.getProductData();
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          this.getProductData();
          // if (err.jsonResponse.status == false) {
          //   this.showAlertMessage(err.jsonResponse.message);
          // }
        });
    });
  };

  getSliderData = () => {
    this.setState({ loadingCounter: this.state.loadingCounter + 1 }, () => {
      API.getRequest('api/AppMaster/loadingimage')
        .then((data) => {
          if (
            data &&
            data.jsonResponse &&
            data.jsonResponse.data &&
            data.jsonResponse.data.length > 0
          ) {
            this.setState({
              sliderData: data.jsonResponse.data,
            });
          }
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          this.getCategoryList();
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          this.getCategoryList();
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    });
  };

  getUserData = async () => {
    console.log(">>>getuserdata");
    // this.setState({
    //     loadingCounter: true
    // })
    API.getRequest('api/Account/getuserprofile')
      .then((dataenc) => {
        // this.setState({
        //     loadingCounter: false
        // })
        const data = API.decrpt(dataenc.jsonResponse);
        console.log("decrypt data");
        console.log(data);
        if (data.success) {
          this.SaveUserProfile(data.data);
        }
      })
      .catch((err) => {
        // this.setState({
        //     loadingCounter: false
        // })
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  SaveUserProfile = async (value) => {
    try {
      console.log('SAVING USER PROFILE');
      console.log(value);
      await AsyncStorage.setItem('userProfile', JSON.stringify(value));
    } catch (e) {
      // save error
      console.log('error = ' + e.message);
    }
  };

  getProductData = () => {
    this.setState(
      { loadingCounter: this.state.loadingCounter + 1, refreshing: true },
      () => {
        API.getRequest('api/medicinenew/topproducts')
          .then((data) => {
            this.setState({
              loadingCounter: this.state.loadingCounter - 1,
              refreshing: false,
            });
            if (data && data.jsonResponse && data.jsonResponse.data) {
              this.setState({
                bestSelling: data.jsonResponse.data.bestselling,
                newArrivals: data.jsonResponse.data.newArrrival,
              });
              console.log(this.state.bestSelling)
              // console.log(this.state.newArrivals)
            }
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              loadingCounter: this.state.loadingCounter - 1,
              refreshing: false,
            });
            // if (err.jsonResponse.status == false) {
            //   this.showAlertMessage(err.jsonResponse.message);
            // }
          });
      },
    );
  };

  addToCart = (item) => {
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
    }, () => {
      API.addItemToCart(item.medicineId, item.qty).then((data) => {
        this.setState({
          loadingCounter: this.state.loadingCounter - 1,
        });
        if (data && data.jsonResponse && data.jsonResponse.status) {
          this.getProductData();
          this.showAlertMessage(data.jsonResponse.message)
          // this.showToastMessage(data.jsonResponse.message);
          Singleton.getInstance().getBadges(this.props.navigation);
          // Singleton.getInstance().CartCount++;
          // Singleton.getInstance().cartBadgeCounterUpdate(this.props.navigation);
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

  CategoryItem = ({ item, index }) => {
    return (
      <View
        style={styles.item}
        easing={'ease-in-out'}
        delay={index * 200}
        animation={'zoomIn'}
        duration={500}>
        <AnimatedButton
          style={{ alignItems: 'center' }}
          onPress={() => {
            this.props.navigation.push('medicine', {
              navParams: item,
            });
          }}>
          <Image
            source={{ uri: item.imgPath }}
            style={
              (index + 2) % 2 == 0 ? styles.itemPhoto : styles.greenitemPhoto
            }
            resizeMode="cover"
          />
          <CustomText
            numberOfLines={5}
            customStyle={styles.itemText}
            text={item.catName}
          />
        </AnimatedButton>
      </View>
    );
  };

  BestSearchListItem = ({ item, index }) => {
    return (
      <View
        style={styles.listItem}
        easing={'ease-in-out'}
        delay={index * 150}
        animation={'fadeInRightBig'}
        duration={500}>
        <View style={{ flexBasis: '50%' }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <AnimatedButton
                onPress={() => {
                  // console.log(item);
                  this.props.navigation.push('medicinedetail', {
                    navParams: item,
                  });
                }}>
                <View style={styles.whitecircle}>
                  <View style={styles.circleImage}>
                    {item.photoPath ? (
                      <Image
                        source={{ uri: item.photoPath }}
                        style={styles.productIMG}
                      />
                    ) : (
                      <Image source={NoImage} style={styles.productIMG} />
                    )}
                  </View>
                </View>
              </AnimatedButton>

              {item.containsInCart ? (
                <AnimatedButton
                  onPress={() => {
                    this.props.navigation.navigate('Cart');
                  }}>
                  <CustomText
                    customStyle={[styles.itemBadgeGreen]}
                    text={strings.GoToCart}
                  />
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onPress={() => {
                    item.qty = 1;
                    this.state.loadingCounter > 0 ? null : this.addToCart(item);
                  }}>
                  <CustomText
                    customStyle={[styles.itemBadge]}
                    text={strings.Buy}
                  />
                </AnimatedButton>
              )}
            </View>

            <View style={styles.productText}>
              <AnimatedButton
                onPress={() => {
                  // console.log(item);
                  this.props.navigation.push('medicinedetail', {
                    navParams: item,
                  });
                }}>
                <CustomText
                  numberOfLines={3}
                  customStyle={styles.itemName}
                  text={item.generic_Name}
                />
                <CustomText
                  numberOfLines={2}
                  customStyle={styles.itemCmp}
                  text={item.companyName}
                />
                <CustomText
                  numberOfLines={2}
                  customStyle={styles.itemDec}
                  text={
                    item.mrp == ''
                      ? 'NA'
                      : '\u20B9 ' + this.parsePrice(item.mrp)
                  }
                />
              </AnimatedButton>
            </View>
          </View>
        </View>
      </View>
    );
  };

  ArrivalListItem = ({ item, index }) => {
    return (
      <View
        style={styles.listItem}
        easing={'ease-in-out'}
        delay={index * 150}
        animation={'fadeInRightBig'}
        duration={500}>
        <View style={{ flexBasis: '50%' }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <AnimatedButton
                onPress={() => {
                  // console.log(item);
                  this.props.navigation.push('medicinedetail', {
                    navParams: item,
                  });
                }}>
                <View style={styles.whitecircle}>
                  <View style={styles.circleImage}>
                    {item.photoPath ? (
                      <Image
                        source={{ uri: item.photoPath }}
                        style={styles.productIMG}
                      />
                    ) : (
                      <Image source={NoImage} style={styles.productIMG} />
                    )}
                  </View>
                </View>
              </AnimatedButton>

              {item.containsInCart ? (
                <AnimatedButton
                  onPress={() => {
                    this.props.navigation.navigate('Cart');
                  }}>
                  <CustomText
                    customStyle={[styles.itemBadgeGreen]}
                    text={strings.GoToCart}
                  />
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onPress={() => {
                    item.qty = 1;
                    this.state.loadingCounter > 0 ? null : this.addToCart(item);
                  }}>
                  <CustomText
                    customStyle={[styles.itemBadge]}
                    text={strings.Buy}
                  />
                </AnimatedButton>
              )}
            </View>

            <View style={styles.productText}>
              <AnimatedButton
                onPress={() => {
                  // console.log(item);
                  this.props.navigation.push('medicinedetail', {
                    navParams: item,
                  });
                }}>
                <CustomText
                  numberOfLines={3}
                  customStyle={styles.itemName}
                  text={item.generic_Name}
                />
                <CustomText
                  numberOfLines={2}
                  customStyle={styles.itemCmp}
                  text={item.companyName}
                />
                <CustomText
                  numberOfLines={2}
                  customStyle={styles.itemDec}
                  text={
                    item.mrp == ''
                      ? 'NA'
                      : '\u20B9 ' + this.parsePrice(item.mrp)
                  }
                />
              </AnimatedButton>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <BaseView>
        {/* <ImageBackground source={DashboardBG} style={styles.img_bg}> */}

        <SafeAreaView
          style={{ flex: 1, backgroundColor: AppTheme.APPCOLOR.PRIMARY }}>
          <CustomLoadingView
            isShowModal={this.state.loadingCounter > 0 ? true : false}
          />
          <View style={styles.container}>
            <ScrollView>
              <View style={styles.mainbox}>
                <View style={styles.headerbox}>
                  <View style={[styles.subheaderbox, { height: 50 }]}>
                    <Image
                      source={IconDavaWhite}
                      resizeMode="contain"
                      style={styles.davaicon}
                    />
                  </View>

                  <View
                    style={[
                      styles.subheaderbox,
                      { height: 40, marginRight: 10 },
                    ]}>
                    <AnimatedButton
                      onPress={() => {
                        this.props.navigation.push('storeList');
                      }}
                      style={[
                        styles.storesearch,
                        { backgroundColor: AppTheme.APPCOLOR.GREY },
                      ]}>
                      <IconMaterialIcons
                        name="location-pin"
                        size={30}
                        color={AppTheme.APPCOLOR.WHITE}
                        style={{
                          // tintColor: 'white',
                          height: 40,
                          alignItems: 'flex-start',
                          backgroundColor: AppTheme.APPCOLOR.GREEN,
                          padding: 4,
                          overflow: 'hidden',
                        }}
                      />
                      {/* <TextInput
                          style={styles.locationinput}
                          editable={false}
                          selectTextOnFocus={false}
                          placeholder={strings.Search_Near_By_Store}
                        /> */}
                      <CustomText
                        text={strings.Search_Near_By_Store} //strings.Category
                        textcolor={'black'}
                        customStyle={[
                          styles.locationinput,
                          { alignSelf: 'center' },
                        ]}
                      />
                    </AnimatedButton>
                  </View>
                </View>
              </View>

              <View style={styles.sliderbox}>
                <Swiper
                  style={[styles.shadowStyle]}
                  showsButtons={false}
                  autoplay={true}
                  key={this.state.sliderData.length}
                  // autoplayTimeout={2.5}
                  // loop={false}
                  removeClippedSubviews={false}
                  showsPagination={false}
                // autoplayDirection={true}
                >
                  {this.state.sliderData.map((slide, key) => {
                    return (
                      <View style={styles.slide1} key={key}>
                        <Image
                          source={{ uri: slide.tablet }}
                          style={styles.slideImage}
                          resizeMode="stretch"
                        />
                      </View>
                    );
                  })}
                </Swiper>
              </View>

              <View style={styles.mainCatSearchView}>
                <View
                  style={
                    (styles.subheaderbox, { marginTop: 15, marginRight: 10 })
                  }>
                  <AnimatedButton
                    style={styles.catBtn}
                    onPress={() => {
                      this.props.navigation.push('category');
                    }}>
                    <CustomText
                      text={strings.Category} //strings.Category
                      customStyle={styles.catText}
                    />
                  </AnimatedButton>
                </View>

                <View
                  style={
                    (styles.subheaderbox,
                      { height: 40, marginTop: 15, flex: 1 })
                  }>
                  <AnimatedButton
                    onPress={() => {
                      this.props.navigation.push('medicine', {});
                    }}
                    style={{
                      backgroundColor: AppTheme.APPCOLOR.GREY,
                      flexDirection: 'row',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <IconMaterialIcons
                      name="search"
                      size={30}
                      color={AppTheme.APPCOLOR.WHITE}
                      style={{
                        // tintColor: 'white',
                        alignItems: 'flex-start',
                        backgroundColor: AppTheme.APPCOLOR.GREEN,
                        padding: 4,
                        height: 40,
                      }}
                    />
                    {/* <TextInput
                        style={styles.storeinput}
                        editable={false}
                        selectTextOnFocus={false}
                        placeholder={strings.Search_Medicine_Healthcare_Product}
                      /> */}
                    <CustomText
                      text={strings.Search_Medicine_Healthcare_Product} //strings.Category
                      textcolor={'black'}
                      customStyle={[styles.storeinput, { alignSelf: 'center' }]}
                    />
                  </AnimatedButton>
                </View>
              </View>

              <FlatList
                horizontal
                style={{ paddingHorizontal: 6 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={this.state.categoryList}
                extraData={this.state}
                renderItem={this.CategoryItem}
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

              <CustomText
                customStyle={[styles.newarrival_btn]}
                text={strings.Best_Selling}
              />

              <FlatList
                horizontal
                style={{ paddingHorizontal: 6 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={this.state.bestSelling}
                extraData={this.state.bestSelling}
                renderItem={this.BestSearchListItem}
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

              <CustomText
                customStyle={[styles.newarrival_btn]}
                text={strings.New_Arrival}
              />

              <FlatList
                horizontal
                style={{ paddingHorizontal: 6 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={this.state.newArrivals}
                extraData={this.state.newArrivals}
                renderItem={this.ArrivalListItem}
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
            </ScrollView>
          </View>
        </SafeAreaView>
        {/* </ImageBackground> */}
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  img_bg: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: AppTheme.APPCOLOR.WHITE,
  },
  mainbox: {
    height: 300,
    backgroundColor: '#dddddd',
  },
  sliderbox: {
    height: 200,
    backgroundColor: AppTheme.APPCOLOR.WHITE,
    position: 'absolute',
    alignSelf: 'center',
    overflow: 'hidden',
    top: 90,
    left: 30,
    right: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 52, 52, 0.8)',
  },
  headerbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 200,
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
  },
  subheaderbox: {
    marginTop: 10,
    flexDirection: 'row',
    elevation: 3,
    // backgroundColor: 'red',
    // height: 50,
  },
  menustyle: {
    tintColor: 'white',
    marginTop: 15,
    alignItems: 'flex-start',
    height: 30,
    width: 30,
    left: 10,
  },
  davaicon: {
    tintColor: 'white',
    alignItems: 'flex-start',
    height: 50,
    width: 50,
    marginLeft: 10,
  },
  storesearch: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    // right: 10,
    // marginRight: 10,
  },
  locationinput: {
    // height: 40,
    fontSize: 12,
    padding: 8,
    // borderBottomRightRadius: 10,
    // borderTopRightRadius: 10,
    backgroundColor: AppTheme.APPCOLOR.GREY,
  },
  storeinput: {
    // marginTop: 15,
    flex: 1,
    // height: 40,
    fontSize: 12,
    padding: 8,
    backgroundColor: AppTheme.APPCOLOR.GREY,
  },
  mainCatSearchView: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  catBtn: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    width: 100,
    // marginVertical: 16,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
  },
  catText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
  itemName: {
    fontSize: 13,
    color: AppTheme.APPCOLOR.BLACK,
    width: 100,
    // overflow: 'hidden'
  },
  itemCmp: {
    fontSize: 10,
    color: AppTheme.APPCOLOR.PRIMARY,
    width: 100,
  },
  itemDec: {
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
    fontSize: 13,
    width: '100%',
  },
  listItem: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: 15,
    alignItems: 'flex-start',
  },
  item: {
    margin: 20,
    alignItems: 'center',
    width: 70,
  },
  itemPhoto: {
    shadowColor: AppTheme.APPCOLOR.BLACK,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    // elevation: 3,
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AppTheme.APPCOLOR.PRIMARY,
  },
  greenitemPhoto: {
    shadowColor: AppTheme.APPCOLOR.WHITE,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    // elevation: 3,
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AppTheme.APPCOLOR.GREEN,
  },
  itemText: {
    color: AppTheme.APPCOLOR.BLACK,
    marginTop: 5,
    fontWeight: '700',
    fontSize: 13,
    width: '100%',
    textAlign: 'center',
  },
  shadowStyle: {
    shadowColor: AppTheme.APPCOLOR.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  newarrival_btn: {
    fontWeight: '700',
    fontSize: 15,
    paddingLeft: 26,
    paddingRight: 26,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 15,
    marginLeft: -12,
    overflow: 'hidden',
    width: 150,
  },
  productIMG: {
    width: 70,
    height: 70,
  },
  productText: {
    alignItems: 'flex-start',
    textAlign: 'left',
    left: 10,
  },
  itemBadge: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 10,
    overflow: 'hidden',
    width: 70,
    elevation: 3,
  },
  itemBadgeGreen: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    alignSelf: 'center',
    // paddingLeft: 20,
    // paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    borderRadius: 10,
    overflow: 'hidden',
    width: 80,
    elevation: 3,
  },
  slide1: {
    elevation: 5,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  circleImage: {
    elevation: 5,
    borderRadius: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 2,
  },
  whitecircle: {
    elevation: 5,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: AppTheme.APPCOLOR.WHITE,
    borderWidth: 3,
  },
});
