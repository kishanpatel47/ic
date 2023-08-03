import React, { Component } from 'react';
import { Image } from 'react-native';

// Navigation Code ----------------------------------------------
// import 'react-native-gesture-handler';
// https://www.robinwieruch.de/react-native-navigation
import { NavigationContainer } from '@react-navigation/native';
// https://reactnavigation.org/docs/tab-based-navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './helper/RootNavigation';
// Navigation Code ----------------------------------------------

// Create Stack ----------------------------------------------
// https://www.robinwieruch.de/react-native-navigation
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
// Create Stack ----------------------------------------------

// Screen Name ----------------------------------------------
import Login from './pages/login';
import Registration from './pages/registration';
import Splash from './pages/splash';
import About from './pages/about';
import Contact from './pages/contact';
import Dashboard from './pages/dashboard';
import Forgotpassword from './pages/forgotpassword';
import MedicineDetail from './pages/medicinedetail';
import NotificationDetail from './pages/notificationDetail';
import NotificationList from './pages/NotificationList';
import MyOrderList from './pages/MyOrderList';
import Cart from './pages/Cart';
import UserProfile from './pages/UserProfile';
import MedicineList from './pages/medicine';
import SelectLanguage from './pages/SelectLanguage';
import StoreList from './pages/storeList';
import StoreDetail from './pages/storeDetail';
import Feedback from './pages/feeback';
import Category from './pages/category';
import OrderDetail from './pages/orderdetail';
import OrderTrack from './pages/OrderTrack';
import Favorite from './pages/favorites';
import RaiseComplain from './pages/RaiseComplain';
import FullScreenImageView from './pages/FullScreenImageView';
import strings from './LanguageFiles/LocalizedStrings';
// Screen Name ----------------------------------------------

import AppTheme from './helper/AppTheme';
import Singleton from './helper/Singleton';
import AddressList from './pages/AddressList';
import AddressForm from './pages/AddressForm';
import SelectAddress from './pages/SelectAddress';

const iconHome = './../Assets/Images/home-icon-silhouette.png';
const iconProfile = './../Assets/Images/profile.png';
const iconNotification = './../Assets/Images/notification.png';
const iconCart = './../Assets/Images/cart.png';
const iconOrders = './../Assets/Images/my-order.png';

/**
 * Note : If you don't bottom navigation bar then change StackScreen and navigate to another screen
 * bottom navigation bar will not show
 * i.e. If open Navigation Stack Screen then open 'forgotpassword' from Dashboard Stack
 */

/**
 * ------------------------------------------------------------------------------
 * Dashboard Stack Screens
 * ------------------------------------------------------------------------------
 */
