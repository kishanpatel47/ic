import React, { Component } from 'react'
import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';
import AnimatedButton from './AnimatedButton';
import LottieView from 'lottie-react-native';
import strings from '../../LanguageFiles/LocalizedStrings';
import CustomText from './CustomText';
const AnimateFile =
    './../../../Assets/AnimationsFiles/62669-success-lottie-animation.json';

export default class SuccessModal extends Component {

    static propTypes = {
        isShowModal: PropTypes.bool.isRequired,
    };

    render() {
        const { isShowModal, onClose, orderId } = this.props;
        return (
            <Modal
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                }}
                animationType={"slide"}
                transparent={true}
                visible={isShowModal}
                onRequestClose={() => {
                    // Alert.alert('Modal has now been closed.');
                }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#00000080',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View
                        style={{
                            width: '80%',
                            margin: 20,
                            backgroundColor: AppTheme.APPCOLOR.WHITE,
                            borderRadius: 10,
                            overflow: 'hidden',
                        }}>
                        <CustomText customStyle={styles.headerText} text={strings.PAYMENT_STATUS}></CustomText>
                        <LottieView
                            speed={1.25}
                            style={{ alignSelf: 'center', height: 200, width: 200 }}
                            source={require(AnimateFile)}
                            autoPlay
                        />
                        <CustomText customStyle={styles.statusText} text={strings.SUCCESS}></CustomText>
                        <CustomText customStyle={styles.orderNo} text={strings.YOUR_ORDER}></CustomText>
                        <CustomText customStyle={styles.orderNo} text={orderId}></CustomText>
                        <AnimatedButton
                            style={{
                                justifyContent: 'center',
                                backgroundColor: AppTheme.APPCOLOR.PRIMARY,
                                margin: 20,
                                marginVertical: 10,
                                borderRadius: 5,
                            }}
                            onPress={this.props.onTrack}>
                            <Text style={styles.buttonText}>{strings.Track_Order}</Text>
                        </AnimatedButton>
                        <AnimatedButton
                            style={{
                                justifyContent: 'center',
                                backgroundColor: AppTheme.APPCOLOR.GREEN,
                                margin: 20,
                                marginTop: 10,
                                borderRadius: 5,
                            }}
                            onPress={onClose}>
                            <Text style={styles.buttonText}>{strings.CLOSE}</Text>
                        </AnimatedButton>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        color: AppTheme.APPCOLOR.WHITE,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 8,
        textTransform: 'uppercase',
    },
    headerText: {
        fontSize: 22,
        color: AppTheme.APPCOLOR.PRIMARY,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 10,
    },
    statusText: {
        fontSize: 20,
        color: AppTheme.APPCOLOR.PRIMARY,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    orderNo: {
        textAlign: 'center',
        color: AppTheme.APPCOLOR.BLACK
    }
})