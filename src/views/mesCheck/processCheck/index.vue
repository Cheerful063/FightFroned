<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="流水号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入流水号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="计划编号" prop="planNo">
				<el-input v-model="queryParams.planNo" placeholder="请输入计划编号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="作业名称" prop="jobName">
				<el-input v-model="queryParams.jobName" placeholder="请输入作业名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="物料名称" prop="materialName">
			    <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable
			        @keyup.enter="handleQuery" />
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
			<el-form-item label="检验时间" style="width: 308px">
				<el-date-picker v-model="daterangeCheckDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesCheck:processCheck:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesCheck:processCheck:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesCheck:processCheck:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesCheck:processCheck:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="processCheckList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="流水号" align="center" prop="serialNo" />
			<el-table-column label="计划编号" align="center" prop="planNo" />
			<el-table-column label="作业名称" align="center" prop="jobName" />
			<el-table-column label="物料名称" align="center" prop="materialName" />
			<el-table-column label="规格" align="center" prop="materialSpec" />
			<el-table-column label="型号" align="center" prop="materialModel" />
			<el-table-column label="单位" align="center" prop="materialModel" />
			<el-table-column label="检验项" align="center" prop="checkItemName" />
			<el-table-column label="生产数量" align="center" prop="productQuantity" />
			<el-table-column label="采样数量" align="center" prop="checkQuantity" />
			<el-table-column label="检验值" align="center" prop="checkValue" />
			<el-table-column label="阈值上限" align="center" prop="maxValue" />
			<el-table-column label="阈值下限" align="center" prop="minValue" />
			<el-table-column label="检验结果" align="center" prop="checkResult">
				<template #default="scope">
					<dict-tag :options="mes_check_result" :value="scope.row.checkResult" />
				</template>
			</el-table-column>
			<el-table-column label="检验人" align="center" prop="checkUserName" />
			<el-table-column label="检验时间" align="center" prop="checkDate" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesCheck:processCheck:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesCheck:processCheck:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改生产采样单对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="processCheckRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="流水号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入流水号" />
				</el-form-item>
				<el-form-item label="作业名称" prop="jobName">
						<el-input v-model="form.jobName" readonly>
							<template #append>
								<el-button @click="openJobSelect()">选择</el-button>
							</template>
						</el-input>
				</el-form-item>
				<el-form-item label="物料名称" prop="materialName">
					<el-input v-model="form.materialName" placeholder="请输入物料名称" />
				</el-form-item>

				<el-form-item label="检验标准" prop="checkItemName">
					<el-input v-model="form.checkItemName" placeholder="请选择检验标准">
							<template #append>
								<el-button @click="openStandardSelect()">选择</el-button>
							</template>
					</el-input>
				</el-form-item>
				
				
				<el-form-item label="生产数量" prop="productQuantity">
					<el-input v-model="form.productQuantity" placeholder="请输入生产数量" />
				</el-form-item>
				<el-form-item label="采样数量" prop="checkQuantity">
					<el-input v-model="form.checkQuantity" placeholder="请输入采样数量" />
				</el-form-item>
				<el-form-item label="检验值" prop="checkValue">
					<el-input v-model="form.checkValue" placeholder="请输入检验值" />
				</el-form-item>
				<el-form-item label="阈值上限" prop="maxValue">
					<el-input v-model="form.maxValue" placeholder="请输入阈值上限" />
				</el-form-item>
				<el-form-item label="阈值下限" prop="minValue">
					<el-input v-model="form.minValue" placeholder="请输入阈值下限" />
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
				<el-form-item label="检验人" prop="checkUserName">
					<el-input v-model="form.checkUserName" placeholder="请输入检验人" />
				</el-form-item>
				<el-form-item label="检验时间" prop="checkDate">
					<el-date-picker clearable v-model="form.checkDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择检验时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
		
		<!-- 选择生产作业弹框 -->
		<ProductJobSelect :open="productJobSelectOpen" @onCancel="handleProductJobCancle"
			@onSelected="handleProductJobSelected"></ProductJobSelect>
			
		<!-- 选择检验标准 -->
		<StandardSelect :open="StandardSelectOpen" @onStandardCancel="handleStandardCancle"
			@onStandardSelected="handleStandardSelect"></StandardSelect>
		
	</div>
