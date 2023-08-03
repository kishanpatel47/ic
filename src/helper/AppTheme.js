import { Platform } from 'react-native';

export default {
  APPCOLOR: {
    PRIMARY: '#eb6005',
    GREEN: '#404d31',
    ICON: '#ffffff',
    DANGER: '#d9534f',
    SUCCESS: '#5cb85c',
    BLACK: '#000000',
    GRAY: '#686868',
    TabBarActiveColor: 'rgba(241,86,35,1)',
    TabBarInactiveColor: 'rgba(77,77,77,1)',
    WHITE: '#ffffff',
    GREY: '#e6e6e6',
    YELLOW: '#fdee21',
    RED: '#FF0000',
    TEXT: '#51504e',
    SILVER: '#D3D3D3',
    // GRADIENT_TOP:'#17473a',
    GRADIENT_BOTTOM: '#072119',
    LIST: '#919190',
    ANS: '#bfbfbd',
    //BGCOLOR: __DEV__ ? 'gray' : '#f7f7f7',
    // BGCOLOR: '#f7f7f7',
  },

  // GRADIENT_COLORS:['#17473a', '#072119'],

  APP_FONTS: {
    REGULAR: Platform.OS == 'ios' ? 'Helvetica' : 'Helvetica',
    // THIN: Platform.OS == 'ios' ? "ProximaNova-Thin" : "Proxima-Nova-Thin",
    // BOLD: Platform.OS == 'ios' ? "ProximaNova-Bold" : "Proxima-Nova-Bold",
    // BOLD: Platform.OS == 'ios' ? "Helvetica-Bold" : "Helvetica-Bold",
    // MACKLIN_LIGHT_ITALIC:"MacklinText-LightItalic",
  },
};
