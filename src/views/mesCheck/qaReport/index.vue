<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
			<el-form-item label="完工单号" prop="productFinishNo">
				<el-input v-model="queryParams.productFinishNo" placeholder="请输入完工单号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="计划编号" prop="productPlanNo">
				<el-input v-model="queryParams.productPlanNo" placeholder="请输入计划编号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="作业名称" prop="productJobName">
				<el-input v-model="queryParams.productJobName" placeholder="请输入作业名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="产品名称" prop="materialName">
				<el-input v-model="queryParams.materialName" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验批次" prop="materialBatchNo">
				<el-input v-model="queryParams.materialBatchNo" placeholder="请输入检验批次" clearable @keyup.enter="handleQuery" />
			</el-form-item>

			<el-form-item label="生产日期" style="width: 280px;font-weight: bold;">
				<el-date-picker v-model="daterangeProductDate" value-format="YYYY-MM-DD" range-separator="-"
					type="daterange"></el-date-picker>
			</el-form-item>


			<el-form-item label="检验项" prop="checkItemName">
				<el-input v-model="queryParams.checkItemName" placeholder="请输入检验项" clearable @keyup.enter="handleQuery" />
			</el-form-item>


			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="loading" :data="qaReportList">
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="检验编号" align="center" prop="serialNo" />
			<el-table-column label="计划编号" align="center" prop="productPlanNo" />
			<el-table-column label="完工单号" align="center" prop="productFinishNo" />
			<el-table-column label="作业名称" align="center" prop="productJobName" />
			<el-table-column label="产线名称" align="center" prop="productLineName" />
			<el-table-column label="检验批次" align="center" prop="materialBatchNo" />
			<el-table-column label="产品名称" align="center" prop="materialName" />
			<el-table-column label="生产日期" align="center" prop="productDate" />
			<el-table-column label="检验项" align="center" prop="checkItemName" />
			<el-table-column label="生产数量" align="center" prop="productQuantity" />
			<el-table-column label="抽检数量" align="center" prop="checkQuantity" />
			<el-table-column label="检验人" align="center" prop="checkUserName" />
			<el-table-column label="合格数量" align="center" prop="checkValue" />
			<el-table-column label="检验时间" align="center" prop="checkDate" width="180px"/>

		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />
	</div>
</template>

<script setup>
	import {
		listQaReport
	} from '@/api/mesCheck/qaReport'
	
	import {
		listUser
	} from "@/api/system/user"

	const showSearch = ref(true)
	const loading = ref(true)
	const total = ref(0)
	const qaReportList = ref([])
	const daterangeProductDate = ref([])
	
	const data = reactive({
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			productFinishNo: null,
			productJobName: null,
			productPlanNo: null,
			materialName: null,
			materialBatchNo: null,
			checkItemName: null
		}
	});
	
	const { proxy } = getCurrentInstance();
	
	const { queryParams } = toRefs(data);




	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		// 日期
		if(daterangeProductDate.value && daterangeProductDate.value.length === 2){
			queryParams.value.params['beginProductDate'] = daterangeProductDate.value[0] + " 00:00:00";
			queryParams.value.params['endProductDate'] = daterangeProductDate.value[1] + " 23:59:59"
		}
		listQaReport(queryParams.value).then(res => {
			qaReportList.value = res.rows
			total.value = res.total
			loading.value = false;
		})
	}
	
	function handleQuery(){
		queryParams.value.pageNum = 1,
		getList();
	}
	
	function resetQuery(){
		daterangeProductDate.value = [];
		proxy.resetForm('queryRef');
		handleQuery();
	}
	getList();
</script>
