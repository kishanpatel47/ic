import React from 'react';
import { StyleSheet, ScrollView, Image, ImageBackground, Dimensions, TouchableHighlight } from 'react-native';
import { View } from 'react-native-animatable';
import AppTheme from '../helper/AppTheme';
import ImageItemBG from '../../Assets/Images/ItemBG.png';
import likeBtn from '../../Assets/Images/like-icon.png';
import minBtn from '../../Assets/Images/minus-qty.png';
import plsBtn from '../../Assets/Images/plus-icon.png';
import AnimatedButton from '../helper/customView/AnimatedButton';
import CustomText from '../helper/customView/CustomText';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import StarRating from 'react-native-star-rating';
import AppBase from '../AppBase';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import strings from '../LanguageFiles/LocalizedStrings';
import Carousel from 'react-native-snap-carousel';
import IconMaterialIcons from 'react-native-vector-icons/AntDesign'; //https://oblador.github.io/react-native-vector-icons/
import Video from 'react-native-video';
import Singleton from '../helper/Singleton';

export default class MedicineDetail extends AppBase {

  constructor(props) {
    super(props);
    this.state = {
      medicineDetail: '',
      qty: 1,
      starCount: 3.5,
      loadingCounter: false,
      showVideoInFullScreen: false,
      videoPause: true,
    };

    this.state.medicineDetail = this.props.route.params.navParams;
  }

  // componentWillMount() {
  //   this.props.navigation.setOptions({
  //     title: this.state.medicineDetail.medicineName,
  //   });
  // }

