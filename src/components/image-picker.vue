<template>
  <div class="c-image-picker">
    <div v-for="(item, index) in sourceData" :key="index" class="img-wrapper">
      <i-icon size="28" type="delete_fill" color="#666666" @click="() => remove(index)" />
      <img class="photo" :src="item">
    </div>
    <div v-if="showAdd" class="add" @click="takePhoto">
      <i-icon type="add" color="#666666" size="40" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sourceData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
    }
  },
  computed: {
    showAdd() {
      return this.sourceData.length < 9;
    }
  },
  methods: {
    takePhoto() {
      mpvue.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          const newSourceData = this.sourceData.concat(tempFilePaths);
          this.$emit('add', newSourceData);
        }
      })
    },
    remove(index) {
      this.$emit('remove', index);
    }
  }

}
</script>
<style lang="scss">
.c-image-picker {
  display: flex;
  flex-wrap: wrap;
  .img-wrapper {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border-radius: 10rpx;
    margin: 25rpx;
    i-icon {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 999;
    }
    .photo {
      width: 100%;
      height: 100%;
      border-radius: 10rpx;
    }
  }
  .add {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10rpx;
    border: 1rpx dashed #666666;
    width: 200rpx;
    height: 200rpx;
    margin: 25rpx;
  }
}
</style>
