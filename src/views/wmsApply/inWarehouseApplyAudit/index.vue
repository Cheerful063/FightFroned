<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
			<el-form-item label="申请单号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入申请单号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="关联单据号" prop="bizBillId">
				<el-input v-model="queryParams.bizBillId" placeholder="请输入关联单据号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="业务类型" prop="bizType">
				<el-select v-model="queryParams.bizType" placeholder="请选择业务类型" clearable>
					<el-option v-for="dict in event_type" :key="dict.value" :label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="供应商" prop="supplierId">
				<el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable>
					<el-option v-for="s in supplierList" :key="s.id" :label="s.name" :value="s.id"></el-option>
				</el-select>


			</el-form-item>
			<el-form-item label="合同号" prop="contactNo">
				<el-input v-model="queryParams.contactNo" placeholder="请输入合同编号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="合同类型" prop="contractType">
				<el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable>
					<el-option v-for="dict in contract_type" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="申请人" prop="applyUser">
				<el-select v-model="queryParams.applyUser" placeholder="请选择申请人" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="申请日期" style="width: 308px;font-weight: bold;">
				<el-date-picker v-model="daterangeApplyTime" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="申请状态" prop="applyStatus">
				<el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable>
					<el-option v-for="dict in apply_status" :key="dict.value" :label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="审核人" prop="auditUser">
				<el-select v-model="queryParams.auditUser" placeholder="请选择审核人" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="审核日期" style="width: 308px;font-weight: bold;">
				<el-date-picker v-model="daterangeAuditTime" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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

		<el-table v-loading="loading" :data="inWarehouseApplyAuditList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="申请单号" align="center" prop="serialNo" />
			<el-table-column label="关联单据号" align="center" prop="bizBillId" />
			<!-- <el-table-column label="业务单据编号" align="center" prop="bizBillId" /> -->
			<el-table-column label="业务类型" align="center" prop="bizType">
				<template #default="scope">
					<dict-tag :options="event_type" :value="scope.row.bizType" />
				</template>
			</el-table-column>

			<!-- <el-table-column label="供应商编号" align="center" prop="supplierId" /> -->
			<el-table-column label="供应商" align="center" prop="supplierName" />

			<el-table-column label="合同号" align="center" prop="contactNo" />
			<el-table-column label="合同类型" align="center" prop="contractType">
				<template #default="scope">
					<dict-tag :options="contract_type" :value="scope.row.contractType" />
				</template>
			</el-table-column>
			<el-table-column label="申请类型" align="center" prop="applyType">
				<template #default="scope">
					<dict-tag :options="wms_apply_type" :value="scope.row.applyType" />
				</template>
			</el-table-column>
			<el-table-column label="申请人" align="center" prop="applyUserName" />
			<el-table-column label="申请日期" align="center" prop="applyTime" width="180">
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
			<el-table-column label="审核日期" align="center" prop="auditTime" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="审核状态" align="center" prop="auditStatus">
				<template #default="scope">
					<dict-tag :options="audit_status" :value="scope.row.auditStatus" />
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['wmsApply:inWarehouseApplyAudit:edit']">详细
					</el-button>

				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改入库申请对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="inWarehouseApplyAuditRef" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="申请单号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入申请单号" disabled />
				</el-form-item>
				<el-form-item label="关联单据号" prop="bizBillId">
					<el-input v-model="form.bizBillId" placeholder="请输入关联单据号" disabled />
				</el-form-item>
				<el-form-item label="业务类型" prop="bizType">
					<el-select v-model="form.bizType" placeholder="请选择业务类型" disabled>
						<el-option v-for="dict in event_type" :key="dict.value" :label="dict.label" :value="dict.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="供应商" prop="supplierName">
					<el-input v-model="form.supplierName" placeholder="暂无" disabled />
				</el-form-item>
				<el-form-item label="合同编号" prop="contactNo">
					<el-input v-model="form.contactNo" placeholder="暂无" disabled />
				</el-form-item>
				<el-form-item label="合同类型" prop="contractType">
					<el-select v-model="form.contractType" placeholder="暂无" disabled>
						<el-option v-for="dict in contract_type" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="申请类型" prop="applyType">
					<el-select v-model="form.applyType" placeholder="暂无" disabled>
						<el-option v-for="dict in wms_apply_type" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="申请人" prop="applyUserName">
					<el-input v-model="form.applyUserName" placeholder="暂无" disabled />
				</el-form-item>
				<el-form-item label="申请日期" prop="applyTime">
					<el-date-picker clearable v-model="form.applyTime" type="date" value-format="YYYY-MM-DD"
						placeholder="暂无" disabled>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="申请状态" prop="applyStatus">
					<el-select v-model="form.applyStatus" placeholder="暂无" disabled>
						<el-option v-for="dict in apply_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核人" prop="auditUserName">
					<el-input v-model="form.auditUserName" placeholder="暂无" disabled />
				</el-form-item>
				<el-form-item label="审核日期" prop="auditTime">
					<el-date-picker clearable v-model="form.auditTime" type="date" value-format="YYYY-MM-DD"
						placeholder="暂无" disabled>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="审核状态" prop="auditStatus">
					<el-select v-model="form.auditStatus" placeholder="暂无" disabled>
						<el-option v-for="dict in audit_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核意见" prop="auditComment">
					<el-input v-model="form.auditComment" placeholder="请输入审核意见" />
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="暂无" disabled />
				</el-form-item>
				<el-form-item label="单据状态" style="font-weight: bold;">
					<dict-tag :options="in_warehouse_status" :value="form.billStatus" />
				</el-form-item>

			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="yesPass">通 过</el-button>
					<el-button type="danger" @click="noPass">驳 回</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="InWarehouseApplyAudit">
	import { ElMessage } from 'element-plus'
	import useUserStore from '@/store/modules/user'
	import {
		listUser
	} from '@/api/system/user'
	import {
		listInWarehouseApplyAudit,
		getInWarehouseApplyAudit,
		delInWarehouseApplyAudit,
		addInWarehouseApplyAudit,
		updateInWarehouseApplyAudit,
		exportInWarehouseApplyAudit,
		listSupplier
	} from "@/api/wmsApply/inWarehouseApplyAudit";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();



	const {
		in_warehouse_status
	} = proxy.useDict('in_warehouse_status')



	const {
		event_type
	} = proxy.useDict('event_type')


	const userStore = useUserStore()




	const {
		contract_type
	} = proxy.useDict('contract_type')


	const {
		wms_apply_type
	} = proxy.useDict('wms_apply_type')






	const {
		apply_status
	} = proxy.useDict('apply_status')






	const {
		audit_status
	} = proxy.useDict('audit_status')









	const inWarehouseApplyAuditList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeApplyTime = ref([]);
	const daterangeAuditTime = ref([]);
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			serialNo: null,
			bizBillId: null,
			bizType: null,
			supplierId: null,
			contractId: null,
			contractType: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
		},
		rules: {}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询入库申请列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeApplyTime && '' != daterangeApplyTime) {
			queryParams.value.params["beginApplyTime"] = daterangeApplyTime.value[0];
			queryParams.value.params["endApplyTime"] = daterangeApplyTime.value[1];
		}
		if (null != daterangeAuditTime && '' != daterangeAuditTime) {
			queryParams.value.params["beginAuditTime"] = daterangeAuditTime.value[0];
			queryParams.value.params["endAuditTime"] = daterangeAuditTime.value[1];
		}
		listInWarehouseApplyAudit(queryParams.value).then(response => {
			inWarehouseApplyAuditList.value = response.rows;
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
			bizBillId: null,
			bizType: null,
			supplierId: null,
			contractId: null,
			contractType: null,
			applyType: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
			auditComment: null,
			remark: null,
			billStatus: null
		};
		proxy.resetForm("inWarehouseApplyAuditRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeApplyTime.value = [];
		daterangeAuditTime.value = [];
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
		title.value = "添加入库申请";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getInWarehouseApplyAudit(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "审核入库申请";
		});
	}

	function submitForm() {
		proxy.$refs["inWarehouseApplyAuditRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateInWarehouseApplyAudit(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addInWarehouseApplyAudit(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除入库申请编号为"' + _ids + '"的数据项？').then(function() {
			return delInWarehouseApplyAudit(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有入库申请数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportInWarehouseApplyAudit(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	const supplierList = ref([])

	function getSuppliers() {
		listSupplier({
			pageNum: 1,
			pageSize: 999
		}).then(res => {
			supplierList.value = res.rows;
		})
	}

	const userList = ref([])

	function getUsers() {
		listUser({
			pageNum: 1,
			pageSize: 999
		}).then(res => {
			userList.value = res.rows;
		})
	}

	function yesPass() {
		form.value.auditStatus = '1';
		form.value.auditUser = userStore.id;
		form.value.auditTime = proxy.parseTime(new Date());
		updateInWarehouseApplyAudit(form.value).then(res => {
			ElMessage.success('审核通过');
			open.value = false;
			getList();
		})
	}
	
	function noPass() {
		form.value.auditStatus = '0';
		form.value.auditUser = userStore.id;
		form.value.auditTime = proxy.parseTime(new Date());
		updateInWarehouseApplyAudit(form.value).then(res => {
			ElMessage.error('驳回')
			open.value = false;
			getList();
		})
	}

	getUsers();
	getSuppliers();
	getList();
</script>
