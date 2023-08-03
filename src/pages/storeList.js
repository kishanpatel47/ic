import React from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import StarRating from 'react-native-star-rating';
import CustomTextInput from '../helper/customView/CustomTextInput';
import { View } from 'react-native-animatable';
import BackIcon from '../../Assets/Images/back-icon.png';
import LoactionIcon from '../../Assets/Images/pin-8-256.png';
import IconDava from '../../Assets/Images/davaindia-logo.png';
import IconCall from '../../Assets/Images/call-icon.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import Singleton from '../helper/Singleton';
import CustomText from '../helper/customView/CustomText';
import { SliderPicker } from 'react-native-slider-picker';
import GetLocation from 'react-native-get-location';
import OtherBrand from '../../Assets/Images/other-brand-icon.png';
import AppBase from '../AppBase';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import strings from '../LanguageFiles/LocalizedStrings';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class StoreList extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      loadingCounter: 0,
      storeList: [],
      filterList: [],
      modal: false,
      searchText: '',
      latitude: '',
      longitude: '',
      page: 1,
      pageSize: 10,
      starCount: 3.5,
      refreshing: false,
      filterRange: 0,
    };
  }

  componentWillMount = () => {
    console.log('componentDidMount storeList');
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
      refreshing: true
    }, () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      }).then((location) => {
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
        });
        console.log(location);
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
          refreshing: true,
          page: 1,
        }, () => {
          this.searchStore();
        });
        // this.state.page = 1;
      }).catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
        this.setState({
          refreshing: false,
          loadingCounter: this.state.loadingCounter - 1,
        });

        if (Platform.OS == 'android') {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          }).then((data) => {
            console.log(data);
            this.setState({
              loadingCounter: this.state.loadingCounter + 1,
              refreshing: true,
            }, () => {
              GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
              }).then((location) => {
                console.log(location);
                this.setState({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  refreshing: true,
                  page: 1,
                  refreshing: false,
                  loadingCounter: this.state.loadingCounter - 1,
                }, () => {
                  this.searchStore();
                });
                // this.state.page = 1;
              }).catch((error) => {
                this.setState({
                  refreshing: false,
                  loadingCounter: this.state.loadingCounter - 1,
                });
                const { code, message } = error;
                console.warn(code, message);
                Alert.alert('Location Error', "Please turn on device location for continue Google's location services");
              });
            });
            // The user has accepted to enable the location services
            // data can be :
            //  - "already-enabled" if the location services has been already enabled
            //  - "enabled" if user has clicked on OK button in the popup
          }).catch((err) => {
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            });
            console.log(err);
            Alert.alert('Location Error', "Please turn on device location for continue Google's location services");
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
            // codes :
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
            //  - ERR03 : Internal error
          });
        }
      });
    },
    );
  };

  renderThumb = () => {
    return (
      <View
        style={{ borderRadius: 5, overflow: 'hidden', height: 20, width: 20 }}
      />
    );
  };
  renderRail = () => {
    return (
      <View
        style={{
          backgroundColor: AppTheme.APPCOLOR.WHITE,
          height: 5,
          width: '100%',
        }}
      />
    );
  };
  renderRailSelected = () => {
    return (
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: AppTheme.APPCOLOR.WHITE,
          height: 20,
          width: 20,
        }}
      />
    );
  };
  renderLabel = (value) => {
    return (
      <CustomText text={value} customStyle={{ color: AppTheme.APPCOLOR.WHITE }} />
    );
  };
  renderNotch = () => {
    return (
      <View
        style={{
          backgroundColor: AppTheme.APPCOLOR.WHITE,
          height: 10,
          width: 10,
        }}
      />
    );
  };

  searchStore = () => {
    let params = {
      City: '',
      searchText: this.state.searchText,
      pageNo: this.state.page,
      pageSize: this.state.pageSize,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };
    console.log(params);
    this.setState({
      // loadingCounter: this.state.loadingCounter + 1,
      refreshing: true
    }, () => {
      API.postRequest('api/Store/findstoredistance', params)
        .then((enc) => {
          API.decrypt(enc.jsonResponse)
            .then((data) => {
              // console.log(data)
              this.setState({
                refreshing: false,
                // loadingCounter: this.state.loadingCounter - 1,
              });
              if (data.data.length > 0) {
                // this.isData = true;
                this.setState({
                  storeList:
                    this.state.page === 1
                      ? data.data
                      : [...this.state.storeList, ...data.data],
                  filterList:
                    this.state.page === 1
                      ? data.data
                      : [...this.state.filterList, ...data.data],
                  page: this.state.page + 1,
                });
                console.log(this.state.storeList.length);
              }
            }).catch((error) => {
              //console.log(error);
              this.setState({
                refreshing: false,
                // loadingCounter: this.state.loadingCounter - 1,
              });
            });
        }).catch((err) => {
          console.log(err);
          this.setState({
            refreshing: false,
            // loadingCounter: this.state.loadingCounter - 1,
          });
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    });
  };

  renderFooter() {
    return this.state.refreshing ? (
      <View>
        <Text>{strings.Loading}</Text>
      </View>
    ) : null;
  }

  RenderProductImage = (storeData) => {
    return (
      <Image
        source={{
          uri:
            'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=100x100&maptype=roadmap&markers=color:0xeb6005%7Clabel:S%7C' +
            storeData.item.store_Latitude +
            ',' +
            storeData.item.store_Longitude +
            '&key=AIzaSyA0gwg1Wybp1OHxpOTn2O7Kf_KxsYEXBmE',
        }}
        style={styles.productIMG}
      />
    );
  };

  RenderStoreName = (storeData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.itemName}
        text={storeData.item.store_Name + ',' + storeData.item.district}
      />
    );
  };

  RenderLocationIcon = (storeData) => {
    return (
      <Image
        source={LoactionIcon}
        resizeMode="contain"
        style={styles.locationicon}
      />
    );
  };

  RenderDistance = (storeData) => {
    return (
      <CustomText
        numberOfLines={2}
        customStyle={styles.subitem}
        text={
          storeData.item.distanceFromUser == ''
            ? 'NA'
            : storeData.item.distanceFromUser + 'KM'
        }
      />
    );
  };

  RenderAddress = (storeData) => {
    return (
      <View>
        <CustomText
          numberOfLines={5}
          customStyle={styles.subitem}
          text={storeData.item.address + storeData.item.district + '.'}
        />
        <CustomText
          numberOfLines={2}
          customStyle={styles.subitem}
          text={storeData.item.state + ' - ' + storeData.item.pincode}
        />
      </View>
    );
  };

  RenderReviewText = (storeData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.reviewtxt}
        text={'Reviews(' + storeData.item.noOfRevies + ')'}
      />
    );
  };

  RenderCallBtn = (storeData) => {
    return (
      <AnimatedButton
        onPress={() => {
          if (storeData.item.mobile_No) {
            Singleton.getInstance().makePhoneCall(storeData.item.mobile_No);
          }
          console.log(storeData.item);
        }}>
        <Image source={IconCall} resizeMode="contain" style={styles.callicon} />
      </AnimatedButton>
    );
  };

  RenderRatingStar = (storeData) => {
    return (
      <View style={styles.row}>
        <StarRating
          disabled={true}
          maxStars={5}
          starSize={20}
          fullStarColor={AppTheme.APPCOLOR.GREEN}
          emptyStarColor={AppTheme.APPCOLOR.PRIMARY}
          rating={storeData.item.avgRatting}
          selectedStar={(rating) => this.onStarRatingPress(rating)}
        />
      </View>
    );
  };
  RenderImage = (storeData) => {
    return (
      <Image
        source={storeData.item.storeTypeFlag == 'E' ? IconDava : OtherBrand}
        resizeMode="contain"
        style={styles.icon}
      />
    );
  };

  StoreListItem = (item, index) => {
    return (
      <View
        key={index}
        easing={'ease-in-out'}
        delay={index * 50}
        animation={'fadeInUp'}
        duration={500}>
        <AnimatedButton
          onPress={() => {
            console.log(item);
          }}>
          <View style={styles.listItem}>
            <AnimatedButton
              onPress={() => {
                console.log(item);
                Singleton.getInstance().openMapWithLatLong(
                  item.item.store_Name,
                  item.item.store_Latitude,
                  item.item.store_Longitude,
                );
              }}>
              <View style={styles.whitecircle}>
                {this.RenderProductImage(item)}
              </View>
            </AnimatedButton>

            <View style={{ alignItems: 'flex-start', flex: 0.6, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                {this.RenderStoreName(item)}
                {this.RenderImage(item)}
              </View>

              <View style={{ flexDirection: 'row' }}>
                {this.RenderLocationIcon(item)}
                {this.RenderDistance(item)}
              </View>

              {this.RenderAddress(item)}
            </View>

            <View style={{ alignItems: 'flex-end', flex: 0.4, marginLeft: 10 }}>
              {this.RenderReviewText(item)}
              {this.RenderRatingStar(item)}
              {this.RenderCallBtn(item)}
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
          fontSize={13}
        />
      </View>
    );
  };

  filterStore = (range) => {
    var _tempList = [];
    if (range > 0 && range < 10) {
      for (var i in this.state.storeList) {
        if (this.state.storeList[i].distanceFromUser <= range) {
          // console.log(this.state.storeList[i].distanceFromUser);
          _tempList.push(this.state.storeList[i]);
        }
      }
      this.setState({
        filterList: _tempList,
      });
    } else {
      this.setState({
        filterList: this.state.storeList,
      });
    }
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
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <AnimatedButton
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}>
                <Image
                  source={BackIcon}
                  resizeMode="contain"
                  style={styles.backiconstyle}
                />
              </AnimatedButton>

              <CustomTextInput
                ref={(ref) => (this.emailInputTextRef = ref)}
                name={'search'}
                style={styles.searchbar}
                returnKeyType={'search'}
                placeholder={strings.Near_by_Search}
                placeholderTextColor={'gray'}
                onChangeText={(value) => {
                  if (value.length > 2) {
                    this.setState(
                      { searchText: value, page: 1, storeList: [] },
                      () => {
                        this.searchStore();
                      },
                    );
                  }
                }}
                onSubmitEditing={() => {
                  console.log('search value: ' + this.state.searchText);
                }}
              />
            </View>

            <FlatList
              // Pagination ----------
              onEndReachedThreshold={0.5}
              onEndReached={({ }) => {
                console.warn('onEndReached');
                this.state.filterRange <= 0 || this.state.filterRange >= 10
                  ? this.searchStore()
                  : null;
              }}
              ListFooterComponent={
                this.state.isShowModal ? this.renderBottomLoader : null
              }
              // Pagination ----------
              contentContainerStyle={{ paddingVertical: 8 }}
              data={this.state.filterList}
              extraData={this.state.filterList}
              key={this.StoreListItem}
              renderItem={this.StoreListItem}
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
                    this.state.filterList.length == 0 && !this.state.refreshing ?
                      strings.No_Record_Found : null
                    // this.state.refreshing
                    //   ? strings.Please_wait
                    //   : strings.No_Record_Found
                  }
                />
              }
            />

            <View
              style={{
                marginHorizontal: 0,
                marginVertical: 0,
                backgroundColor: AppTheme.APPCOLOR.PRIMARY,
                height: 100,
              }}>
              <CustomText
                numberOfLines={1}
                customStyle={styles.filtertxt}
                text={strings.Filter_By_Distance}
              />

              <SliderPicker
                minLabel={strings._less}
                // midLabel={'mid'}
                maxLabel={strings._above}
                maxValue={10}
                callback={(position) => {
                  this.setState({ filterRange: position });
                  this.filterStore(position);
                }}
                defaultValue={10}
                labelFontColor={AppTheme.APPCOLOR.WHITE}
                // labelFontWeight={'600'}
                showFill={true}
                fillColor={AppTheme.APPCOLOR.GREEN}
                // labelFontWeight={'bold'}
                showNumberScale={false}
                showSeparatorScale={true}
                labelFontSize={13}
                scaleNumberFontColor={AppTheme.APPCOLOR.WHITE}
                scaleNumberFontSize={13}
                buttonBackgroundColor={AppTheme.APPCOLOR.WHITE}
                buttonBorderColor={AppTheme.APPCOLOR.WHITE}
                buttonBorderWidth={1}
                scaleNumberFontWeight={'300'}
                buttonDimensionsPercentage={5}
                heightPercentage={0.7}
                widthPercentage={90}
              />

              {/* <RangeSlider
                height={5}
                min={1}
                max={10}
                step={1}
                floatingLabel
                renderThumb={this.renderThumb.bind(this)}
                renderRail={this.renderRail.bind(this)}
                renderRailSelected={this.renderRailSelected.bind(this)}
                renderLabel={this.renderLabel.bind(this)}
                renderNotch={this.renderNotch.bind(this)}
                style={{ top: 10, marginHorizontal: 32 }}
                onValueChanged={(min, max, value) => {
                  console.log(min + ' - ' + max + ' - ' + value);
                  clearTimeout(this.sliderTimeoutId)
                  this.sliderTimeoutId = setTimeout(() => {
                    if (value) {
                      this.setState(
                        {
                          filterRange: min,
                        },
                        () => {
                          this.filterStore(min);
                        },
                      );
                    }
                  }, 100)

                }}
              /> */}

              {/* <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // top: 22,
                }}>
                <CustomText
                  numberOfLines={1}
                  customStyle={{ color: AppTheme.APPCOLOR.WHITE, fontSize: 13 }}
                  text={strings._less}
                />
                <CustomText
                  numberOfLines={1}
                  customStyle={{ color: AppTheme.APPCOLOR.WHITE, fontSize: 13 }}
                  text={strings._above}
                />
              </View> */}
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
    fontSize: 12,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
    textAlign: 'left',
  },
  subitem: {
    fontSize: 10,
    color: AppTheme.APPCOLOR.BLACK,
    textAlign: 'auto',
  },
  circleImage: {
    // elevation: 5,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 2,
  },
  productIMG: {
    width: 80,
    height: 80,
  },
  whitecircle: {
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: 80,
    height: 80,
    elevation: 5,
  },
  locationicon: {
    height: 15,
    width: 15,
    tintColor: AppTheme.APPCOLOR.PRIMARY,
  },
  callicon: {
    height: 30,
    width: 30,
    // marginTop:10
  },
  icon: {
    height: 30,
    width: 30,
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
  searchbar: {
    marginBottom: 15,
    marginTop: 15,
    marginRight: 20,
    marginLeft: 20,
    padding: 10,
    fontSize: 13,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  reviewtxt: {
    fontSize: 13,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
    width: '100%',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  filtertxt: {
    color: AppTheme.APPCOLOR.WHITE,
    fontSize: 13,
    textAlign: 'center',
    top: 5,
    bottom: 5,
  },
});
