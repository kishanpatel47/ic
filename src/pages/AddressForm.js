import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import AppTheme from '../helper/AppTheme';
import BaseView from '../helper/customView/BaseView';
import AppBase from '../AppBase';
import { View } from 'react-native-animatable';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../helper/customView/CustomText';
import strings from '../LanguageFiles/LocalizedStrings';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AnimatedButton from '../helper/customView/AnimatedButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //https://oblador.github.io/react-native-vector-icons/
import CustomAutoComplete from '../helper/customView/CustomAutoComplete';
import API from '../connection/http-utils';

export default class AddressForm extends AppBase {

  constructor(props) {
    super(props);
    this.state = {
      isHome: true,
      selectedPincodeValue: {},
      setSelectedPincodeValue: [],
      setFilterPincodeData: [],
      AddressID: 0,
      addressObj: {},
      UserId: [],
      Name: '',
      Phone1: '',
      Phone2: '',
      PinCode: '',
      City: '',
      State: '',
      Address1: '',
      Address2: '',
      Address3: '',
      AddressType: 1,
      IsDefault: false,
      isFromCart: false,
      loadingCounter: 0
    };
    this.state.UserId = this.props.route.params.userInfo.userId;
    this.state.addressObj = this.props.route.params.addressObj ? this.props.route.params.addressObj : {};
    this.state.isFromCart = this.props.route.params.isFromCart ? this.props.route.params.isFromCart : false;
  }

  componentDidMount = () => {
    this.setState({
      AddressID: this.state.addressObj && this.state.addressObj.addressID ? this.state.addressObj.addressID : 0,
      UserId: this.state.UserId,
      Name: this.state.addressObj.name ? this.state.addressObj.name : '',
      Phone1: this.state.addressObj.phone1 ? this.state.addressObj.phone1 : '',
      Phone2: this.state.addressObj.phone2 ? this.state.addressObj.phone2 : '',
      PinCode: this.state.addressObj.pinCode ? this.state.addressObj.pinCode : '',
      City: this.state.addressObj.city ? this.state.addressObj.city : '',
      State: this.state.addressObj.state ? this.state.addressObj.state : '',
      Address1: this.state.addressObj.address1 ? this.state.addressObj.address1 : '',
      Address2: this.state.addressObj.address2 ? this.state.addressObj.address2 : '',
      Address3: this.state.addressObj.address3 ? this.state.addressObj.address3 : '',
      AddressType: this.state.addressObj.addressType ? this.state.addressObj.addressType : 1,
      IsDefault: this.state.addressObj.isDefault ? this.state.addressObj.isDefault : false
    }, () => {
      // Update navigation title
      this.props.navigation.setOptions({ title: this.state.AddressID == 0 ? strings.ADD_NEW_ADDRESS : strings.UPDATE_ADDRESS })
    });
  };

  SearchDataFromJSON = (query) => {
    let params = {
      masterdataenum: "PincodeMaster",
      searchText: query,
      PageNo: 1,
      PageSize: 10
    };
    console.log(params);
    this.setState({
      loadingCounter: this.state.loadingCounter + 1,
    }, () => {
      API.postRequest('api/common/masterlist', params)
        .then((data) => {
          // console.log(data.jsonResponse.data)
          // console.log('SEARCHED DATA - ' + data.jsonResponse.data.length);
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          if (
            data &&
            data.jsonResponse &&
            data.jsonResponse.data &&
            data.jsonResponse.data.length > 0
          ) {
            this.setState({
              setFilterPincodeData: data.jsonResponse.data
            });
            // console.log(this.state.setFilterPincodeData);
          }
        })
        .catch((err) => {
          this.setState({
            loadingCounter: this.state.loadingCounter - 1,
          });
          console.log(err);
          // if (err.jsonResponse.status == false) {
          //   this.showAlertMessage(err.jsonResponse.message);
          // }
        });
    })
  };

  setPincodeValue(item) {
    console.log("SELECTED ZIP ", item)
    this.setState({
      setSelectedPincodeValue: item,
      selectedPincodeValue: item.zipCode,
      setFilterPincodeData: [],
      PinCode: item.zipCode,
      City: item.cityName,
      State: item.stateName,
    })
  }

