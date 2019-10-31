import Base from './base';

export default class Product extends Base {

  /**
   * 获取团购列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量 }
   * @returns
   * @memberof Product
   */
  static async queryTeamProductlist() {
    return await this.get('/products/group', {
    }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * 获取秒杀列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量 }
   * @returns
   * @memberof Product
   */
  static async querySecondProductlist() {
    return await this.get('/products/seckill', {
    }, {
      baseURL: this.phpUrl,
    });
  }

  /**
   * 获取首页商品列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量 }
   * @returns
   * @memberof Product
   */
  static async getIndexProductList({ pageNum, pageSize, cid }) {
    return await this.get('/wx/index/productList', {
      pageNum: pageNum,
      pageSize: pageSize,
      cid: cid,
    }, {
      baseURL: this.baseUrl,
    });
  }
  /**
   * 获取商品列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量 ,cid: 产品大类}
   * @returns
   * @memberof Product
   */
  static async getProductListByCid({ pageNum, pageSize, cid }) {
    return await this.get('/wx/index/productListByCid', {
      pageNum: pageNum,
      pageSize: pageSize,
      cid: cid,
    }, {
      baseURL: this.baseUrl,
    });
  }
  /**
   * 获取商品大类列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量}
   * @returns
   * @memberof Product
   */
  static async getCategoriesList({ pageNum, pageSize }) {
    return await this.get('/wx/index/categoriesList', {
      pageNum: pageNum,
      pageSize: pageSize
    }, {
      baseURL: this.baseUrl,
    });
  }
  /**
   * 获取商品评论列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量}
   * @returns
   * @memberof Comment
   */
  static async getProductCommentList({ pageNum, pageSize,pid }) {
    return await this.get('/wx/index/productCommentList', {
      pageNum: pageNum,
      pageSize: pageSize,
      pid: pid
    }, {
      baseURL: this.baseUrl,
    });
  }
  /**
   * 获取商品详细信息
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量 }
   * @returns
   * @memberof Product
   */
  static async getProductDetails({ productId }) {
    return await this.get('/wx/index/productDetail', {
      productId: productId,
    }, {
      baseURL: this.baseUrl,
    });
  }
 /**
   * 查询商品库存
   *
   * @static
   * @param {*} { pid: 产品id }
   * @returns
   * @memberof Product
   */
  static async getProductReserve({ productId }) {
    return await this.get('/wx/index/productReserveTotal', {
      productId: productId,
    }, {
      baseURL: this.baseUrl,
    });
  }

    /**
   * 获取商品优惠券信息
   *
   * @static
   * @param {*} { pid: 商品id }
   * @returns
   * @memberof DiscountCoupon
   */
  static async getDiscountCouponList(id) {
    return await this.get('/discounts/product',{ id }, {
      baseURL: this.phpUrl,
    });
  }





  /**
   * php 获取分类
   *
   * @static
   * @param {*} { id }
   * @returns
   * @memberof Product
   */
  static phpGetCategories(id = 0) {
    return this.get('/cates/tree2', { id }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * php 获取商品
   *
   * @static
   * @memberof Product
   */
  static phpGetProductByCid({cid, child=true, page=1, sum=10}) {
    return this.get('/products/cid', {
      cid,
      child,
      page,
      sum
    }, {
      baseURL: this.phpUrl,
    });
  }

  static phpGetProductDetail(id) {
    return this.get('/products/detail', { id }, {
      baseURL: this.phpUrl,
    });
  }
}
