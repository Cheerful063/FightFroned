<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="设备名称" prop="equipmentName">
				<el-input v-model="queryParams.equipmentName" placeholder="请输入设备名称" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="开始日期" prop="startDate">
				<el-date-picker clearable size="small" v-model="queryParams.startDate" type="date"
					value-format="yyyy-MM-dd" placeholder="选择开始日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束日期" prop="endDate">
				<el-date-picker clearable size="small" v-model="queryParams.endDate" type="date"
					value-format="yyyy-MM-dd" placeholder="选择结束日期">
				</el-date-picker>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="loading" :data="reportList">

			<el-table-column label="设备名称" align="center" prop="equipmentName" />
			<el-table-column label="已产数量" align="center" prop="productQuantity" />
			<el-table-column label="单位耗电量" align="center" prop="powerConsume" />
			<el-table-column label="总耗电量" align="center" prop="totalPowerConsume" />
			<el-table-column label="单位碳排放" align="center" prop="carbonEmission" />
			<el-table-column label="总碳排放" align="center" prop="totalCarbonEmission" />
		</el-table>
		<!-- 分页 -->
		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

	</div>
</template>
<script>
	import {
		listEquipmentPowerReport
	} from '@/api/carbonReport/equipmentPowerReport';


	export default {
		name: "EquipmentPowerReport",
		data() {
			return {
				// 遮罩层
				loading: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 表格数据
				reportList: [],
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					equipmentName: null,
					startDate: null,
					endDate: null
				},
				
			};
		},
		created(){
			this.getList();
		},
		methods: {
			/** 查询项目维护列表 */
			getList() {
				this.loading = true;
				listEquipmentPowerReport(this.queryParams).then(response => {
					this.reportList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.resetForm("queryForm");
				this.handleQuery();
			},
		}
	};
</script>
