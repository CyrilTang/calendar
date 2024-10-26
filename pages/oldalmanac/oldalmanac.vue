<template>
	<view class="table-container" v-if="!loading">
		<picker v-if="isDatePickerVisible" mode="date" :value="date" @change="bindDateChange"
			@cancel="isDatePickerVisible = false">
			<view class="picker">
				{{date ? date : '日期选择'}}
			</view>
		</picker>

		<view class="one-title">
			<uni-icons type="back" size="25" color="red" @click="addOneDay(date, -1)"></uni-icons>
			<text class="calendar-lunar">
				{{ calendar.traditionalcal || '无传统历' }}
			</text>
			<uni-icons type="forward" size="25" color="red" @click="addOneDay(date, 1)"></uni-icons>
		</view>
		<view class="ganzhi">
			<text>{{calendar.yearganzhi}} {{calendar.monthganzhi}} {{calendar.dayganzhi}} [{{calendar.shengxiao}}]
				{{calendar.week_day}} {{calendar.constellation}}</text>
		</view>
		<!-- 宜 忌 -->
		<view class="yiji-container">
			<view class="yiji-item yi">
				<image src="../../static/yiji_yi.png" mode="aspectFit">
				</image>
				<text>{{ calendar.yi.length > 0 ? calendar.yi.join(' ') : '无宜' }}</text>
			</view>
			<view class="yiji-item ji">
				<image src="../../static/yiji_ji.png" mode="aspectFit">
				</image>
				<text>{{ calendar.ji.length > 0 ? calendar.ji.join(' ') : '无忌' }}</text>
			</view>
		</view>
		<!-- 宜 忌 over -->
		<!-- 两列的行 -->

		<view class="all-information" style="padding: 10rpx;">

			<uni-row class="info-uni-row " :gutter="gutter" :width="nvueWidth">
				<uni-col :span="6">
					<view class="info-uni-col dark info-flex "
						style="border-top: 1rpx solid #cd8900;border-left: 1rpx solid #cd8900;">
						<text class="color-text">七政：</text>
						<text>{{calendar.qizheng}}</text>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view class="info-uni-col light info-flex text-border"
						style="border-right: none;border-bottom: none;">
						<text class="color-text">冲煞：</text>
						<text>{{calendar.chongsha}}</text>
					</view>
				</uni-col>
				<uni-col :span="6">
					<view class="info-uni-col dark info-flex text-border" style="border-bottom: none;">
						<text class="color-text">值神：</text>
						<text>{{calendar.zhishen}}</text>
					</view>
				</uni-col>
			</uni-row>

			<uni-row class="info-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="24">
					<view class="info-uni-col-text text-border" style="border-bottom: none;padding: 15rpx;">
						<text class="vertical-text color-text">纳音</text>
						<text class="vertical-text">{{calendar.yearnayin}}</text>
						<text class="vertical-text">{{calendar.monnayin}}</text>
						<text class="vertical-text">{{calendar.daynayin}}</text>
						<text class="vertical-text">{{calendar.hournayin}}</text>

					</view>
				</uni-col>
			</uni-row>
			<view class="next-twelve text-border">
				<uni-row class="info-uni-row " :gutter="gutter" :width="nvueWidth">
					<uni-col :span="3">
						<view class="info-uni-col twelve-eight">
							<text class="color-text">建除十二神</text>
							<text>{{calendar.shiershen}}</text>
						</view>
					</uni-col>
					<uni-col :span="18">
						<view class="info-uni-col">
							<view class="">
								<uni-row>
									<uni-col :span="8" class="">
										<view class="ji-tai">
											<text class="color-text">吉神宜趋</text>
											<view class="info-text">
												<text v-for="(item,index) in calendar.jishen"
													:key="index">{{item}}</text>
											</view>
										</view>
									</uni-col>
									<uni-col :span="8" class="">
										<view class="ji-tai">
											<text class="color-text">今日胎神</text>
											<view class="info-text">
												<text v-for="(item,index) in calendar.todaytai_direction"
													:key="index">{{item}}</text>
											</view>
										</view>
									</uni-col>
									<uni-col :span="8" class="">
										<view class="ji-tai">
											<text class="color-text">吉神宜忌</text>
											<view class="info-text">
												<text v-for="(item,index) in calendar.xiongsha"
													:key="index">{{item}}</text>
											</view>
										</view>
									</uni-col>
								</uni-row>
							</view>

							<view class="ji-tai" style="padding-bottom: 20rpx;">
								<text class="color-text">彭祖百忌</text>
								<text>{{calendar.pangshu}}</text>
							</view>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="info-uni-col twelve-eight">
							<text class="color-text">二十八星宿</text>
							<text>{{calendar.xingxiu}}</text>
						</view>
					</uni-col>
				</uni-row>
			</view>

		</view>

		<view class="jiushendir">
			<view class="jishentitle">
				吉神方位

			</view>

			<view class="jishentag">
				<view class="tag">
					<text>喜神</text>
					<text>{{calendar.xi_direction}}</text>
				</view>
				<view class="tag">
					<text>福神</text>
					<text>{{calendar.fu_direction}}</text>
				</view>
				<view class="tag">
					<text>财神</text>
					<text>{{calendar.cai_direction}}</text>
				</view>
				<view class="tag">
					<text>阴贵神</text>
					<text>{{calendar.yingui_direction}}</text>
				</view>
				<view class="tag">
					<text>阳贵神</text>
					<text>{{calendar.yangGui_direction}}</text>
				</view>
			</view>
		</view>
	</view>

	<view v-else-if="loading">Loading...</view>
	<view v-else>Error loading data</view>
