<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="模型名称" prop="modelName">
				<el-input v-model="queryParams.modelName" placeholder="请输入模型名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesModel:productModel:add']">新建
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesModel:productModel:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesModel:productModel:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesModel:productModel:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="productModelList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="模型名称" align="center" prop="modelName" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="产品型号" align="center" prop="productType" />
			<el-table-column label="产品规格" align="center" prop="productSpec" />
			<el-table-column label="产品单位" align="center" prop="productUnit" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesModel:productModel:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesModel:productModel:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改产品建模对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body >
			<el-form ref="productModelRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="产品" prop="materialId">
					<el-input v-model="form.productName" readonly style="flex: 1;" />
					<el-button @click="openPick('product')">选择</el-button>
				</el-form-item>
				<el-form-item label="产品型号" prop="productType">
					<el-input v-model="form.productType" disabled />
				</el-form-item>
				<el-form-item label="产品规格" prop="productSpec">
					<el-input v-model="form.productSpec" disabled />
				</el-form-item>
				<el-form-item label="模型名称" prop="modelName">
					<el-input v-model="form.modelName" placeholder="请输入模型名称" />
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
				</el-form-item>
				<el-divider content-position="center">产品模型明细信息</el-divider>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button type="primary" icon="Plus" @click="handleAddMesProductModelDetail">添加</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" icon="Delete" @click="handleDeleteMesProductModelDetail">删除</el-button>
					</el-col>
				</el-row>
				<el-table :data="mesProductModelDetailList" :row-class-name="rowMesProductModelDetailIndex"
					@selection-change="handleMesProductModelDetailSelectionChange" ref="mesProductModelDetail">
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column label="序号" align="center" prop="index" width=auto />

					<el-table-column label="物料" align="center" prop="materialId" width="220">
						<template #default="scope">
							<el-input v-model="scope.row.materialName" readonly>
								<template #append>
									<el-button @click="openPick(scope.row)">选择</el-button>
								</template>
							</el-input>
						</template>
					</el-table-column>

					<el-table-column label="型号" align="center" prop="index" width=auto>
						<template #default="scope">
							<el-input v-model="scope.row.materialType" />
						</template>
					</el-table-column>
					<el-table-column label="规格" align="center" prop="index" width=auto>
						<template #default="scope">
							<el-input v-model="scope.row.materialSpec" />
						</template>
					</el-table-column>
					<el-table-column label="单位" align="center" prop="index" width=auto>
						<template #default="scope">
							<el-input v-model="scope.row.materialUnit" />
						</template>
					</el-table-column>
					<el-table-column label="备注" align="center" prop="index" width=auto>
						<template #default="scope">
							<el-input v-model="scope.row.detailRemark" />
						</template>
					</el-table-column>
				</el-table>
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

<script setup name="ProductModel">
	import MaterialSelect from '@/components/Material/MaterialSelect';
	import {
		listProductModel,
		getProductModel,
		delProductModel,
		addProductModel,
		updateProductModel,
		exportProductModel
	} from "@/api/mesModel/productModel";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();






	const pickTarget = ref(null);                               // 'product' 或 明细行对象

	const materialSelectOpen = ref(false);
	const material = ref(null);

	const productModelList = ref([]);
	const mesProductModelDetailList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const checkedMesProductModelDetail = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			modelName: null,
		},
		rules: {
			materialId: [{
				required: true,
				message: "产品名称不能为空",
				trigger: "change"
			}],
			modelName: [{
				required: true,
				message: "模型名称不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	function openPick(target) {
		pickTarget.value = target;
		materialSelectOpen.value = true;
	}
	/** 查询产品建模列表 */
	function getList() {
		loading.value = true;
		listProductModel(queryParams.value).then(response => {
			productModelList.value = response.rows;
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
			modelName: null,
			remark: null
		};
		mesProductModelDetailList.value = [];
		proxy.resetForm("productModelRef");
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
		title.value = "新建产品建模";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getProductModel(_id).then(response => {
			form.value = response.data;
			mesProductModelDetailList.value = response.data.mesProductModelDetailList;
			open.value = true;
			title.value = "修改产品建模";
		});
	}

	function submitForm() {
		proxy.$refs["productModelRef"].validate(valid => {
			if (valid) {
				form.value.mesProductModelDetailList = mesProductModelDetailList.value;
				if (form.value.id != null) {
					updateProductModel(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addProductModel(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除产品建模编号为"' + _ids + '"的数据项？').then(function() {
			return delProductModel(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 产品模型明细序号 */
	function rowMesProductModelDetailIndex({
		row,
		rowIndex
	}) {
		row.index = rowIndex + 1;
	}

	/** 产品模型明细添加按钮操作 */
	function handleAddMesProductModelDetail() {
		let obj = {};
		mesProductModelDetailList.value.push(obj);
	}

	/** 产品模型明细删除按钮操作 */
	function handleDeleteMesProductModelDetail() {
		if (checkedMesProductModelDetail.value.length == 0) {
			proxy.$modal.msgError("请先选择要删除的产品模型明细数据");
		} else {
			const mesProductModelDetails = mesProductModelDetailList.value;
			const checkedMesProductModelDetails = checkedMesProductModelDetail.value;
			mesProductModelDetailList.value = mesProductModelDetails.filter(function(item) {
				return checkedMesProductModelDetails.indexOf(item.index) == -1
			});
		}
	}

	/** 复选框选中数据 */
	function handleMesProductModelDetailSelectionChange(selection) {
		checkedMesProductModelDetail.value = selection.map(item => item.index)
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有产品建模数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProductModel(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	function chandleSelectMaterial() {
		materialSelectOpen.value = true;
	}

	function handleMaterialSelected(list) {
		console.log(list);
		if (list && list.length > 0) {
			const m = list[0];
			// 填上半部分
			if (pickTarget.value === 'product') {
				form.value.materialId = m.id;
				form.value.productName = m.name;
				form.value.productType = m.model;
				form.value.productSpec = m.specification;
				form.value.productUnit = m.unit;
			} else {
				// 填下半部分
				const row = pickTarget.value;
				row.materialId = m.id;
				row.materialName = m.name;
				row.materialType = m.model;
				row.materialSpec = m.specification;
				row.materialUnit = m.unit;
			}
			materialSelectOpen.value = false;
		}
	}

	function handleMaterialCancel() {
		materialSelectOpen.value = false;
	}

	getList();
</script>
