import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import splash1 from '../Splash1';
import UserDrawer from '../UserDrawer';
import Dashboard from '../views/Dashboard';
import PopularMouldings from '../views/PopularMouldings';
import TypesList from '../views/TypesList';
import Filter from '../views/Filter';
import SearchResultMouldings from '../views/SearchResultMouldings';

import CarousalSample from '../CarouselSample';
import MaterialList from '../views/MaterialList';
import CollectionList from '../views/CollectionList';
import SearchResultCollection from '../views/SearchResultCollection';
import ProfileDetails from '../views/ProfileDetails';
import SearchProfile from '../views/SearchProfile';
import SearchresultMouldingsWithoutHeader from '../views/SearchResultMouldingsWithoutHeader';

export default class Consts {
  static myInstance = null;
  static GridColumns = 2;

  /**
   * @returns {Consts}
   */
  static getInstance() {
    if (Consts.myInstance == null) {
      console.warn('Create new instance');
      Consts.myInstance = new Consts();
      //   getGridColumns()
    }

    return this.myInstance;
  }

  getGridColumns() {
    if (Platform.isPad) {
      // iPad
      // return 500
      this.GridColumns = 4;
    } else {
      if (Platform.OS == 'android' && DeviceInfo.isTablet) {
        // tablet
        // return 500
        this.GridColumns = 4;
      } else {
        //iPhone
        // return 250
        this.GridColumns = 2;
      }
    }
    return this.GridColumns;
  }

  static APP_SCREENS = {
    SPLASH1: splash1,
    USERDRAWER: UserDrawer,
    DASHBOARD: Dashboard,
    POPULAR_MOULDINGS: PopularMouldings,
    CAROUSAL_SAMPLE: CarousalSample,
    TYPES_LIST: TypesList,
    FILTER: Filter,
    SEARCH_RESULT_MOULDINGS: SearchResultMouldings,
    MATERIAL_LIST: MaterialList,
    COLLECTION_LIST: CollectionList,
    SEARCH_RESULT_COLLECTION: SearchResultCollection,
    PROFILE_DETAILS: ProfileDetails,
    SEARCH_PROFILE: SearchProfile,
    SEARCH_RESULT_WITHOUT_HEADER: SearchresultMouldingsWithoutHeader,
  };

  static DRAWER_NAME = {
    // HOME_DRAWER: 'Home',
    POPULAR_MOULDINGS_DRAWER: 'PopularMouldingsDrawer',
    TYPES_DRAWER: 'TypeListDrawer',
    MATERIAL_DRAWER: 'MaterialDrawer',
    COLLECTION_DRAWER: 'CollectionDrawer',
    PROFILE_NUMBER_DRAWER: 'ProfileNumberDrawer',
    FIND_RETAILER_DRAWER: 'FindRetailerDrawer',
    INSPIRATION_GALLERY_DRAWER: 'InspirationGalleryDrawer',
  };

  static SCREEN_TITLES = {
    SPLASH1: 'splash1',
    USERDRAWER: 'UserDrawer',
    DASHBOARD: 'Dashboard',
    POPULAR_MOULDINGS: 'PopularMouldings',
    TYPES_LIST: 'TypesList',
    PROFILE_LIST: 'ProfileList',
    FILTER: 'Filter',
    FIND_RETAILER: 'FindRetailer',
    SEARCH_RESULT_MOULDINGS: 'SearchResultMouldings',
    MATERIAL_LIST: 'MaterialList',
    COLLECTION_LIST: 'CollectionList',
    SEARCH_RESULT_COLLECTION: 'SearchResultCollection',
    PROFILE_DETAILS: 'ProfileDetails',
    GALLERY_LIST: 'GalleryList',
    GALLERY_ITEM: 'GalleryItem',
    SEARCH_PROFILE: 'SearchProfile',
    SEARCH_RESULT_WITHOUT_HEADER: 'SearchresultMouldingsWithoutHeader',
    CAROUSAL_SAMPLE: 'CarouselSample',
  };
}
