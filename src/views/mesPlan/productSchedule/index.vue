<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="生产日期" style="width: 308px">
				<el-date-picker v-model="daterangeProductDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="交货日期" style="width: 308px">
				<el-date-picker v-model="daterangeDeliveryDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="发布状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="请选择发布状态" clearable>
					<el-option v-for="dict in product_schedule_status" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="流水号" prop="serialNo">
				<el-input v-model="queryParams.serialNo" placeholder="请输入" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="计划号" prop="planNo">
				<el-input v-model="queryParams.planNo" placeholder="请输入" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="物料" prop="materialName">
				<el-input v-model="queryParams.materialName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="BOM" prop="bomName">
				<el-input v-model="queryParams.bomName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="生产线" prop="productLineName">
				<el-input v-model="queryParams.productLineName" placeholder="请输入" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="工艺" prop="processName">
				<el-input v-model="queryParams.processName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="项目" prop="projectName">
				<el-input v-model="queryParams.projectName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
			</el-form-item>



			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesPlan:productSchedule:add']">新建
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesPlan:productSchedule:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesPlan:productSchedule:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesPlan:productSchedule:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="filteredList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="流水号" align="center" prop="serialNo" />
			<el-table-column label="计划号" align="center" prop="planNo" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="型号" align="center" prop="productModel" />
			<el-table-column label="规格" align="center" prop="productSpec" />
			<el-table-column label="单位" align="center" prop="productUnit" />
			<el-table-column label="BOM" align="center" prop="bomName" />
			<el-table-column label="生产线" align="center" prop="productLineName" />
			<el-table-column label="工艺" align="center" prop="processName" />
			<el-table-column label="项目" align="center" prop="projectName" />

			<el-table-column label="待产数量" align="center" prop="requireQuantity" />
			<el-table-column label="已产数量" align="center" prop="productQuantity" />
			<el-table-column label="生产日期" align="center" prop="productDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.productDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="发布状态" align="center" prop="status">
				<template #default="scope">
					<dict-tag :options="product_schedule_status" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column label="领料状态" align="center" prop="receiveStatus">
				<template #default="scope">
					<dict-tag :options="receive_material_status" :value="scope.row.receiveStatus" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesPlan:productSchedule:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesPlan:productSchedule:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改计划排产对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="productScheduleRef" :model="form" :rules="rules" label-width="80px"
				:disabled="form.status === '1'">
				<!-- <el-form-item label="计划号" prop="planId">
					<el-input v-model="form.planId" placeholder="请输入计划号" />
				</el-form-item> -->

				<el-form-item label="计划号" prop="planId">
					<el-select v-model="form.planId" placeholder="请选择计划号">
						<el-option v-for="b in options.plans" :key="b.id" :label="b.serialNo" :value="b.id"></el-option>
					</el-select>
				</el-form-item>

				<!-- <el-form-item label="项目" prop="projectName">
					<el-input v-model="form.projectName" placeholder="请输入项目" :disabled="form.id != null" />
				</el-form-item> -->

				<el-form-item label="项目" prop="projectId">
					<el-select v-model="form.projectId" placeholder="请选择项目" :disabled="form.id != null">
						<el-option v-for="b in options.projects" :key="b.id" :label="b.name" :value="b.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="产品" prop="productName">
					<el-input v-model="form.productName" placeholder="请输入产品" :disabled="form.id != null" />
				</el-form-item>

				<!-- <el-form-item label="产品" prop="materialId">
					<el-select v-model="form.materialId" placeholder="请选择产品" style="width: 100%">
						<el-option v-for="w in options.materials" :key="w.id" :label="w.name" :value="w.id" />
					</el-select>
				</el-form-item> -->



				<el-form-item label="规格" prop="productSpec">
					<el-input v-model="form.productSpec" placeholder="请输入规格" :disabled="form.id != null" />
				</el-form-item>


				<el-form-item label="型号" prop="productModel">
					<el-input v-model="form.productModel" placeholder="请输入型号" :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="单位" prop="productUnit">
					<el-input v-model="form.productUnit" placeholder="请输入单位" :disabled="form.id != null" />
				</el-form-item>

				<!-- <el-form-item label="BOM" prop="bomId">
					<el-input v-model="form.bomId" placeholder="请输入BOM单编号" />
				</el-form-item> -->

				<el-form-item label="BOM" prop="bomId">
					<el-select v-model="form.bomId" placeholder="请选择BOM">
						<el-option v-for="b in options.boms" :key="b.id" :label="b.name" :value="b.id"></el-option>
					</el-select>
				</el-form-item>

				<!-- <el-form-item label="生产线" prop="productLineId">
					<el-input v-model="form.productLineId" placeholder="请输入生产线" />
				</el-form-item> -->

				<el-form-item label="生产线" prop="productLineId">
					<el-select v-model="form.productLineId" placeholder="请选择生产线">
						<el-option v-for="l in options.lines" :key="l.id" :label="l.productLineName" :value="l.id">
						</el-option>
					</el-select>
				</el-form-item>


				<!-- <el-form-item label="工艺" prop="processId">
					<el-input v-model="form.processId" placeholder="请输入工艺" />
				</el-form-item> -->

				<el-form-item label="工艺" prop="processId">
					<el-select v-model="form.processId" placeholder="请选择工艺">
						<el-option v-for="l in options.processes" :key="l.id" :label="l.processName" :value="l.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="待产数量" prop="requireQuantity">
					<el-input v-model="form.requireQuantity" placeholder="请输入待产数量" :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="已产数量" prop="productQuantity">
					<el-input v-model="form.productQuantity" placeholder="请输入已产数量" :disabled="form.id != null" />
				</el-form-item>
				<el-form-item label="生产日期" prop="productDate">
					<el-date-picker clearable v-model="form.productDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择生产日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="交货日期" prop="deliveryDate">
					<el-date-picker clearable v-model="form.deliveryDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择交货日期" :disabled="form.id != null">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择发布状态">
						<el-option v-for="dict in product_schedule_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>

				<!-- 				<el-form-item label="状态" prop="status">
					<el-input :value="form.status === '1' ? '已下发' : '未发布'" disabled />
				</el-form-item> -->

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" :disabled="form.id != null" />
				</el-form-item>

				<template v-if="form.id != null">
					<el-divider content-position="center">排产物料信息信息</el-divider>
					<!-- <el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button type="primary" icon="Plus" @click="handleAddMesProductScheduleMaterial">添加
						</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" icon="Delete" @click="handleDeleteMesProductScheduleMaterial">删除
						</el-button>
					</el-col>
				</el-row> -->
					<el-table :data="mesProductScheduleMaterialList"
						:row-class-name="rowMesProductScheduleMaterialIndex"
						@selection-change="handleMesProductScheduleMaterialSelectionChange"
						ref="mesProductScheduleMaterial">
						<el-table-column type="selection" width="50" align="center" />
						<el-table-column label="序号" align="center" prop="index" width="50" />

						<el-table-column label="物料" align="center" prop="materialName" width="150" />
						<el-table-column label="型号" align="center" prop="materialModel" width="150" />
						<el-table-column label="规格" align="center" prop="materialSpec" width="150" />
						<el-table-column label="单位" align="center" prop="materialUnit" width="150" />
						<!-- 					<el-table-column label="物料档案编号" prop="materialId" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.materialId" placeholder="请输入物料档案编号" />
						</template>
					</el-table-column> -->
						<el-table-column label="需求数量" prop="requireQuantity" width="150"></el-table-column>
						<el-table-column label="已用数量" prop="usageQuantity" width="150"></el-table-column>
						<el-table-column label="剩余数" prop="leftQuantity" width="150"></el-table-column>
						<el-table-column label="备注" prop="remark" width="150">
							<template #default="scope">
								<el-input v-model="scope.row.remark" placeholder="请输入备注" />
							</template>
						</el-table-column>
					</el-table>
				</template>

			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button v-if="form.id != null" type="primary" @click="submitForm('save')">保 存</el-button>
					<el-button type="success" @click="submitForm('submit')">提 交</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

	</div>
