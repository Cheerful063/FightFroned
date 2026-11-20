<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="名称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['mesPlan:mesBom:add']">新建
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesPlan:mesBom:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesPlan:mesBom:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesPlan:mesBom:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="mesBomList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="名称" align="center" prop="name" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="型号" align="center" prop="productType" />
			<el-table-column label="规格" align="center" prop="productSpec" />
			<el-table-column label="单位" align="center" prop="productUnit" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesPlan:mesBom:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesPlan:mesBom:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改产品BOM单对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="mesBomRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item label="产品">
					<el-input v-model="form.productName" placeholder="请先选择产品模型" readonly />
				</el-form-item>

				<el-form-item label="产品模型" prop="productId">
					<el-select v-model="form.productId" placeholder="请选择产品模型" clearable filterable
						@change="handleProductModelChange">
						<el-option v-for="m in productModelList" :key="m.id" :label="m.modelName" :value="m.materialId">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="描述" prop="description">
					<el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
				</el-form-item>
				<el-divider content-position="center">BOM单明细信息</el-divider>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button type="primary" icon="Plus" @click="handleAddMesProductBomDetail">添加</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" icon="Delete" @click="handleDeleteMesProductBomDetail">删除</el-button>
					</el-col>
				</el-row>
				<el-table :data="mesProductBomDetailList" :row-class-name="rowMesProductBomDetailIndex"
					@selection-change="handleMesProductBomDetailSelectionChange" ref="mesProductBomDetail">
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column label="序号" align="center" prop="index" width="55" />
					<el-table-column label="物料" align="center" prop="materialName" width="200">
						<template #default="scope">
							<el-input v-model="scope.row.materialName" placeholder="请选择物料" readonly >
								<template #append>
									<el-button @click="openPick(scope.row)">选择</el-button>
								</template>
							</el-input>
						</template>
					</el-table-column>
					<el-table-column label="型号" align="center" prop="materialType" width="120" />
					<el-table-column label="规格" align="center" prop="materialSpec" width="120" />
					<el-table-column label="单位" align="center" prop="materialUnit" width="120" />
					<el-table-column label="用量" prop="usage" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.usage" placeholder="请输入用量" />
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="remark" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.remark" placeholder="请输入备注" />
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

<script setup name="MesBom">
	
	import {
		listMesBom,
		getMesBom,
		delMesBom,
		addMesBom,
		updateMesBom,
		exportMesBom
	} from "@/api/mesPlan/mesBom";
	import {
		ElMessageBox
	} from 'element-plus'
	import MaterialSelect from '@/components/Material/MaterialSelect';
	import { listProductModel } from '@/api/mesModel/productModel';
	const {
		proxy
	} = getCurrentInstance();















	const materialSelectOpen = ref(false);
	const pickTarget = ref(null); // 'product' 或 明细行对象
	const productModelList = ref([])
	const mesBomList = ref([]);
	const mesProductBomDetailList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const checkedMesProductBomDetail = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			name: null,
		},
		rules: {
			name: [{
				required: true,
				message: "名称不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询产品BOM单列表 */
	function getList() {
		loading.value = true;
		listMesBom(queryParams.value).then(response => {
			mesBomList.value = response.rows;
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
			name: null,
			productId: null,
			description: null,
			createBy: null,
			createTime: null,
			updateBy: null,
			updateTime: null
		};
		mesProductBomDetailList.value = [];
		proxy.resetForm("mesBomRef");
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
		getProductModel();
		reset();
		open.value = true;
		title.value = "添加产品BOM单";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		getProductModel();
		reset();
		const _id = row.id || ids.value
		getMesBom(_id).then(response => {
			form.value = response.data;
			mesProductBomDetailList.value = response.data.mesProductBomDetailList;
			open.value = true;
			title.value = "修改产品BOM单";
		});
	}

	function submitForm() {
		proxy.$refs["mesBomRef"].validate(valid => {
			if (valid) {
				form.value.mesProductBomDetailList = mesProductBomDetailList.value;
				if (form.value.id != null) {
					updateMesBom(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addMesBom(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除产品BOM单编号为"' + _ids + '"的数据项？').then(function() {
			return delMesBom(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** BOM单明细序号 */
	function rowMesProductBomDetailIndex({
		row,
		rowIndex
	}) {
		row.index = rowIndex + 1;
	}

	/** BOM单明细添加按钮操作 */
	function handleAddMesProductBomDetail() {
		let obj = {};
		obj.materialId = "";
		obj.usage = "";
		obj.remark = "";
		mesProductBomDetailList.value.push(obj);
	}

	/** BOM单明细删除按钮操作 */
	function handleDeleteMesProductBomDetail() {
		if (checkedMesProductBomDetail.value.length == 0) {
			proxy.$modal.msgError("请先选择要删除的BOM单明细数据");
		} else {
			const mesProductBomDetails = mesProductBomDetailList.value;
			const checkedMesProductBomDetails = checkedMesProductBomDetail.value;
			mesProductBomDetailList.value = mesProductBomDetails.filter(function(item) {
				return checkedMesProductBomDetails.indexOf(item.index) == -1
			});
		}
	}

	/** 复选框选中数据 */
	function handleMesProductBomDetailSelectionChange(selection) {
		checkedMesProductBomDetail.value = selection.map(item => item.index)
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有产品BOM单数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportMesBom(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	//下拉菜单数据
	function getProductModel() {
		listProductModel({
			pageNum: 1,
			pageSize: 999
		}).then(res => {
			productModelList.value = res.rows;
		});
	}

	function handleProductModelChange(val) {
		const m = productModelList.value.find(x => x.materialId === val);
		if(m){
			form.value.productName = m.productName;
			form.value.productType = m.productType;
			form.value.productSpec = m.productSpec;
			form.value.productUnit = m.productUnit;
		}else{
			form.value.productName = null;
		}
	}

	function chandleSelectMaterial() {
		materialSelectOpen.value = true;
	}

	function openPick(target) {
		pickTarget.value = target;
		materialSelectOpen.value = true;
	}

	function handleMaterialSelected(list) {
		if (list && list.length > 0) {
			const m = list[0];
			const row = pickTarget.value;

			row.materialId = m.id;
			row.materialName = m.name;
			row.materialType = m.model;
			row.materialSpec = m.specification;
			row.materialUnit = m.unit;
		}
		materialSelectOpen.value = false;
	}

	function handleMaterialCancel() {
		materialSelectOpen.value = false;
	}

	getList();
</script>
