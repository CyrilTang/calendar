<template>
	<view class="custom-table">
		<!-- 第一行，三列 -->
		<view class="table-row">
			<view class="table-cell" style="width: 30%;">列1</view>
			<view class="table-cell" style="width: 40%;">列2（宽）</view>
			<view class="table-cell" style="width: 30%;">列3</view>
		</view>

		<!-- 第二行，模拟合并两列 -->
		<view class="table-row merged-row">
			<view class="merged-cell" style="width: 100%;">
				<view class="table-cell-inner" style="width: 50%; display: inline-block;">列1</view>
				<view class="table-cell-inner"
					style="width: 50%; display: inline-block; border-left: 1px solid #ccc; padding-left: 10px;">列2和列3合并
				</view>
			</view>
		</view>

		<!-- 第三行，四列 -->
		<view class="table-row">
			<view class="table-cell" style="width: 20%;">列1</view>
			<view class="table-cell" style="width: 30%;">列2</view>
			<view class="table-cell" style="width: 25%;">列3</view>
			<view class="table-cell" style="width: 25%;">列4</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CustomTable',
	};
</script>

<style scoped>
	.custom-table {
		width: 100%;
	}

	.table-row {
		display: flex;
		align-items: center;
	}

	.table-cell,
	.table-cell-inner {
		box-sizing: border-box;
		padding: 10px;
		text-align: left;
	}

	.merged-row {
		background-color: #fff;
		/* 与.table-cell背景色相同，以隐藏内部边框 */
	}

	.merged-cell {
		width: 100%;
		padding: 0;
		/* 移除外部padding，因为内部元素会有自己的padding */
		border: none;
		/* 移除外部边框 */
		position: relative;
		/* 用于定位内部元素 */
	}

	.table-cell-inner:first-child {
		border: none;
		/* 第一个内部单元格不需要左边框 */
	}
</style>