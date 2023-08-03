import React from 'react';
import { StyleSheet, ScrollView, FlatList, Image, Modal } from 'react-native';
import CustomTextInput from '../helper/customView/CustomTextInput';
import { View } from 'react-native-animatable';
import BackIcon from '../../Assets/Images/back-icon.png';
import NoImage from '../../Assets/Images/noimage.png';
import IconDava from '../../Assets/Images/davaindia-logo.png';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomText from '../helper/customView/CustomText';
import CheckBox from 'react-native-checkbox';
import AppBase from '../AppBase';
import strings from '../LanguageFiles/LocalizedStrings';

export default class StoreDetail extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      medicinelist: [],
      modal: false,
      name: true,
      mrp: false,
      radioButton: 'value1',
    };
  }

  componentDidMount = () => {
    console.log('CALLING Medicine');
    this.getMedicineLsit();
  };

  getMedicineLsit = () => {
    let params = {
      // "searchText": this.state.searchtext,
      // "medicineSearchType": 0,
      // "orderBy": this.state.orderBy,
      // "pageNo": this.state.page,
      // "pageSize": this.state.
      searchText: 'para',
      medicineSearchType: 0,
      orderBy: 'MRP ASC',
      pageNo: 1,
      pageSize: 10,
    };
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
            medicinelist: data.jsonResponse.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
  };

  RenderProductImage = (medData) => {
    return (
      <Image
        source={{
          uri:
            medData.photoPath == ''
              ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
              : medData.photoPath,
        }}
        style={styles.productIMG}
      />
    );
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
        text={medData.unitSizeText == '' ? 'NA' : medData.unitSizeText}
      />
    );
  };

  RenderUnitSize = (medData) => {
    return (
      <CustomText
        numberOfLines={3}
        customStyle={styles.subitem}
        text={medData.unitSize == '' ? 'NA' : 'Unit Size: ' + medData.unitSize}
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
    return <CustomText customStyle={[styles.itemBadge]} text={'Add'} />;
  };

  RenderImage = (medData) => {
    return (
      <Image
        source={medData.iS_BPPI_PRODUCT == true ? IconDava : NoImage}
        resizeMode="contain"
        style={styles.icon}
      />
    );
  };

  RecommendationListItem = ({ item, index }) => {
    return (
      <View style={styles.recommended_listitem}>
        <View style={{ flexBasis: '50%' }}>
          <View
            styles={{
              borderRadius: 25,
              overflow: 'hidden',
              borderWidth: 2,
              height: 40,
              width: 40,
              borderWidth: 4,
            }}>
            <Image
              source={item.iS_BPPI_PRODUCT == true ? IconDava : NoImage}
              resizeMode="contain"
              style={{
                height: 30,
                width: 30,
                textAlign: 'right',
                alignSelf: 'flex-end',
                backgroundColor: '#fcb061',
              }}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{
                uri:
                  item.photoPath == ''
                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
                    : item.photoPath,
              }}
              style={styles.productIMG}
            />

            <View style={{ alignItems: 'flex-start' }}>
              <CustomText
                numberOfLines={10}
                customStyle={{
                  flexWrap: 'wrap',
                  width: 120,
                  padding: 5,
                  justifyContent: 'flex-start',
                  color: AppTheme.APPCOLOR.BLACK,
                  fontSize: 15,
                  fontWeight: '700',
                }}
                text={item.generic_Name}
              />

              <CustomText
                numberOfLines={3}
                customStyle={{
                  fontSize: 12,
                  color: AppTheme.APPCOLOR.BLACK,
                }}
                text={item.unitSizeText == '' ? 'NA' : item.unitSizeText}
              />

              <CustomText
                numberOfLines={3}
                customStyle={{
                  fontSize: 12,
                  color: AppTheme.APPCOLOR.BLACK,
                }}
                text={
                  item.unitSize == '' ? 'NA' : 'Unit Size: ' + item.unitSize
                }
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                <CustomText
                  numberOfLines={3}
                  customStyle={{
                    fontSize: 12,
                    color: AppTheme.APPCOLOR.BLACK,
                    fontWeight: '700',
                    width: '40%',
                    height: 40,
                  }}
                  text={
                    item.mrp == ''
                      ? 'NA'
                      : '\u20B9 ' + this.parsePrice(item.mrp)
                  }
                />

                <CustomText
                  customStyle={[styles.recommended_badge]}
                  text={'Add'}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      //   <View style={styles.recommended_listitem}>
      //     <View style={{flexBasis: '50%',flexDirection:'row'}}>
      //             <View style={styles.whitecircle}>
      //             <View style={styles.circleImage}>
      //             <Image source={{uri: item.photoPath == ''?
      //                     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png" : item.photoPath
      //             }} style={styles.productIMG} />
      //             </View>
      //             </View>

      //                 <View style={{ alignItems: "flex-start",marginLeft: 10 }}>
      //                 <CustomText
      //                 numberOfLines={10}
      //                 customStyle={styles.itemName}
      //                 text={item.generic_Name} />

      //             <CustomText
      //             numberOfLines={3}
      //             customStyle={styles.subitem}
      //             text={item.unitSizeText == '' ? 'NA' : item.unitSizeText}
      //             />

      //             <CustomText
      //             numberOfLines={3}
      //             customStyle={styles.subitem}
      //             text={item.unitSize == '' ? 'NA' :'Unit Size: '+ item.unitSize}
      //             />

      //             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      //             <CustomText
      //             numberOfLines={3}
      //             customStyle={styles.price}
      //             text={item.mrp == '' ? 'NA' :'\u20B9 '+item.mrp}
      //             />

      //             <CustomText
      //             customStyle={[styles.recommended_badge]}
      //             text={'Add'}
      //             />
      //             </View>

      //             </View>

      //             <View style={{ alignItems: "flex-end", marginLeft: 10 }}>
      //             <Image source={item.iS_BPPI_PRODUCT == true ? IconDava: NoImage} resizeMode="contain" style={styles.icon}/>
      //             </View>
      //     </View>
      //   </View>
    );
  };

  _updateState = (item) => {
    this.setState({ item: !this.state[item] });
    // use the getState props to get child state
    return this.props.getState(this.state);
  };

  render() {
    return (
      <BaseView>
        <Modal
          style={styles.modalcss}
          animationType={'slide'}
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            Alert.alert('Modal has now been closed.');
          }}>
          <View style={styles.modalmainview}>
            <View style={styles.checkboxview}>
              <CustomText
                numberOfLines={3}
                customStyle={styles.sortbylabel}
                text={'Select Sort By'}
              />
              <CheckBox
                label="Name"
                labelStyle={styles.checkboxcss}
                checked={this.state.name}
                onChange={(checked) => {
                  this.setState({
                    name: this.state.name == true ? false : true,
                    mrp: false,
                  });
                }}
              />
              <CheckBox
                label="MRP"
                labelStyle={styles.checkboxcss}
                checked={this.state.mrp}
                onChange={(checked) => {
                  this.setState({
                    mrp: this.state.mrp == true ? false : true,
                    name: false,
                  });
                }}
              />
            </View>
          </View>
        </Modal>
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
              placeholder={'Search Medicines'}
              placeholderTextColor={'gray'}
              onChangeText={(value) => {
                // this.setState({ searchText: value }, () => {
                //     this.searchStore(this.state.searchText)
                // })
              }}
              onSubmitEditing={() => {
                // console.log("search value: " + this.state.searchText)
              }}
            />

            <AnimatedButton
              onPress={() => {
                this.setState({
                  modal: true,
                });
              }}>
              <CustomText
                customStyle={[styles.sortbybtn]}
                text={'Sort By: Name'}
                onPress={() => {
                  this.setState({
                    modal: true,
                  });
                }}
              />
            </AnimatedButton>
          </View>

          <ScrollView>
            {this.state.medicinelist.map((medData, key) => {
              return (
                <View
                  key={key}
                  easing={'ease-in-out'}
                  // delay={index * 150}
                  animation={'fadeInUp'}
                  duration={500}>
                  <AnimatedButton
                    style={
                      {
                        // marginHorizontal: 16,
                        // marginVertical: 8
                      }
                    }
                    onPress={() => {
                      this.props.navigation.push('medicinedetail', {
                        navParams: medData,
                      });
                    }}>
                    <View style={styles.listItem}>
                      <View style={styles.whitecircle}>
                        <View style={styles.circleImage}>
                          {this.RenderProductImage(medData)}
                        </View>
                      </View>

                      <View
                        style={{
                          alignItems: 'flex-start',
                          flex: 1,
                          marginLeft: 10,
                        }}>
                        {this.RenderProductTitle(medData)}
                        {this.RenderSubProductOne(medData)}
                        {this.RenderUnitSize(medData)}
                        {this.RenderPrice(medData)}
                      </View>

                      <View
                        style={{
                          alignItems: 'flex-end',
                          flex: 1,
                          marginLeft: 10,
                        }}>
                        {this.RenderImage(medData)}
                        {this.RenderAddBTN(medData)}
                      </View>
                    </View>
                  </AnimatedButton>
                </View>
              );
            })}
          </ScrollView>
          <View>
            <CustomText
              // customStyle={[styles.newarrival_btn]}
              text={'Recommendations'}
            />

            <FlatList
              horizontal
              style={{ paddingHorizontal: 6 }}
              contentContainerStyle={{ paddingVertical: 8 }}
              data={this.state.medicinelist}
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
                    this.state.refreshing ? strings.Please_wait : strings.No_Record_Found
                  }
                />
              }
            />
          </View>
        </View>
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
  },
  itemName: {
    fontSize: 20,
    color: AppTheme.APPCOLOR.BLACK,
    fontWeight: '700',
  },
  subitem: {
    fontSize: 15,
    color: AppTheme.APPCOLOR.BLACK,
  },
  price: {
    fontSize: 15,
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
    shadowColor: AppTheme.APPCOLOR.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
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
    width: '40%',
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
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
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
    borderRadius: 25,
  },
});
