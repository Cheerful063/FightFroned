<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="流水号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入流水号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="领料单号" prop="materialRequisitionId">
				<el-input v-model="queryParams.materialRequisitionId" placeholder="请输入领料单号" clearable
					@keyup.enter="handleQuery" />
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
					v-hasPermi="['mesCheck:materialCheck:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesCheck:materialCheck:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesCheck:materialCheck:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesCheck:materialCheck:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="materialCheckList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="流水号" align="center" prop="serialNo" />
			<el-table-column label="领料单号" align="center" prop="materialRequisitionId" />
			<el-table-column label="物料名称" align="center" prop="materialName" />
			<el-table-column label="规格" align="center" prop="materialSpec" />
			<el-table-column label="型号" align="center" prop="materialModel" />
			<el-table-column label="单位" align="center" prop="materialUnit" />
			<el-table-column label="需求数量" align="center" prop="requireQuantity" />
			<el-table-column label="已领数量" align="center" prop="receiveQuantity" />
			<el-table-column label="抽检数量" align="center" prop="checkQuantity" />
			<el-table-column label="检验项" align="center" prop="checkItemName" />
			<el-table-column label="标准值上限" align="center" prop="maxValue" />
			<el-table-column label="标准值下限" align="center" prop="minValue" />
			<el-table-column label="检验值" align="center" prop="checkValue" />
			<el-table-column label="检验结果" align="center" prop="checkResult">
				<template #default="scope">
					<dict-tag :options="mes_check_result" :value="scope.row.checkResult" />
				</template>
			</el-table-column>
			<el-table-column label="检验人" align="center" prop="checkUserName" />
			<el-table-column label="检验时间" align="center" prop="checkDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.checkDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesCheck:materialCheck:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesCheck:materialCheck:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改物料检验单对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="materialCheckRef" :model="form" :rules="rules" label-width="80px">
<!-- 				<el-form-item label="流水号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入流水号" :disabled="form.id != null" />
				</el-form-item>	 -->			
				
				<!-- <el-form-item label="领料编号" prop="materialRequisitionId">
					<el-input v-model="form.materialRequisitionId" placeholder="请输入领料单号" />
				</el-form-item> -->
				
				<el-form-item label="领料编号" prop="materialRequisitionNo">
					<el-input v-model="form.materialRequisitionNo" placeholder="请选择物料" readonly >
						<template #append>
							<el-button @click="openPick()">选择</el-button>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item label="物料名称" prop="materialName">
					<el-input v-model="form.materialName"/>
				</el-form-item>
				
				
				<el-form-item label="检验标准" prop="checkItemName">
					<el-input v-model="form.checkItemName"  :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="需求数量" prop="requireQuantity">
					<el-input v-model="form.requireQuantity" placeholder="请输入需求数量" :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="已领数量" prop="receiveQuantity">
					<el-input v-model="form.receiveQuantity" placeholder="请输入已领数量" :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="抽检数量" prop="checkQuantity">
					<el-input v-model="form.checkQuantity" placeholder="请输入抽检数量" />
				</el-form-item>
				<el-form-item label="检验值" prop="checkValue">
					<el-input v-model="form.checkValue" placeholder="请输入检验值" />
				</el-form-item>
				<el-form-item label="标准值上限" prop="maxValue" label-width="auto">
					<el-input v-model="form.maxValue" placeholder="请输入标准值上限" :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="标准值下限" prop="minValue" label-width="auto">
					<el-input v-model="form.minValue" placeholder="请输入标准值下限" :disabled="form.id != null"/>
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
					<el-input v-model="form.checkUserName" placeholder="请输入检验人"  :disabled="form.id != null"/>
				</el-form-item>
				<el-form-item label="检验时间" prop="checkDate">
					<el-date-picker clearable v-model="form.checkDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择检验时间" :disabled="form.id != null">
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
		
		<!-- 选择物料档案 -->
		<RequisitionSelect :open="materialSelectOpen" @onCancel="handleMaterialCancel"
			@onSelected="handleMaterialSelected"></RequisitionSelect>
	</div>
</template>

<script setup name="MaterialCheck">
	import RequisitionSelect from "@/components/product/RequisitionSelect";
	import { getRequisitionApply } from "@/api/mesProduct/requisitionApply";
	
	import {
		listMaterialCheck,
		getMaterialCheck,
		delMaterialCheck,
		addMaterialCheck,
		updateMaterialCheck,
		exportMaterialCheck
	} from "@/api/mesCheck/materialCheck";
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

	const materialCheckList = ref([]);
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
			materialRequisitionId: null,
			checkUser: null,
			checkDate: null
		},
		rules: {
			materialRequisitionNo: [{
				required: true,
				message: "领料编号不能为空",
				trigger: "blur"
			}],
			
			materialName: [{
				required: true,
				message: "物料名称不能为空",
				trigger: "blur"
			}],
			materialRequisitionId: [{
				required: true,
				message: "领料单号不能为空",
				trigger: "blur"
			}],
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
			remark: [{
				required: true,
				message: "备注不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询物料检验单列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeCheckDate && '' != daterangeCheckDate) {
			queryParams.value.params["beginCheckDate"] = daterangeCheckDate.value[0];
			queryParams.value.params["endCheckDate"] = daterangeCheckDate.value[1];
		}
		listMaterialCheck(queryParams.value).then(response => {
			materialCheckList.value = response.rows;
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
			materialRequisitionId: null,
			materialRequisitionNo: null,
			materialId: null,
			checkStandardId: null,
			requireQuantity: null,
			receiveQuantity: null,
			checkQuantity: null,
			checkValue: null,
			maxValue: null,
			minValue: null,
			checkResult: null,
			remark: null,
			checkUser: null,
			checkDate: null
		};
		proxy.resetForm("materialCheckRef");
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
		title.value = "添加来料检验单";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getMaterialCheck(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改物料检验单";
		});
	}

	function submitForm() {
		proxy.$refs["materialCheckRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateMaterialCheck(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addMaterialCheck(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除物料检验单编号为"' + _ids + '"的数据项？').then(function() {
			return delMaterialCheck(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有物料检验单数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportMaterialCheck(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}
	
	function chandleSelectMaterial() {
		materialSelectOpen.value = true;
	}
	
	function openPick() {

		materialSelectOpen.value = true;
	}
	
	function handleMaterialSelected(row) {
		
		form.value.materialRequisitionId = row.id;
		form.value.materialRequisitionNo = row.serialNo;
		materialSelectOpen.value = false;
		
		getRequisitionApply(row.id).then(res => {
			const details = (res.data && res.data.mesMaterialRequisitionDetailList) || []
			if(details.length === 0){return}
			const d = details[0];
			form.value.materialId = d.materialId;
			form.value.materialName = d.materialName;
			form.value.materialSpec = d.materialSpec;
			form.value.materialUnit = d.materialUnit;
			form.requireQuantity = d.requireQuantity;
			
		})
		
	}
	
	function handleMaterialCancel() {
		materialSelectOpen.value = false;
	}

	getList();
</script>
