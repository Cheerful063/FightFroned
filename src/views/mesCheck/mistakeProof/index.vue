<template>
	<div class="app-container">

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesCheck:mistakeProof:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesCheck:mistakeProof:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesCheck:mistakeProof:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesCheck:mistakeProof:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="mistakeProofList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="错误项" align="center" prop="mistakeItem" />
			<el-table-column label="错误类型" align="center" prop="type">
				<template #default="scope">
					<dict-tag :options="mes_mistake_type" :value="scope.row.type" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesCheck:mistakeProof:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesCheck:mistakeProof:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改防错管理对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="mistakeProofRef" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="错误项" prop="mistakeItem">
					<el-input v-model="form.mistakeItem" placeholder="请输入错误项" />
				</el-form-item>
				<el-form-item label="错误类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择错误类型">
						<el-option v-for="dict in mes_mistake_type" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="导致错误结果" prop="mistakeResult">
					<el-input v-model="form.mistakeResult" type="textarea" placeholder="请输入内容" />
				</el-form-item>
				<el-form-item label="预防手段" prop="preventMethod">
					<el-input v-model="form.preventMethod" type="textarea" placeholder="请输入内容" />
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

<script setup name="MistakeProof">
	import {
		listMistakeProof,
		getMistakeProof,
		delMistakeProof,
		addMistakeProof,
		updateMistakeProof,
		exportMistakeProof
	} from "@/api/mesCheck/mistakeProof";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();



	const {
		mes_mistake_type
	} = proxy.useDict('mes_mistake_type')









	const mistakeProofList = ref([]);
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
		},
		rules: {
			type: [{
				required: true,
				message: "错误类型不能为空",
				trigger: "change"
			}],
			mistakeItem: [{
				required: true,
				message: "错误项不能为空",
				trigger: "blur"
			}],
			mistakeResult: [{
				required: true,
				message: "导致错误结果不能为空",
				trigger: "blur"
			}],
			preventMethod: [{
				required: true,
				message: "预防手段不能为空",
				trigger: "blur"
			}]
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询防错管理列表 */
	function getList() {
		loading.value = true;
		listMistakeProof(queryParams.value).then(response => {
			mistakeProofList.value = response.rows;
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
			type: null,
			mistakeItem: null,
			mistakeResult: null,
			preventMethod: null
		};
		proxy.resetForm("mistakeProofRef");
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
		title.value = "添加防错管理";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getMistakeProof(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改防错管理";
		});
	}

	function submitForm() {
		proxy.$refs["mistakeProofRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateMistakeProof(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addMistakeProof(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除防错管理编号为"' + _ids + '"的数据项？').then(function() {
			return delMistakeProof(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有防错管理数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportMistakeProof(queryParams.value).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	getList();
</script>
