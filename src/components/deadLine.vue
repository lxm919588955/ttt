<template>
  <div class="cfh-deadline">
    <span class="text">距结束</span>
    <div class="time"><span>{{hours}}</span>:<span>{{minutes}}</span>:<span>{{seconds}}</span></div>
  </div>
</template>
<script>
export default {
  props: {
    timeStramp: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      timer: null,
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  },
  computed: {

  },
  mounted() {
    console.log(this.timeStramp)
    let difference = (this.timeStramp - new Date().getTime() / 1000);
    this.setTime(difference);
    this.timer = setInterval(() => {
      difference -= 1;
      this.setTime(difference);
      if (difference <= 0) clearInterval(this.timer);
    }, 1000);
  },
  beforeDestory() {
    clearInterval(this.timer);
  },
  methods: {
    setTime(time) {
      if (time <= 0) {
        return;
      }
      const hours = Math.floor(time / 60 / 60);
      const minutes = Math.floor((time - hours * 60 * 60) / 60);
      const seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
      this.hours = hours < 10 ? '0' + hours : hours;
      this.minutes = minutes < 10 ? '0' + minutes : minutes;
      this.seconds = seconds < 10 ? '0' + seconds : seconds;
    }
  }
}
</script>
<style lang="scss" scoped>
.cfh-deadline {
  width: 210rpx;
  height: 40rpx;
  background: #ed5b06;
  font-size: 10px;
  color: #ffffff;
  display: flex;
  border-radius: 8rpx;
  align-items: center;
  justify-content: space-around;
  .text {
    font-weight: bold;
  }
  .time {
    span {
      display: inline-block;
      color: #ed5b06;
      background: #ffffff;
      padding: 0 4rpx;
      border-radius: 10rpx;
      margin: 0 4rpx;
    }
  }
}
</style>
