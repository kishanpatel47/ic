import React from 'react';
import { StyleSheet, ScrollView, Image, Dimensions, Animated, Modal } from 'react-native';
import AnimatedButton from '../helper/customView/AnimatedButton';
import { View } from 'react-native-animatable';
import AppTheme from '../helper/AppTheme';
import BaseView from '../helper/customView/BaseView';
import AppBase from '../AppBase';
import CustomLoadingView from '../helper/customView/CustomLoadingView';
import Carousel from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import IconMaterialIcons from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';

export default class FullScreenImageView extends AppBase {
    constructor(props) {
        super(props);
        this.state = {
            tempimagepath: [],
            imagearray: [],
            qty: 1,
            starCount: 3.5,
            loadingCounter: false,
            showVideoInFullScreen: false,
            videoPause: true,
            modal: false,
            videoPath: '',
            thumb: '',
            currentindex: ''
        };
        this.state.tempimagepath = this.props.route.params.navParams;
        this.state.currentindex = this.props.route.params.index;
    }
    componentDidMount = () => {
        for (let i = 0; i < this.state.tempimagepath.length; i++) { //make an array format related to npm ImageViewer
            this.state.imagearray.push({
                url: this.state.tempimagepath[i].docPath
            })
        }
    };

    //   videoBuffer = (isBuffer) => {
    videoError = (error) => {
        console.log("Video Playback Error = " + JSON.stringify(error));
    }

    PlayVideo = (video) => {
        // this.player.presentFullscreenPlayer();
    }

    _renderCarouselImage = ({ item, index }) => {
        return (
            item.docTypeID == 1 ?
                <ImageViewer
                    imageUrls={this.state.imagearray}
                    style={[styles.slideImage]}
                    renderIndicator={() => null}
                />
                :
                <View style={{
                    justifyContent: 'center',
                    flex: 1,
                    width: Dimensions.get('window').width,
                }}>

                    <View style={
                        {
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Image
                            source={{ uri: item.thumb }}
                            style={[styles.slideImage, {
                            }]}
                            resizeMode="contain"
                        />
                        <AnimatedButton
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
                            onPress={() => {
                                this.setState({
                                    videoPause: false,
                                }, () => {
                                    setTimeout(() => {
                                        // this.player.presentFullscreenPlayer()
                                        this.setState({
                                            modal: true,
                                            videoPath: item.docPath,
                                            thumb: item.thumb
                                        })
                                    }, 1000);
                                })
                            }}>
                            <IconMaterialIcons
                                style={{
                                    // alignContent: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'red'
                                }}
                                name="play"
                                size={30}
                                color={'white'}
                            />
                        </AnimatedButton>
                    </View>
                </View>

        );
    }


    renderProductImages = () => {
        // const insets = useSafeAreaInsets();
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.APPCOLOR.BLACK }}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.tempimagepath}
                    renderItem={this._renderCarouselImage}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                    // onSnapToItem={this.changeItem}
                    index
                    firstItem={this.state.currentindex}
                />
                <AnimatedButton
                    style={{
                        borderRadius: 50,
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 10,
                        right: 0,
                        padding: 5,
                        marginTop: DeviceInfo.hasNotch() && Platform.OS == 'ios' ? 33 : 0,
                        shadowColor: 'black',
                        shadowOffset: {
                            width: 5,
                            height: 5
                        },
                        margin: 15,
                        elevation: 5,
                        shadowRadius: 5,
                        shadowOpacity: 0.2,
                    }}
                    onPress={() => {
                        this.props.navigation.pop();
                    }}>
                    <IconMaterialIcons
                        name="close"
                        size={25}
                        color={AppTheme.APPCOLOR.PRIMARY}
                    />
                </AnimatedButton>
            </View>

        );
    };

    changeItem = ({ index }) => {
        console.warn("Index Changed")
    }

    render() {
        return (
            <BaseView style={styles.container}>
                <CustomLoadingView isShowModal={this.state.loadingCounter} />
                <Modal
                    style={styles.modalcss}
                    animationType={'slide'}
                    transparent={true}
                    backdropOpacity={0.5}
                    visible={this.state.modal}
                    onRequestClose={() => {
                        this.setState({ modal: false });
                    }}>
                    <View style={{ flex: 1 }}>

                        <VideoPlayer
                            onBack={() => {
                                this.setState({ modal: false });
                            }}
                            onPause={() => {
                                this.setState({
                                    videoPause: true
                                })
                            }}
                            // tapAnywhereToPause={true}
                            paused={this.state.videoPause} ///
                            poster={this.state.thumb}
                            posterResizeMode={'contain'}
                            controls={true}
                            resizeMode="contain"
                            onFullscreenPlayerWillDismiss={() => {
                                this.setState({
                                    videoPause: true
                                })
                            }}
                            source={{ uri: this.state.videoPath }}
                            ref={(ref) => {
                                this.player = ref
                            }}
                            // onReadyForDisplay={this.PlayVideo}
                            onError={this.videoError}               // Callback when video cannot be loaded
                            style={
                                [styles.backgroundVideo, {
                                }]} />
                    </View>
                </Modal>
                {this.renderProductImages()}
            </BaseView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    slideImage: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        borderRadius: 5,
        justifyContent: 'flex-end',
    },

    backgroundVideo: {
        flex: 1,
        backgroundColor: 'black',
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
    modalcss: {
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 0,
        // backgroundColor: 'red',
        flex: 1,
    },
});
