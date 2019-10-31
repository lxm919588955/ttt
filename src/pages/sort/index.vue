<template>
  <div class="page-category">
    <scroll-view scroll-y class="sidebar">
      <ul class="category-list">
        <li
          v-for="item in categories"
          :key="item.cid"
          :class="['item', (item.cid==currentCategory.cid || item.cid==currentCategory.pid)?'isActive':'']"

        >
          <div class="item-wrap" @click="chooseCategory(item)">
            <!-- <img class="cate-img img0" :src="'http://' + item.url" /> -->
            <span class="cate-name">{{item.cname}}</span>
          </div>
          <ul class="child-list" v-show="item.cid==currentCategory.cid || item.cid==currentCategory.pid">
            <li
              :class="['item-wrap', 'child-item', i.cid==currentCategory.cid?'isActive':'']" v-for="(i,index1) in item.child"
              :key='index1'
              @click="chooseCategory(i)"
            >
              <span class="cate-name">• {{i.cname}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll-view>
    <scroll-view scroll-y class="product-list" @scrolltolower="addMore">
      <p class="category-title">{{currentCategory.cname}}</p>
      <div class="item" @click="goDetail(item.pid)" v-for="item in products" :key="item">
        <img v-if="!item.cover" src="/static/images/product.jpg" />
        <img v-else :src="item.cover" />
        <div class="content">
          <p class="title">{{item.pname}}</p>
          <div class="product-footer">
            <div class="num">规格 {{item.metering}}{{item.unit}}</div>
            <div class="price">￥{{item.activity_price == null ? item.pprice : item.activity_price}}</div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
  import { numFormat } from '@/utils/index';
  import productApi from '../../api/product'
export default {
  data () {
    return {
      firstLoad: true,  // 是否第一次加载
      loading: false, // 是否正在加载
      categories: [],
      currentCategory: {},
      products: [],
      page: 1,
      size: 10,
      isEmpty: true,
    }
  },
  computed: {
  },
  async onLoad() {
    await this._getCategoriesList();
    const tempCategory = mpvue.getStorageSync('tempCategory');
    this.chooseCategory(tempCategory || this.categories[0]);
    mpvue.removeStorageSync('tempCategory');
    this.firstLoad = false;  // 因为onLaod是异步,所以这一步必定在onshow之后
  },
  onShow() {
    if (!this.firstLoad) {
      const tempCategory = mpvue.getStorageSync('tempCategory');
      this.chooseCategory(tempCategory || this.currentCategory);
      mpvue.removeStorageSync('tempCategory');
    }
  },
  methods: {
    // 选择分类
    chooseCategory(current) {

      if (current.cid === this.currentCategory.cid) return;
      this.currentCategory = current;

    console.log(this.currentCategory)
      this._getProductList(current.cid);

    },
    // 加载更多
    addMore() {
      this._getProductList(this.currentCategory.cid, true);
    },
    // 获取商品列表
    async _getProductList(cid, isAdd){
      if (isAdd) {
        // 加载更多但是没有数据时直接返回
        if (this.isEmpty) return;
        this.page += 1;
      } else {
        this.isEmpty = false;
        this.page = 1;
      }
      try {
        const res = await productApi.phpGetProductByCid({
          cid: cid,
          page: this.page,
          size: this.size,
        });
        if (res.data.length < this.size) {
          this.isEmpty = true;
        }
        if (isAdd) {
          // 下拉加载
          this.products = this.products.concat(res.data);
        } else {
          // 刷新
          this.products = res.data;
        }
      } catch (err) {
        if (!err) return;
        mpvue.showToast({
          title: err.message,
          icon: 'none'
        });
      }
    },
    // 获取分类列表
    async _getCategoriesList(){
      try {
        const res = await productApi.phpGetCategories();
        this.categories = res.data.map(item => {
          return {
            cid: item.cid,
            cname: item.cname,
            url: item.url,
            child: item.child.map(c => {
              return {
                cid: c.cid,
                cname: c.cname,
                url: c.url,
                pid: item.cid,
              }
            }),
          }
        });
      } catch (error) {
        if (!err) return;
        mpvue.showToast({
          title: err.message,
          icon: 'none'
        });
      }
    },
    _getProductListByCid(cid){
      productApi._getProductListByCid({
        pageNum: 0,
        pageSize:50,
        cid: cid
      }).then(res =>{
        if(res.code === 0){
          this.products = res.data.list
          // 设置销量
          this.products.forEach(item => item.saleTotal = numFormat(item.saleTotal, 'W'))
        }
      }).catch(() => {
      })
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
.sidebar .category-list .cate-img{
    background: none;
}
</style>