  componentDidMount = () => {
    // this.getAboutData();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          loadingCounter: true,
        },
        () => {
          this.getMedicineDetail();
        },
      );
    });
  };

  getMedicineDetail = () => {
    // this.state.medicineDetail.medicineId
    this.setState({ loadingCounter: true }, () => {
      API.getRequest('api/medicinenew/getdeatilbymedid?mid=' + this.state.medicineDetail.medicineId)
        .then((data) => {
          // console.log(data.jsonResponse);
          this.setState({
            loadingCounter: false,
          });
          // data.jsonResponse.data.documentMasters.push({ //sample data add for video
          //   "docName": "Video1",
          //   "docPath": "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          //   "thumb": "http://via.placeholder.com/640x360",
          //   "docTypeID": 2,
          //   "docTypeName": "Video",
          //   "sequenceID": 1
          // });
          if (data && data.jsonResponse && data.jsonResponse.data) {
            console.log("medicineDetails = " + JSON.stringify(data.jsonResponse.data))
            this.setState({
              medicineDetail: data.jsonResponse.data,
            });
            console.log(this.state.medicineDetail.documentMasters)
            this.props.navigation.setOptions({
              title: this.state.medicineDetail.medicineName,
            });
          }
        })
        .catch((err) => {
          this.setState({
            loadingCounter: false,
          });
          console.log(err);
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    });
  };

  addToFav = () => {
    if (!this.state.medicineDetail.contiansInFavourite) {
      this.setState({ loadingCounter: true }, () => {
        API.postRequest('api/userfavourite/savefavourite', {
          ProductId: this.state.medicineDetail.medicineId,
        })
          .then((data) => {
            this.showToastMessage(data.jsonResponse.message);
            this.getMedicineDetail();
            this.setState({
              loadingCounter: false,
            });
          })
          .catch((err) => {
            this.setState({
              loadingCounter: false,
            });
            console.log(err);
            if (err.jsonResponse.status == false) {
              this.showAlertMessage(err.jsonResponse.message);
            }
          });
      });
    } else {
      this.setState({ loadingCounter: true }, () => {
        API.postRequest('api/userfavourite/removefavourite', {
          ProductId: this.state.medicineDetail.medicineId,
        })
          .then((data) => {
            this.showToastMessage(data.jsonResponse.message);
            this.getMedicineDetail();
            this.setState({
              loadingCounter: false,
            });
          })
          .catch((err) => {
            this.setState({
              loadingCounter: false,
            });
            console.log(err);
            if (err.jsonResponse.status == false) {
              this.showAlertMessage(err.jsonResponse.message);
            }
          });
      });
    }
  };

  addToCart = (item, isNavigate) => {
    console.log(item);
    this.setState(
      {
        loadingCounter: true,
      },
      () => {
        API.addItemToCart(item.medicineId, item.cartQty)
          .then((data) => {
            this.setState({
              loadingCounter: false,
            });
            if (data && data.jsonResponse && data.jsonResponse.status) {
              Singleton.getInstance().getBadges(this.props.navigation);
              this.showToastMessage(data.jsonResponse.message);
              if (isNavigate == 1) {
                this.props.navigation.navigate('Cart');
                this.getMedicineDetail();
              } else {
                this.getMedicineDetail();
              }
            } else {
              this.showAlertMessage(data.jsonResponse.message);
            }
          })
          .catch((err) => {
            this.setState({
              loadingCounter: false,
            });
            console.log(err);
            if (err.jsonResponse.status == false) {
              this.showAlertMessage(err.jsonResponse.message);
            }
          });
      },
    );
  };

  incrementCount(item) {
    // index will be the key value
    const items = this.state.medicineDetail;
    console.log(items);
    item.cartQty += 1;

    // items.splice(0, 1, item);
    this.setState(
      {
        medicineDetail: items,
      },
      () => {
        this.addToCart(item, 0);
      },
    );
  }

  decrementCount(item) {
    // index will be the key value
    const items = this.state.medicineDetail;
    item.cartQty -= 1;
    // items.splice(0, 1, item);
    this.setState(
      {
        medicineDetail: items,
      },
      () => {
        this.addToCart(item, 0);
      },
    );
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  //   videoBuffer = (isBuffer) => {
  videoError = (error) => {
    console.log("Video Playback Error = " + JSON.stringify(error));
  }

  PlayVideo = (video) => {
    // this.player.presentFullscreenPlayer();
  }

  onCarouselPress(index) {
    this.props.navigation.push('fullscreenimageview', {
      navParams: this.state.medicineDetail.documentMasters, index: index
    });
  }

  _renderCarouselImage = ({ item, index }) => {
    console.log(item)
    return (
      item.docTypeID == 1 ?
        <AnimatedButton onPress={() => this.onCarouselPress(index)} >
          <Image
            source={{ uri: item.docPath }}
            style={[styles.slideImage]}
            resizeMode="contain"
          />
        </AnimatedButton>
        :
        <AnimatedButton onPress={() => this.onCarouselPress(index)} >
          <View style={{
            justifyContent: 'center',
            flex: 1,
            width: Dimensions.get('window').width,
          }}>
            {/* {this.state.videoPause ? */}
            <View style={
              {
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{ uri: this.state.medicineDetail.photoPath }}
                style={[styles.slideImage, {
                }]}
                resizeMode="contain"
              />
              <IconMaterialIcons
                style={{
                  position: 'absolute',
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 25,
                    height: 25
                  },
                  // elevation: 20,
                  shadowRadius: 25,
                  shadowOpacity: 1
                }}
                name="play"
                size={30}
                color={'white'}
              />
            </View>
          </View>
        </AnimatedButton>

    );
  }
  renderProductImages = () => {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        imageStyle={
          {
            // bottom: 0,
          }
        }
        source={ImageItemBG}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.medicineDetail.documentMasters}
          renderItem={this._renderCarouselImage}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
          // onSnapToItem={this.changeItem}
          index
        />
      </ImageBackground>
    );
  };

  changeItem = ({ index }) => {
    console.warn("Index Changed")
  }

  render() {
    return (
      <BaseView style={styles.container}>
        <CustomLoadingView isShowModal={this.state.loadingCounter} />
        <ScrollView style={styles.padding}>
          {this.renderProductImages()}
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
            }}>
            <View style={[styles.row, { marginTop: 30 }]}>
              <CustomText
                customStyle={[styles.medicineName]}
                text={this.state.medicineDetail.medicineName}
              />
              <AnimatedButton
                // style={{ width: '20%' }}
                onPress={() => {
                  this.addToFav();
                }}>
                <Image
                  source={likeBtn}
                  resizeMode="contain"
                  style={
                    this.state.medicineDetail.contiansInFavourite
                      ? styles.likeIcon
                      : styles.likeIconGreen
                  }
                />
              </AnimatedButton>
            </View>
            <View style={styles.row}>
              <CustomText
                customStyle={[styles.unitSize]}
                text={
                  this.state.medicineDetail.unitSize ||
                  'NA' + this.state.medicineDetail.unitSizeText ||
                  'NA'
                }
              />
            </View>
            <View style={styles.row}>
              <CustomText
                customStyle={[styles.description]}
                text={strings.Descriptions + ':'}
              />
            </View>

            <View style={styles.row}>
              <CustomText
                customStyle={[styles.descriptionText]}
                text={this.state.medicineDetail.description || '-'}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <CustomText
                  customStyle={[styles.mrp]}
                  text={
                    '\u20B9 ' +
                    this.parsePrice(this.state.medicineDetail.mrp) || '-'
                  }
                />
                {this.state.medicineDetail.savingAmount > 0 ?
                  <CustomText
                    customStyle={[styles.savings]}
                    text={
                      '\u20B9 ' + this.state.medicineDetail.savingAmount || ''
                    }
                  /> : null}
              </View>
              {this.state.medicineDetail.containsInCart ? (
                <View style={styles.qtycss}>
                  <AnimatedButton
                    onPress={() => {
                      this.decrementCount(this.state.medicineDetail);
                    }}>
                    <Image
                      source={minBtn}
                      resizeMode="contain"
                      style={styles.qtyIcon}
                    />
                  </AnimatedButton>
                  <CustomText
                    customStyle={[styles.qty.toString()]}
                    text={this.state.medicineDetail.cartQty}
                  />
                  <AnimatedButton
                    onPress={() => {
                      this.incrementCount(this.state.medicineDetail);
                    }}>
                    <Image
                      source={plsBtn}
                      resizeMode="contain"
                      style={styles.qtyIcon}
                    />
                  </AnimatedButton>
                </View>
              ) : null}
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                {this.state.medicineDetail.containsInCart ? (
                  <AnimatedButton
                    style={styles.buyBtn}
                    onPress={() => {
                      this.props.navigation.navigate('Cart');
                    }}>
                    <CustomText
                      customStyle={[styles.buyBtnTxt]}
                      text={strings.GoToCart}
                    />
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    style={styles.buyBtn}
                    onPress={() => {
                      this.state.medicineDetail.cartQty = 1;
                      this.addToCart(this.state.medicineDetail, 0);
                      // this.props.navigation.navigate('Cart');
                    }}>
                    <CustomText
                      customStyle={[styles.buyBtnTxt]}
                      text={strings.Buy}
                    />
                  </AnimatedButton>
                )}
                {/* <AnimatedButton style={styles.bellBtn} onPress={() => { }}>
                  <Image
                    source={bellBtn}
                    resizeMode="contain"
                    style={styles.bellIcon}
                  />
                </AnimatedButton> */}
              </View>

              <View>
                <CustomText
                  customStyle={[styles.reviewTxt]}
                  text={strings.Reviews}
                />

                <View style={styles.row}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={20}
                    fullStarColor={AppTheme.APPCOLOR.GREEN}
                    emptyStarColor={AppTheme.APPCOLOR.PRIMARY}
                    rating={this.state.medicineDetail.avgRating}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                  />
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
        {/* </ImageBackground> */}
      </BaseView >
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  img_bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  wrapper: {
    top: 50,
  },
  padding: {
    // padding: 15
    // margin: 15
  },
  row: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  col: {
    flexDirection: 'row',
    // width: '70 %',
    // alignItems: 'flex-start',
    flex: 1,
    // justifyContent: 'flex-start',
  },
  flextStart: {
    alignItems: 'flex-start',
  },
  alignRowItems: {
    flexDirection: 'column',
    flex: 1,
    // alignItems: 'flex-end',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    // justifyContent: "center"
  },
  medicineName: {
    width: '75%',
    textAlign: 'left',
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
  slide1: {
    elevation: 5,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  slideImage: {
    // width: '100%',
    height: 200,
    width: Dimensions.get('window').width,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'flex-end',
    // flex: 1,
    // backgroundColor: AppTheme.APPCOLOR.GREEN,
    marginBottom: 10,
  },
  likeIcon: {
    tintColor: AppTheme.APPCOLOR.PRIMARY,
    height: 30,
    // width: 44,
    alignItems: 'flex-end',
    // left: 20,
  },
  likeIconGreen: {
    tintColor: AppTheme.APPCOLOR.GRAY,
    height: 30,
    // width: 44,
    // textAlign: 'right',
    alignItems: 'flex-end',
    // left: 20,
  },
  unitSize: {
    color: AppTheme.APPCOLOR.GREEN,
    fontWeight: '700',
  },
  qty: {
    color: AppTheme.APPCOLOR.BLACK,
    marginLeft: 5,
    marginRight: 5,
  },
  mrp: {
    fontWeight: '700',
    fontSize: 20,
    color: AppTheme.APPCOLOR.BLACK,
  },
  savings: {
    fontWeight: '300',
    fontSize: 15,
    marginHorizontal: 10,
    marginVertical: 2,
    color: AppTheme.APPCOLOR.PRIMARY,
  },
  qtyIcon: {
    alignItems: 'center',
    tintColor: AppTheme.APPCOLOR.APPCOLOR,
    height: 25,
    width: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  bellIcon: {
    alignItems: 'center',
    tintColor: AppTheme.APPCOLOR.APPCOLOR,
    height: 25,
    width: 30,
  },
  buyBtn: {
    // padding: 10,
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    height: 40,
    marginTop: 5,
    justifyContent: 'center',
  },
  buyBtnTxt: {
    color: AppTheme.APPCOLOR.WHITE,
  },
  bellBtn: {
    // padding: 10,
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    borderRadius: 10,
    marginLeft: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  description: {
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
  },
  reviewTxt: {
    color: AppTheme.APPCOLOR.BLACK,
    textAlign: 'center',
  },
  descriptionText: {
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '300',
    fontSize: 12,
    paddingBottom: 15,
  },
  starRating: {},
  menustyle: {
    marginTop: 15,
    alignItems: 'flex-start',
    height: 30,
    width: 30,
    left: 10,
  },
  buttonLeft: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    fontSize: 30,
    color: AppTheme.APPCOLOR.WHITE,
    padding: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonRight: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    fontSize: 30,
    color: AppTheme.APPCOLOR.WHITE,
    padding: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  qtycss: {
    flexDirection: 'row',
    // width: '30 %',
    alignItems: 'flex-start',
    // flex: 1,
    justifyContent: 'flex-start',
  },
  backgroundVideo: {
    flex: 1,
    backgroundColor: 'black',
    // position: 'absolute',


    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,

  },
  videoContainer: {
    // flex: 1,
    // backgroundColor: 'black',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },

});
