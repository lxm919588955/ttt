<template>
  <div class="index-window">
    <div class="window">
      <p class="window__title">恭喜获得<span> {{couponList.length}} </span>张优惠券</p>
      <div class="top">
        <div class="coupon-list">
          <div class="item" v-for="(item, index) in couponList" :key="index">
            <div class="left">
              <h2 class="discount"><span>￥</span><span>{{item.value-0}}</span></h2>
              <p class="rule">满{{item.condition}}元可用</p>
            </div>
            <div class="center">
              <p class="title">{{item.name}}</p>
              <p class="date-line">{{item.expired_time ? ('有效期至'+item.expired_time) : '不过期'}}</p>
            </div>
            <div class="right"><h3>已领取</h3></div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="btn" @click="close">进店看看</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    couponList: Array,
  },
  methods: {
    close() {
      this.$emit('on-close');
    }
  }
}
</script>
<style lang="scss" scoped>
.index-window {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 200rpx 100rpx 0;
  background-color: rgba(0, 0, 0, .6);
  z-index: 9997;
  .window {
    width: 550rpx;
    .window__title {
      background-color: #ff3d4e;
      text-align: center;
      padding-top: 50rpx;
      color: #ffffff;
      font-size: 24rpx;
      border-radius: 40rpx 40rpx 0 0;
      span {
        color: #ffe7c6;
        font-size: 32rpx;
      }
    }
    .top {
      position: relative;
      z-index: 9999;
      overflow-y: scroll;
      width: 550rpx;
      height: 320rpx;
      background-color: #ff3d4e;
      /* border-color: #000 transparent transparent transparent; */
      border-radius: 90%/0 0 80px 80px;
      .coupon-list {
        padding: 20rpx 0;
        .item {
          display: flex;
          width: 460rpx;
          height: 133rpx;
          background-image: url('http://114.67.68.162/static/imgs/coupon-bg1.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          margin: 0 auto;
          margin-bottom: 10rpx;
          &.expire {
            background-image: url('http://114.67.68.162/static/imgs/coupon-bg2.png');
            .center,.right {
              color: #999999;
            }
          }
          .left {
            width: 146rpx;
            color: #ffffff;
            text-align: center;
            .discount {
              padding-top: 14rpx;
              font-weight: bold;
              span:first-child {
                font-size: 28rpx;
              }
              span:last-child {
                font-size: 32rpx;
              }
            }
            .rule {
              padding-top: 10rpx;
              font-size: 20rpx;
            }
          }
          .center {
            width: 260rpx;
            padding-left: 40rpx;
            .title {
              padding: 18rpx 0 0;
              font-size: 28rpx;
              color: #333333;
              font-weight: bold;
            }
            .date-line {
              font-size: 22rpx;
              color: #999999;
            }
          }
          .right {
            width: 54rpx;
            font-size: 20rpx;
            color: #ff7d55;
            align-self: center;
            h3 {
              width: 30rpx;
              padding-left: 20rpx;
            }
          }
        }
      }
    }
    .bottom {
      position: relative;
      z-index: 9996;
      width: 550rpx;
      height: 120rpx;
      background-color: #fd5c6a;
      margin-top: -80rpx;
      border-radius: 0 0 40rpx 40rpx;
      padding-top: 120rpx;
      .btn {
        width: 400rpx;
        height: 80rpx;
        border-radius: 50rpx;
        background-color: #fddbab;
        margin: 0 auto;
        line-height: 80rpx;
        text-align: center;
        color: #ff3d4e;
        font-size: 32rpx;
        border: 2rpx solid #ff3d4e;
      }
    }
  }
}
</style>
