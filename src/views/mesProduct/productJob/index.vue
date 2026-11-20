<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="作业名称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入作业名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="开始时间" style="width: 308px">
				<el-date-picker v-model="daterangeStartTime" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" style="width: 308px">
				<el-date-picker v-model="daterangeEndTime" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="作业状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="请选择作业状态" clearable>
					<el-option v-for="dict in product_job_status" :key="dict.value" :label="dict.label"
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
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['mesProduct:productJob:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesProduct:productJob:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesProduct:productJob:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesProduct:productJob:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="productJobList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="作业名称" align="center" prop="name" />
			<el-table-column label="生产计划" align="center" prop="planNo" />
			<el-table-column label="计划排产" align="center" prop="scheduleNo" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="型号" align="center" prop="productModel" />
			<el-table-column label="规格" align="center" prop="productSpec" />
			<el-table-column label="单位" align="center" prop="productUnit" />
			<el-table-column label="开始时间" align="center" prop="startTime" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="结束时间" align="center" prop="endTime" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesProduct:productJob:edit']">修改
					</el-button>
<!-- 					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesProduct:productJob:remove']">删除
					</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改生产作业对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="productJobRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="作业名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入作业名称" />
				</el-form-item>
				
				<el-form-item label="生产计划" align="center" prop="planNo" width="200" v-if="form.id == null" >
						<el-input v-model="form.planNo" placeholder="请选择生产计划" readonly >
							<template #append>
								<el-button @click="openPick()">选择</el-button>
							</template>
						</el-input>

				</el-form-item>
				
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker clearable v-model="form.startTime" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择开始时间" :disabled="form.id != null">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker clearable v-model="form.endTime" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择结束时间" :disabled="form.id != null">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="生产数量" prop="productQuantity">
					<el-input v-model="form.productQuantity" placeholder="请输入生产数量" />
				</el-form-item>
				<el-form-item label="作业状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择作业状态" :disabled="form.id != null">
						<el-option v-for="dict in product_job_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" />
				</el-form-item>
				<el-divider content-position="center">生产作业物料信息</el-divider>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button type="primary" icon="Plus" @click="handleAddMesProductJobMaterial">添加</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" icon="Delete" @click="handleDeleteMesProductJobMaterial">删除</el-button>
					</el-col>
				</el-row>
				<el-table :data="mesProductJobMaterialList" :row-class-name="rowMesProductJobMaterialIndex"
					@selection-change="handleMesProductJobMaterialSelectionChange" ref="mesProductJobMaterial">
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column label="序号" align="center" prop="index" width="auto" />
					<el-table-column label="物料" prop="materialName" width="auto">
						<template #default="scope">
							<el-input v-model="scope.row.materialName" disabled/>
						</template>
					</el-table-column>
					<el-table-column label="消耗数量" prop="usageQuantity" width="auto">
						<template #default="scope">
							<el-input v-model="scope.row.usageQuantity" placeholder="请输入消耗数量" :disabled="form.id != null" />
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="detailRemark" width="auto">
						<template #default="scope">
							<el-input v-model="scope.row.detailRemark" placeholder="请输入备注" />
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
		
		
		
		<!-- 选择生产计划排产 -->
		<ProductScheduleSelect :open="materialSelectOpen" @onCancel="handleMaterialCancel"
			@onSelected="handleMaterialSelected"></ProductScheduleSelect>
	</div>
</template>

<script setup name="ProductJob">
	import { getProductSchedule } from "@/api/mesPlan/productSchedule";
	import ProductScheduleSelect from '@/components/product/ProductScheduleSelect';
	import {
		listProductJob,
		getProductJob,
		delProductJob,
		addProductJob,
		updateProductJob,
		exportProductJob
	} from "@/api/mesProduct/productJob";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();
	const materialSelectOpen = ref(false);
















	const {
		product_job_status
	} = proxy.useDict('product_job_status')





	const productJobList = ref([]);
	const mesProductJobMaterialList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const checkedMesProductJobMaterial = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeStartTime = ref([]);
	const daterangeEndTime = ref([]);
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			name: null,
			startTime: null,
			endTime: null,
			status: null,
		},
		rules: {
			name: [{
				required: true,
				message: "作业名称不能为空",
				trigger: "blur"
			}],
			productQuantity: [{
				required: true,
				message: "生产数量不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询生产作业列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeStartTime && '' != daterangeStartTime) {
			queryParams.value.params["beginStartTime"] = daterangeStartTime.value[0];
			queryParams.value.params["endStartTime"] = daterangeStartTime.value[1];
		}
		if (null != daterangeEndTime && '' != daterangeEndTime) {
			queryParams.value.params["beginEndTime"] = daterangeEndTime.value[0];
			queryParams.value.params["endEndTime"] = daterangeEndTime.value[1];
		}
		listProductJob(queryParams.value).then(response => {
			productJobList.value = response.rows;
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
			planId: null,
			scheduleId: null,
			productId: null,
			startTime: null,
			endTime: null,
			productQuantity: null,
			status: null,
			remark: null
		};
		mesProductJobMaterialList.value = [];
		proxy.resetForm("productJobRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeStartTime.value = [];
		daterangeEndTime.value = [];
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
		title.value = "添加生产作业";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getProductJob(_id).then(response => {
			form.value = response.data;
			mesProductJobMaterialList.value = response.data.mesProductJobMaterialList;
			open.value = true;
			title.value = "修改生产作业";
		});
	}

	function submitForm() {
		proxy.$refs["productJobRef"].validate(valid => {
			if (valid) {
				form.value.mesProductJobMaterialList = mesProductJobMaterialList.value;
				if (form.value.id != null) {
					updateProductJob(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addProductJob(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除生产作业编号为"' + _ids + '"的数据项？').then(function() {
			return delProductJob(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 生产作业物料序号 */
	function rowMesProductJobMaterialIndex({
		row,
		rowIndex
	}) {
		row.index = rowIndex + 1;
	}

	/** 生产作业物料添加按钮操作 */
	function handleAddMesProductJobMaterial() {
		let obj = {};
		obj.materialId = "";
		obj.usageQuantity = "";
		obj.detailRemark = "";
		mesProductJobMaterialList.value.push(obj);
	}

	/** 生产作业物料删除按钮操作 */
	function handleDeleteMesProductJobMaterial() {
		if (checkedMesProductJobMaterial.value.length == 0) {
			proxy.$modal.msgError("请先选择要删除的生产作业物料数据");
		} else {
			const mesProductJobMaterials = mesProductJobMaterialList.value;
			const checkedMesProductJobMaterials = checkedMesProductJobMaterial.value;
			mesProductJobMaterialList.value = mesProductJobMaterials.filter(function(item) {
				return checkedMesProductJobMaterials.indexOf(item.index) == -1
			});
		}
	}

	/** 复选框选中数据 */
	function handleMesProductJobMaterialSelectionChange(selection) {
		checkedMesProductJobMaterial.value = selection.map(item => item.index)
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有生产作业数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProductJob(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}
	
	function openPick() {
		materialSelectOpen.value = true;

	}
	
	function handleMaterialSelected(row) {
		form.value.planId = row.planId;
		form.value.scheduleId = row.id;
		form.value.planNo = row.planNo;
		form.value.productId = row.materialId;
		form.value.productName = row.productName;
		form.value.productModel = row.productModel;
		form.value.productSpec = row.productSpec;
		form.value.productUnit = row.productUnit;
		form.value.materialName = row.materialName;
		
		materialSelectOpen.value = false;
		
		// 带出该排产的物料明细 → 自动填生产作业明细
			getProductSchedule(row.id).then(res => {
				const mats = (res.data && res.data.mesProductScheduleMaterialList) || [];
				mesProductJobMaterialList.value = mats.map(m => ({
					materialId: m.materialId,
					usageQuantity: m.requireQuantity,
					materialName: m.materialName,
					detailRemark: ""
				}));
			});
		
		
		
	}
	
	function handleMaterialCancel() {
		materialSelectOpen.value = false;
	}

	getList();
</script>
