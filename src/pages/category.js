import React from 'react';
import { StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { View } from 'react-native-animatable';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomText from '../helper/customView/CustomText';
import AppBase from '../AppBase';
import DeviceInfo from 'react-native-device-info';
import BackIcon from '../../Assets/Images/back-icon.png';
import CustomTextInput from '../helper/customView/CustomTextInput';
import strings from '../LanguageFiles/LocalizedStrings';

const GridPadding = 8;
const GridColumns = DeviceInfo.isTablet() ? 4 : 2;
export default class Category extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      _categoryList: [],
      loadingCounter: 0,
      searchText: ''
    };
  }

  componentDidMount = () => {
    console.log('CALLING CATEGORY');
    this.getCategoryList();
  };

  getCategoryList = () => {
    this.setState({ loadingCounter: this.state.loadingCounter + 1 }, () => {
      API.getRequest('api/catagory/getcatagory')
        .then((data) => {
          if (data && data.jsonResponse && data.jsonResponse.length > 0) {
            this.setState({
              categoryList: data.jsonResponse,
              _categoryList: data.jsonResponse,
            });
          }
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          if (err.jsonResponse.status == false) {
            this.showAlertMessage(err.jsonResponse.message);
          }
        });
    });
  };

  filterCategory = () => {
    var filterData = [];
    filterData = this.state._categoryList.filter((data) => {
      if (data.catName.toUpperCase().includes(this.state.searchText.toUpperCase()))
        return data;
    })
    // console.log(filterData);
    this.setState({
      categoryList: filterData
    });
  }

  CategoryItem = ({ item, index }) => {
    // console.log(item);
    return (
      <View
        easing={'ease-in-out'}
        delay={index * 50}
        animation={index % 2 ? 'fadeInRight' : 'fadeInLeft'}
        duration={500}>
        <AnimatedButton
          style={{
            // backgroundColor:'blue',
            width:
              (Dimensions.get('window').width -
                GridPadding * GridColumns * 2 -
                20) /
              GridColumns,
            marginRight: 16, //index % GridColumns == 0 ? 0 : GridPadding,
            marginVertical: 8,
            borderColor: AppTheme.APPCOLOR.PRIMARY,
            borderRadius: 5,
            borderWidth: 2,
          }}
          onPress={() => {
            this.props.navigation.push('medicine', {
              navParams: item,
            });
          }}>
          <View style={styles.item}>
            <Image
              source={{ uri: item.imgPath }}
              style={styles.itemPhoto}
              resizeMode="cover"
            />
            <CustomText
              numberOfLines={2}
              customStyle={styles.itemText}
              text={item.catName}
            />
          </View>
        </AnimatedButton>
      </View>
    );
  };

  render() {
    return (
      <BaseView>
        <CustomLoadingView
          isShowModal={this.state.loadingCounter > 0 ? true : false}
        />
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', backgroundColor: AppTheme.APPCOLOR.PRIMARY }}>
            <CustomTextInput
              ref={(ref) => (this.emailInputTextRef = ref)}
              name={'search'}
              style={styles.searchbar}
              returnKeyType={'search'}
              placeholder={strings.SEARCH}
              placeholderTextColor={'gray'}
              onChangeText={(value) => {
                setTimeout(() => {
                  if (value.length > 0) {
                    this.setState(
                      {
                        searchText: value,
                      },
                      () => {
                        this.filterCategory();
                      },
                    );
                  } else {
                    if (this.state._categoryList.length <= 0) {
                      this.getCategoryList();
                    } else {
                      this.setState({
                        categoryList: this.state._categoryList,
                      });
                    }
                  }
                }, 300);
              }}
              onSubmitEditing={() => {
                console.log('search value: ' + this.state.searchText);
              }}
            />
          </View>
          <FlatList
            numColumns={2}
            style={{ paddingHorizontal: 16 }}
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
                  this.state.refreshing ? strings.Please_wait : strings.No_Record_Found
                }
              />
            }
          />
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemPhoto: {
    shadowColor: AppTheme.APPCOLOR.WHITE,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    width: 60,
    height: 60,
  },
  itemText: {
    color: AppTheme.APPCOLOR.BLACK,
    marginTop: 5,
    fontWeight: '700',
    fontSize: 17,
    width: '100%',
    textAlign: 'center',
  },
  item: {
    // margin: 23,
    alignItems: 'center',
    padding: 10,
  },
  searchbar: {
    marginBottom: 5,
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    padding: 10,
    fontSize: 13,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});