</template>

<script>
	export default {
		data() {
			return {
				calendar: null,
				isDatePickerVisible: true,
				date: '',
				combinedArray: [],
				loading: false,
				gutter: 0,
				nvueWidth: 730
			};
		},
		onLoad(e) {
			this.date = e.parm || new Date().toISOString().split('T')[0]; // 默认显示当天日期
			this.getChineseC(this.date);
		},
		onShow() {

		},
		methods: {
			addDays(dateStr, days) {
				const date = new Date(dateStr);
				date.setDate(date.getDate() + days);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			addOneDay(date, days) {
				const newDate = this.addDays(this.date, days);
				this.date = newDate;
				this.getChineseC(this.date);
			},
			bindDateChange(e) {
				this.date = e.detail.value;
				this.getChineseC(this.date);
			},
			getChineseC(e) {
				const url = "/lunar/demo.php?date="+ e;
				this.$get(url).then((res) => {
					this.calendar = res;
	
				}).catch((error) => {
					console.error('请求失败:', error);
				});
			}

		}
	};
</script>

<style lang="scss">
	//uni-row布局-五行等部分
	page {
		background-color: white;
	}

	.all-information {
		font-size: 28rpx;

		.text-border {
			border: 1rpx solid #cd8900;
		}


	}

	.info-uni-row {
		// 组件在小程序端display为inline
		// QQ、抖音小程序文档写有 :host，但实测不生效
		// 百度小程序没有 :host
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}

	.info-flex {
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		/* 防止文字换行 */
	}

	.info-uni-col {
		height: 80rpx;

	}

	.twelve-eight {
		height: 300rpx;
		display: flex;
		justify-content: space-around;

		text {
			writing-mode: vertical-rl;
			text-align: center;
			margin-right: 5px;
			line-height: 1;
		}
	}

	.next-twelve {
		padding: 0 15rpx;
	}

	.color-text {
		color: #b17300;
	}

	.ji-tai {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 25rpx;

		.info-text {
			text {
				margin-right: 5px;
			}
		}
	}

	.info-uni-col-text {
		display: flex;
		flex-direction: row;
		/* 水平排列 */
		align-items: center;

		justify-content: space-between;
		/* 垂直对齐到顶部 */
		flex-wrap: nowrap;
		/* 不换行 */
		height: 100%;

	}

	.vertical-text {
		writing-mode: vertical-rl;
		/* 文字垂直排列，从右向左 */
		text-align: center;
		/* 文本居中 */
		margin-right: 5px;
		/* 每个文本块之间的间距 */
		line-height: 1;
		/* 调整行高，确保文本垂直居中 */
	}

	//uni-row布局-五行等部分over
	.table-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* 设置表格容器的总宽度 */
		text-align: center;
		margin-top: 20rpx;
	}

	.one-title {
		//农历抬头部分显示样式
		margin: 0 auto;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		color: red;

		.calendar-lunar {
			font-size: 40rpx;
			font-weight: 600;
			margin: 0 100rpx;
		}
	}

	.ganzhi {
		font-size: 28rpx;
		margin: 20rpx 5rpx;
	}

	.yiji-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		/* 文字左对齐 */
		padding: 0 20rpx;

	}

	.yiji-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
		width: 100%;
		/* 设置固定宽度 */
		box-sizing: border-box;
		/* 确保内边距和边框不会影响总宽度 */
	}

	.yiji-item image {
		width: 40rpx;
		height: 40rpx;
		vertical-align: middle;
	}

	.yiji-item text {
		margin-left: 30rpx;
		/* 图片和文字之间的间距 */
		text-align: left;
		/* 文字左对齐 */
		flex: 1;
		/* 让文字部分占据剩余空间 */
	}

	.jieqi {
		display: flex;
		justify-content: space-around;
	}

	.jiushendir {
		padding: 15rpx;

		.jishentitle {
			font-size: 30rpx;
			font-weight: 600;
			text-align: left;
			color: #b17300;
		}

		.jishentag {
			margin-top: 20rpx;
			display: flex;

			.tag:not(:first-child) {
				margin-left: 15rpx;

			}

			text {

				font-size: 28rpx;
			}
		}


	}
</style>