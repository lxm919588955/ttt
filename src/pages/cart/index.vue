<template>
  <div class="page-cart">
    <section>
      <ul class="cart-list" v-if="cartList[0]">
        <li
          v-for="item in cartList"
          :key="item.id"
          :style="item.style"
          :data-style="item.style">
          <div
            class="item"
            @touchstart="(e) => touchStart(item.id, e)"
            @touchmove="(e) => touchMove(item.id, e)"
            @touchend="(e) => touchEnd(item.id, e)"
          >
            <div @click="checkOne(item.id)" class="check">
              <img :src="item.checked?'/static/images/checked.png':'/static/images/unchecked.png'" />
            </div>
            <img @click="goDetail(item.pid)" class="item-img" :src="item.product.cover || '/static/images/product.jpg'" />
            <div class="content">
              <div class="params">
                <p class="title">{{item.product.pname}}</p>
                <span class="weight">规格: {{item.product.metering}}{{item.product.unit}}</span>
              </div>
              <div class="money">
                <span class="price">￥{{item.product.pprice}}</span>
                <i-input-number
                  :value="item.num"
                  min="0"
                  max="100"
                  @change="fieldChange(item, 'quantity', $event)"
                />
              </div>
            </div>
          </div>
          <div class="btn-group">
            <div
              class="btn-delete"
              @click="deleteChat(item.id)">删除</div>
          </div>
        </li>
      </ul>
      <empty-list v-else></empty-list>
    </section>
    <footer>
      <div class="total">
        <div @click="selectAll" class="select-all">
          <img :src="isSelectAll?'/static/images/checked.png':'/static/images/unchecked.png'" />
          <span>全选</span>
        </div>
        <div class="total-money">
          总计: <span>{{totalPrice}}</span>
        </div>
      </div>
      <div class="buy" @click="goBuy">结算</div>
    </footer>
  </div>
