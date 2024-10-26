<template>
	<view class="container" style="text-align: center;">
		<image :src="path" mode="widthFix" show-menu-by-longpress></image>
		<l-painter ref="painter"  isCanvasToTempFilePath @success="path = $event" hidden
			css="width: 1300rpx; padding-bottom: 40rpx; background: linear-gradient(,#ffffff 0%, #ffffff 100%);position: relative;">
			<l-painter-view
				css="margin-left:60rpx; margin-top: 30rpx; padding: 32rpx; box-sizing: border-box; background: #fff; border-radius: 16rpx; width: 1200rpx; box-shadow: 0 20rpx 58rpx rgba(0,0,0,.15)">
				<!-- <l-painter-image :src="moyu"
					css="object-fit: cover; object-position: 50% 50%; width:1040rpx; height:1616rpx; border-radius: 12rpx;" /> -->
				<l-painter-image src="https://dayu.qqsuu.cn/moyuribao/apis.php"
					css="object-fit: cover; object-position: 50% 50%; width:1140rpx; height:2000rpx; border-radius: 12rpx;" />
				<l-painter-image src=""
					css="  position: absolute; bottom: 350rpx;right:170rpx;  object-fit: cover; object-position: 50% 50%; width:200rpx; height:200rpx;" /></l-painter-view>
			<l-painter-image src="/static/apha.png"
				css="object-fit: cover; object-position: 50% 50%; width: 200rpx; height:30rpx;margin-top:-140rpx;margin-left:179rpx" />
				<l-painter-image src="/static/apha.png"
					css="object-fit: cover; object-position: 50% 50%; width: 200rpx; height:20rpx;margin-top:-1785rpx;margin-left:179rpx" />
			</l-painter-view>

		</l-painter>
		<view class="" style="margin-bottom: 20rpx;margin-top: 20rpx;">
			<button type="default" size="mini">长按图片保存至相册</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				moyu: '',
				path: '',
			};
		},
	
		onLoad() {

			uni.showLoading({
				title: '加载中',
				success() {
					setTimeout(() => {
						uni.hideLoading(); // 修改数据，触发视图更新
					}, 10000); // 3000毫秒后执行
				}
			})


		},
		methods: {
	


		}
	}
</script>

<style lang="scss">

</style>