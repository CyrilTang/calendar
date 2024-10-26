<template>
  <view>
    <view class="uni-padding-wrap uni-common-mt">
      <uni-segmented-control :current="current" :values="items" :style-type="styleType" :active-color="activeColor" @clickItem="onClickItem" :disabled="loading" />
    </view>

    <view class="content">
      <scroll-view @scrolltolower="loadMore" scroll-y style="height: 80vh;" :scroll-y="!loading">
        <view class="image-container">
          <image v-for="(image, index) in images" :key="index" :src="getImageUrl(image.name)" mode="widthFix" @click="downPic(getImageUrl(image.name))" @error="onImageError(index)" class="image-item" />
        </view>
        <uni-load-more v-if="!hasMore" status="noMore" />
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      items: ['美女', '风景', '动漫', '萌宠'],
      current: 0,
      activeColor: '#007aff',
      styleType: 'button',
      images: [],
      baseUrl: '',
      loading: false,
      hasMore: true,
      currentPage: 1,
      categories: ['girls', 'scenery', 'anime', 'pets'],
      defaultImageUrl: 'https://example.com/default-image.jpg' // 默认占位图的URL
    };
  },
  mounted() {
    this.loadLocalData();
  },
  methods: {
    getPic() {
      this.loading = true;
      uni.showLoading({
        title: '加载中'
      });

      // 模拟至少1秒的加载时间
      const startTime = Date.now();

      uni.request({
        url: '',
        data: {
          pages: this.currentPage,
          category: this.categories[this.current]
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const newData = res.data.data || [];
            if (newData.length > 0) {
              this.images = this.images.concat(newData);
              this.currentPage++;
              this.saveLocalData();
            } else {
              this.hasMore = false;
            }
          } else {
            console.error('请求失败:', res);
          }
        },
        complete: () => {
          const elapsed = Date.now() - startTime;
          const delay = Math.max(1000 - elapsed, 0);

          setTimeout(() => {
            this.loading = false;
            uni.hideLoading();
          }, delay);
        }
      });
    },
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.getPic();
      }
    },
    getImageUrl(name) {
      return `${this.baseUrl}${this.categories[this.current]}/${name}_yasuo`;
    },
    onClickItem(e) {
      console.log('Current item clicked:', e.currentIndex); // 调试信息
      if (this.current !== e.currentIndex && !this.loading) {
        this.current = e.currentIndex;
        this.images = []; // 清空图片数组
        this.currentPage = 1; // 重置当前页
        this.hasMore = true; // 重置更多标志
        this.loadLocalData(); // 尝试加载本地数据
      }
    },
    downPic(url) {
      uni.navigateTo({
        url: `/pages/details/details?imageUrl=${url}`
      });
    },
    onImageError(index) {
      // 当图片加载失败时，替换为默认占位图
      this.$set(this.images[index], 'name', 'default-image');
    },
    loadLocalData() {
      const key = `wallpaper_${this.categories[this.current]}`;
      const localData = uni.getStorageSync(key);
      if (localData) {
        const { data, timestamp } = localData;
        const currentTime = new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (currentTime - timestamp < expirationTime) {
          this.images = data;
          this.currentPage = Math.ceil(data.length / 10); // 假设每页10条数据
          this.hasMore = data.length > 0;
          this.loading = false;
          return;
        }
      }
      this.getPic(); // 如果本地数据无效或不存在，发起网络请求
    },
    saveLocalData() {
      const key = `wallpaper_${this.categories[this.current]}`;
      const dataToSave = {
        data: this.images,
        timestamp: new Date().getTime()
      };
      uni.setStorageSync(key, dataToSave);
    }
  }
};
</script>

<style lang="scss">
.uni-common-mt {
  margin-top: 30px;
}

.uni-padding-wrap {
  padding: 0 15rpx;
}

.content {
  margin-top: 10rpx;

  .image-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5px;
    /* 为左右两边留出一些间距 */
  }

  .image-item {
    border-radius: 15rpx;
    width: 32%; /* 每行显示三张图片，留出一些间距 */
    margin-bottom: 10px; /* 图片之间的垂直间距 */
    box-sizing: border-box; /* 确保边距和边框不会影响宽度 */
  }

  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #333;
  }
}
</style>