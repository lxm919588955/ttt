import Base from './base';

export default class Cart extends Base {

  /**
   * 获取订单列表
   *
   * @static
   * @param {*} { pageNum: 页数, pageSize: 每页数量, type: 订单类型 0：未付款，1：代发货3：待收货,6：已完成,8: 全部 }
   * @returns
   * @memberof Order
   */
  static getCartList({ uid }) {
    return this.get('/trolleys', {
      uid
    }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * 添加到购物车
   *
   * @static
   * @memberof Cart
   */
  static addToCart({ uid, pid, num }) {
    return this.post('/trolleys/create', {
      uid,
      pid,
      num,
    }, {
      baseURL: this.phpUrl,
    });
  }



  /**
   * 更新购物车
   *
   * @static
   * @param {*} { id, num }
   * @returns
   * @memberof Cart
   */
  static updateCart({ id, num }) {
    return this.post('/trolleys/update', { id, num }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * 删除购物车
   *
   * @static
   * @param {*} { id }
   * @returns
   * @memberof Cart
   */
  static deleteCart({ id }) {
    return this.get('/trolleys/del', { id }, {
      baseURL: this.phpUrl,
    });
  }
}
