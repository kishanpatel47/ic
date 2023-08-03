import React from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import AppTheme from '../helper/AppTheme';
import BaseView from '../helper/customView/BaseView';
import AppBase from '../AppBase';
import { View } from 'react-native-animatable';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import CustomText from '../helper/customView/CustomText';
import AnimatedButton from '../helper/customView/AnimatedButton';
import strings from '../LanguageFiles/LocalizedStrings';
import API from '../connection/http-utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //https://oblador.github.io/react-native-vector-icons/
import Singleton from '../helper/Singleton';
import Card from '../helper/customView/Card';

export default class AddressList extends AppBase {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            addressList: [],
            loadingCounter: 0,
            userInfo: ''
        };
    }

    componentDidMount = () => {
        console.log('INIT ADDRESS LIST');
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                addressList: [],
            }, () => {
                console.log("1");
                this.getUserData();
            });
        });

    };

    render() {
        return (
            <BaseView style={{ justifyContent: 'center' }}>
                <View style={{ flex: 1 }}>
                    <CustomLoadingView
                        isShowModal={this.state.loadingCounter > 0 ? true : false}
                    />

                    <FlatList
                        onEndReachedThreshold={0.5}
                        onEndReached={({ }) => {
                            console.warn('onEndReached');
                            // this.getCarteList();
                        }}
                        ListFooterComponent={
                            this.state.isShowModal ? this.renderBottomLoader : null
                        }
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.refreshing}
                        contentContainerStyle={{ paddingVertical: 8 }}
                        data={this.state.addressList}
                        extraData={this.state.addressList}
                        key={this.AddressListItem}
                        renderItem={this.AddressListItem}
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
                                        : strings.EMPTY_ADDRESS
                                }
                            />
                        }
                    />
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
                                console.log("this.state.userInfo");
                                console.log(this.state.userInfo);
                                if (this.state.userInfo) {
                                    this.props.navigation.push('addressForm', { userInfo: this.state.userInfo });
                                }
                            }}>
                            <CustomText
                                text={strings.ADD_NEW_ADDRESS}
                                customStyle={{
                                    textAlign: 'center',
                                    color: AppTheme.APPCOLOR.WHITE,
                                }}
                            />
                        </AnimatedButton>
                    </View>

                </View>
            </BaseView>
        );
    }

    AddressListItem = ({ item, index }) => {
        return (
            <AnimatedButton
                onPress={() => {
                    this.props.navigation.push('addressForm', { userInfo: this.state.userInfo, addressObj: item });
                }}>
                <Card
                    width={'100%'}
                    easing={'ease-in-out'}
                    delay={index * 150}
                    animation={'fadeInUp'}
                    duration={500}>
                    <View style={styles.listItem}>
                        <View>
                            {this.RenderAddressTitle(item)}
                            {this.RenderAddress(item)}
                            {item.isDefault ? this.RenderDefault(item) : null}
                        </View>
                    </View>
                </Card>
            </AnimatedButton>
        );
    };

    RenderAddressTitle = (Data) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CustomText
                    numberOfLines={10}
                    customStyle={styles.itemName}
                    text={Data.name ? Data.name : '-'}
                />
                <View
                    style={[styles.namechip, { paddingHorizontal: 10 }]}
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
                        customStyle={{ color: 'white', fontSize: 13 }}
                    />
                </View>
            </View>

        );
    };

    RenderAddress = (Data) => {
        return (
            <View>
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

    getUserData = async () => {
        console.log('ADDRESS PROFILE DATA');
        Singleton.getInstance().getUserProfile().then((data) => {
            console.log("user info");
            console.log(data);
            this.setState({
                userInfo: data,
            }, () => {

                this.getAddressList();
            });
        }).catch((err) => {
            console.log(err);
            if (err.jsonResponse.status == false) {
                this.showAlertMessage(err.jsonResponse.message);
            }
        });
        // API.getRequest('api/Account/getuserprofile')
        //     .then((dataenc) => {
        //         const data = API.decrpt(dataenc.jsonResponse);
        //         this.setState({
        //             userInfo: data.data,
        //         }, () => {
        //             this.getAddressList();
        //         });

        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         if (err.jsonResponse.status == false) {
        //             this.showAlertMessage(err.jsonResponse.message);
        //         }
        //     });
    };

    getAddressList = () => {
        this.setState({
            loadingCounter: this.state.loadingCounter + 1
        }, () => {// '2069' : '1027'
            API.getRequest('api/address/getaddresslist').then((data) => {
                console.log(data.jsonResponse);
                this.setState({
                    refreshing: false,
                    loadingCounter: this.state.loadingCounter - 1,
                });
                if (
                    data &&
                    data.jsonResponse &&
                    data.jsonResponse.data
                ) {
                    this.setState({
                        addressList: data.jsonResponse.data,
                        // carttotal: data.jsonResponse.data.carttoal,
                    });
                    console.log(this.state.addressList.length);
                }
            }).catch((err) => {
                this.setState({
                    refreshing: false,
                    loadingCounter: this.state.loadingCounter - 1,
                });
                console.log(err);
                if (err.jsonResponse.status == false) {
                    this.showAlertMessage(err.jsonResponse.message);
                }
            });
        });
    };

    onRefresh = () => {
        //set isRefreshing to true
        this.setState({
            refreshing: true
        }, () => {
            this.getAddressList();
        })
        // and set isRefreshing to false at the end of your callApiMethod()
    }
}

const styles = StyleSheet.create({
    btnSelectAddress: {
        backgroundColor: AppTheme.APPCOLOR.GREEN,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
        height: 40,
        justifyContent: 'center',
    },
    listItem: {
        width: '100%',
        alignSelf: 'flex-start',
        // flexDirection: 'row',
        padding: 5,
        // borderBottomColor: AppTheme.APPCOLOR.GRAY,
        // borderBottomWidth: 1,
    },
    productIMG: {
        width: 70,
        height: 70,
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
        // alignSelf: 'center',
    },
    namechip: {
        backgroundColor: AppTheme.APPCOLOR.PRIMARY,
        // borderWidth: 3,
        borderColor: AppTheme.APPCOLOR.PRIMARY,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        flexDirection: 'row'
    },
    btnSave: {
        backgroundColor: AppTheme.APPCOLOR.GREEN,
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        width: '100%'
    },

});