</template>

<script setup name="ProductSchedule">
	import {
		listProductSchedule,
		getProductSchedule,
		delProductSchedule,
		addProductSchedule,
		updateProductSchedule,
		exportProductSchedule,
		getScheduleOption
	} from "@/api/mesPlan/productSchedule";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();



























	const {
		product_schedule_status
	} = proxy.useDict('product_schedule_status')


	const {
		receive_material_status
	} = proxy.useDict('receive_material_status')





	const productScheduleList = ref([]);
	const mesProductScheduleMaterialList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const checkedMesProductScheduleMaterial = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeProductDate = ref([]);
	const daterangeDeliveryDate = ref([]);

	const activeQuery = ref([]);

	const options = reactive({
		plans: [],
		bom: [],
		lines: [],
		process: [],
		projects: []
	});

	function loadOptions() {
		getScheduleOption().then(res => {
			options.plans = res.plans;
			options.boms = res.boms;
			options.lines = res.lines;
			options.processes = res.processes
			options.projects = res.projects;
			options.materials = res.materials;
		})
	}

	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			productDate: null,
			deliveryDate: null,
			status: null,
			serialNo: null,
			planNo: null,
			materialName: null,
			bomName: null,
			productLineName: null,
			processName: null,
			projectName: null
		},
		rules: {
			planId: [{
				required: true,
				message: "计划号不能为空",
				trigger: "blur"
			}],
			bomId: [{
				required: true,
				message: "BOM单编号不能为空",
				trigger: "blur"
			}],
			productLineId: [{
				required: true,
				message: "生产线编号不能为空",
				trigger: "blur"
			}],
			processId: [{
				required: true,
				message: "工艺编号不能为空",
				trigger: "blur"
			}],
			requireQuantity: [{
				required: true,
				message: "待产数量不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询计划排产列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeProductDate && '' != daterangeProductDate) {
			queryParams.value.params["beginProductDate"] = daterangeProductDate.value[0];
			queryParams.value.params["endProductDate"] = daterangeProductDate.value[1];
		}
		if (null != daterangeDeliveryDate && '' != daterangeDeliveryDate) {
			queryParams.value.params["beginDeliveryDate"] = daterangeDeliveryDate.value[0];
			queryParams.value.params["endDeliveryDate"] = daterangeDeliveryDate.value[1];
		}
		listProductSchedule(queryParams.value).then(response => {
			productScheduleList.value = response.rows;
			total.value = response.total;
			loading.value = false;
		});
	}
	const filteredList = computed(() => {
		const q = activeQuery.value;
		return productScheduleList.value.filter(item => {
			if (q.planNo && !(item.planNo || '').includes(q.planNo)) return false;
			if (q.materialName && !((item.productName || '') + (item.productModel || '') + (item
					.productSpec || '')).includes(q.materialName)) return false;
			if (q.bomName && !(item.bomName || '').includes(q.bomName)) return false;
			if (q.productLineName && !(item.productLineName || '').includes(q.productLineName))
				return false;
			if (q.processName && !(item.processName || '').includes(q.processName)) return false;
			if (q.projectName && !(item.projectName || '').includes(q.projectName)) return false;
			return true;
		});
	});

	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// 表单重置
	function reset() {
		form.value = {
			id: null,
			planId: null,
			orderId: null,
			materialId: null,
			bomId: null,
			productLineId: null,
			processId: null,
			projectId: null,
			requireQuantity: null,
			productQuantity: null,
			productDate: null,
			deliveryDate: null,
			remark: null,
			status: null,
			receiveStatus: null,
			serialNo: null
		};
		mesProductScheduleMaterialList.value = [];
		proxy.resetForm("productScheduleRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		activeQuery.value = {
			...queryParams.value
		}
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeProductDate.value = [];
		daterangeDeliveryDate.value = [];
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
		loadOptions();
		form.value.status = '0';
		form.value.serialNo = "JHPC" + Date.now();
		open.value = true;
		title.value = "添加计划排产";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		loadOptions();
		const _id = row.id || ids.value
		getProductSchedule(_id).then(response => {
			form.value = response.data;
			mesProductScheduleMaterialList.value = response.data.mesProductScheduleMaterialList;
			open.value = true;
			title.value = "修改生产计划";
		});
	}

	function submitForm(mode) {
		proxy.$refs["productScheduleRef"].validate(valid => {
			if (valid) {
				form.value.mesProductScheduleMaterialList = mesProductScheduleMaterialList.value;
				if (mode === 'submit' && form.id != null) {
					form.value.status = '1';
				}
				if (form.value.id != null) {
					updateProductSchedule(form.value).then(response => {
						proxy.$modal.msgSuccess(mode === 'submit' ? '提交成功' : '保存成功');
						open.value = false;
						getList();
					});
				} else {
					addProductSchedule(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除计划排产编号为"' + _ids + '"的数据项？').then(function() {
			return delProductSchedule(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 排产物料信息序号 */
	function rowMesProductScheduleMaterialIndex({
		row,
		rowIndex
	}) {
		row.index = rowIndex + 1;
	}

	/** 排产物料信息添加按钮操作 */
	function handleAddMesProductScheduleMaterial() {
		let obj = {};
		obj.materialId = "";
		obj.requireQuantity = "";
		obj.usageQuantity = "";
		obj.leftQuantity = "";
		obj.remark = "";
		mesProductScheduleMaterialList.value.push(obj);
	}

	/** 排产物料信息删除按钮操作 */
	function handleDeleteMesProductScheduleMaterial() {
		if (checkedMesProductScheduleMaterial.value.length == 0) {
			proxy.$modal.msgError("请先选择要删除的排产物料信息数据");
		} else {
			const mesProductScheduleMaterials = mesProductScheduleMaterialList.value;
			const checkedMesProductScheduleMaterials = checkedMesProductScheduleMaterial.value;
			mesProductScheduleMaterialList.value = mesProductScheduleMaterials.filter(function(item) {
				return checkedMesProductScheduleMaterials.indexOf(item.index) == -1
			});
		}
	}

	/** 复选框选中数据 */
	function handleMesProductScheduleMaterialSelectionChange(selection) {
		checkedMesProductScheduleMaterial.value = selection.map(item => item.index)
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有计划排产数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProductSchedule(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	getList();
</script>
