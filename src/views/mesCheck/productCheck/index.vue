<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="流水号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入流水号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="完工单号" prop="productFinishNo">
				<el-input v-model="queryParams.productFinishNo" placeholder="请输入完工单号" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="计划编号" prop="productScheduleId">
				<el-input v-model="queryParams.productScheduleId" placeholder="请输入计划排产编号" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="作业名称" prop="productJobName">
				<el-input v-model="queryParams.productJobName" placeholder="请输入作业名称" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="产品名称" prop="materialName">
				<el-input v-model="queryParams.materialName" placeholder="请输入产品名称" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验批次" prop="materialBatchNo">
				<el-input v-model="queryParams.materialBatchNo" placeholder="请输入检验批次" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			
			<el-form-item label="生产日期" style="width: 308px">
				<el-date-picker v-model="daterangeProductDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="检验项" prop="checkItemName">
				<el-input v-model="queryParams.checkItemName" placeholder="请输入检验项" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验结果" prop="checkResult">
				<el-select v-model="queryParams.checkResult" placeholder="请选择检验结果" clearable>
					<el-option v-for="dict in mes_check_result" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="检验人" prop="checkUser">
				<el-input v-model="queryParams.checkUser" placeholder="请输入检验人" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验时间" prop="checkDate">
				<el-date-picker clearable v-model="queryParams.checkDate" type="date" value-format="YYYY-MM-DD"
					placeholder="请选择检验时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesCheck:productCheck:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesCheck:productCheck:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesCheck:productCheck:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesCheck:productCheck:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="productCheckList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="流水号" align="center" prop="serialNo" />
			<!-- <el-table-column label="计划排产编号" align="center" prop="productScheduleId" /> -->
			<el-table-column label="计划编号" align="center" prop="productPlanId" />
			<!-- <el-table-column label="生产计划编号" align="center" prop="productPlanId" /> -->
			<el-table-column label="完工单号" align="center" prop="productFinishNo" />
			<el-table-column label="作业名称" align="center" prop="productJobName" />
			<el-table-column label="产线名称" align="center" prop="productLineName" />
			
			<!-- <el-table-column label="生产线编号" align="center" prop="productLineId" /> -->
			<!-- <el-table-column label="生产作业编号" align="center" prop="productJobId" /> -->
			<!-- <el-table-column label="物料档案编号" align="center" prop="materialId" /> -->
			<el-table-column label="检验批次" align="center" prop="materialBatchNo" />
			<el-table-column label="产品名称" align="center" prop="materialName" />
			<el-table-column label="生产日期" align="center" prop="productDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.productDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="检验项" align="center" prop="checkItemName" />
			<el-table-column label="生产数量" align="center" prop="productQuantity" />
			<el-table-column label="抽检数量" align="center" prop="checkQuantity" />
			<el-table-column label="检验值" align="center" prop="checkValue" />
			<el-table-column label="阈值上限" align="center" prop="maxValue" />
			<el-table-column label="阈值下限" align="center" prop="minValue" />
			<el-table-column label="检验结果" align="center" prop="checkResult">
				<template #default="scope">
					<dict-tag :options="mes_check_result" :value="scope.row.checkResult" />
				</template>
			</el-table-column>
			<!-- <el-table-column label="备注" align="center" prop="remark" /> -->
			<el-table-column label="检验人" align="center" prop="checkUserName" />
			<el-table-column label="检验时间" align="center" prop="checkDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.checkDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesCheck:productCheck:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesCheck:productCheck:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改产品检验单对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="productCheckRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="流水号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入流水号" />
				</el-form-item>
				<el-form-item label="完工单号" prop="productFinishNo">
					<!-- <el-input v-model="form.productFinishNo" placeholder="请输入完工单号" /> -->
					<el-input v-model="form.productFinishNo" placeholder="请选择物料" readonly >
						<template #append>
							<el-button @click="openFinishSelect">选择</el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="检验标准" prop="checkItemName">
					<el-input v-model="form.checkItemName" placeholder="请选择检验标准" readonly >
						<template #append>
							<el-button @click="openStandardSelect()">选择</el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抽检数量" prop="checkQuantity">
					<el-input v-model="form.checkQuantity" placeholder="请输入抽检数量" />
				</el-form-item>
				<el-form-item label="检验值" prop="checkValue">
					<el-input v-model="form.checkValue" placeholder="请输入检验值" />
				</el-form-item>
				<el-form-item label="阈值上限" prop="maxValue">
					<el-input v-model="form.maxValue" placeholder="请输入标准值上限" />
				</el-form-item>
				<el-form-item label="阈值下限" prop="minValue">
					<el-input v-model="form.minValue" placeholder="请输入标准值下限" />
				</el-form-item>
				<el-form-item label="检验结果" prop="checkResult">
					<el-select v-model="form.checkResult" placeholder="请选择检验结果">
						<el-option v-for="dict in mes_check_result" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
		
		<!-- 选择生产完工单 -->
		<ProductFinishSelect :open="finishSelectOpen" @onSelected="handleFinishSelected"
		    @onCancel="finishSelectOpen = false" />
		<!-- 选择检验标准 -->
		<StandardSelect :open="standardSelectOpen" checkType="2"
		    @onStandardSelected="handleStandardSelected"
		    @onStandardCancel="standardSelectOpen = false" />
	</div>