</template>
<script>
import cartApi from '../../api/cart';
import productApi from '../../api/product';
import EmptyList from '@/components/emptyList';
import { mapState } from 'vuex';
export default {
  components: {
    EmptyList
  },
  data() {
    return {
      loading: false,  // 是否正在请求
      isEmpty: false, // 是否没有更多数据了
      cartList: [], // 购物车列表
      page: 1,  // 当前页码
      size: 20,  // 每页数量
    };
  },
  computed: {
    ...mapState(['userInfo']),
    totalPrice() {
      let totalPrice = this.cartList.reduce((total, item) => {
        if (item.checked) {
          return total + item.product.pprice*item.num;
        } else {
          return total;
        }
      }, 0);
      return totalPrice.toFixed(2);
    },
    // 是否全选
    isSelectAll() {
      return !this.cartList.some(item => !item.checked);
    },
  },
  onShow() {
    this._initMove();
    this.isEmpty = false;
    this._getList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this._reFresh();
  },
    // 上拉触底
  onReachBottom() {
    if (!this.isEmpty) {
      this._addMore();
    }
  },
  methods: {
    // 改变字段值
    fieldChange(cart, field, e) {
      if (this.loading) return;
      this.loading = true;
      if (!e.mp.detail.value) {
        this.deleteChat(cart.id);
        this.loading = false;
        return;
      }
      // 获取产品库存
      productApi
        .getProductReserve({ productId: cart.pid })
        .then(res  => {
          if (e.mp.detail.value <= res.data) {
            return Promise.resolve();
          } else {
            // 库存不足
            throw new Error('库存不足');
          }
        })
        .then(res => {
          // 更新购物车
          return cartApi.updateCart({
            id: cart.id,
            num: e.mp.detail.value,
          });
        })
        .then(res => {
          // 设置购买数量
          this.cartList.find(item => item.id === cart.id).num = e.mp.detail.value;
        })
        .catch(err => {
          if (err) {
            mpvue.showToast({
              title: err.message + '',
              icon: 'none',
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    checkOne(id) {
      this.cartList = this.cartList.map(item => {
        return {
          ...item,
          checked: item.id === id ? !item.checked : item.checked
        }
      });
      console.log(this.cartList)
    },
    selectAll() {
      this.cartList = this.cartList.map(item => {
        return {
          ...item,
          checked: this.isSelectAll ? false : true,
        }
      });
    },
    deleteChat(id) {
      mpvue.showModal({
        title: '提示',
        content: '确定删除该条数据？',
        success: (res) => {
          if (res.confirm) {
            this._removeOne(id);
          } else if (res.cancel) {
            this._initMove();
          }
        }
      });
    },
    // 查看详情
    goDetail(pid) {
      this.$router.push({
        path: '/pages/productDetail/index',
        query: {pid:pid}
      });
    },
    _initMove() {
      this.cartList = this.cartList.map(item => {
        return {
          ...item,
          style: ''
        };
      });
    },
    // 结算
    goBuy(){
      const checkedList = this.cartList
        .filter(item => item.checked)
        .map(item => {
          return {
            pid: item.pid,
            pname: item.product.pname,
            pnum: item.num,
            weight: item.product.weight,
            pprice: item.product.activity_price || item.product.pprice,
            cover: item.product.cover,
          }
        });
      if (!checkedList.length) {
        mpvue.showToast({
          title: '请选择商品',
          icon: 'none',
        });
        return;
      }
      mpvue.setStorageSync('tempCartList', checkedList);
      // 跳转到 下单页面
      this.$router.push({
        path: '/pages/orderForm/index',
        query: { type: 0 }
      });
    },
    // 触碰开始，重置偏移量，使滑块归位
    touchStart(id, e) {
      this._initMove();
      const startPageX = e.touches[0].pageX;
      const startPageY = e.touches[0].pageY;
      this.startPageX = startPageX;
      this.startPageY = startPageY;
    },
    // 控制滑块移动
    touchMove(id, e) {
      const currentPageX = e.touches[0].pageX;
      const currentPageY = e.touches[0].pageY;
      let width = this.startPageX - currentPageX;
      let heigh = this.startPageY - currentPageY;
      // 判断角度小于30度为水平滑动，大于30度为垂直滑动
      const minTan = Math.tan(30 / 180 * Math.PI);
      const tan = Math.abs(heigh / width);
      if (tan <= minTan  && !this.direction) {
        this.direction = 'horizontal';
      } else if (tan > minTan && !this.direction) {
        this.direction = 'vertical';
      }
      if (this.direction == 'horizontal') {
        // 水平滑动时阻止body上下滚动
        e.preventDefault();
        e.stopPropagation();
        if (width > 75) width = 75;
        if (width < 0) width = 0;
        let newCartList = this.cartList;
        const currentData = newCartList.find(item => item.id === id);
        currentData.style = `transform: translateX(${-width}px)`;
        this.cartList = newCartList;
      }
    },
    // 抬手时将滑块移至最佳位置，全部展示或全部隐藏
    touchEnd(id, e) {
      console.log('end', id, e);
      const endPageX = e.mp.changedTouches[0].pageX;
      const endWidth = this.startPageX - endPageX;
      if (this.direction === 'horizontal') {
        const current = this.cartList.find(item => item.id === id);
        if (endWidth <= 30) {
        // 加个判空，防止重复赋值引起的抖动
          if (current) {
            current.style = `transform: translateX(0px)`;
          }
        } else {
          current.style = `transform: translateX(-75px)`;
        }
      }
      this.direction = '';
    },
    // 刷新
    _reFresh() {
      this.page = 1;
      this.isEmpty = false;
      this._getList();
    },
    _addMore() {
      this.page += 1;
      this._getList();
    },
    // 获取列表
    async _getList(addFlag) {
      if (this.isEmpty || this.loading) return;
      this.loading = true;
      try {
        const res = await cartApi.getCartList({ uid: this.userInfo.uid });
        const cartList = res.data;
        if (cartList.length < this.size) {
          this.isEmpty = true;
        }
        this.cartList = cartList;
        this._initMove();
      } catch (error) {
        if (!error) return;
        mpvue.showToast({
          title: error.message,
          icon: 'none'
        });
      }
      this.loading = false;
      wx.stopPullDownRefresh();

    },
    // 删除
    async _removeOne(id) {
      try {
        const res = await cartApi.deleteCart({ id: id });
        this._initMove();
        setTimeout(() => {
          this.cartList = this.cartList.filter(item => item.id !== id);
          this._initMove();
        }, 300);
      } catch (error) {
        if (!error) return;
        mpvue.showToast({
          title: error.message,
          icon: 'none'
        });
      }
    }
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
