import Base from './base';

export default class Order extends Base {

  /**
   * 获取订单列表
   *
   * @static
   * @param {*} { }
   * @returns
   * @memberof Order
   */
  static async queryOrderList({ uid, status, searchText, oid }) {
    let params = {
      uid: uid,
      searchText: searchText,
      oid: oid || '',
    }
    if (status !== undefined) {
      params.status = status;
    }
    return await this.get(`/orders`, params, {
      baseURL: this.phpUrl,
    });
  }

  /**
   * 保存订单信息
   *
   * @static
   * @param {*} { uid: 用户id }
   * @returns
   * @memberof DiscountCoupon
   */
  static async saveUserProductOrder(obj) {
    return await this.post('/wx/order/saveUserProductOrder',obj, {
      baseURL: this.baseUrl,
    });
  }


  /**
   * 删除订单信息
   *
   * @static
   * @param {*} { oid: 订单id }
   * @returns
   */
  static async deleteOrderByOid({ id }) {
    return await this.get('/orders/del', {
      id
    }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * 签收
   *
   * @static
   * @memberof Order
   */
  static orderReceive(onumber) {
    return this.get('/orders/receive', {
      onumber
    }, {
      baseURL: this.phpUrl,
    });
  }

  /**
   * 计算运费
   *
   * @static
   * @param {*} { province, weight }
   * @returns
   * @memberof Order
   */
  static getFreight({ province, weight, price }) {
    return this.post('/orders/freight', {
      province,
      weight,
      price: Number(price) || 0,
    }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * 创建订单
   *
   * @static
   * @param {*} { plist, address, uid, type, odesc, did, dprice,lprice }
   * @returns
   * @memberof Order
   */
  static phpCreateOrder({ plist, address, uid, type, odesc, did, dprice,lprice }) {
    return this.post('/orders/create', {
      plist,
      address,
      uid,
      type,
      odesc,
      did,
      dprice,
      lprice,
    }, {
      baseURL: this.phpUrl,
    })
  }


  /**
   * 获取我的团购列表
   *
   * @static
   * @param {*} { uid }
   * @returns
   * @memberof Order
   */
  static getMyTeamList({ uid }) {
    return this.get('/orders/mygroup', {
      uid,
    }, {
      baseURL: this.phpUrl,
    });
  }


  static getEveryOrderNum({ uid }) {
    return this.get('/orders/total', {
      uid,
    }, {
      baseURL: this.phpUrl,
    });
  }
}
