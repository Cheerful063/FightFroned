<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
			<el-form-item label="单据号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入流水号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="申请人" prop="applyUser">
				<el-select v-model="queryParams.applyUser" placeholder="请选择申请人" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId">

					</el-option>
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
				<el-select v-model="queryParams.auditUser" placeholder="请输入审核人" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId">

					</el-option>
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


		<el-table v-loading="loading" :data="replenishApplyAuditList" >
			
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="单据号" align="center" prop="serialNo" />
			<el-table-column label="状态" align="center" prop="status">
				<template #default="scope">
					<span>{{ statusMap[scope.row.status] }}</span>
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
						v-hasPermi="['wmsApply:replenishApplyAudit:edit']">详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改补货申请对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="replenishApplyAuditRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="流水号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入流水号" disabled />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-input :value="statusMap[form.status]" disabled></el-input>
					
				</el-form-item>
				<el-form-item label="申请人" prop="applyUser">
					<el-input v-model="form.applyUserName" placeholder="请输入申请人" disabled />
				</el-form-item>
				<el-form-item label="申请日期" prop="applyTime">
					<el-date-picker clearable v-model="form.applyTime" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择申请日期" disabled>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="申请状态" prop="applyStatus">
					<el-select v-model="form.applyStatus" placeholder="请选择申请状态" disabled>
						<el-option v-for="dict in apply_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核人" prop="auditUserName">
					<el-input v-model="form.auditUserName" placeholder="请输入审核人" disabled />
				</el-form-item>
				<el-form-item label="审核日期" prop="auditTime">
					<el-date-picker clearable v-model="form.auditTime" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择审核日期" disabled>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="审核状态" prop="auditStatus">
					<el-select v-model="form.auditStatus" placeholder="请选择审核状态" disabled>
						<el-option v-for="dict in audit_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核意见" prop="auditComment">
					<el-input v-model="form.auditComment" placeholder="请输入审核意见" />
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" disabled />
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

<script setup name="ReplenishApplyAudit">
	import { ElMessage } from 'element-plus';
	import {
		listUser
	} from "@/api/system/user";
	import useUserStore from "@/store/modules/user";
	import {
		listReplenishApplyAudit,
		getReplenishApplyAudit,
		delReplenishApplyAudit,
		addReplenishApplyAudit,
		updateReplenishApplyAudit,
		exportReplenishApplyAudit
	} from "@/api/wmsApply/replenishApplyAudit";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();











	const {
		apply_status
	} = proxy.useDict('apply_status')






	const {
		audit_status
	} = proxy.useDict('audit_status')









	const replenishApplyAuditList = ref([]);
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

	/** 查询补货申请列表 */
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
		listReplenishApplyAudit(queryParams.value).then(response => {
			replenishApplyAuditList.value = response.rows;
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
			status: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
			auditComment: null,
			remark: null,
			purchaseApplyFlag: null
		};
		proxy.resetForm("replenishApplyAuditRef");
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
		title.value = "添加补货申请";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getReplenishApplyAudit(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改补货申请";
		});
	}

	function submitForm() {
		proxy.$refs["replenishApplyAuditRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateReplenishApplyAudit(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addReplenishApplyAudit(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除补货申请编号为"' + _ids + '"的数据项？').then(function() {
			return delReplenishApplyAudit(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有补货申请数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportReplenishApplyAudit(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	const statusMap = {
		1: '未采购',
		2: '采购中',
		3: '已入库'
	}
	const userList = ref([])

	function getUsers() {
		listUser({
			pageNum: 1,
			pageSize: 999
		}).then(res => {
			userList.value = res.rows
		})
	}
	const userStore = useUserStore();

	function yesPass() {
		form.value.auditStatus = '1';
		form.value.auditUser = userStore.id;
		form.value.auditTime = proxy.parseTime(new Date());
		updateReplenishApplyAudit(form.value).then(res => {
			ElMessage.success("审核通过");
			open.value = false;
			getList();
		})
	}

	function noPass() {
		form.value.auditStatus = '0';
		form.value.auditUser = userStore.id;
		form.value.auditTime = proxy.parseTime(new Date());
		updateReplenishApplyAudit(form.value).then(res => {
			ElMessage.error("已驳回");
			open.value = false;
			getList();
		})
	}

	getUsers();
	getList();
</script>
