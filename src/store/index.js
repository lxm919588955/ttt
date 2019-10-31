import Vue from 'vue';
import Vuex from 'vuex';
import product from './product';
import UserApi from '@/api/user';
import cart from "./cart";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {},  // 用户信息
    isAuth: false,  // 是否授权
  },
  mutations: {
    // 设置用户信息
    setUserInfo: (state, payload) => {
      const newUserInfo = {
        ...state.userInfo,
        ...payload
      };
      state.userInfo = newUserInfo;
      // 保存一份进缓存
      mpvue.setStorageSync('userInfo', newUserInfo);
    },
    // 设置授权状态
    setAuth: (state, payload) => {
      state.isAuth = payload;
    },
  },
  actions: {
    // 授权
    async getToken (context, payload) {
      try {
        const res = await UserApi.getToken(payload);
        context.commit('setUserInfo', res.data);
        mpvue.setStorageSync('token', res.data.token);
        let pages = getCurrentPages();
        if (pages.length) {
          if (pages[pages.length - 1].route == 'pages/auth/index') {
            mpvue.reLaunch({
              url: '/pages/home/index'
            });
          }
        }
      } catch (error) {
        if (error) {
          mpvue.showToast({
            title: '授权失败，请重试',
            icon: 'none'
          });
        }
        // let pages = getCurrentPages();
        // if (pages.length) {
        //   if (pages[pages.length - 1].route !== 'pages/auth/index') {
        //     mpvue.navigateTo({
        //       url: '/pages/auth/index'
        //     });
        //   }
        // }
      }
    },
  },
  modules: {
    product,
    cart
  }
});

export default store;
