<template>
	<view class="content">
		<!-- 轮播图组件 -->
		<XsuuSwiper :swiperItems="swiperItems" />

		<!-- 节假日轮播 -->
		<view class="festival">
			<uni-section titleFontSize="24rpx" titleColor="#00234a" :sub-title="sentence"
				:title="combinedArray.join(',  ')" type="line" />
		</view>

		<!-- 心情选择日历 -->
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="changeDate"
			:selected="info.selected" :lunar="info.lunar" @change="handleDateChange" />

		<!-- 更多功能 -->
		<uni-section title="更多" type="line" padding>
			<uni-grid :column="3" :show-border="false" :square="false" @change="handleGridChange">
				<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<image class="image" :src="item.url" mode="aspectFill" />
						<text class="text">{{ item.text }}</text>
						<view v-if="item.badge" class="grid-dot">
							<uni-badge :text="item.badge" :type="item.type" />
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</uni-section>
	</view>
</template>

<script>
	import XsuuSwiper from '../../components/Xss-swiper/Xsuu-swiper.vue';

	export default {
		components: {
			XsuuSwiper
		},
		data() {
			return {
				fullDate: '',
				options: ['😀', '😁', '🤬', '🙂', '🙃', '🥰'], // 选择项
				selectedIndex: 0, // 当前选中的索引
				sentence: '',
				currentIndex: 0,
				currentAnimation: 'opacity: 1; transition: opacity 0.5s ease-in-out;',
				combinedArray: [],
				swiperItems: [{
						img: 'https://bg1.png',
						title: '',
						Subtitle: '',
						tip: '',
						url: '/pages/details/details'
					},
					{
						img: 'https://bg2.png',
						title: '宜',
						Subtitle: '',
						tip: '',
						url: ''
					},
					{
						img: 'https://bg3.png',
						title: '彭祖百忌',
						Subtitle: '',
						tip: '',
						url: ''
					},
					{
						img: 'https://bg4.png',
						title: '',
						Subtitle: '',
						tip: '',
						url: ''
					}
				],
				showCalendar: true,
				info: {
					lunar: true,
					range: true,
					insert: true,
					selected: []
				},
				dynamicList: [],
				list: [{
						url: '/static/lhl.png',
						text: '老黄历',
						badge: '0',
						type: 'primary'
					},
					{
						url: '/static/my.png',
						text: '摸鱼工具',
						badge: '1',
						type: 'success'
					},
					{
						url: '/static/mm.png',
						text: '美满打卡',
						badge: 'hot',
						type: 'warning'
					},
					{
						url: '/static/retire.png',
						text: '退休计算',
						badge: '2',
						type: 'error'
					},
					{
						url: '/static/wall.png',
						text: '壁纸'
					},
					{
						url: '/static/bloodtype.png',
						text: '血型查询'
					}
				],
				calendar: {},
				changeDate: '',
				content: '',
				slaryRate: 1
			};
		},
		onReady() {
			this.showCalendar = true;
		},
		onLoad() {
			this.getCurrentDate();
			this.loadLocalData();
			this.getChineseC();
			this.checkLocalDatas();
			this.fetchYiYan();
		},
		methods: {
			fetchYiYan() {
				uni.request({
					url: 'https://timor.tech/api/holiday/tts/tomorrow',
					success: (res) => {
						this.sentence = res.data.tts;
					},
					fail: (err) => {
						console.error('Error fetching quote:', err);
					}
				});
			},
			shareToTimeline() {
				wx.shareAppMessage({
					title: '小美满日历',
					path: '/pages/index/index',
					success: () => {
						console.log('分享到朋友圈成功');
					},
					fail: (res) => {
						console.log('分享到朋友圈失败', res);
					}
				});
			},
			getCurrentDate() {
				this.changeDate = new Date().toISOString().slice(0, 10);
			},
			getChineseC() {
				const url = `/lunar/demo.php?date=${this.changeDate}`;
				this.$get(url).then((res) => {
					this.calendar = res;
					this.updateSwiperItems(res);
					this.combinedArray = [
						...res.festival,
						...res.otherFestival,
						...res.ylfestival,
						...res.ylotherFestival
					];
				}).catch((error) => {
					console.error('请求失败:', error);
				});
			},
			updateSwiperItems(res) {
				this.swiperItems[0].title = res.calendar;
				this.swiperItems[0].Subtitle = `${res.traditionalcal}   ${res.week_day}   ${res.shichen}时`;
				this.swiperItems[1].Subtitle = res.yi.join(', ');
				this.swiperItems[2].Subtitle = res.pangshu;
				this.swiperItems[3].title = `上一节气: ${res.prejieqi}`;
				this.swiperItems[3].Subtitle = `下一节气: ${res.nextjieqi}`;
				this.slaryRate = res.slaryRate;
			},
			handleDateChange(e) {
				const selectedDate = e.fulldate;

				if (selectedDate === this.changeDate) {
					uni.showActionSheet({
						itemList: this.options,
						success: (res) => {
							this.selectedIndex = res.tapIndex;
							this.updateSelected(selectedDate, this.selectedIndex);
						},
						fail: (err) => {
							console.error('选择失败:', err);
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '只能定义今日心情哦'
					});
				}
			},

			updateSelected(date, selectedIndex) {
				const existingIndex = this.info.selected.findIndex(item => item.date === date);
				if (existingIndex !== -1) {
					// 更新已存在的记录
					this.info.selected[existingIndex] = {
						date: date,
						info: this.options[selectedIndex]
					};
				} else {
					// 添加新记录
					this.info.selected.push({
						date: date,
						info: this.options[selectedIndex]
					});
				}
				this.saveLocalData();
			},
			saveLocalData() {
				try {
					uni.setStorageSync('moodData', JSON.stringify(this.info));
				} catch (e) {
					console.error('保存数据失败:', e);
				}
			},
			loadLocalData() {
				try {
					const data = uni.getStorageSync('moodData');
					if (data) {
						this.info = JSON.parse(data);
					}
				} catch (e) {
					console.error('加载数据失败:', e);
				}
			},
			handleGridChange(e) {
				switch (e.detail.index) {
					case 0:
						this.goOldAlmanac();
						break;
					case 1:
						this.goMoyuTool();
						break;
					case 2:
						this.goPost();
						break;
					case 4:
						this.goPicture();
						break;
					case 5:
						this.goBloodType();
						break;
					default:
						uni.showToast({
							title: '待开发',
							icon: 'error'
						});
				}
			},
			goOldAlmanac() {
				uni.redirectTo({
					url: `/pages/oldalmanac/oldalmanac?parm=${this.changeDate}`
				});
			},
			goMoyuTool() {
				uni.navigateToMiniProgram({
					appId: 'wx37da2c80f978c546'
				});
			},
			goPost() {
				uni.redirectTo({
					url: `/pages/post/post?parm=${this.changeDate}`
				});
			},
			goPicture() {
				uni.redirectTo({
					url: '/pages/picture/picture'
				});
			},
			goRetire() {
				uni.redirectTo({
					url: '/pages/retire/retire'
				});
			},
			goBloodType() {
				uni.redirectTo({
					url: '/pages/bloodtype/bloodtype'
				});
			},
			checkLocalDatas() {
				// 检查本地数据的逻辑
			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: white;
	}

	.picker {
		margin-top: 20px;
		text-align: center;
	}

	.festival {
		width: 92%;
		border-radius: 15rpx;
		box-shadow: -1px 0px 5px 5px rgba(100, 100, 111, 0.07);
		margin: 0 auto;
		margin-top: 20rpx;
	}

	.chinesetext {
		margin-top: 20rpx;
		padding: 0% 4%;

		.chinseseContent {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: break-word;
			white-space: normal;
			margin-top: 5rpx;
		}
	}

	.image {
		width: 25px;
		height: 25px;
	}

	.text {
		font-size: 14px;
		margin-top: 5px;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	.grid-dynamic-box {
		margin-bottom: 15px;
	}

	.grid-item-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.grid-dot {
		position: absolute;
		top: 5px;
		right: 15px;
	}

	.swiper {
		height: 420px;

		/* 响应式设计 */
		@media screen and (min-width: 768px) and (max-width: 1425px) {
			height: 630px;
		}

		@media screen and (min-width: 1425px) {
			height: 830px;
		}
	}
</style>