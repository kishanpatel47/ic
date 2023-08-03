import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import CustomTextInput from '../helper/customView/CustomTextInput';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import { View } from 'react-native-animatable';
import BackIcon from '../../Assets/Images/back-icon.png';
import NoImage from '../../Assets/Images/noimage.png';
import minBtn from '../../Assets/Images/minus-qty.png';
import plsBtn from '../../Assets/Images/plus-icon.png';
import OtherBrand from '../../Assets/Images/other-brand-icon.png';
import IconDava from '../../Assets/Images/davaindia-logo.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomText from '../helper/customView/CustomText';
import strings from '../LanguageFiles/LocalizedStrings';
import CheckBox from 'react-native-checkbox';
import AppBase from '../AppBase';
import Tooltip from 'rn-tooltip';
import Singleton from '../helper/Singleton';
import _ from 'lodash';
export default class MedicineList extends AppBase {

  constructor(props) {
    super(props);
    this.timeout = 0;
    this.state = {
      medicinelist: [],
      recommendedlist: [],
      modal: false,
      name_asc: true,
      name_dsc: false,
      price_asc: false,
      price_dsc: false,
      showEmpty: false,
      page: 1,
      pageSize: 10,
      sortbyvalue: 'Name ASC',
      sortbylabel: 'Name ↑',
      searchText: '',
      categoryDetail: {},
      qty: 1,
      refreshing: false,
      loadingCounter: 0,
      toolTipVisible: false
    };

    this.onEndReachedCalledDuringMomentum = true;
    this.state.categoryDetail = this.props.route.params.navParams
      ? this.props.route.params.navParams
      : {};

    console.log("Cagory Data >>>>>>>>>>>>>>>>>>>>");
    console.log(this.state.categoryDetail);
    this.props.navigation.setOptions({
      title: this.state.categoryDetail.catName,
      headerShown: this.state.categoryDetail.catName != null ? true : false
    });
  }

  componentDidMount = () => {
    this.onChangeTextDelayed = _.debounce(this.onChangeText, 500);
    this.state.page = 1;
    this.getMedicineList();
    this.getRecommendedList();
  };

  onChangeText(value) {
    console.log("debouncing");
    // setTimeout(() => {
    if (value.length > 2 || value.length == 0) {
      this.setState(
        {
          searchText: value,
          medicinelist: [],
          page: 1,
          // categoryDetail: {},
        },
        () => {
          this.getMedicineList("search");
        },
      );
    }
    // }, 300);
  }

