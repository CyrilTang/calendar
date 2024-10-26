<template>
	<view>
		<!-- 加载中提示 -->
		<view v-if="!isDataLoaded" style="text-align: center; margin-top: 200rpx;">
			<image src="/static/loading.gif" style="width: 100rpx; height: 100rpx;"></image>
			<text>加载中...</text>
		</view>
		<!-- 数据加载完毕后的内容 -->
		<view v-else style="text-align: center;">
			<image :src="path" mode="widthFix" show-menu-by-longpress></image>
			<l-painter ref="painter" isCanvasToTempFilePath @success="onPosterSuccess" hidden
				css="width: 1200rpx; padding-bottom: 40rpx; background: linear-gradient(,#ffffff 0%, #ffffff 100%);">
				<l-painter-view
					css="margin-left: 40rpx; margin-top: 30rpx; padding: 32rpx; box-sizing: border-box; background: #fff; border-radius: 16rpx; width: 1100rpx; box-shadow: 0 20rpx 58rpx rgba(0,0,0,.15)">
					<l-painter-image src="https://imgapi.cn/api.php?zd=zsy&fl=fengjing&gs=images"
						css="object-fit: cover; object-position: 50% 50%; width: 1035rpx; height: 1200rpx; border-radius: 12rpx;" />
					<l-painter-view
						css="margin-top: 32rpx; color: #FF0000; font-weight: bold; font-size: 28rpx; line-height: 1em;">
						<l-painter-text text="每日一句" css="vertical-align: bottom" />
					</l-painter-view>
					<l-painter-view
						css="margin-top: 32rpx; color: #FF0000; font-weight: bold; font-size: 28rpx; line-height: 1em;">
						<l-painter-text :text="dates.words"
							css="line-clamp: 1;vertical-align: bottom;  font-weight: normal;  color: #999999;width:450rpx" />
					</l-painter-view>

					<l-painter-view css="">
						<l-painter-text
							css="line-clamp: 2;color: #333333; line-height: 2em; font-size: 40rpx; width: 850rpx; padding-right:32rpx; box-sizing: border-box"
							:text="dates.mmdd"></l-painter-text>
						<l-painter-text
							css="margin-top:-40rpx;line-clamp: 2; color: #333333; line-height: 2em; font-size: 36rpx; width: 850rpx;padding-top:20rpx; padding-right:32rpx; box-sizing: border-box"
							:text="dates.date"></l-painter-text>
						<l-painter-image src="https://www.example.com/"
							css="object-fit: cover; object-position: 50% 50%; width: 200rpx; height: 200rpx; border-radius: 50%;margin-top:-220rpx;margin-left:800rpx" />

					</l-painter-view>

				</l-painter-view>
			</l-painter>
			<view class="" style="margin-bottom: 20rpx;margin-top: 20rpx;">
				<button type="default" size="mini" @click="saveImg">长按图片保存至相册</button>
			</view>
			<ad unit-id="adunit-038b796be04fbfd1" ad-type="video" ad-theme="white" bindload="adLoad" binderror="adError"
				bindclose="adClose"></ad>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			path: '',
			dates: {
				mmdd: '',
				date: '',
				words: ''
			},
			changeDate: '',
			isDataLoaded: false // 新增的数据加载状态标志
		};
	},
	onLoad(e) {
		console.log(e);
		this.changeDate = e.parm;
		console.log(this.changeDate);
	},
	onReady() {
		this.loadData();
	},
	methods: {
		async loadData() {
			uni.showLoading({
				title: '加载中'
			});

			try {
				await this.fetchData();
				await this.generatePoster();
			} catch (error) {
				console.error('加载失败', error);
			} finally {
				uni.hideLoading();
				this.isDataLoaded = true;
			}
		},
		fetchData() {
			let _this = this;
			return new Promise((resolve, reject) => {
				// 获取数据
				uni.request({
					url: "https://example.com?" + "date=" + _this.changeDate,
					success(res) {
						_this.dates.mmdd = res.data.traditionalcal;
						_this.dates.date = res.data.week_day + '   ' + res.data.constellation;
						_this.loadYiyan().then(resolve).catch(reject);
					},
					fail(reject) {
						reject();
					}
				});
			});
		},
		loadYiyan() {
			let _this = this;
			return new Promise((resolve, reject) => {
				uni.request({
					url: "https://example.com/index.php",
					success(res) {
						_this.dates.words = res.data;
						resolve();
					},
					fail(reject) {
						reject();
					}
				});
			});
		},
		generatePoster() {
			return new Promise((resolve, reject) => {
				this.$nextTick(() => { // 确保组件已经渲染
					if (this.$refs.painter && this.$refs.painter.canvasToTempFilePath) {
						this.$refs.painter.canvasToTempFilePath({
							fileType: "jpg",
							quality: 1,
							success: (res) => {
								this.path = res.tempFilePath;
								resolve();
							},
							fail: (err) => {
								console.error('生成海报失败', err);
								reject(err);
							}
						});
					} else {
						console.error('Painter组件未正确初始化');
						reject(new Error('Painter组件未正确初始化'));
					}
				});
			});
		},
		saveImg() {
			// 保存图片到相册
			uni.saveImageToPhotosAlbum({
				filePath: this.path,
				success: function() {
					console.log('save success');
				},
				fail: (err) => {
					console.error('保存失败', err);
				}
			});
		},
		onPosterSuccess(event) {
			this.path = event;
		}
	}
}
</script>
<style lang="less">
	page {
		background-color: white;
	}
</style>