</template>

<script setup name="ProductCheck">
	import StandardSelect from "@/components/MesCheck/StandardSelect";
	import ProductFinishSelect from "@/components/product/ProductFinishSelect";
	import {
		listProductCheck,
		getProductCheck,
		delProductCheck,
		addProductCheck,
		updateProductCheck,
		exportProductCheck
	} from "@/api/mesCheck/productCheck";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();



































	const {
		mes_check_result
	} = proxy.useDict('mes_check_result')
	
	const materialSelectOpen = ref(false);
	
	
	const standardSelectOpen = ref(false);
	const finishSelectOpen = ref(false);







	const productCheckList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeProductDate = ref([]);
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			serialNo: null,
			productFinishNo: null,
			productScheduleId: null,
			productJobId: null,
			materialBatchNo: null,
			productDate: null,
			checkQuantity: null,
			checkValue: null,
			maxValue: null,
			minValue: null,
			checkResult: null,
			checkUser: null,
			checkDate: null
		},
		rules: {
			productFinishNo: [{
				required: true,
				message: "完工单号不能为空",
				trigger: "blur"
			}],
			checkItemName: [{ required: true, message: "检验标准不能为空", trigger: "change" }],
			checkQuantity: [{
				required: true,
				message: "抽检数量不能为空",
				trigger: "blur"
			}],
			checkValue: [{
				required: true,
				message: "检验值不能为空",
				trigger: "blur"
			}],
			checkResult: [{
				required: true,
				message: "检验结果不能为空",
				trigger: "change"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询产品检验单列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeProductDate && '' != daterangeProductDate) {
			queryParams.value.params["beginProductDate"] = daterangeProductDate.value[0];
			queryParams.value.params["endProductDate"] = daterangeProductDate.value[1];
		}
		listProductCheck(queryParams.value).then(response => {
			productCheckList.value = response.rows;
			total.value = response.total;
			loading.value = false;
		});
	}

	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// 表单重置
	function reset() {
		form.value = {
			id: null,
			serialNo: null,
			productFinishId: null,
			productFinishNo: null,
			productPlanId: null,
			productScheduleId: null,
			productLineId: null,
			productJobId: null,
			materialId: null,
			materialBatchNo: null,
			productDate: null,
			productQuantity: null,
			checkStandardId: null,
			checkQuantity: null,
			checkValue: null,
			maxValue: null,
			minValue: null,
			checkResult: null,
			remark: null,
			checkUser: null,
			checkDate: null,
			checkItemName: null
		};
		proxy.resetForm("productCheckRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeProductDate.value = [];
		proxy.resetForm("queryRef");
		handleQuery();
	}

	// 多选框选中数据
	function handleSelectionChange(selection) {
		ids.value = selection.map(item => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	}

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "添加产品检验单";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getProductCheck(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改产品检验单";
		});
	}

	function submitForm() {
		proxy.$refs["productCheckRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateProductCheck(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addProductCheck(form.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
			}
		});
	}

	/** 删除按钮操作 */
	function handleDelete(row) {
		const _ids = row.id || ids.value;
		proxy.$modal.confirm('是否确认删除产品检验单编号为"' + _ids + '"的数据项？').then(function() {
			return delProductCheck(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有产品检验单数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProductCheck(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}


	function openFinishSelect() {
		finishSelectOpen.value = true;
	}
	function openStandardSelect() {
	    standardSelectOpen.value = true;
	}
	
	
	function handleFinishSelected(row) {
		// console.log(row)
		form.value.productFinishNo = row.serialNo

	    finishSelectOpen.value = false;
	}
	
	
	function handleStandardSelected(list) {
		// console.log(list)
	    const row = list && list[0];
		form.value.checkItemName = row.checkItemName;
	    form.value.maxValue = row.maxValue;
	    form.value.minValue = row.minValue;
	    standardSelectOpen.value = false;
	}
	getList();
</script>