  getMedicineList = (value) => {
    console.log("method call")
    let params = {
      searchText: this.state.searchText,
      medicineSearchType: 0,
      orderBy: this.state.sortbyvalue,
      pageNo: this.state.page,
      pageSize: this.state.pageSize,
      catId: this.state.categoryDetail.catId
        ? this.state.categoryDetail.catId
        : 0,
    };

    if (value == "search") {
      this.setState({
        medicinelist: []
      })
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>params");
    // console.log(this.state.categoryDetail);
    console.log(params)

    this.setState(
      { loadingCounter: this.state.loadingCounter + 1 },
      () => {
        API.postRequest('api/medicinenew/searchbyname', params)
          .then((data) => {
            console.log(data.jsonResponse.data);
            if (
              data &&
              data.jsonResponse &&
              data.jsonResponse.data &&
              data.jsonResponse.data.length > 0
            ) {
              this.setState({
                medicinelist:
                  this.state.page === 1
                    ? data.jsonResponse.data
                    : [...this.state.medicinelist, ...data.jsonResponse.data],
                showEmpty: this.state.medicinelist == 0 ? true : false,
                page: this.state.page + 1,
                loadingCounter: this.state.loadingCounter - 1,
                refreshing: false
              }, () => {
                setTimeout(() => {
                  this.getRecommendedList();
                }, 1000);
              });
              console.log(this.state.medicinelist);
            }
            else {
              this.setState({
                refreshing: false,
                loadingCounter: this.state.loadingCounter - 1,
              });
            }
          })
          .catch((err) => {
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            }, () => {
              setTimeout(() => {
                this.getRecommendedList();
              }, 1000);
            });
            console.log(err);
            if (err.jsonResponse.status == false) {
              this.showAlertMessage(err.jsonResponse.message);
            }
          });
      },
    );
  };

  getRecommendedList = () => {
    this.setState(
      { loadingCounter: this.state.loadingCounter + 1 },
      () => {
        API.getRequest('api/medicinenew/recomendatedproducts')
          .then((data) => {
            // console.log(data.jsonResponse.data);
            if (
              data &&
              data.jsonResponse &&
              data.jsonResponse.data &&
              data.jsonResponse.data.recomendedProducts &&
              data.jsonResponse.data.recomendedProducts.length > 0
            ) {
              this.setState({
                recommendedlist: data.jsonResponse.data.recomendedProducts,
                loadingCounter: this.state.loadingCounter - 1,
              });
              // console.log(this.state.medicinelist.length);
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

  onRefresh = () => {
    //set isRefreshing to true
    this.setState({
      refreshing: true
    }, () => {
      this.getMedicineList();
    })
    // and set isRefreshing to false at the end of your callApiMethod()
  }

  addToCart = (item, value) => {
    console.log(item.medicineId, item.cartQty);
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
    }, () => {
      API.addItemToCart(item.medicineId, item.cartQty)
        .then((data) => {
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          if (data && data.jsonResponse && data.jsonResponse.status) {
            Singleton.getInstance().getBadges(this.props.navigation);
            this.showAlertMessage(data.jsonResponse.message);
            if (value == 'medicinelist') {
              this.setState({
                medicinelist: this.state.medicinelist.filter((i) => {
                  if (i.medicineId == item.medicineId) {
                    console.log(i);
                    if (item.cartQty == 0) {
                      i.containsInCart = false;
                    } else {
                      i.containsInCart = true;
                    }
                  }
                  return i;
                }),
                recommendedlist: this.state.recommendedlist.filter((i) => {
                  if (i.medicineId == item.medicineId) {
                    console.log(i);
                    if (item.cartQty == 0) {
                      i.containsInCart = false;
                    } else {
                      i.containsInCart = true;
                    }
                  }
                  return i;
                }),

              });
            } else {
              this.setState({
                recommendedlist: this.state.recommendedlist.filter((i) => {
                  if (i.medicineId == item.medicineId) {
                    console.log(i);
                    i.containsInCart = true;
                  }
                  return i;
                }),
                medicinelist: this.state.medicinelist.filter((i) => {
                  if (i.medicineId == item.medicineId) {
                    console.log(i);
                    i.containsInCart = true;
                    i.cartQty++;
                  }
                  return i;
                }),
              });
            }
          } else {
            this.showAlertMessage(data.jsonResponse.message);
          }
        })
        .catch((err) => {
          this.setState({
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

  incrementCount(item, index) {
    // index will be the key value
    const items = this.state.medicinelist;
    item.cartQty += 1;

    items.splice(index, 1, item);
    this.setState(
      {
        medicinelist: items,
        page: 1,
      },
      () => {
        this.addToCart(item, 'medicinelist');
      },
    );
  }

  decrementCount(item, index) {
    // index will be the key value
    const items = this.state.medicinelist;
    item.cartQty -= 1;
    items.splice(index, 1, item);
    this.setState(
      {
        medicinelist: items,
        page: 1,
      },
      () => {
        this.addToCart(item, 'medicinelist');
      },
    );
  }

  RenderProductImage = (medData) => {
    if (medData.photoPath) {
      return (
        <Image source={{ uri: medData.photoPath }} style={styles.productIMG} />
      );
    } else {
      return <Image source={NoImage} style={styles.productIMG} />;
    }
  };

  RenderProductTitle = (medData) => {
    return (
      <CustomText
        numberOfLines={10}
        customStyle={styles.itemName}
        text={medData.generic_Name}
      />
    );
  };

  RenderSubProductOne = (medData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.subitem}
        text={medData.companyName == '' ? 'NA' : medData.companyName}
      />
    );
  };

  RenderUnitSize = (medData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.subitem}
        text={
          medData.unitSize == ''
            ? 'NA'
            : strings.Unit_Size + ': ' + medData.unitSize
        }
      />
    );
  };

  RenderPrice = (medData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.price}
        text={
          medData.mrp == '' ? 'NA' : '\u20B9 ' + this.parsePrice(medData.mrp)
        }
      />
    );
  };

  RenderAddBTN = (medData) => {
    return (
      <AnimatedButton
        onPress={() => {
          this.setState({
            page: 1,
          });
          medData.cartQty = 1;
          this.addToCart(medData, 'medicinelist');
        }}>
        <CustomText customStyle={[styles.itemBadge]} text={strings.Add} />
      </AnimatedButton>
    );
  };

  RenderQuntity = (medData, index) => {
    return (
      <View style={styles.row}>
        <View style={styles.col}>
          <AnimatedButton
            onPress={() => {
              this.decrementCount(medData, index);
            }}>
            <Image
              source={minBtn}
              resizeMode="contain"
              style={styles.qtyIcon}
            />
          </AnimatedButton>
          <CustomText customStyle={[styles.qty]} text={medData.cartQty} />
          <AnimatedButton
            onPress={() => {
              this.incrementCount(medData, index);
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

  RenderImage = (medData) => {
    return (
      <Tooltip containerStyle={{ backgroundColor: AppTheme.APPCOLOR.GREEN }} pointerColor={AppTheme.APPCOLOR.GREEN} popover={<Text style={{ color: AppTheme.APPCOLOR.WHITE }}>{medData.iS_BPPI_PRODUCT ? strings.DIBrand : strings.OTBrand}</Text>}>
        <Image
          source={medData.iS_BPPI_PRODUCT ? IconDava : OtherBrand}
          resizeMode="contain"
          style={styles.icon}
        />
      </Tooltip>
    );
  };

  showDavaInfo = (isTrue) => {
    if (isTrue) {
      this.showAlert(
        strings.DIBrand
      );
    }
  }

  MedicineListItem = ({ item, index }) => {
    return (
      <View
        easing={'ease-in-out'}
        // delay={index * 100}
        animation={'fadeInUp'}
        duration={500}>
        <AnimatedButton
          onPress={() => {
            //this.loginPressed();
            this.props.navigation.push('medicinedetail', { navParams: item });
          }}>
          <View style={styles.listItem}>
            <View style={styles.whitecircle}>
              <View style={styles.circleImage}>
                {this.RenderProductImage(item)}
              </View>
            </View>

            <View style={{ alignItems: 'flex-start', flex: 0.7, marginLeft: 10 }}>
              {this.RenderProductTitle(item)}
              {this.RenderSubProductOne(item)}
              {this.RenderUnitSize(item)}
              {this.RenderPrice(item)}
            </View>

            <View style={{ alignItems: 'flex-end', flex: 0.3, marginLeft: 10 }}>
              {this.RenderImage(item)}

              {item.containsInCart
                ? item.cartQty > 0
                  ? this.RenderQuntity(item, index)
                  : null
                : this.RenderAddBTN(item)}
            </View>
          </View>
        </AnimatedButton>
      </View>
    );
  };

  RecommendationListItem = ({ item, index }) => {
    return (
      <View style={styles.recommended_listitem}>
        <View style={{ flexBasis: '50%' }}>
          <View
            style={{
              // borderRadius: 50,
              overflow: 'hidden',
              // borderWidth: 2,
              alignSelf: 'flex-end',
              justifyContent: 'center',
              height: 40,
              width: 40,
              borderBottomEndRadius: 50,
              borderBottomStartRadius: 50,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 0,
              // borderWidth: 4,
              backgroundColor: 'rgba(241, 86, 35, 0.3)',
            }}>
            <Tooltip containerStyle={{ backgroundColor: AppTheme.APPCOLOR.GREEN }} pointerColor={AppTheme.APPCOLOR.GREEN} popover={<Text style={{ color: AppTheme.APPCOLOR.WHITE }}>{item.iS_BPPI_PRODUCT ? strings.DIBrand : strings.OTBrand}</Text>}>
              <Image
                source={item.iS_BPPI_PRODUCT == true ? IconDava : OtherBrand}
                resizeMode="contain"
                style={{
                  height: 30,
                  width: 30,
                  alignSelf: 'center',
                  // borderRadius: 50,
                  // backgroundColor: AppTheme.APPCOLOR.PRIMARY,
                }}
              />
            </Tooltip>
          </View>

          <AnimatedButton
            onPress={() => {
              //this.loginPressed();
              this.props.navigation.push('medicinedetail', { navParams: item });
            }}>
            <View style={{ flexDirection: 'row' }}>

              <View
                style={{
                  borderRadius: 50,
                  overflow: 'hidden',
                  borderColor: AppTheme.APPCOLOR.WHITE,
                  borderWidth: 3,
                  width: 60,
                  height: 60,
                }}>
                <View style={styles.circleImage}>
                  <Image
                    source={{
                      uri:
                        item.photoPath == ''
                          ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
                          : item.photoPath,
                    }}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
              </View>

              <View style={{ alignItems: 'flex-start' }}>
                <CustomText
                  numberOfLines={2}
                  customStyle={{
                    width: 120,
                    color: AppTheme.APPCOLOR.BLACK,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                  text={item.generic_Name}
                />

                <CustomText
                  numberOfLines={2}
                  customStyle={{
                    fontSize: 10,
                    color: AppTheme.APPCOLOR.BLACK,
                  }}
                  text={item.unitSizeText == '' ? 'NA' : item.unitSizeText}
                />

                <CustomText
                  numberOfLines={2}
                  customStyle={{
                    fontSize: 10,
                    color: AppTheme.APPCOLOR.BLACK,
                  }}
                  text={
                    item.unitSize == ''
                      ? 'NA'
                      : strings.Unit_Size + ': ' + item.unitSize
                  }
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <CustomText
                    numberOfLines={2}
                    customStyle={{
                      fontSize: 13,
                      color: AppTheme.APPCOLOR.BLACK,
                      fontWeight: '700',
                      flex: 1,
                    }}
                    text={
                      item.mrp == ''
                        ? 'NA'
                        : '\u20B9 ' + this.parsePrice(item.mrp)
                    }
                  />
                </View>
              </View>
            </View>
          </AnimatedButton>
          <View style={{ alignSelf: 'flex-end', paddingRight: 5 }}>
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
                  item.cartQty = 1;
                  this.addToCart(item, 'recommendedlist');
                }}>
                <CustomText
                  customStyle={[styles.recommended_badge]}
                  text={strings.Add}
                />
              </AnimatedButton>
            )}
          </View>
        </View>
      </View >
    );
  };

  renderFooter() {
    return this.state.refreshing ? (
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

  render() {
    return (
      <BaseView>
        <StatusBar
          translucent={false}
          backgroundColor={AppTheme.APPCOLOR.PRIMARY}
          barStyle={'dark-content'}
        />
        <CustomLoadingView
          isShowModal={this.state.loadingCounter > 0 ? true : false}
        />
        <Modal
          style={styles.modalcss}
          animationType={'slide'}
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            //   Alert.alert('Modal has now been closed.');
          }}>
          <TouchableOpacity
            style={styles.modalmainview}
            onPress={() => {
              this.setState({ modal: false });
            }}>
            {/* <View style={styles.modalmainview}> */}
            <View style={styles.checkboxview}>
              <CustomText
                numberOfLines={3}
                customStyle={styles.sortbylabel}
                text={strings.Select_Sort_By}
              />
              <CheckBox
                label="Name ↑"
                labelStyle={styles.checkboxcss}
                checked={this.state.name_asc}
                onChange={(checked) => {
                  this.setState(
                    {
                      page: 1,
                      name_asc: this.state.name_asc == true ? false : true,
                      name_dsc: false,
                      price_asc: false,
                      price_dsc: false,
                      modal:
                        checked == true
                          ? this.showAlertMessage(
                            strings.Please_select_any_one_of_these,
                          )
                          : false,
                      sortbyvalue: 'Name ASC',
                      sortbylabel: 'Name ↑'
                    },
                    () => {
                      setTimeout(() => {
                        this.getMedicineList();
                      }, 500);
                    },
                  );
                }}
              />
              <CheckBox
                label="Name ↓"
                labelStyle={styles.checkboxcss}
                checked={this.state.name_dsc}
                onChange={(checked) => {
                  this.setState(
                    {
                      page: 1,
                      name_dsc: this.state.name_dsc == true ? false : true,
                      name_asc: false,
                      modal:
                        checked == true
                          ? this.showAlertMessage(
                            strings.Please_select_any_one_of_these,
                          )
                          : false,
                      sortbyvalue: 'NAME DESC',
                      sortbylabel: 'Name ↓'
                    },
                    () => {
                      setTimeout(() => {
                        this.getMedicineList();
                      }, 500);
                    },
                  );
                }}
              />
              <CheckBox
                label="Price ↑"
                labelStyle={styles.checkboxcss}
                checked={this.state.price_asc}
                onChange={(checked) => {
                  this.setState(
                    {
                      page: 1,
                      price_asc: this.state.price_asc == true ? false : true,
                      price_dsc: false,
                      name_asc: false,
                      name_dsc: false,
                      modal:
                        checked == true
                          ? this.showAlertMessage(
                            strings.Please_select_any_one_of_these,
                          )
                          : false,
                      sortbyvalue: 'MRP Asc',
                      sortbylabel: 'Price ↑'
                    },
                    () => {
                      setTimeout(() => {
                        this.getMedicineList();
                      }, 500);
                    },
                  );
                }}
              />
              <CheckBox
                label="Price ↓"
                labelStyle={styles.checkboxcss}
                checked={this.state.price_dsc}
                onChange={(checked) => {
                  this.setState(
                    {
                      page: 1,
                      price_dsc: this.state.price_dsc == true ? false : true,
                      price_asc: false,
                      name_asc: false,
                      name_dsc: false,
                      modal:
                        checked == true
                          ? this.showAlertMessage(
                            strings.Please_select_any_one_of_these,
                          )
                          : false,
                      sortbyvalue: 'MRP DESC',
                      sortbylabel: 'Price ↓'
                    },
                    () => {
                      setTimeout(() => {
                        this.getMedicineList();
                      }, 500);
                    },
                  );
                }}
              />
            </View>
            {/* </View> */}
          </TouchableOpacity>
        </Modal>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>

            <View style={{ flexDirection: 'row' }}>

              {this.state.categoryDetail.catName == null ? <AnimatedButton
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}>
                <Image
                  source={BackIcon}
                  resizeMode="contain"
                  style={styles.backiconstyle}
                />
              </AnimatedButton>
                : null}
              <CustomTextInput
                ref={(ref) => (this.emailInputTextRef = ref)}
                name={'search'}
                style={styles.searchbar}
                returnKeyType={'search'}
                placeholder={strings.Search_Medicines}
                placeholderTextColor={'gray'}
                onChangeText={(value) => {
                  if (value.length > 2 || value.length == 0) {
                    this.setState({
                      medicinelist: [],
                    });
                    if (this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                      this.setState({
                        searchText: value,
                        page: 1,
                        // categoryDetail: {},
                      });
                      this.getMedicineList();
                    }, 1000);
                  }
                  // setTimeout(() => {
                  //   if (value.length > 2 || value.length == 0) {
                  //     this.setState(
                  //       {
                  //         searchText: value,
                  //         medicinelist: [],
                  //         page: 1,
                  //         // categoryDetail: {},
                  //       },
                  //       () => {
                  //         this.getMedicineList();
                  //       },
                  //     );
                  //   }
                  // }, 500);
                }}
                onSubmitEditing={() => {
                  console.log('search value: ' + this.state.searchText);
                }}
              />

              <AnimatedButton
                onPress={() => {
                  this.setState({ modal: true });
                }}>
                <CustomText
                  customStyle={[styles.sortbybtn]}
                  text={strings.Sort + ': ' + this.state.sortbylabel}
                  onPress={() => {
                    this.setState({
                      modal: true,
                    });
                  }}
                />
              </AnimatedButton>
            </View>
            <FlatList
              // style={{ flex: 1, height: Dimensions.get('window').height }}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
              onEndReachedThreshold={0.5}
              onEndReached={({ distanceFromEnd }) => {
                console.log(" console.log(distanceFromEnd) ");
                console.log(distanceFromEnd);
                // if (distanceFromEnd > 0) {
                if (!this.onEndReachedCalledDuringMomentum) {
                  console.warn('onEndReached');
                  this.getMedicineList();
                  this.onEndReachedCalledDuringMomentum = true;

                }
                // }



              }}
              ListFooterComponent={
                this.state.refreshing ? this.renderBottomLoader : null
              }
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.refreshing}
              contentContainerStyle={{ paddingVertical: 8 }}
              data={this.state.medicinelist}
              extraData={this.state.medicinelist}
              key={this.MedicinListItem}
              renderItem={this.MedicineListItem}
              showsHorizontalScrollIndicator={false}
              renderFooter={this.renderFooter.bind(this)}
              ListEmptyComponent={
                <CustomText
                  customStyle={{
                    marginTop: 16,
                    flex: 1,
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                  text={
                    this.state.showEmpty ?
                      strings.No_Record_Found : null
                  }
                />
              }
            />

            <View>
              <CustomText
                customStyle={[styles.recommendation_txt]}
                text={strings.Recommendations}
              />

              <FlatList
                horizontal
                style={{ paddingHorizontal: 6, marginBottom: 15 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={this.state.recommendedlist}
                extraData={this.state}
                key={this.RecommendationListItem}
                renderItem={this.RecommendationListItem}
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
                      this.state.showEmpty ?
                        strings.No_Record_Found : null
                    }
                  />
                }
              />
            </View>
          </View>
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
    borderBottomColor: AppTheme.APPCOLOR.GRAY,
    borderBottomWidth: 1,
    // marginBottom: 30,
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
    // elevation: 5,
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
  itemBadge: {
    fontWeight: '600',
    fontSize: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 12,
    overflow: 'hidden',
    width: 50,
    elevation: 3,
  },
  icon: {
    height: 30,
    width: 30,
  },
  recommended_listitem: {
    // flex:1,

    // flexDirection: "row",
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    // padding:10,
    backgroundColor: AppTheme.APPCOLOR.WHITE,
    margin: 5,
    padding: 5,
    paddingTop: 0,
    paddingRight: 0,
    shadowColor: AppTheme.APPCOLOR.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    // height: '100%',
    borderRadius: 5
  },
  recommended_badge: {
    fontWeight: '600',
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    textAlign: 'center',
    // width: '40%',
    elevation: 3,
    height: 25,
    width: 50
  },
  itemBadgeGreen: {
    fontWeight: '600',
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    textAlign: 'center',
    // width: '40%',
    elevation: 3,
    height: 25,
  },

  modalcss: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalmainview: {
    flex: 1,
    backgroundColor: '#00000080',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxview: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 20,
  },
  sortbylabel: {
    color: AppTheme.APPCOLOR.BLACK,
    fontSize: 15,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  checkboxcss: {
    color: AppTheme.APPCOLOR.BLACK,
    fontSize: 15,
    fontWeight: '600',
  },
  backiconstyle: {
    marginBottom: 15,
    marginTop: 25,
    marginRight: 0,
    marginLeft: 20,
    padding: 10,
    // alignItems: 'flex-start',
    height: 25,
    width: 25,
    // left: 10
  },

  sortbybtn: {
    fontWeight: '600',
    fontSize: 12,
    // padding:15,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    textAlign: 'center',
    // margin:15,
    color: 'white',
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    overflow: 'hidden',
    width: 100,
  },
  searchbar: {
    marginBottom: 15,
    marginTop: 15,
    marginRight: 0,
    marginLeft: 20,
    padding: 10,
    fontSize: 13,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  recommendation_txt: {
    color: AppTheme.APPCOLOR.BLACK,
    fontSize: 15,
    padding: 10,
    fontWeight: '700',
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
  footer: {
    alignSelf: 'center',
  }
});
