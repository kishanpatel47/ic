import React from 'react';
import {
    StyleSheet,
    Modal,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { View } from 'react-native-animatable';
import itemImg from '../../Assets/Images/feedback-icon.png';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import CustomTextInput from '../helper/customView/CustomTextInput';
import AppBase from '../AppBase';
import CustomText from '../helper/customView/CustomText';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { decode as atob, encode as btoa } from 'base-64';
import strings from '../LanguageFiles/LocalizedStrings';
import CommonDataManager from '../helper/CommonDataManager';
import Singleton from '../helper/Singleton';
import Moment from 'moment'; //https://medium.com/better-programming/using-moment-js-in-react-native-d1b6ebe226d4

export default class RaiseComplain extends AppBase {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            detailText: '',
            // page: 1,
            // pageSize: 10,
            modal: false,
            complaintList: [],
            // refreshing: false,
            loadingCounter: 0,
            userInfo: {},
            orderid: ''
        };
        this.state.orderid = this.props.route.params.orderdetail.orderId;
        console.log(this.state.orderid);
    }

    componentDidMount = () => {
        console.log('INIT ADDRESS LIST');

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getUserData();
            this.setState({
                complaintList: [],
            }, () => {
                // this.state.orderid = this.props.route.params.orderdetail.orderId;
                // console.log(this.state.orderid);
            });
        });
    };


    getUserData = async () => {
        Singleton.getInstance().getUserProfile().then((data) => {
            this.setState({
                userInfo: data,
            }, () => {
                this.getComplaint();
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
        //             this.getComplaint();
        //         });
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         if (err.jsonResponse.status == false) {
        //             this.showAlertMessage(err.jsonResponse.message);
        //         }
        //     });
    };

    getComplaint = () => {
        this.setState({ loadingCounter: this.state.loadingCounter + 1 }, () => {
            console.log('>>>' + 'api/complaint/getcomplist?userid=' + this.state.userInfo.userId + '&orderid=' + this.state.orderid);
            API.getRequest('api/complaint/getcomplist?userid=' + this.state.userInfo.userId + '&orderid=' + this.state.orderid)
                .then((data) => {
                    this.setState({
                        // refreshing: false,
                        loadingCounter: this.state.loadingCounter - 1,
                    }, () => {
                        console.log(
                            'Hidden Indicator = ' + this.state.loadingCounter,
                        );
                        console.log(data);
                        if (data.jsonResponse.data.length > 0) {
                            this.setState({
                                complaintList: data.jsonResponse.data
                            });
                        }
                    });

                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        // refreshing: false,
                        loadingCounter: this.state.loadingCounter - 1,
                    });
                    if (err.jsonResponse.status == false) {
                        this.showAlertMessage(err.jsonResponse.message);
                    }
                });
        });
    };

    addComplaint = () => {
        if (this.state.detailText.length <= 0) {
            this.showAlertMessage(strings.Please_enter_detail);
        } else {
            let params = {
                Description: this.state.detailText,
                OrderID: this.state.orderid,
            };
            this.setState({ loadingCounter: this.state.loadingCounter + 1 }, () => {
                API.postRequest('api/complaint/addcomp', params)
                    .then((enc) => {
                        this.setState(
                            {
                                // refreshing: false,
                                loadingCounter: this.state.loadingCounter - 1,
                            },
                            () => {
                                if (enc.jsonResponse.status === true) {
                                    // Save button clicked and dismiss modal
                                    this.setState({ modal: false }, () => {
                                        setTimeout(() => {
                                            this.getComplaint();
                                        }, 1000);

                                    });
                                    this.showToastMessage(enc.jsonResponse.message);
                                } else {
                                    this.showAlertMessage(enc.jsonResponse.message);
                                }
                            },
                        );
                    })
                    .catch((err) => {
                        console.log("Error : = " + err);
                        this.setState({
                            // refreshing: false,

                            loadingCounter: this.state.loadingCounter - 1,

                        });
                        if (err.jsonResponse.status == false) {
                            this.showAlertMessage(err.jsonResponse.message);
                        }
                    });
            });
        };
    }

    RenderImage = (Data) => {
        return <Image source={itemImg} style={styles.productIMG} />;
    };

    RenderTitle = (Data) => {
        return (
            <CustomText
                // numberOfLines={3}
                customStyle={styles.itemName}
                text={Data.item.description}
            />
        );
    };

    RenderAns = (Data) => {
        return (
            <CustomText
                // numberOfLines={3}
                customStyle={styles.reviewtxt}
                text={Data}
            />
        );
    };


    complaintListItem = (item, index) => {
        return (
            <View
                key={index}
                easing={'ease-in-out'}
                delay={index * 50}
                animation={'fadeInUp'}
                duration={500}>

                <AnimatedButton
                    onPress={() => {
                        // this.props.navigation.push('medicinedetail', { navParams: storeData.item });
                    }}>
                    <View style={styles.listItem}>
                        {this.RenderImage(item)}

                        <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                            {this.RenderTitle(item)}
                        </View>
                        <View
                            style={[styles.statusChip, { paddingHorizontal: 10 }]}
                        >
                            <CustomText
                                text={item.item.statusName}
                                customStyle={{ color: 'white', fontSize: 13 }}
                            />
                        </View>
                    </View>
                    {
                        item.item.remarks.map((data) => {
                            return (<View style={{
                                backgroundColor: AppTheme.APPCOLOR.ANS,
                                borderRadius: 10,
                                padding: 10,
                                margin: 50,
                                marginTop: 0,
                                marginBottom: 1,
                                marginRight: 5,
                            }}>
                                <View style={styles.ans}>
                                    <CustomText
                                        numberOfLines={3}
                                        customStyle={styles.reviewtxt}
                                        text={data.remark}
                                    />
                                </View>
                                <CustomText
                                    numberOfLines={1}
                                    customStyle={styles.reviewdate}
                                    text={Moment(data.createdDate).format('DD/MM/YYYY')}
                                />
                            </View>)
                        })
                    }

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
                    textsize={13}
                />
            </View>
        );
    };

    render() {
        return (
            <BaseView>
                <CustomLoadingView
                    isShowModal={this.state.loadingCounter > 0 ? true : false}
                />
                <Modal
                    style={styles.modalcss}
                    animationType={'slide'}
                    transparent={true}
                    backdropOpacity={0.1}
                    visible={this.state.modal}
                    onRequestClose={() => {
                        this.setState({ modal: false });
                    }}>
                    {/* <TouchableOpacity
            style={styles.modalmainview}
            onPress={() => {
              this.setState({ modal: false });
            }}> */}
                    <View style={styles.modalmainview}>
                        <View style={styles.boxview}>
                            <View style={styles.centerContent}>
                                <CustomText
                                    text={strings.RAISE_COMPLAIN}
                                    textcolor={AppTheme.APPCOLOR.PRIMARY}
                                    textsize={25}
                                    fontweight={'700'}

                                />
                                {/* <Image source={FeebackMenu} style={styles.modalimage} /> */}
                            </View>

                            <CustomTextInput
                                name={'detail'}
                                style={styles.textinput}
                                returnKeyType={'done'}
                                placeholder={strings.DESCRIPTION}
                                placeholderTextColor={AppTheme.APPCOLOR.TEXT}
                                onChangeText={(value) => this.setState({ detailText: value })}
                            />

                            <View
                                style={[
                                    styles.centerContent,
                                    { borderRadius: 0, borderWidth: 0 },
                                ]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <AnimatedButton
                                        onPress={() => {
                                            this.addComplaint();
                                        }}
                                        style={styles.savebtn}>
                                        <CustomText
                                            text={strings.SAVE}
                                            customStyle={styles.savetxt}
                                        />
                                    </AnimatedButton>
                                    <AnimatedButton
                                        onPress={() => {
                                            this.setState({ modal: false });
                                        }}
                                        style={styles.savebtn}>
                                        <CustomText
                                            text={strings.CANCEL}
                                            customStyle={styles.savetxt}
                                        />
                                    </AnimatedButton>
                                </View>
                            </View>
                            {/* <View style={styles.centerContent}>
                <AnimatedButton
                  onPress={() => {
                    this.addComplaint();
                  }}
                  style={styles.savebtn}>
                  <CustomText
                    text={strings.SAVE}
                    customStyle={styles.savetxt}
                  />
                </AnimatedButton>
              </View> */}
                        </View>
                    </View>
                    {/* </TouchableOpacity> */}
                </Modal>

                <View style={styles.container}>
                    <FlatList
                        // Pagination ----------
                        // onEndReachedThreshold={0.5}
                        // onEndReached={({ }) => {
                        //     console.warn('onEndReached');
                        //     this.getComplaint();
                        // }}
                        // // ListFooterComponent={
                        // //     this.state.isShowModal ? this.renderBottomLoader : null
                        // // }
                        // onRefresh={() => this.getComplaint()}
                        // refreshing={this.state.refreshing}
                        // Pagination ----------
                        contentContainerStyle={{ paddingVertical: 8 }}
                        data={this.state.complaintList}
                        extraData={this.state.complaintList}
                        key={this.complaintListItem}
                        renderItem={this.complaintListItem}
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

                    <AnimatedButton
                        onPress={() => {
                            //this.addLead();
                            this.setState({
                                modal: true,
                            });
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            height: 50,
                            backgroundColor: AppTheme.APPCOLOR.WHITE,
                            borderRadius: 100,
                            backgroundColor: AppTheme.APPCOLOR.PRIMARY,
                        }}>
                        <IconMaterialIcons
                            name="add"
                            size={30}
                            color={AppTheme.APPCOLOR.WHITE}
                        />
                    </AnimatedButton>
                </View>
            </BaseView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    productIMG: {
        width: 40,
        height: 40,
    },
    itemName: {
        fontSize: 20,
        color: AppTheme.APPCOLOR.BLACK,
        fontWeight: '700',
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // width: '90%'
        // padding: 10,
        marginRight: 30,
    },
    reviewtxt: {
        fontSize: 13,
        color: AppTheme.APPCOLOR.BLACK,
        fontWeight: '700',
        marginRight: 30,
    },
    reviewdate: {
        fontSize: 10,
        color: AppTheme.APPCOLOR.GRAY,
        fontWeight: '700',
        marginRight: 5,
        marginBottom: 0,
        textAlign: 'right',
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        padding: 10,
        margin: 5,
        marginBottom: 5,
        flex: 1,
        backgroundColor: AppTheme.APPCOLOR.LIST,
        borderRadius: 10,
    },
    modalcss: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        backgroundColor: 'red',
    },
    modalmainview: {
        flex: 1,
        backgroundColor: '#00000080',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxview: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        padding: 20,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalimage: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textinput: {
        borderBottomColor: AppTheme.APPCOLOR.GRAY,
        borderBottomWidth: 1,
        fontSize: 13
    },
    savebtn: {
        justifyContent: 'center',
        backgroundColor: AppTheme.APPCOLOR.PRIMARY,
        alignItems: 'center',
        height: 44,
        margin: 20,
        borderRadius: 10,
        width: 100,
    },
    savetxt: {
        color: 'white',
        textAlign: 'center',
    },
    ans: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        // padding: 10,
        // margin: 50,
        // marginTop: 0,
        // marginBottom: 1,
        // marginRight: 5,
        flex: 1,
        // backgroundColor: AppTheme.APPCOLOR.ANS,
        // borderRadius: 10,
    },
    footer: {
        alignSelf: 'center',
    },
    statusChip: {
        backgroundColor: AppTheme.APPCOLOR.PRIMARY,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 5,
        flexDirection: 'row',
        height: 44,
    },

});
