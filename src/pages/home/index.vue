<template>
  <div class="page-home">
    <!-- tab BEGIN -->
    <i-switch></i-switch>
    <section class="header">
      <i-tabs
        i-class="tabs"
        current="index"
        color="#ec5c05"
        >
          <i-tab key="index" title="首页"></i-tab>
          <i-tab @click="handleTabChange" key="team" title="团购"></i-tab>
        </i-tabs>
    </section>
    <!-- tab END -->
    <!-- 轮播 BEGIN -->
    <section class="swiper">
      <swiper
        :indicator-dots="true"
        :autoplay="true"
      >
        <div v-for="(item, index) in banner" :key="index">
          <swiper-item>
            <img :src="item.cover" class="slide-image" />
          </swiper-item>
        </div>
      </swiper>
    </section>
    <!-- 轮播 END -->
    <!-- 折扣专区 BEGIN -->
    <img class="discount-title" src="http://114.67.68.162/static/imgs/discount-title-bg0.jpg" />
    <scroll-view scroll-x>
    <section class="discount-list">
      <div class="item" v-for="item in secondProducts" :key="item.pid">
        <img :src="item.cover || '/static/images/product.jpg'" class="prod-img" />
        <div class="content">
          <div class="deadline">
            <!-- <img src="/static/images/deadline.png" /> -->
            <dead-line :timeStramp="item.activity && item.activity.end_time"/>
          </div>
          <p class="title">{{item.pname}}</p>
          <div class="money">
            <span class="price">￥{{item.activity_price}}</span>
            <span class="origin-price">￥{{item.pprice}}</span>
            <span class="more" @click="goDetail(item.pid)">查看详情</span>
          </div>
        </div>
      </div>
    </section>
    </scroll-view>
    <!-- 折扣专区 END -->
    <!-- 视频栏 BEGIN -->
    <section class="media">
      <video
        id="myVideo"
        :src="videoUrl"
        controls
        :poster="index_video_background"
      ></video>
    </section>
    <!-- 视频栏 END -->
    <!-- 分类 BEGIN -->
    <section class="categories">
      <div class="item" v-for="(item, c_index) in categoryList" :key="item.cid" v-if="item.prolist.length">
        <div
          class="cat-title"
        >
          <div>
            <img :src="item.url" alt="">
            {{item.cname}}
          </div>
          <div @click="goCategoryPage(item, item.cid)">
            <span class="cat-more-title">更多</span>
            <i-icon class="cat-more" type="enter" />
          </div>
        </div>
        <scroll-view scroll-x>
          <div class="categories2">
            <block v-for="(i,c_index1) in item.child" :key="i.cid">
              <div
                class="categories2-item"
                @click="goCategoryPage(i, item.cid)"
                v-if="c_index1 < 4"
              >
                <img :src="i.url" alt="">
                <span href="">{{i.cname}}</span>
              </div>
            </block>
          </div>
        </scroll-view>
        <div class="product-list">
          <div
            class="product-item"
            @click="goDetail(product.pid)"
            v-for="(product, p_index) in item.prolist"
            :key="product.pid">
            <div>
              <img v-if="product.cover_type !== 2" :src="product.cover || '/static/images/product.jpg'" />
              <video v-else :src="product.cover"  controls ></video>
              <p class="title">{{product.pname}}</p>
              <p class="price">￥{{product.pprice}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 分类 END -->
    <index-window v-if="windowVisible" :couponList="discount" @on-close="windowClose"></index-window>
  </div>
</template>
<script>
import deadLine from '@/components/deadLine.vue';
import productApi from '../../api/product';
import CommentApi from '@/api/comment';
import IndexWindow from '@/components/indexWindow';
import { mapState } from 'vuex';
export default {
  components: {
    deadLine,
    IndexWindow
  },
  data () {
    return {
      windowVisible: false,
      currentTab: 'index',  // 当前tab页
      banner: [],
      categoryList: [],
      videoUrl: '',
      index_video_background: '',
      secondProducts: [],
      discount: [],
      catColors: ['#1eaffe', '#fe4251', '#0354fd', '#fd7d00']
    }
  },
  computed: {
    ...mapState(['userInfo']),
  },
  onLoad() {
    // this.getCategories();
    const redirectUrl = this.$route.query.redirect;
    if (redirectUrl) {
      this.$router.push({
        path: decodeURIComponent(redirectUrl)
      });
    }
    this.getRecomment();
  },
  methods: {
    windowClose() {
      this.windowVisible = false;
    },
    async getRecomment() {
      try {
        const res = await CommentApi.getIndexRecommend({ uid: this.userInfo.uid });
        this.banner = res.data.banner;
        this.videoUrl = res.data.index_video;
        this.index_video_background = res.data.index_video_background;
        this.categoryList = res.data.cate;
        this.secondProducts = res.data.product;
        this.discount = res.data.discount;
        if (this.discount && this.discount.length) {
          this.windowVisible = true;
        }
      } catch (error) {
        console.log(err);
        if (!err) return;
        mpvue.showToast({
          title: err.message,
          icon: 'none'
        });
      }
    },
    // 点击分类
    goCategoryPage(cate, pid) {
      mpvue.setStorageSync('tempCategory', { ...cate, pid });
      this.$router.push({
        path: '/pages/sort/index',
        isTab: true,
      });
    },
    // 改变tab页
    handleTabChange() {
      this.$router.push({
        path: '/pages/team/index'
      });
    },
    // 查看详情
    goDetail(pid) {
      this.$router.push({
        path: '/pages/productDetail/index',
        query: {pid:pid}
      });
    }
  }
}
</script>
<style lang="scss">
@import './index.scss';
.categories2 {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 10rpx;
}
.categories2-item{
  width: 200rpx;
  text-align: center;
  font-size: 28rpx;
  box-sizing: border-box;
  margin-bottom: 15rpx;
  border-right: 2rpx #686868 dashed;
  &:last-child {
    border-right: none;
  }
}
.categories2-item img{
  display: block;
  width: 50rpx;
  height: 50rpx;
  margin: 0 auto 10rpx;
}
.categories2-item span {
  white-space: nowrap;
  font-size: 22rpx;
}
.cat-title img{
  width: 30rpx;
  height: 30rpx;
}
.product-item .title{
    text-align: center;
}
</style>