function DashboardStackScreens() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          title: strings.DASHBOARD, //Set Header Title
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white', //Set Header text color
          headerTitleStyle: {
            // fontWeight: 'bold', //Set Header text style
          },
          headerShown: false,
        }}
      />

      <RootStack.Screen
        name="forgotpassword"
        component={Forgotpassword}
        options={{
          title: strings.FORGOTPASSWORD,
        }}
      />

      <RootStack.Screen
        name="medicinedetail"
        component={MedicineDetail}
        options={{
          title: "Medicine Details",
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="medicine"
        component={MedicineList}
        options={{
          // title: strings.MEDICINELIST,
          // headerShown: title != null ? true : false,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="fullscreenimageview"
        component={FullScreenImageView}
        options={{
          // tabBarVisible: false, //like this
          title: strings.MEDICINELIST,
          headerShown: false,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />

      <RootStack.Screen
        name="storeList"
        component={StoreList}
        options={{ title: strings.NEARBYSTORES, headerShown: false }}
      />
      <RootStack.Screen
        name="storeDetail"
        component={StoreDetail}
        options={{ title: '', headerShown: false }}
      />
      <RootStack.Screen
        name="category"
        component={Category}
        options={{
          title: strings.CATEGORY,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
    </RootStack.Navigator>
  );
}

/**
 * ------------------------------------------------------------------------------
 * Notification Stack Screens
 * ------------------------------------------------------------------------------
 */
function NotificationStackScreens() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="NotificationList"
        component={NotificationList}
        options={{
          title: strings.NOTIFICATIONS,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white', //Set Header text color
          headerTitleStyle: {
            // fontWeight: 'bold', //Set Header text style
          },
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name="NotificationDetail"
        component={NotificationDetail}
        options={{
          title: strings.NOTIFICATIONDETAIL,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
    </RootStack.Navigator>
  );
}

/**
 * ------------------------------------------------------------------------------
 * My Orders Stack Screens
 * ------------------------------------------------------------------------------
 */
function MyOrderStackScreens() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="MyOrderList"
        component={MyOrderList}
        options={{
          title: 'My Orders',
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white', //Set Header text color
          headerTitleStyle: {
            // fontWeight: 'bold', //Set Header text style
          },
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          title: strings.ORDERDETAIL,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="OrderTrack"
        component={OrderTrack}
        options={{
          title: strings.ORDERTRACK,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />

      <RootStack.Screen
        name="RaiseComplain"
        component={RaiseComplain}
        options={{
          title: strings.RAISECOMPLAIN,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />

    </RootStack.Navigator>
  );
}

/**
 * ------------------------------------------------------------------------------
 * Cart Stack Screens
 * ------------------------------------------------------------------------------
 */
function CartStackScreens() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Cart"
        component={Cart}
        options={{
          title: strings.CART,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white', //Set Header text color
          headerTitleStyle: {
            // fontWeight: 'bold', //Set Header text style
          },
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name="SelectAddress"
        component={SelectAddress}
        options={{
          title: strings.SELECTADDRESS,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="medicinedetail"
        component={MedicineDetail}
        options={{
          title: "Medicine Details",
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="addressForm"
        component={AddressForm}
        options={{
          title: strings.ADD_NEW_ADDRESS,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="OrderTrack"
        component={OrderTrack}
        options={{
          title: strings.ORDERTRACK,
          headerShown: true,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white',
        }}
      />
    </RootStack.Navigator>
  );
}

/**
 * ------------------------------------------------------------------------------
 * User Profile Stack Screens
 * ------------------------------------------------------------------------------
 */
function UserProfileStackScreens() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: strings.PROFILE,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerTintColor: 'white', //Set Header text color
          headerTitleStyle: {
            // fontWeight: 'bold', //Set Header text style
          },
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="contact"
        component={Contact}
        options={{
          title: strings.CONTACTUS,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="favorite"
        component={Favorite}
        options={{
          title: strings.FAVORITE,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="about"
        component={About}
        options={{
          title: strings.ABOUTUS,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="feedback"
        component={Feedback}
        options={{
          title: strings.FEEDBACK,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="selectLanguage"
        component={SelectLanguage}
        options={{
          title: strings.LANGUAGE,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="addressList"
        component={AddressList}
        options={{
          title: strings.ADDRESS_TITLE,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="addressForm"
        component={AddressForm}
        options={{
          title: strings.ADD_NEW_ADDRESS,
          headerStyle: {
            backgroundColor: AppTheme.APPCOLOR.PRIMARY, //Set Header color
          },
          headerShown: true,
          headerTintColor: 'white',
        }}
      />
    </RootStack.Navigator>
  );
}

/**
 * ------------------------------------------------------------------------------
 * TabBar Navigator
 * ------------------------------------------------------------------------------
 */
function TabNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // unmountOnBlur: true,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return (
              <Image
                source={require(iconHome)}
                style={[
                  {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    // backgroundColor:'blue',
                    tintColor: color,
                  },
                ]}
              />
            );
          } else if (route.name === 'Notification') {
            return (
              <Image
                source={require(iconNotification)}
                style={[
                  {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    // backgroundColor:'blue',
                    tintColor: color,


                  },
                ]}
              />
            );
          } else if (route.name === 'My Orders') {
            return (
              <Image
                source={require(iconOrders)}
                style={[
                  {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    tintColor: color,
                  },
                ]}
              />
            );
          } else if (route.name === 'Profile') {
            return (
              <Image
                source={require(iconProfile)}
                style={[
                  {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    // backgroundColor:'blue',
                    tintColor: color,
                  },
                ]}
              />
            );
          } else {
            return (
              <Image
                source={require(iconCart)}
                style={[
                  {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    // backgroundColor:'blue',
                    tintColor: color,
                  },
                ]}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: AppTheme.APPCOLOR.TabBarActiveColor,
        inactiveTintColor: AppTheme.APPCOLOR.TabBarInactiveColor,
      }}>
      <Tab.Screen name="Home" component={DashboardStackScreens} options={{ unmountOnBlur: true, }} />
      {/* <Tab.Screen name="Notification" component={NotificationStackScreens} /> */}

      <Tab.Screen
        name="Notification"
        component={NotificationStackScreens}
        options={{
          tabBarBadge: Singleton.getInstance().NotificationCounter,
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen name="My Orders" component={MyOrderStackScreens} options={{ unmountOnBlur: true }} />

      <Tab.Screen
        name="Cart"
        component={CartStackScreens}
        options={{
          tabBarBadge: Singleton.getInstance().CartCount,
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen name="Profile" component={UserProfileStackScreens} options={{ unmountOnBlur: true, }} />
    </Tab.Navigator>
  );
}

/**
 * ------------------------------------------------------------------------------
 * Main Application Router
 * Navigation + Tab Bar example link
 * https://dev.to/easybuoy/combining-stack-tab-drawer-navigations-in-react-native-with-react-navigation-5-da
 * ------------------------------------------------------------------------------
 */
const Router = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="splash"
          component={Splash}
          options={{
            title: 'Splash', //Set Header Title
            headerStyle: {
              backgroundColor: 'purple', //Set Header color
            },
            headerTintColor: 'white', //Set Header text color
            headerTitleStyle: {
              // fontWeight: 'bold', //Set Header text style
            },
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="login"
          component={Login}
          options={{
            title: 'Login', //Set Header Title
            headerStyle: {
              backgroundColor: 'purple', //Set Header color
            },
            headerTintColor: 'white', //Set Header text color
            headerTitleStyle: {
              // fontWeight: 'bold', //Set Header text style
            },
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="registration"
          component={Registration}
          options={{
            title: 'Registration', //Set Header Title
            headerStyle: {
              backgroundColor: 'purple', //Set Header color
            },
            headerTintColor: 'white', //Set Header text color
            headerTitleStyle: {
              // fontWeight: 'bold', //Set Header text style
            },
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="dashboard"
          component={TabNavigator}
          options={{
            title: 'Dashboard', //Set Header Title
            headerStyle: {
              // backgroundColor: 'purple', //Set Header color
            },
            headerTintColor: 'white', //Set Header text color
            headerTitleStyle: {
              // fontWeight: 'bold', //Set Header text style
            },
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="forgotpassword"
          component={Forgotpassword}
          options={{
            title: 'Forgot password',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
