<template>
  <div class="page-auth">
    <img
      class="logo"
      src="../../../static/images/nbut.jpg"
    >
    <!-- <div class="login-form">
      <div class="login-input">
        <div class="iconfont icon-user"></div>
        <input
          :value="form.username"
          type="text"
          title="账号"
          placeholder="输入账号或手机号"
          @input="(e) => fieldChange('username', e)" />
      </div>
      <div class="login-input">
        <div class="iconfont icon-lock"></div>
        <input
          :value="form.password"
          type="password"
          title="密码"
          placeholder="输入密码"
          @input="(e) => fieldChange('password', e)" />
        <div class="iconfont icon-eye-close"></div>
      </div>
    </div> -->
    <button
      class="btn-into"
      open-type="getUserInfo"
      @getuserinfo="getUserinfo"
    >授权</button>
    <div class="footer">
      <p class="tips">登录即同意<span>用户注册协议</span></p>
    </div>
    <i-toast id="toast" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { $Toast } from '../../../static/iview/base/index';
import configs from '@/utils/configs';
export default {
  data() {
    return {
      token: '',
      form: {
        username: '',
        password: ''
      }
    };
  },
  computed: {
    ...mapState(['isAuth', 'userInfo'])
  },
  async beforeMount() {
    this.token = mpvue.getStorageSync('token');
  },
  methods: {
    ...mapMutations([ 'setUserInfo', 'setAuth' ]),
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
    fieldChange(field, e) {
      this.form[field] = e.target.value;
    }
  }
}
</script>
<style lang="scss">
page {
  width: 100%;
  height: 100%;
  background-image: url('http://114.67.68.162/static/imgs/login-bg0.jpg');
  background-size: 750rpx 237rpx;
  background-repeat: no-repeat;
  background-position-y: 100%;
}
  .logo {
    display: block;
    width: 300rpx;
    height: 300rpx;
    padding-top: 50rpx;
    margin: 0 auto;
  }
  .login-input {
    font-size: 14px;
    padding: 20px 0;
    margin: 0 80rpx;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #e8e8e8;
    .iconfont {
      font-size: 23px;
      color: #adadad;
      padding: 0 20rpx;
    }
    input {
      color: #adadad;
      flex: 1;
    }
  }
  .btn-into {
    margin: 60rpx 80rpx 0;
    border-radius: 45rpx;
    background: -webkit-linear-gradient(left, #f8956a , #e98053);
    color: #ffffff;
    font-weight: 600;
    font-size: 18px;
  }
  .footer {
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 45rpx;
    .tips {
      color: #ffffff;
      font-size: 12px;
      span {
        text-decoration: underline;
      }
    }
  }
</style>
