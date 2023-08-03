import React from 'react';
import {
    StyleSheet, FlatList, ScrollView, Image, Text,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { View } from 'react-native-animatable';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppTheme from '../helper/AppTheme';
import AnimatedButton from '../helper/customView/AnimatedButton';
import BaseView from '../helper/customView/BaseView';
import API from '../connection/http-utils';
import AppBase from '../AppBase';
import CustomText from '../helper/customView/CustomText';
import Moment from 'moment';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import Timeline from 'react-native-timeline-flatlist';
import Singleton from '../helper/Singleton';
import Card from '../helper/customView/Card';
import strings from '../LanguageFiles/LocalizedStrings';

export default class OrderTrack extends AppBase {
    constructor(props) {
        super(props);
        this.state = {
            orderId: '',
            orderDetail: [],
            // itemOrderDetail: [],
            loadingCounter: false
        };
    }

    setCurrent = () => {
        return (<IconMaterialIcons
            name="check"
            size={25}
            color={AppTheme.APPCOLOR.GREEN}
        />);
    }

    componentDidMount = () => {
        this.state.orderId = this.props.route.params.navParams.orderId;
        this.getUserData();
    };

    getOrderTrack = () => {
        this.setState({
            loadingCounter: true,
        }, () => {
            let params = {
                Orderid: this.state.orderId
            };
            // console.log(params);
            API.postRequest('api/cart/trackorder', params).then((data) => {
                // console.log(data)
                this.setState({
                    loadingCounter: false,
                });
                console.log(data.jsonResponse.data);
                if (data.jsonResponse.status) {
                    if (data && data.jsonResponse && data.jsonResponse.data) {
                        let _stat = [];
                        data.jsonResponse.data.map((st) => {
                            _stat.push({
                                'title': st.date ? Moment(st.date).format('DD/MM/YYYY') : 'N/A',
                                'description': st.message ? st.message : '',
                                'circleColor': AppTheme.APPCOLOR.PRIMARY,
                                'dotColor': st.isCompleted ? AppTheme.APPCOLOR.PRIMARY : AppTheme.APPCOLOR.WHITE,
                            });
                        })
                        this.setState({
                            orderDetail: _stat,
                        });
                    }
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
    };

    getUserData = async () => {
        Singleton.getInstance().getUserProfile().then((data) => {
            this.setState({
                userInfo: data,
                userName: data && data.firstName ? data.firstName : '',
                userMobile: data && data.mobileNo ? data.mobileNo : '',
                userEmail: data && data.email ? data.email : '',
            }, () => {
                // this.getAddressList();
                this.getOrderTrack();
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
        //             userName: data.data && data.data.firstName ? data.data.firstName : '',
        //             userMobile: data.data && data.data.mobileNo ? data.data.mobileNo : '',
        //             userEmail: data.data && data.data.email ? data.data.email : '',
        //         });
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         if (err.jsonResponse.status == false) {
        //             this.showAlertMessage(err.jsonResponse.message);
        //         }
        //     });
    };

    onRefresh() {
        this.getOrderTrack();
    }

    onEndReached() {
        //fetch next data
    }

    renderDetail(item, index) {
        // console.log(rowData)
        return (
            <View
                style={{ flex: 1, margin: -8, padding: 5 }}
                easing={'ease-in-out'}
                delay={index * 150}
                animation={'fadeInRightBig'}
                duration={500}
            >
                <CustomText customStyle={[styles.title]} numberOfLines={1} text={item.title} />
                <View style={styles.descriptionContainer}>
                    <CustomText customStyle={[styles.textDescription]} numberOfLines={5} text={item.description + '\n'} />
                </View>
            </View>
        )
    }

    renderFooter() {
        //show loading indicator
        if (this.state.waiting) {
            return <ActivityIndicator />;
        } else {
            return <Text>~</Text>;
        }
    }

    render() {
        return (
            <BaseView contentContainerStyle={{ flexGrow: 1 }}>
                <CustomLoadingView
                    isShowModal={this.state.loadingCounter}
                />
                <ScrollView>
                    <Card style={styles.container}>
                        <CustomText customStyle={styles.orderId} text={strings.Order_No + ' - ' + this.state.orderId}></CustomText>
                        <Timeline
                            data={this.state.orderDetail}
                            circleSize={20}
                            innerCircle={'dot'}
                            // innerCircle={'icon'}
                            showTime={false}
                            circleColor={AppTheme.APPCOLOR.WHITE}
                            lineColor={AppTheme.APPCOLOR.GREEN}
                            timeContainerStyle={{ minWidth: 52, marginTop: 0 }}
                            timeStyle={{ textAlign: 'center', backgroundColor: AppTheme.APPCOLOR.GREEN, color: AppTheme.APPCOLOR.WHITE, padding: 5, borderRadius: 13 }}
                            descriptionStyle={{ color: AppTheme.APPCOLOR.GRAY }}
                            options={{
                                // refreshControl: (
                                //     <RefreshControl
                                //         refreshing={this.state.isRefreshing}
                                //         onRefresh={this.onRefresh}
                                //     />
                                // ),
                                renderFooter: this.renderFooter,
                                onEndReached: this.onEndReached
                            }}
                            renderDetail={this.renderDetail}
                        />
                    </Card>
                </ScrollView>
            </BaseView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        margin: 15,
        borderRadius: 15
    },
    orderId: {
        textAlign: 'center',
        marginVertical: 15,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 12,
        // marginTop: -5,
        fontWeight: 'bold',
        color: AppTheme.APPCOLOR.BLACK,
    },
    descriptionContainer: {
        flexDirection: 'row',
    },
    textDescription: {
        color: AppTheme.APPCOLOR.PRIMARY,
        fontSize: 15
    }
});
