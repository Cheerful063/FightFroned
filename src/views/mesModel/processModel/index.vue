<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="工艺名称" prop="processName">
				<el-input v-model="queryParams.processName" placeholder="请输入工艺名称" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesModel:processModel:add']">新建
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesModel:processModel:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesModel:processModel:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesModel:processModel:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="processModelList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="工艺名称" align="center" prop="processName" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="型号" align="center" prop="productType" />
			<el-table-column label="规格" align="center" prop="productSpec" />
			<el-table-column label="单位" align="center" prop="productUnit" />
			<el-table-column label="单位耗电量" align="center" prop="powerConsume" />
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesModel:processModel:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesModel:processModel:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改工艺建模对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="processModelRef" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="产品" prop="materialId">
					<el-input v-model="form.materialId" placeholder="请输入产品" />
				</el-form-item>
				<el-form-item label="工艺名称" prop="processName">
					<el-input v-model="form.processName" placeholder="请输入工艺名称" />
				</el-form-item>
				<el-form-item label="工艺描述" prop="description">
					<el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
				</el-form-item>
				<el-form-item label="单位耗电量" prop="powerConsume" >
					<el-input v-model="form.powerConsume" placeholder="请输入单位耗电量" />
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
	</div>
</template>

<script setup name="ProcessModel">
	import {
		listProcessModel,
		getProcessModel,
		delProcessModel,
		addProcessModel,
		updateProcessModel,
		exportProcessModel
	} from "@/api/mesModel/processModel";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();














	const processModelList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			processName: null,
		},
		rules: {
			materialId: [{
				required: true,
				message: "产品不能为空",
				trigger: "blur"
			}],
			processName: [{
				required: true,
				message: "工艺名称不能为空",
				trigger: "blur"
			}],
			powerConsume: [{
				required: true,
				message: "单位耗电量不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询工艺建模列表 */
	function getList() {
		loading.value = true;
		listProcessModel(queryParams.value).then(response => {
			processModelList.value = response.rows;
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
			materialId: null,
			processName: null,
			description: null,
			powerConsume: null,
			remark: null
		};
		proxy.resetForm("processModelRef");
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

	/** 新建按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "添加工艺建模";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getProcessModel(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改工艺建模";
		});
	}

	function submitForm() {
		proxy.$refs["processModelRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateProcessModel(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addProcessModel(form.value).then(response => {
						proxy.$modal.msgSuccess("新建成功");
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
		proxy.$modal.confirm('是否确认删除工艺建模编号为"' + _ids + '"的数据项？').then(function() {
			return delProcessModel(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有工艺建模数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProcessModel(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	getList();
</script>