</template>

<script setup name="ProcessCheck">
	import StandardSelect from '@/components/MesCheck/StandardSelect'
	import ProductJobSelect from '@/components/product/ProductJobSelect'
	import {
		listProcessCheck,
		getProcessCheck,
		delProcessCheck,
		addProcessCheck,
		updateProcessCheck,
		exportProcessCheck
	} from "@/api/mesCheck/processCheck";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();



























	const {
		mes_check_result
	} = proxy.useDict('mes_check_result')









	const processCheckList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeCheckDate = ref([]);
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			serialNo: null,
			productPlanId: null,
			checkValue: null,
			maxValue: null,
			minValue: null,
			checkResult: null,
			checkUser: null,
			checkDate: null
		},
		rules: {
			jobName: [{
				required: true,
				message: "作业名称不能为空",
				trigger: "blur"
			}],
			materialName:[{
				required: true,
				message: "物料名称不能为空",
				trigger: "blur"
			}],
			checkItemName:[{
				required: true,
				message: "检验标准不能为空",
				trigger: "blur"
			}],
			
			checkQuantity: [{
				required: true,
				message: "采样数量不能为空",
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

	/** 查询生产采样单列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeCheckDate && '' != daterangeCheckDate) {
			queryParams.value.params["beginCheckDate"] = daterangeCheckDate.value[0];
			queryParams.value.params["endCheckDate"] = daterangeCheckDate.value[1];
		}
		listProcessCheck(queryParams.value).then(response => {
			processCheckList.value = response.rows;
			total.value = response.total;
			loading.value = false;
		});
	}
	// const allRows = ref([])
	// function getList(){
	// 	loading.value = true;
	// 	listProcessCheck({pageNum:1,pageSize:999}).then(res => {
	// 		allRows.value = res.rows
	// 		loading.value = false;
	// 	})
	// }

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
			productPlanId: null,
			productScheduleId: null,
			productLineId: null,
			checkStandardId: null,
			productQuantity: null,
			checkQuantity: null,
			checkValue: null,
			maxValue: null,
			minValue: null,
			checkResult: null,
			remark: null,
			checkUser: null,
			checkDate: null
		};
		proxy.resetForm("processCheckRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeCheckDate.value = [];
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
		title.value = "添加生产采样单";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getProcessCheck(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改生产采样单";
		});
	}

	function submitForm() {
		proxy.$refs["processCheckRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateProcessCheck(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addProcessCheck(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除生产采样单编号为"' + _ids + '"的数据项？').then(function() {
			return delProcessCheck(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有生产采样单数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProcessCheck(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}
	
	const productJobSelectOpen = ref(false)
	
	function openJobSelect() {
		productJobSelectOpen.value = true;
	}
	
	function handleProductJobCancle() {
		productJobSelectOpen.value = false;
	}
	
	function handleProductJobSelected(row) {
		// console.log(row)
		form.value.serialNo = row.serialNo;
		form.value.jobName = row.name;
		form.value.materialName = row.productName;
		form.value.productQuantity = row.productQuantity;
		
		productJobSelectOpen.value = false;
	}
	
	
	const StandardSelectOpen = ref(false)
	
	function openStandardSelect(){
		StandardSelectOpen.value = true;
	}
	
	function handleStandardCancle() {
		StandardSelectOpen.value = false;
	}
	
	function handleStandardSelect(rows){
		const row = rows && rows[0];
		// console.log(row)
		form.value.checkDate = row.checkItemName;
		form.value.maxValue = row.maxValue;
		form.value.minValue = row.minValue;
		
		StandardSelectOpen.value = false;
	}
	
	
	
	
	
	getList();
</script>