  render() {
    return (
      <BaseView>
        <View style={styles.container}>
          <CustomLoadingView
            isShowModal={this.state.loadingCounter > 0 ? true : false}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : null}
            style={{ flex: 1 }}>
            <View style={{ flex: 1, }}>
              <ScrollView
                keyboardDismissMode={'on-drag'}
                style={{ padding: 10 }}
                keyboardShouldPersistTaps={'handled'}>
                <CustomTextInput
                  ref={(ref) => (this.nameInputTextRef = ref)}
                  name={'name'}
                  maxLength={35}
                  value={this.state.Name}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_NAME_TITLE}
                  keyboardType={'default'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ Name: value })
                  }
                  onSubmitEditing={() => { this.phoneInputTextRef.focus(); }}
                />
                <CustomTextInput
                  ref={(ref) => (this.phoneInputTextRef = ref)}
                  name={'phone'}
                  maxLength={10}
                  value={this.state.Phone1}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_PHONE_TITLE}
                  keyboardType={'phone-pad'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ Phone1: value })
                  }
                  onSubmitEditing={() => { this.alternativePhoneInputTextRef.focus(); }}
                />
                <CustomTextInput
                  ref={(ref) => (this.alternativePhoneInputTextRef = ref)}
                  name={'alternativePhone'}
                  keyboardType={'phone-pad'}
                  maxLength={11}
                  value={this.state.Phone2}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_ALTERNATIVE_PHONE_TITLE}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ Phone2: value })
                  }
                  onSubmitEditing={() => { this.cityInputTextRef.focus(); }}
                />
                <CustomAutoComplete
                  // Data to show in suggestion
                  keyboardType={'phone-pad'}
                  data={this.state.setFilterPincodeData}
                  // Default value if you want to set something in input
                  defaultValue={this.state.PinCode.toString()}
                  // To show the suggestions
                  onChangeText={(text) => {
                    this.setState({
                      PinCode: text,
                      City: '',
                      State: '',
                    }, () => {
                      if (text.length > 3) {
                        this.SearchDataFromJSON(text)
                      } else {
                        this.setState({
                          setFilterPincodeData: [],
                        })
                      }
                    })
                  }}
                  placeholder={strings.ZIP + '*'}
                  containerStyle={styles.SearchBox}
                  flatListProps={{
                    style: {
                      position: 'relative'
                    },
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item }) => (
                      <AnimatedButton
                        style={{
                          borderBottomColor: AppTheme.APPCOLOR.GRAY,
                          borderBottomWidth: 1,
                          // backgroundColor:'transparent',
                        }}
                        onPress={() => {
                          this.setPincodeValue(item)
                        }}>
                        <CustomText customStyle={styles.SearchBoxTextItem} text={item.zipCode} textcolor={AppTheme.APPCOLOR.TEXT} />
                      </AnimatedButton>
                    ),
                  }}
                />

                <CustomTextInput
                  ref={(ref) => (this.cityInputTextRef = ref)}
                  name={'city'}
                  editable={false}
                  value={this.state.City}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_CITY}
                  keyboardType={'default'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ City: value })
                  }
                />
                <CustomTextInput
                  ref={(ref) => (this.stateInputTextRef = ref)}
                  name={'state'}
                  editable={false}
                  value={this.state.State}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_STATE}
                  keyboardType={'default'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ State: value })
                  }
                  onSubmitEditing={() => { this.address1InputTextRef.focus(); }}
                />
                <CustomTextInput
                  ref={(ref) => (this.address1InputTextRef = ref)}
                  name={'addressLine1'}
                  maxLength={35}
                  value={this.state.Address1}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_LINE_1}
                  keyboardType={'default'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ Address1: value })
                  }
                  onSubmitEditing={() => { this.address2InputTextRef.focus(); }}
                />
                <CustomTextInput
                  ref={(ref) => (this.address2InputTextRef = ref)}
                  name={'addressLine2'}
                  maxLength={35}
                  value={this.state.Address2}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_LINE_2}
                  keyboardType={'default'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ Address2: value })
                  }
                  onSubmitEditing={() => { this.address3InputTextRef.focus(); }}
                />
                <CustomTextInput
                  ref={(ref) => (this.address3InputTextRef = ref)}
                  name={'addressLine3'}
                  maxLength={35}
                  value={this.state.Address3}
                  style={[{ flex: 1, borderBottomColor: 'grey' }]}
                  returnKeyType={'next'}
                  placeholder={strings.ADDRESS_LINE_3}
                  keyboardType={'default'}
                  placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                  onChangeText={(value) =>
                    this.setState({ Address3: value })
                  }
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <AnimatedButton
                    style={[styles.btnSelectAddress, this.state.AddressType === 1 ? styles.btnSelected : styles.btnNormal]}
                    onPress={() => {
                      // this.props.navigation.push('addressForm');
                      this.setState({
                        AddressType: 1,
                      })
                    }}>
                    <MaterialCommunityIcons
                      name={'home'}
                      size={20}
                      color={AppTheme.APPCOLOR.WHITE}
                      style={{
                        alignSelf: 'center',
                        alignItems: 'flex-start',
                        overflow: 'hidden',
                        paddingHorizontal: 3
                      }}
                    />
                    <CustomText
                      text={strings.ADDRESS_HOME}
                      customStyle={{ color: 'white' }}
                    />
                  </AnimatedButton>
                  <AnimatedButton
                    style={[styles.btnSelectAddress, this.state.AddressType === 2 ? styles.btnSelected : styles.btnNormal]}
                    onPress={() => {
                      this.setState({
                        AddressType: 2,
                      })
                      // this.props.navigation.push('addressForm');
                    }}>
                    <MaterialCommunityIcons
                      name={'office-building'}
                      size={20}
                      color={AppTheme.APPCOLOR.WHITE}
                      style={{
                        alignSelf: 'center',
                        alignItems: 'flex-start',
                        overflow: 'hidden',
                        paddingHorizontal: 3
                      }}
                    />
                    <CustomText
                      text={strings.ADDRESS_WORK}
                      customStyle={{ color: 'white' }}
                    />
                  </AnimatedButton>
                </View>

                <AnimatedButton
                  style={{ marginLeft: 0, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}
                  onPress={() => {
                    this.setState({
                      IsDefault: !this.state.IsDefault,
                    })
                    // this.props.navigation.push('addressForm');
                  }}>
                  <MaterialCommunityIcons
                    name={this.state.IsDefault ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                    size={30}
                    color={AppTheme.APPCOLOR.GREEN}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'flex-start',
                      padding: 4,
                      overflow: 'hidden',
                    }}
                  />
                  <CustomText
                    text={strings.ADDRESS_DEFAULT}
                    customStyle={{ color: 'black' }}
                  />

                </AnimatedButton>
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  padding: 10,
                  alignItems: 'center',
                  backgroundColor: AppTheme.APPCOLOR.PRIMARY
                }}>
                <AnimatedButton
                  style={[styles.btnSave]}
                  onPress={() => {
                    this.saveAddress();
                  }}>
                  <CustomText
                    text={this.state.AddressID == 0 ? strings.SAVE : strings.UPDATE}
                    customStyle={{
                      textAlign: 'center',
                      color: AppTheme.APPCOLOR.WHITE,
                    }}
                  />
                </AnimatedButton>
              </View>

            </View>
          </KeyboardAvoidingView>
        </View>
      </BaseView>
    );
  }

  saveAddress = () => {
    var hasErr = false;
    if (this.state.Name.length <= 0) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_User_Name);
    } else if (this.state.Phone1.length <= 0) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_Enter_Mobile_Number1);
    }
    else if (!this.validateMobile(this.state.Phone1)) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_Mobile);
    } else if ((this.state.PinCode.toString()).length < 6) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_Zip);
    } else if (this.state.City.length <= 0) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_City);
    } else if (this.state.State.length <= 0) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_State);
    } else if (this.state.Address1.length <= 0) {
      hasErr = true;
      this.showAlertMessage(strings.Valid_Address);
    } else if (this.state.Phone2.length > 0) {
      if (!this.validateMobile(this.state.Phone2)) {
        hasErr = true;
        this.showAlertMessage(strings.Valid_alt_Mobile);
      }
    }
    if (!hasErr) {
      this.setState({
        loadingCounter: true,
      }, () => {
        let params = {
          AddressID: this.state.addressObj && this.state.addressObj.addressID ? this.state.addressObj.addressID : 0,
          UserId: this.state.UserId,
          Name: this.state.Name,
          Phone1: this.state.Phone1,
          Phone2: this.state.Phone2,
          PinCode: this.state.PinCode,
          City: this.state.City,
          State: this.state.State,
          Address1: this.state.Address1,
          Address2: this.state.Address2,
          Address3: this.state.Address3,
          AddressType: this.state.AddressType,
          IsDefault: this.state.IsDefault
        };
        console.log('SAVE ADDRESS - ', params);
        API.postRequest('api/address/addupdateaddress', params).then((data) => {
          this.setState({
            loadingCounter: false,
          });
          console.log(data);
          if (data.jsonResponse.status) {
            if (params.AddressID == 0) {
              // Add new address message.
              this.showToastMessage(strings.Address_Added);
            }
            else {
              // Update address sucessfully.
              this.showToastMessage(strings.Update_Address_Sucessfully);
            }
            if (this.state.IsDefault && data.jsonResponse.data) {
              console.log('NEW ADDRESS ID - ' + data.jsonResponse.data);
              this.updateCartAddress(data.jsonResponse.data);
            } else {
              this.props.navigation.pop();
            }
          } else {
            this.showAlertMessage(data.jsonResponse.message);
          }
        }).catch((err) => {
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
  }

  updateCartAddress = (id) => {
    this.setState({
      loadingCounter: true,
    }, () => {
      console.log('UPDATE ADDRESS CART - ', id);
      API.getRequest('api/cart/upadteaddressincart?addressId=' + id).then((data) => {
        this.setState({
          loadingCounter: false,
        });
        console.log(data);
        if (data.jsonResponse.status) {
          // this.showToastMessage(strings.SUCCESS);
          // if (this.state.isFromCart) {
          //   this.updateCartAddress();
          // }
          this.props.navigation.pop();
        } else {
          this.showAlertMessage(data.jsonResponse.message);
        }
      }).catch((err) => {
        this.setState({
          loadingCounter: false,
        });
        console.log(err);
        if (err.jsonResponse.status == false) {
          this.showAlertMessage(err.jsonResponse.message);
        }
      });
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'red',
  },

  btnSave: {
    backgroundColor: AppTheme.APPCOLOR.GREEN,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    width: '100%'
  },

  btnSelectAddress: {
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderColor: AppTheme.APPCOLOR.GREEN,
    borderWidth: 3,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 20,
    height: 40,
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },

  btnNormal: {
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderColor: AppTheme.APPCOLOR.PRIMARY,
    borderWidth: 3,
  },
  btnSelected: {
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
    borderColor: AppTheme.APPCOLOR.GREEN,
    borderWidth: 3,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    // position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  // MainContainer: {
  //   backgroundColor: '#FAFAFA',
  //   flex: 1,
  //   padding: 12,
  // },
  // AutocompleteStyle: {
  //   flex: 1,
  //   left: 0,
  //   position: 'absolute',
  //   right: 0,
  //   top: 0,
  //   zIndex: 1,
  //   borderWidth: 1
  // },
  SearchBox: {
    borderWidth: 0,
    borderLeftWidth: 0,
    borderBottomColor: AppTheme.APPCOLOR.GRAY,
    borderBottomWidth: 1,
    // backgroundColor: 'red'
  },
  SearchBoxTextItem: {
    margin: 5,
    fontSize: 16,
    paddingVertical: 8,
    // borderBottomColor: AppTheme.APPCOLOR.GRAY,
    // borderBottomWidth: 1,
  },
  // selectedTextContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // selectedTextStyle: {
  //   textAlign: 'center',
  //   fontSize: 18,
  // },
});