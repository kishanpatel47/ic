import React, { Component } from 'react'
import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';
import AnimatedButton from './AnimatedButton';
import LottieView from 'lottie-react-native';
import strings from '../../LanguageFiles/LocalizedStrings';
const AnimateFile =
    './../../../Assets/AnimationsFiles/75376-cross-mark-animarion.json';

export default class FailModal extends Component {

    static propTypes = {
        isShowModal: PropTypes.bool.isRequired,
    };

    render() {
        const { isShowModal, onClose } = this.props;
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
                        <Text style={styles.headerText}>{strings.PAYMENT_STATUS}</Text>
                        <LottieView
                            speed={1.25}
                            style={{ alignSelf: 'center', height: 125, width: 125 }}
                            source={require(AnimateFile)}
                            autoPlay
                        />
                        <Text style={styles.statusText}>{strings.FAIL}</Text>
                        <AnimatedButton
                            style={{
                                justifyContent: 'center',
                                backgroundColor: AppTheme.APPCOLOR.GREEN,
                                margin: 20,
                                borderRadius: 5,
                                height: 44
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
    }
})