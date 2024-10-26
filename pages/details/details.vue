<template>
	<view class="container">
		<image style="width: 100%;" :src="imageUrl.replace('_yasuo', '')" mode="widthFix"></image>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			:direction="direction" @trigger="trigger" />
	</view>
</template>

<script>
	export default {

		data() {
			return {
				rewardedVideoAd: null, //激励视频广告
				imageUrl: '',
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				is_color_type: false,
				content: [{
						iconPath: '/static/icon/up.png',
						selectedIconPath: '/static/icon/up-active.png',
						text: '上一页',
						active: false
					},
					{
						iconPath: '/static/icon/home.png',
						selectedIconPath: '/static/icon/home-active.png',
						text: '首页',
						active: false
					},
					{
						iconPath: '/static/icon/download.png',
						selectedIconPath: '/static/icon/download-active.png',
						text: '下载',
						active: false
					}
				]
			};
		},
		onLoad(e) {
			this.imageUrl = e.imageUrl
			this.initRewardedVideoAd();
			this.realImageUrl = e.realImageUrl; // 假设 realImageUrl 也是从上一个页面传递过来的参数
		},
		methods: {

			trigger(e) {
				this.content[e.index].active = !e.item.active
				console.log(e);
				if (e.index == 2) {
					// 使用方法示例
					this.checkAuth()
				} else if (e.index == 1) {
					uni.redirectTo({
						url: '/pages/index/index'
					})
				} else {
					uni.navigateBack({
						delta: 1,
						// 返回的页面数，如果是1表示返回上一级页面，可以根据需求调整
						success: function() {
							console.log('返回上一页成功');
						},
						fail: function(error) {
							console.error('返回上一页失败', error);
						}
					});
				}

			},
			// 初始化激励视频广告
			initRewardedVideoAd() {
				if (uni.createRewardedVideoAd) {
					this.rewardedVideoAd = uni.createRewardedVideoAd({
						adUnitId: 'adunit-65fb3ebcb540b2c8' // 替换为你的广告单元ID
					});

					this.rewardedVideoAd.onLoad(() => {
						console.log('激励视频广告加载成功');
					});

					this.rewardedVideoAd.onError((err) => {
						console.error('激励视频广告加载失败', err);
					});

					this.rewardedVideoAd.onClose((res) => {
						if (res && res.isEnded) {
							// 用户完整观看视频后，调用下载图片方法
							this.downloadImage();
						} else {
							// 用户未完整观看视频
							uni.showToast({
								icon: 'none',
								title: '请完整观看视频以获取奖励'
							});
						}
					});
				} else {
					console.error('当前环境不支持激励视频广告');
				}
			},

			// 检查授权并处理逻辑
			checkAuth() {
				uni.getSetting({
					success: (res) => {
						// 判断用户是否已经授权
						if (res.authSetting['scope.writePhotosAlbum']) {
							// 用户已授权，显示提示对话框
							this.showConfirmDialog();
						} else {
							// 用户未授权，请求授权
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									// 授权成功后，显示提示对话框
									this.showConfirmDialog();
								},
								fail: () => {
									// 如果用户拒绝授权，提示用户手动开启权限
									uni.showModal({
										title: '提示',
										content: '您尚未授权保存图片，请在设置中开启权限',
										showCancel: false,
										confirmText: '去设置',
										success: (modalRes) => {
											if (modalRes.confirm) {
												// 打开设置页面
												uni.openSetting({
													success: (settingRes) => {
														// 用户从设置页返回后，再次尝试获取授权状态
														if (settingRes
															.authSetting[
																'scope.writePhotosAlbum'
																]) {
															// 用户在设置页开启了权限，显示提示对话框
															this.showConfirmDialog();
														} else {
															// 用户没有开启权限，可做其他处理
															uni.showToast({
																icon: 'none',
																title: '请授权以使用功能'
															});
														}
													}
												});
											}
										}
									});
								}
							});
						}
					}
				});
			},

			// 显示确认对话框
			showConfirmDialog() {
				uni.showModal({
					title: '提示',
					content: '观看广告后可下载图片，是否继续？',
					confirmText: '确认',
					cancelText: '取消',
					success: (modalRes) => {
						if (modalRes.confirm) {
							// 用户点击确认，显示激励视频广告
							this.showRewardedVideoAd();
						} else if (modalRes.cancel) {
							// 用户点击取消，不做任何操作
							uni.showToast({
								icon: 'none',
								title: '已取消'
							});
						}
					}
				});
			},

			// 显示激励视频广告
			showRewardedVideoAd() {
				if (this.rewardedVideoAd) {
					this.rewardedVideoAd.load()
						.then(() => {
							return this.rewardedVideoAd.show();
						})
						.catch((err) => {
							console.error('激励视频广告加载或显示失败', err);
							uni.showToast({
								icon: 'none',
								title: '广告加载失败，请稍后再试'
							});
						});
				} else {
					console.error('激励视频广告实例未初始化');
				}
			},

			// 下载图片的方法
			downloadImage() {
				const imageUrl = this.imageUrl.replace(/\_yasuo$/, '');;
				uni.downloadFile({
					url: imageUrl,
					success: (downloadRes) => {
						if (downloadRes.statusCode === 200) {
							// 下载成功，保存图片到相册
							uni.saveImageToPhotosAlbum({
								filePath: downloadRes.tempFilePath,
								success: () => {
									uni.showToast({
										icon: 'success',
										title: '图片保存成功'
									});
								},
								fail: (saveRes) => {
									uni.showToast({
										icon: 'none',
										title: '图片保存失败'
									});
								}
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: '图片下载失败'
							});
						}
					}
				});
			}
		},
		// 分享配置
			onShareAppMessage(res) {
				return {
					title: '小美满壁纸', // 自定义分享标题
					path: `/pages/details/details?imageUrl=${this.imageUrl}`, // 自定义分享路径
			
				};
			}

	}
</script>

<style lang="scss">
	.container {
		width: 100%;

		Image {
			width: 100%;
		}
	}
</style>