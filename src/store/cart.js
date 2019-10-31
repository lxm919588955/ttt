import cartApi from '../api/cart';

const cart = {
  namespaced: true,
  state: {
    cartList: [],  // 购物车列表
    loading: false,  // 是否正在加载中
    address: {}
  },
  mutations: {
    // 设置购物车列表
    setCartList(state, payload) {
      state.cartList = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setAddress(state, payload) {
      state.address = payload;
    },
  },
  actions: {
    // 调用接口示例
    async getCartList(context, payload) {
      context.commit('setLoading', true);
      try {
        const res = await cartApi.getCartList(payload);
        context.commit('setCartList', res.data);
      } catch (error) {
        context.commit('setCartList', []);
      }
      context.commit('setLoading', false);
    }
  }
}

export default cart;
