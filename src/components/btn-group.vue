<template>
  <div class="btn-group">
    <a v-for="(item, index) in levels" :key="index" :href="'/pages/welcome/level'+item+'/index'"><image class="item" :src="'http://47.96.86.167/cfh_images/picture/level'+item+'.png'" /></a>
    <a class="share" @click="share"><button class="item" open-type="share"></button></a>
  </div>
</template>

<script>
export default {
  props: {
    levels: Array
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onShareAppMessage() {

  },
  methods: {
    share() {
      console.log(11);
    }
  }
}
</script>

<style lang="scss">
.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40rpx;
  .item {
    width: 210rpx;
    height: 210rpx;
  }
}
.share {
  button {
    background-color: transparent;
    background-image: url(http://47.96.86.167/cfh_images/btn/share.png);
    background-size: 100% 100%;
    &::after {
      border: none;
    }
  }
}
</style>
