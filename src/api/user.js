import Base from './base';

export default class User extends Base {

  /**
   * 登录获取token
   *
   * @static
   * @param {*} { code: 小程序code, nick: 用户昵称 }
   * @returns
   * @memberof User
   */
  static async getToken({ code, nick, avatar }) {
    return await this.get('/wx/login', {
      code: code,
      nick: nick,
      avatar: avatar,
    });
  }


  /**
   * 绑定手机号
   *
   * @static
   * @param {*} { phone: 用户手机号 }
   * @returns
   * @memberof User
   */
  static async bindPhone({ phone }) {
    return await this.post(`/wx/bind/${phone}`, {}, {
      baseURL: this.baseUrl,
    });
  }


  /**
   * 获取用户已拥有优惠券信息
   *
   * @static
   * @returns
   * @memberof User
   */
  static async getDiscountUserList(id) {
    return await this.get('/discounts/user', { id }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   *  领取优惠券
   *
   * @static
   * @param {*} { uid: 用户id, did: 优惠券id }
   * @returns
   * @memberof User
   */
  static async receiveCoupon({ uid, did }) {
    return await this.post('/wx/index/insertUserDiscounut',{
      uid,
      did,
    }, {
      baseURL: this.baseUrl,
    });
  }

  /**
   * 获取用户收获地址
   *
   * @static
   * @param {*} { uid: 用户id }
   * @returns
   * @memberof address
   */
  static async getAddressList(obj) {
    return await this.get('/wx/index/addressList',obj, {
      baseURL: this.baseUrl,
    });
  }

  /**
   * 支付订单
   *
   * @static
   * @param {*} { uid: 用户id }
   * @returns
   * @memberof DiscountCoupon
   */
  static async generateOrder(obj) {
    return await this.post('/wx/order/pay/'+obj.oid,{}, {
      baseURL: this.baseUrl,
      // baseURL: 'http://zxr.free.idcfengye.com',
    });
  }
}
