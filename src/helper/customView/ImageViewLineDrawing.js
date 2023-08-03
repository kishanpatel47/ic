import React, {Component} from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import AppTheme from '../AppTheme';
import PropTypes from 'prop-types';

export default class ImageViewLineDrawing extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {style, uri} = this.props;
    return (
      <View style={[style]}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            padding: 0,
            flex: 1,
          }}>
          <Image
            source={{
              uri: uri, //item.meta_fields['profile-full-image'],
              // cache: 'reload',
            }}
            resizeMethod={'scale'}
            resizeMode={'center'}
            // resizeMode={'contain'}
            style={[
              styles.imgGalleryItem,
              {
                transform: [{scale: 0.9}],
                margin: 0,
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
              },
            ]}
            //style={[styles.imgGalleryItem, {padding: 16}]}
          />
        </View>
      </View>
    );
  }
}

ImageViewLineDrawing.propTypes = {
  style: PropTypes.style,
  uri: PropTypes.uri,
};

const styles = StyleSheet.create({
  // imgGalleryItem:{
  //   transform:[{scale:0.5}]
  // }
  // imgGalleryItem: {
  //   // borderColor:'gray',
  //   // borderWidth:1,
  //   overflow: 'hidden',
  //   borderBottomRightRadius: 0,
  //   borderBottomLeftRadius: 0,
  //   height: (Dimensions.get('window').width - 60) / GridColumns,
  // },
});
