<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="领料单号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入领料单号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="领取日期" prop="requisitionDate">
				<el-date-picker clearable v-model="queryParams.requisitionDate" type="date" value-format="YYYY-MM-DD"
					placeholder="请选择领取日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="申请人" prop="applyUser">
				<el-input v-model="queryParams.applyUser" placeholder="请输入申请人" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="申请时间" prop="applyTime">
				<el-date-picker clearable v-model="queryParams.applyTime" type="date" value-format="YYYY-MM-DD"
					placeholder="请选择申请时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="申请状态" prop="applyStatus">
				<el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable>
					<el-option v-for="dict in apply_status" :key="dict.value" :label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="审核人" prop="auditUser">
				<el-input v-model="queryParams.auditUser" placeholder="请输入审核人" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="审核时间" prop="auditTime">
				<el-date-picker clearable v-model="queryParams.auditTime" type="date" value-format="YYYY-MM-DD"
					placeholder="请选择审核时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="审核状态" prop="auditStatus">
				<el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable>
					<el-option v-for="dict in audit_status" :key="dict.value" :label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesProduct:requisitionApply:add']">新建
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesProduct:requisitionApply:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesProduct:requisitionApply:remove']">删除
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="requisitionApplyList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="领料单号" align="center" prop="serialNo" />
			<el-table-column label="生产计划" align="center" prop="planNo" />
			<el-table-column label="计划排产" align="center" prop="scheduleNo" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="型号" align="center" prop="productModel" />
			<el-table-column label="规格" align="center" prop="productSpec" />
			<el-table-column label="单位" align="center" prop="productUnit" />
			<!-- <el-table-column label="流水号" align="center" prop="serialNo" /> -->
			<!-- <el-table-column label="生产计划id" align="center" prop="planId" />
			<el-table-column label="计划排产id" align="center" prop="scheduleId" />
			<el-table-column label="产品id" align="center" prop="productId" /> -->
			<el-table-column label="领取日期" align="center" prop="requisitionDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.requisitionDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="申请人" align="center" prop="applyUserName" />
			<el-table-column label="申请时间" align="center" prop="applyTime" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="申请状态" align="center" prop="applyStatus">
				<template #default="scope">
					<dict-tag :options="apply_status" :value="scope.row.applyStatus" />
				</template>
			</el-table-column>
			<el-table-column label="审核人" align="center" prop="auditUserName" />
			<el-table-column label="审核时间" align="center" prop="auditTime" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" prop="auditStatus">
				<template #default="scope">
					<dict-tag :options="audit_status" :value="scope.row.auditStatus" />
				</template>
			</el-table-column>
			<!-- <el-table-column label="状态" align="center" prop="status" /> -->
			<el-table-column label="操作" align="center" width="180">
				<template #default="scope">
					<div style="display: flex; justify-content: center; align-items: center;">
						<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
							v-hasPermi="['mesProduct:requisitionApply:edit']">修改
						</el-button>
						<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
							v-hasPermi="['mesProduct:requisitionApply:remove']">删除
						</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改领料单对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="requisitionApplyRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="领料单号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入流水号" />
				</el-form-item>
<!-- 				<el-form-item label="生产计划id" prop="planId">
					<el-input v-model="form.planId" placeholder="请输入生产计划id" />
				</el-form-item>


				<el-form-item label="领取单号" prop="">
					<el-input v-model="form.scheduleId" placeholder="请输入计划排产id" />
				</el-form-item> -->
				<el-form-item label="计划排产" prop="scheduleId">
					<el-input v-model="form.scheduleId" placeholder="请输入计划排产id" />
				</el-form-item>
				<el-form-item label="产品" prop="productName">
					<el-input v-model="form.productName" placeholder="请输入产品" />
				</el-form-item>
				<el-form-item label="型号" prop="productModel">
					<el-input v-model="form.productModel" placeholder="请输入产品型号" />
				</el-form-item>
				<el-form-item label="规格" prop="productSpec">
					<el-input v-model="form.productSpec" placeholder="请输入产品规格" />
				</el-form-item>
				<el-form-item label="单位" prop="productUnit">
					<el-input v-model="form.productUnit" placeholder="请输入产品单位" />
				</el-form-item>
				<el-form-item label="待产数量" prop="requireQuantity">
					<el-input v-model="form.requireQuantity" placeholder="请输入待产数量" />
				</el-form-item>
				<el-form-item label="生产日期" prop="productDate">
					<el-input v-model="form.productDate" placeholder="请输入生产日期" />
				</el-form-item>
				<el-form-item label="领取日期" prop="requisitionDate">
					<el-date-picker clearable v-model="form.requisitionDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择领取日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="申请人" prop="applyUser">
					<el-input v-model="form.applyUser" placeholder="请输入申请人" />
				</el-form-item>
				<el-form-item label="申请时间" prop="applyTime">
					<el-date-picker clearable v-model="form.applyTime" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择申请时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="申请状态" prop="applyStatus">
					<el-select v-model="form.applyStatus" placeholder="请选择申请状态">
						<el-option v-for="dict in apply_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核人" prop="auditUser">
					<el-input v-model="form.auditUser" placeholder="请输入审核人" />
				</el-form-item>
				<el-form-item label="审核时间" prop="auditTime">
					<el-date-picker clearable v-model="form.auditTime" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择审核时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="审核状态" prop="auditStatus">
					<el-select v-model="form.auditStatus" placeholder="请选择审核状态">
						<el-option v-for="dict in audit_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核意见" prop="auditComment">
					<el-input v-model="form.auditComment" placeholder="请输入审核意见" />
				</el-form-item>
