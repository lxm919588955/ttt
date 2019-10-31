<script>
import { mapActions, mapMutations } from 'vuex';
import style from './common/style/main.css';
export default {
  mpType: 'app',
  data() {
    return {
      isColdStart: false,  // 是否为冷启动
    }
  },
  onLaunch() {
    this.isColdStart = true;
    const userInfo = mpvue.getStorageSync('userInfo');
    this.setUserInfo(userInfo);
  },
  onShow() {
    this.login();
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    ...mapActions(['getToken']),
    async login() {
      const isAuth = await this.isAuth();
      const token = mpvue.getStorageSync('token');
      if (!isAuth) {
        // 未授权 并且是 冷启动
        if (this.isColdStart) {
          this.isColdStart = false;
          mpvue.removeStorageSync('token');
          mpvue.removeStorageSync('userInfo');
          if (this.$router.currentRoute.path !== '/pages/auth/index') {
            this.$router.push({
              path: '/pages/auth/index'
            });
          }
        }
      } else {
        // 已授权，静默登录
        mpvue.getUserInfo({
          success: (res) => {
            const nick = res.userInfo.nickName;
            const avatarUrl = res.userInfo.avatarUrl;
            mpvue.login({
              success: (res) => {
                const code = res.code;
                // 授权接口调用
                this.getToken({
                  code: code,
                  nick: nick,
                  avatar: avatarUrl,
                });
              },
              fail: (err) => {
                mpvue.showToast({
                  title: '授权失败，请重试',
                  icon: 'none'
                });
              }
            });
          },
          fail: (err) => {
            mpvue.showToast({
              title: '授权失败，请重试',
              icon: 'none'
            });
          }
        });
      }
      // else {
      //   // 已授权跳转到首页
      //   console.log('已授权&&未过期');
      //   let pages = getCurrentPages();
      //   if (pages.length) {
      //     if (pages[pages.length - 1].route == 'pages/auth/index') {
      //       mpvue.reLaunch({
      //         url: '/pages/home/index'
      //       });
      //     }
      //   } else {
      //     mpvue.reLaunch({
      //       url: '/pages/home/index'
      //     });
      //   }
      // }
    },
    // 是否已经获取权限
    isAuth() {
      return new Promise((resolve, reject) => {
        mpvue.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              this.$store.commit('setAuth', true);
              mpvue.getUserInfo({
                success: (res) => {
                  this.$store.commit('setUserInfo', res.userInfo);
                }
              });
              resolve(true);
            } else {
              console.log('未授权');
              this.$store.commit('setAuth', false);
              resolve(false);
            }
          },
          fail: (err) => {
            this.$store.commit('setAuth', false);
            resolve(false);
          }
        });
      });
    }
  }
}
</script>
<style lang="scss">
page {
  color: #333333;
}
.big-border {
  height: 18rpx;
  background: #f3f3f3;
}
.flex-box {
  display: flex;
}
</style>

