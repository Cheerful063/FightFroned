<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
			<el-form-item label="物料名称" prop="materialName">
			    <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable
			        @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验项目" prop="checkItemName">
				<el-input v-model="queryParams.checkItemName" placeholder="请输入检验项目名称" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="检验类型" prop="checkType">
				<el-select v-model="queryParams.checkType" placeholder="请选择检验类型" clearable>
					<el-option v-for="dict in mes_check_type" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['mesCheck:standard:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesCheck:standard:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesCheck:standard:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesCheck:standard:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="standardList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="物料名称" align="center" prop="materialName" />
			<el-table-column label="型号" align="center" prop="materialModel" />
			<el-table-column label="规格" align="center" prop="materialSpec" />
			<el-table-column label="单位" align="center" prop="materialUnit" />
			<el-table-column label="检验项目" align="center" prop="checkItemName" />
			<el-table-column label="检验类型" align="center" prop="checkType">
				<template #default="scope">
					<dict-tag :options="mes_check_type" :value="scope.row.checkType" />
				</template>
			</el-table-column>
			<el-table-column label="标准值上限" align="center" prop="maxValue" />
			<el-table-column label="标准值下限" align="center" prop="minValue" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesCheck:standard:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesCheck:standard:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改质检标准对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="standardRef" :model="form" :rules="rules" label-width="80px">

				<el-form-item label="物料名称" prop="materialName">
					<!-- <el-input v-model="form.materialName" placeholder="请输入物料分类" /> -->
					<!-- <template #default="scope"> -->
						<el-input v-model="form.materialName" placeholder="请选择物料" readonly >
							<template #append>
								<el-button @click="openPick()">选择</el-button>
							</template>
						</el-input>
					<!-- </template> -->
				</el-form-item>
				<el-form-item label="型号" prop="materialModel">
					<el-input v-model="form.materialModel" placeholder="请输入物料分类" />
				</el-form-item>
				<el-form-item label="规格" prop="materialSpec">
					<el-input v-model="form.materialSpec" placeholder="请输入物料分类" />
				</el-form-item>
				<el-form-item label="单位" prop="materialUnit">
					<el-input v-model="form.materialUnit" placeholder="请输入物料分类" />
				</el-form-item>

				<el-form-item label="检验项目名称" prop="checkItemName" label-width="auto">
					<el-input v-model="form.checkItemName" placeholder="请输入检验项目名称" />
				</el-form-item>
				<el-form-item label="检验类型" prop="checkType" label-width="auto">
					<el-select v-model="form.checkType" placeholder="请选择检验类型">
						<el-option v-for="dict in mes_check_type" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标准值上限" prop="maxValue" label-width="auto">
					<el-input v-model="form.maxValue" placeholder="请输入标准值上限" />
				</el-form-item>
				<el-form-item label="标准值下限" prop="minValue" label-width="auto">
					<el-input v-model="form.minValue" placeholder="请输入标准值下限" />
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
		
		<!-- 选择物料档案 -->
		<MaterialSelect :open="materialSelectOpen" @onCancel="handleMaterialCancel"
			@onSelected="handleMaterialSelected"></MaterialSelect>
	</div>
</template>

<script setup name="Standard">
	import MaterialSelect from "@/components/Material/MaterialSelect.vue";
	import {
		listStandard,
		getStandard,
		delStandard,
		addStandard,
		updateStandard,
		exportStandard
	} from "@/api/mesCheck/standard";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();







	const {
		mes_check_type
	} = proxy.useDict('mes_check_type')


const materialSelectOpen = ref(false);






	const standardList = ref([]);
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
			checkItemName: null,
			checkType: null,
			materialName: null
		},
		rules: {
			checkItemName: [{
				required: true,
				message: "检验项目名称不能为空",
				trigger: "blur"
			}],
			checkType: [{
				required: true,
				message: "检验类型：1来料检验2产品检验3生产采样不能为空",
				trigger: "change"
			}],
			maxValue: [{
				required: true,
				message: "标准值上限不能为空",
				trigger: "blur"
			}],
			minValue: [{
				required: true,
				message: "标准值下限不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);
	
	
	

	/** 查询质检标准列表 */
	function getList() {
		loading.value = true;
		listStandard(queryParams.value).then(response => {
			standardList.value = response.rows;
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
			checkItemName: null,
			checkType: null,
			maxValue: null,
			minValue: null,
			remark: null
		};
		proxy.resetForm("standardRef");
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
		title.value = "添加质检标准";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getStandard(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改质检标准";
		});
	}

	function submitForm() {
		proxy.$refs["standardRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateStandard(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addStandard(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除质检标准编号为"' + _ids + '"的数据项？').then(function() {
			return delStandard(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有质检标准数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportStandard(val).then(res => {
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
	
	function handleMaterialSelected(rows) {
		const row = rows && rows[0]
		if(!row) return;
		// console.log(row)
		form.value.materialId = row.id;
		form.value.materialName = row.name;
		form.value.materialModel = row.model;
		form.value.materialSpec = row.specification;
		form.value.materialUnit = row.unit;
		materialSelectOpen.value = false;
	}
	
	function handleMaterialCancel() {
		materialSelectOpen.value = false;
	}

	getList();
</script>
