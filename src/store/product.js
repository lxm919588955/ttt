import productApi from '../api/product';

const product = {
  namespaced: true,
  state: {
    productList: [],
    indexProductList: [],
    teamProductList: [],
    loading: false
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setTeamProductList(state, payload) {
      state.productList = payload;
    },
  },
  actions: {
    // 调用接口示例
    async getTeamProductList(context, payload) {
      context.commit('setLoading', true);
      try {
        const res = await productApi.queryTeamProductlist(payload);
        context.commit('setTeamProductList', res.data);
      } catch (error) {
        context.commit('setTeamProductList', []);
      }
      context.commit('setLoading', false);
    },
    // 首页产品信息
    async getIndexProductList(context, payload) {
      context.commit('setLoading', true);
      try {
        const res = await productApi.getIndexProductList(payload);
        console.info(res)
        context.commit('setIndexProductList', res.data);
      } catch (error) {
        context.commit('setIndexProductList', []);
      }
      context.commit('setLoading', false);
    }
  }
}

export default product;
