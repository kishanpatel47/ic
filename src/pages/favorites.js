import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import { View } from 'react-native-animatable';
import NoImage from '../../Assets/Images/noimage.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomText from '../helper/customView/CustomText';
import strings from '../LanguageFiles/LocalizedStrings';
import AppBase from '../AppBase';

export default class Favorite extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      favoriteList: [],
      refreshing: false,
      loadingCounter: 0,
    };
  }

  componentDidMount = () => {
    console.log('CALLING USERDATA');
    this.getFavoriteList();
  };

  getFavoriteList = () => {
    this.setState(
      { loadingCounter: this.state.loadingCounter + 1 },
      () => {
        API.getRequest('api/userfavourite/favouriteitemlist')
          .then((data) => {
            console.log(data.jsonResponse.data);
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            });
            if (
              data &&
              data.jsonResponse &&
              data.jsonResponse.data &&
              data.jsonResponse.data.favouriteItems
            ) {
              this.setState({
                favoriteList: data.jsonResponse.data.favouriteItems,
              });
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
      this.getFavoriteList();
    })
    // and set isRefreshing to false at the end of your callApiMethod()
  }

  removeFav = (id) => {
    console.log(id);
    this.setState(
      { loadingCounter: this.state.loadingCounter + 1, refreshing: true },
      () => {
        API.postRequest('api/userfavourite/removefavourite', {
          ProductId: id,
        })
          .then((data) => {
            console.log(data.jsonResponse);
            this.showToastMessage(data.jsonResponse.message);
            this.setState({
              refreshing: false,
              loadingCounter: this.state.loadingCounter - 1,
            });
            this.getFavoriteList();
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

  MedicineListItem = ({ item, index }) => {
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
            {item.qty >= 1 ? this.RenderQuntity(item, index) : null}
            {this.RenderDELBTN(item)}
          </View>
        </View>
      </View>
    );
  };

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

  RenderDELBTN = (medData) => {
    return (
      <AnimatedButton
        onPress={() => {
          this.removeFav(medData.medicineId);
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

  render() {
    return (
      <BaseView>
        <CustomLoadingView
          isShowModal={this.state.loadingCounter > 0 ? true : false}
        />
        <FlatList
          onEndReachedThreshold={0.5}
          onEndReached={({ }) => {
            console.warn('onEndReached');
            // this.getMedicineList();
          }}
          ListFooterComponent={
            this.state.isShowModal ? this.renderBottomLoader : null
          }
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          contentContainerStyle={{ paddingVertical: 8 }}
          data={this.state.favoriteList}
          extraData={this.state.favoriteList}
          key={this.MedicinListItem}
          renderItem={this.MedicineListItem}
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
                this.state.refreshing
                  ? strings.Please_wait
                  : strings.No_Favorites
              }
            />
          }
        />
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
});