<!-- 				<el-form-item label="状态" prop="status">
					<el-input v-model="form.status" placeholder="请输入状态" />
				</el-form-item> -->
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" />
				</el-form-item>
				<el-divider content-position="center">领料单物料明细信息</el-divider>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button type="primary" icon="Plus" @click="handleAddMesMaterialRequisitionDetail">添加
						</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" icon="Delete" @click="handleDeleteMesMaterialRequisitionDetail">删除
						</el-button>
					</el-col>
				</el-row>
				<el-table :data="mesMaterialRequisitionDetailList"
					:row-class-name="rowMesMaterialRequisitionDetailIndex"
					@selection-change="handleMesMaterialRequisitionDetailSelectionChange"
					ref="mesMaterialRequisitionDetail">
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column label="序号" align="center" prop="index" width="50" />
					<el-table-column label="物料" prop="materialId" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.materialId" placeholder="请输入物料档案id" />
						</template>
					</el-table-column>
					<el-table-column label="型号" prop="materialModel" width="120" />
					<el-table-column label="规格" prop="materialSpec" width="120" />
					<el-table-column label="单位" prop="materialUnit" width="80" />
					<el-table-column label="需求数量" prop="requireQuantity" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.requireQuantity" placeholder="请输入需求数量" />
						</template>
					</el-table-column>
					<el-table-column label="已领数量" prop="receiveQuantity" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.receiveQuantity" placeholder="请输入已领数量" />
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="detailRemark" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.detailRemark" placeholder="请输入备注" />
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm(0)">保 存</el-button>
					<el-button type="success" @click="submitForm(1)">提 交</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="RequisitionApply">
	import {
		listRequisitionApply,
		getRequisitionApply,
		delRequisitionApply,
		addRequisitionApply,
		updateRequisitionApply
	} from "@/api/mesProduct/requisitionApply";
	const {
		proxy
	} = getCurrentInstance();

















	const {
		apply_status
	} = proxy.useDict('apply_status')






	const {
		audit_status
	} = proxy.useDict('audit_status')









	const requisitionApplyList = ref([]);
	const mesMaterialRequisitionDetailList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const checkedMesMaterialRequisitionDetail = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			serialNo: null,
			requisitionDate: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
			status: null,
		},
		rules: {
			scheduleId: [{
				required: true,
				message: "计划排产不能为空",
				trigger: "blur"
			}],
			requisitionDate: [{
				required: true,
				message: "领取日期不能为空",
				trigger: "blur"
			}]
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询领料单列表 */
	function getList() {
		loading.value = true;
		listRequisitionApply(queryParams.value).then(response => {
			requisitionApplyList.value = response.rows;
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
			planId: null,
			scheduleId: null,
			productId: null,
			requisitionDate: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
			auditComment: null,
			status: null,
			remark: null
		};
		mesMaterialRequisitionDetailList.value = [];
		proxy.resetForm("requisitionApplyRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
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
		title.value = "添加领料申请";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getRequisitionApply(_id).then(response => {
			form.value = response.data;
			mesMaterialRequisitionDetailList.value = response.data.mesMaterialRequisitionDetailList;
			open.value = true;
			title.value = "修改领料申请";
		});
	}

	/** 保存/提交：flag = 0 保存，1 提交 */
	function submitForm(flag) {
		proxy.$refs["requisitionApplyRef"].validate(valid => {
			if (valid) {
				form.value.mesMaterialRequisitionDetailList = mesMaterialRequisitionDetailList.value;
				if (flag === 1) {
					// 提交：申请状态置为待审核
					form.value.applyStatus = "1";
				} else if (form.value.id == null) {
					// 新建且只是保存：未提交
					form.value.applyStatus = "0";
				}
				if (form.value.id != null) {
					updateRequisitionApply(form.value).then(response => {
						proxy.$modal.msgSuccess(flag === 1 ? "提交成功" : "修改成功");
						open.value = false;
						getList();
					});
				} else {
					addRequisitionApply(form.value).then(response => {
						proxy.$modal.msgSuccess(flag === 1 ? "提交成功" : "新建成功");
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
		proxy.$modal.confirm('是否确认删除领料单编号为"' + _ids + '"的数据项？').then(function() {
			return delRequisitionApply(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 领料单物料明细序号 */
	function rowMesMaterialRequisitionDetailIndex({
		row,
		rowIndex
	}) {
		row.index = rowIndex + 1;
	}

	/** 领料单物料明细添加按钮操作 */
	function handleAddMesMaterialRequisitionDetail() {
		let obj = {};
		obj.materialId = "";
		obj.requireQuantity = "";
		obj.receiveQuantity = "";
		obj.detailRemark = "";
		mesMaterialRequisitionDetailList.value.push(obj);
	}

	/** 领料单物料明细删除按钮操作 */
	function handleDeleteMesMaterialRequisitionDetail() {
		if (checkedMesMaterialRequisitionDetail.value.length == 0) {
			proxy.$modal.msgError("请先选择要删除的领料单物料明细数据");
		} else {
			const mesMaterialRequisitionDetails = mesMaterialRequisitionDetailList.value;
			const checkedMesMaterialRequisitionDetails = checkedMesMaterialRequisitionDetail.value;
			mesMaterialRequisitionDetailList.value = mesMaterialRequisitionDetails.filter(function(item) {
				return checkedMesMaterialRequisitionDetails.indexOf(item.index) == -1
			});
		}
	}

	/** 复选框选中数据 */
	function handleMesMaterialRequisitionDetailSelectionChange(selection) {
		checkedMesMaterialRequisitionDetail.value = selection.map(item => item.index)
	}

	getList();
</script>
