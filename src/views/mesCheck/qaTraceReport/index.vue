<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px"
			class="query-form">
			<el-form-item label="流水号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入流水号" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="完工单号" prop="productFinishNo">
				<el-input v-model="queryParams.productFinishNo" placeholder="请输入完工单号" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="计划编号" prop="productPlanNo">
				<el-input v-model="queryParams.productPlanNo" placeholder="请输入计划编号" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="作业名称" prop="productJobName">
				<el-input v-model="queryParams.productJobName" placeholder="请输入作业名称" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="产品名称" prop="materialName">
				<el-input v-model="queryParams.materialName" placeholder="请输入产品名称" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验批次" prop="materialBatchNo">
				<el-input v-model="queryParams.materialBatchNo" placeholder="请输入检验批次" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="生产日期" style="width: 300px;font-weight: bold;">
				<el-date-picker v-model="daterangeProductDate" value-format="YYYY-MM-DD" range-separator="-"
					type="daterange"></el-date-picker>
			</el-form-item>
			<el-form-item label="检验项" prop="checkItemName">
				<el-input v-model="queryParams.checkItemName" placeholder="请输入检验项" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验结果" prop="checkResult">
				<el-select v-model="queryParams.checkResult" placeholder="请选择检验结果" clearable>
					<el-option v-for="dict in mes_check_result" :value="dict.value" :label="dict.label"
						:key="dict.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="检验人" prop="checkUserName">
				<el-input v-model="queryParams.checkUserName" placeholder="请输入检验人" clearable style="width: 160px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验时间" style="width: 300px;font-weight: bold;">
				<el-date-picker v-model="daterangeCheckDate" value-format="YYYY-MM-DD" range-separator="-"
					type="daterange"></el-date-picker>
			</el-form-item>

			<el-form-item style="display: block">
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>


		<el-table v-loading="loading" :data="traceList">
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="流水号" align="center" prop="serialNo" />
			<el-table-column label="计划编号" align="center" prop="productPlanNo" />
			<el-table-column label="完工单号" align="center" prop="productFinishNo" />
			<el-table-column label="作业名称" align="center" prop="productJobName" />
			<el-table-column label="产线名称" align="center" prop="productLineName" />
			<el-table-column label="检验批次" align="center" prop="materialBatchNo" />
			<el-table-column label="产品名称" align="center" prop="materialName" />
			<el-table-column label="生产日期" align="center" prop="productDate">
				<template #default="scope">
					<span>{{ parseTime(scope.row.productDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="检验项" align="center" prop="checkItemName" />
			<el-table-column label="生产数量" align="center" prop="productQuantity" />
			<el-table-column label="抽检数量" align="center" prop="checkQuantity" />
			<el-table-column label="检验结果" align="center" prop="checkResult">
				<template #default="scope">
					<dict-tag :options="mes_check_result" :value="scope.row.checkResult" />
				</template>
			</el-table-column>

			<el-table-column label="检验人" align="center" prop="checkUserName" />

			<el-table-column label="检验时间" align="center" prop="checkDate">
				<template #default="scope">
					<span>{{ parseTime(scope.row.checkDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />
	</div>
</template>


<script setup>
	import {
		listQaTrace
	} from "@/api/mesCheck/qaTrace"

	import {
		listUser
	} from "@/api/system/user"


	const userList = ref([])
	const showSearch = ref(true);
	const loading = ref(true);
	const traceList = ref([]);
	const total = ref(0);
	// const queryForm = ref(null);
	const daterangeProductDate = ref([]);
	const daterangeCheckDate = ref([]);
	
	const data = reactive({
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			serialNo: null,
			productFinishNo: null,
			productPlanNo: null,
			productPlanId: null,
			productJobName: null,
			materialName: null,
			materialBatchNo: null,
			checkItemName: null,
			checkResult: null,
			checkUserName: null,
			productLineName: null,
			checkUser: null
		}
	});
	const {
		proxy
	} = getCurrentInstance();
	const {
		mes_check_result
	} = proxy.useDict('mes_check_result')

	const {
		queryParams
	} = toRefs(data)


	listUser({pageNum:1 , pageSize:999}).then(res => {
		userList.value = res.rows || [];
		getList();
	})

	//查列表
	function getList() {
		queryParams.value.params = {};
		//日期处理
		if (daterangeProductDate.value && daterangeProductDate.value.length === 2) {
			queryParams.value.params['beginProductDate'] = daterangeProductDate.value[0] + " 00:00:00";
			queryParams.value.params['endProductDate'] = daterangeProductDate.value[1] + " 23:59:59"
		}
		if (daterangeCheckDate.value && daterangeCheckDate.value.length === 2) {
			queryParams.value.params['beginCheckDate'] = daterangeCheckDate.value[0] + " 00:00:00";
			queryParams.value.params['endCheckDate'] = daterangeCheckDate.value[1] + " 23:59:59";
		}
		//检验人处理 姓名=>userId
		const kw = queryParams.value.checkUserName;
		if(kw){
			const hit = userList.value.find(u => u.userName && u.userName.includes(kw));
			queryParams.value.checkUser = hit ? String(hit.userId) : "-1";
		}else{
			queryParams.value.checkUser = null;
		}
		
		listQaTrace(queryParams.value).then(res => {
			traceList.value = res.rows;
			total.value = res.total;
			loading.value = false;
		})
	}

	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}


	function resetQuery() {
		daterangeProductDate.value = [];
		daterangeCheckDate.value = [];
		proxy.resetForm("queryForm");
		handleQuery();
	}
	// getList();
</script>

<style scoped lang="scss">

</style>
