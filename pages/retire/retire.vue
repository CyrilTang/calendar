<template>
	<view class="container">
		<view class="header">
			<text class="title">退休年龄计算器</text>
		</view>
		<form @submit.prevent="calculateRetirement">
			<view class="form-group">
				<text>出生年份:</text>
				<input v-model="birthYear" type="number" placeholder="请输入出生年份" required />
			</view>
			<view class="form-group">
				<text>出生月份:</text>
				<input v-model="birthMonth" type="number" :min="1" :max="12" placeholder="请输入出生月份" required />
			</view>
			<view class="form-group">
				<text>性别:</text>
				<picker @change="onGenderChange" :value="genderIndex" :range="genders">
					<view class="picker">
						{{ genders[genderIndex] }}
					</view>
				</picker>
			</view>
			<button type="default" formType="submit" size="default">计算退休年龄</button>
		</form>
		<view v-if="result" class="result">
			<text>退休年龄: {{ result.retirementAge }}</text>
			<text>退休时间: {{ result.retirementTime }}</text>
			<text>延迟退休月数: {{ result.delayMonths }}</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				birthYear: '',
				birthMonth: '',
				genders: ['男', '女（55岁退休）', '女（50岁退休）'],
				genderIndex: 0,
				result: null
			};
		},
		methods: {
			onGenderChange(e) {
				this.genderIndex = e.detail.value;
			},
			calculateRetirement() {
				const yearOfBirth = parseInt(this.birthYear);
				const monthOfBirth = parseInt(this.birthMonth);
				const type = this.genders[this.genderIndex].includes('男') ? 'male' :
					this.genders[this.genderIndex].includes('55') ? 'female55' : 'female50';

				function monthDiff(fromYear, fromMonth, toYear, toMonth) {
					return (toYear - fromYear) * 12 + toMonth - fromMonth;
				}

				function addMonths(date, months) {
					date.setMonth(date.getMonth() + months);
					return date;
				}

				let retirementAge = '';
				let retirementTime = '';
				let delayMonths = 0;

				// 计算逻辑保持不变
				// ... (这里省略了与原JS相同的计算逻辑)

				const retirementStartDate = addMonths(
					new Date(yearOfBirth, monthOfBirth - 1),
					(type === 'male' ? 60 : type === 'female55' ? 55 : 50) * 12 + delayMonths,
				);
				retirementTime = `${retirementStartDate.getFullYear()}年${retirementStartDate.getMonth() + 1}月`;

				this.result = {
					retirementAge,
					retirementTime,
					delayMonths: `${delayMonths}个月`,
				};
			}
		}
	};
</script>

<style scoped>
	/* 这里添加样式 */
	.container {
		padding: 20px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.header .title {
		font-size: 24px;
		margin-bottom: 20px;
		color: #333;
	}

	.form-group {
		margin: 0 auto;
		margin-bottom: 10px;
		text-align: left;
		width: 80%;
	
		
		
	}

	.form-group input,
	.form-group picker {
	
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 80%;
	}

	button {
		padding: 0px 20px;
		background-color: #007BFF;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.3s ease;
		width: 50%;
	}

	button:hover {
		background-color: #0056b3;
	}

	.result {
		margin-top: 20px;
		padding: 10px;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 4px;
		text-align: left;
	}

	.note {
		margin-top: 50px;
		text-align: left;
		line-height: 40px;
		color: #c90000;
	}
</style>