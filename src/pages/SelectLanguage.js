import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native-animatable';
import AppTheme from '../helper/AppTheme';
import CustomText from '../helper/customView/CustomText';
import RNRestart from 'react-native-restart';
import LanguageListItem from '../helper/customView/LanguageListItem';
import strings from '../LanguageFiles/LocalizedStrings';
import {getLng, setLng} from '../helper/changeLanguage';
import AppBase from '../AppBase';

const languages = [
  {
    locale: 'en',
    name: strings.English,
  },
  {
    locale: 'hi',
    name: strings.Hindi,
  },
];

export default class SelectLanguage extends AppBase {
  constructor(props) {
    super(props);
    this.state = {
      currentLocale: '',
    };
  }

  componentDidMount = () => {
    this.checkLanguage();
  };

  checkLanguage = async () => {
    const lngData = await getLng();
    if (!lngData) {
      strings.setLanguage('en');
    }

    this.setState({
      currentLocale: lngData ? lngData : 'en',
    });
  };

  changeLanguage = (language) => {
    console.log(language);
    setLng(language);
    this.setState({
      currentLocale: language,
    });
    RNRestart.Restart();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomText
          customStyle={{
            marginTop: 16,
            justifyContent: 'center',
            textAlign: 'center',
            color: AppTheme.APPCOLOR.BLACK,
            fontWeight: '700',
          }}
          text={strings.Choose_Your_Preeferred_Language}
        />
        <View style={{marginTop: 15}}>
          {languages.map((language) => (
            <LanguageListItem
              key={language.locale}
              isActive={language.locale === this.state.currentLocale}
              locale={language.locale}
              name={language.name}
              englishName={language.englishName}
              onChangeLocale={(locale) => {
                this.changeLanguage(locale);
              }}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box1: {
    height: 300,
    backgroundColor: '#dddddd',
  },
  box2: {
    height: 200,
    backgroundColor: AppTheme.APPCOLOR.WHITE,
    position: 'absolute',
    alignSelf: 'center',
    top: 90,
    left: 30,
    right: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 52, 52, 0.8)',
  },
  box3: {
    // flexDirection:"row",
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    // alignItems: 'center',
    height: 200,
    backgroundColor: AppTheme.APPCOLOR.PRIMARY,
  },
  shadowStyle: {
    shadowColor: AppTheme.APPCOLOR.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  slide1: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  slide2: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});
