<template>
  <div class="page-myself">
    <section class="user-info">
      <template v-if="userInfo.token">
        <img class="user-avatar" :src="userInfo.avatarUrl">
        <div class="user-name">用户名：{{userInfo.nickName}}</div>
        <div class="user-id">用户id：{{userInfo.uid}}</div>
      </template>
      <template v-else>
        <button
          class="btn-into"
          open-type="getUserInfo"
          @getuserinfo="getUserinfo"
        >点击登录</button>
      </template>
      <!-- <div class="iconfont icon-settings"></div> -->
    </section>
    <section>
      <i-notice-bar
        icon="systemprompt"
        background-color="#ffffff"
        loop
      >为了保障您及时获取订单信息和更多优惠,请绑定手机号</i-notice-bar>
    </section>
    <div class="big-border"></div>
    <section class="grid">
      <i-cell-group>
          <i-cell title="我的订单" value="查看全部订单" url="/pages/orderList/index?type=all" is-link>
          </i-cell>
      </i-cell-group>
      <div class="grid flex-box">
        <div class="grid-item" @click="goOrder('pay')">
          <i-badge :count="orderNumObj.pay||0" overflow-count="99">
            <div class="iconfont icon-pay"></div>
            <p>待付款</p>
          </i-badge>
        </div>
        <div class="grid-item" @click="goOrder('send')">
          <i-badge :count="orderNumObj.deliver||0" overflow-count="99">
            <div class="iconfont icon-send"></div>
            <p>待发货</p>
          </i-badge>
        </div>
        <div class="grid-item" @click="goOrder('receive')">
          <i-badge :count="orderNumObj.receive||0" overflow-count="99">
            <div class="iconfont icon-deliver"></div>
            <p>待收货</p>
          </i-badge>
        </div>
        <div class="grid-item" @click="goOrder('comment')">
          <i-badge :count="orderNumObj.comment||0" overflow-count="99">
            <div class="iconfont icon-comment1"></div>
            <p>待评价</p>
          </i-badge>
        </div>
        <button class="grid-item service" open-type="contact" @contact="handleContact">
          <i-badge count="0" overflow-count="99">
            <div class="iconfont icon-service"></div>
            <p>客服</p>
          </i-badge>
        </button>
      </div>
    </section>
    <div class="big-border"></div>
    <section class="discount cell-group">
      <i-cell-group>
        <i-cell @click="goTeamList" title="我的团购" is-link>
          <div class="iconfont icon-tuangou" slot="icon"></div>
        </i-cell>
        <i-cell @click="goCouponList" title="我的优惠券" is-link>
          <div class="iconfont icon-ticket" slot="icon"></div>
          <!-- <span class="cell-value" slot="footer">3</span> -->
        </i-cell>
        <!-- <i-cell title="签到有奖" is-link>
          <div class="iconfont icon-present" slot="icon"></div>
          <span class="cell-value" slot="footer">今日未签到</span>
        </i-cell> -->
        <!-- <i-cell title="邀请好友领券" is-link>
          <div class="iconfont icon-friendadd" slot="icon"></div>
        </i-cell> -->
      </i-cell-group>
    </section>
    <div class="big-border"></div>
    <section class="about cell-group">
      <i-cell-group @click="goAddress">
        <i-cell title="我的收货地址" is-link>
          <div class="iconfont icon-footprint" slot="icon"></div>
        </i-cell>
        <!-- <i-cell title="关于我们" is-link>
          <div class="iconfont icon-info" slot="icon"></div>
        </i-cell> -->
      </i-cell-group>
    </section>
  </div>
</template>
<script>
import OrderApi from '@/api/order';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  data () {
    return {
      name: "个人中心",
      orderNumObj: {},
    }
  },

  computed: {
    ...mapState(['userInfo']),
  },
  onShow() {
    this.getEveryOrderNum();
  },
  methods: {
    ...mapMutations([ 'setUserInfo', 'setAuth', 'setAddress' ]),
    ...mapActions(['getToken']),
    getUserinfo(res) {
      console.log(res)
      if (res.mp.detail.encryptedData) {
        // 授权成功
        this.setUserInfo(res.mp.detail.userInfo);
        mpvue.getUserInfo({
          success: res => {
            const nick = res.userInfo.nickName;
            const avatarUrl = res.userInfo.avatarUrl;
            mpvue.login({
              success: res => {
                console.log('code', res.code);
                console.log('userInfo', this.userInfo);
                this.setAuth(true);
                const code = res.code;
                // 授权接口调用
                this.getToken({
                  code: code,
                  nick: nick,
                  avatar: avatarUrl,
                });
              }
            });
          }
        });
      }
    },
    async getEveryOrderNum() {
      try {
        const res = await OrderApi.getEveryOrderNum({ uid: this.userInfo.uid });
        this.orderNumObj = res.data;
      } catch (err) {
        if (err) {
          mpvue.showToast({
            title: err.message + '',
            icon: 'none',
          });
        }
      }

    },
    goOrder(type) {
      this.$router.push({
        path: '/pages/orderList/index',
        query: { type: type}
      });
    },
    // 去我的优惠券列表
    goCouponList() {
      this.$router.push({
        path: '/pages/myCoupon/index',
        query: {
          isShowAll: true,
        },
      });
    },
    // 联系客服
    handleContact(e) {
      console.log(e)
    },
    // 去团购列表
    goTeamList() {
      this.$router.push({
        path: '/pages/myTeamList/index',
      });
    },
        // 选择收获地址
    goAddress() {
      mpvue.chooseAddress({
        success: (res) => {
          const defaultAddress = {
            contacts: res.userName,
            phone: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            district: res.countyName,
            desc: res.detailInfo,
            postalCode: res.postalCode
          };
          this.setAddress(defaultAddress);
          mpvue.setStorageSync('defaultAddress', defaultAddress);
        }
      });
    },
  }
}
</script>
<style lang="scss">
page {
  background: #f3f3f3;
}
.page-myself {
  .user-info {
    color: #ffffff;
    position: relative;
    padding-top: 50rpx;
    text-align: center;
    font-size: 14px;
    background: url('http://114.67.68.162/static/imgs/mine-bg0.jpg') 100% 100%;
    height: 312rpx;
    .btn-into {
      margin-top: 120rpx;
      margin-bottom: 15rpx;
      border-radius: 45rpx;
      background: -webkit-linear-gradient(left, #f8956a , #e98053);
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
    }
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-bottom: 15rpx;
    }
    .user-name {
      margin-bottom: 15rpx;
    }
    .icon-settings {
      position: absolute;
      top: 50rpx;
      right: 30rpx;
      color: #ffffff;
      font-size: 58rpx;
    }
  }
  .grid {
    border-top: 1rpx solid #f3f3f3;
    background: #ffffff;
    .grid {
      padding: 20rpx 0;
    }
    .grid-item {
      padding-top: 12rpx;
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #494949;
      .iconfont {
        font-size: 54rpx;
        padding-bottom: 10rpx;
      }
      &.service {
        color: #fca64a;
        border-left: 1rpx solid #eaeaea;
        position: relative;
        display: inline-block;
        margin: 0;
        padding: 12rpx 0 0 0;
        box-sizing: border-box;
        font-size: 14px;
        line-height: inherit;
        border-radius: 0;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        background-color: #ffffff;
        &::after {
          border: none;
        }
      }
    }
  }
  .discount, .about {
    .iconfont {
      font-size: 55rpx;
    }
    .cell-value {
      color: #fca64a;
    }
  }
}
</style>
