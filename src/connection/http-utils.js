import { call } from 'react-native-reanimated';
import Singleton from '../helper/Singleton';
import ApiParams from './api-urls';
import CryptoJS from 'react-native-crypto-js';
import NetInfo from '@react-native-community/netinfo';

export default {
  async isNetConnected() {
    return await NetInfo.fetch().then((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      return state.isConnected;
    });
  },
  get kk() {
    return CryptoJS.enc.Utf8.parse('Z4NMqZEvvScXIxwk');
  },

  get ii() {
    return CryptoJS.enc.Utf8.parse('vg96EmbXrpPSICat');
  },

  encrypt(info) {
    return new Promise((resolve) => {
      let data = info;
      let encData = CryptoJS.AES.encrypt(data, this.kk, {
        iv: this.ii,
      }).toString();
      resolve(encData);
    });
  },

  decrypt(raw) {
    return new Promise((resolve) => {
      let decData = CryptoJS.AES.decrypt(raw, this.kk, { iv: this.ii }).toString(
        CryptoJS.enc.Utf8,
      );
      resolve(JSON.parse(decData));
    });
  },

  getUserPassword(user, password) {
    const obj = { user: '', pwd: '' };
    if (password && user) {
      const no = this.randomIntFromInterval();
      obj.user = String(no) + user;
      obj.pwd = this.makeid(no) + password;
    }
    return obj;
  },

  randomIntFromInterval() {
    // min and max included
    return Math.floor(Math.random() * (9 - 1 + 1) + 1);
  },

  makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*()';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  encryptedString(str, req, token) {
    const str2 = str.length / 2 - 1;
    const str3 = Number(str2) > 10 ? 10 : str2;
    const res = str.substr(str2, str3);
    const newStringArray = str.split('');
    newStringArray.splice(str2, str3);
    var obj = {
      req: newStringArray.join(''),
      token: res,
    };
    return obj;
  },

  encrpt(data) {
    return CryptoJS.AES.encrypt(data, this.kk, { iv: this.ii }).toString();
  },

  decrpt(raw) {
    let decData = CryptoJS.AES.decrypt(raw, this.kk, { iv: this.ii }).toString(
      CryptoJS.enc.Utf8,
    );
    return JSON.parse(decData);
  },

  getToken() {
    Singleton.getInstance()
      .getToken()
      .then((jsonValue) => {
        // console.log(jsonValue);
        return jsonValue;
      });
  },

  async authApi(login) {
    let body =
      'grant_type=password&username=' +
      login.username +
      '&password=' +
      login.password +
      '&client_id=moblieApp';
    console.log(body);
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      const response = await fetch(ApiParams.API_URLS.DEVELOPMENT + 'token', {
        method: ApiParams.METHODS.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });
      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      // console.log(finalResponse);
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },

  async getRequest(endpoint) {
    console.warn(Singleton.getInstance().AccessToken)
    this.getToken();
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      const response = await fetch(ApiParams.API_URLS.DEVELOPMENT + endpoint, {
        method: ApiParams.METHODS.GET,
        headers: {
          accept: 'application/json',
          'Content-Type': ApiParams.CONTENT_TYPE.APPLICATION_JSON,
          Authorization: Singleton.getInstance().AccessToken,
        },
      });

      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },

  async simplePostRequest(endpoint, params) {
    console.warn(endpoint, params)
    // console.log(ApiParams.API_URLS.LIVE + endpoint, params);
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      const response = await fetch(ApiParams.API_URLS.DEVELOPMENT + endpoint, {
        method: ApiParams.METHODS.POST,
        headers: {
          accept: '*/*',
          'Content-Type': ApiParams.CONTENT_TYPE.APPLICATION_JSON,
        },
        body: JSON.stringify(params),
      });
      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      // console.log(finalResponse);
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },

  async postRequest(endpoint, params) {
    // console.warn(endpoint, params)
    this.getToken();
    // console.log(Singleton.getInstance().AccessToken)
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      const response = await fetch(ApiParams.API_URLS.DEVELOPMENT + endpoint, {
        method: ApiParams.METHODS.POST,
        headers: {
          accept: '*/*',
          'Content-Type': ApiParams.CONTENT_TYPE.APPLICATION_JSON,
          Authorization: Singleton.getInstance().AccessToken,
        },
        body: JSON.stringify(params),
      });
      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      // console.log("update api response >>>>>>>>>>");
      // console.log(finalResponse);
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },

  async simpleGetRequest(endpoint, params) {
    console.warn(endpoint, params)
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      const response = await fetch(ApiParams.API_URLS.DEVELOPMENT + endpoint, {
        method: ApiParams.METHODS.GET,
        headers: {
          Accept: 'application/json',
          'Content-Type': ApiParams.CONTENT_TYPE.APPLICATION_JSON,
        },
        body: JSON.stringify(params),
      });
      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },

  async genTransRequest(params) {
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      console.log(params);
      const response = await fetch("http://115.124.96.40:8090/api/cart/paymenttest?amount=" + params.amount + "&orderId=" + params.orderId, {
        method: ApiParams.METHODS.GET,
        headers: {
          Accept: 'application/json',
          'Content-Type': ApiParams.CONTENT_TYPE.APPLICATION_JSON,
        },
        // body: JSON.stringify(params),
      });
      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },

  async addItemToCart(medicineId, qty) {
    let params = {
      ProductId: medicineId,
      Qty: qty,
    };
    console.warn('api/cart/addtocart', params)
    this.getToken();
    var isConnected = await this.isNetConnected();
    if (isConnected) {
      const response = await fetch(
        ApiParams.API_URLS.DEVELOPMENT + 'api/cart/addtocart',
        {
          method: ApiParams.METHODS.POST,
          headers: {
            accept: '*/*',
            'Content-Type': ApiParams.CONTENT_TYPE.APPLICATION_JSON,
            Authorization: Singleton.getInstance().AccessToken,
          },
          body: JSON.stringify(params),
        },
      );
      var responseJson = await response.json();
      var finalResponse = {
        jsonHeaders: response.headers,
        jsonResponse: responseJson,
      };
      // console.log(finalResponse);
      return finalResponse;
    } else {
      var finalResponse = {
        jsonResponse: {
          status: false,
          message: 'Please check your internet connection !!',
        },
      };
      // console.log(finalResponse);
      throw finalResponse;
    }
  },
};
