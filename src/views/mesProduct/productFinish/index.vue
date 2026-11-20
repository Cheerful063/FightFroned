<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="生产计划" prop="planId">
				<el-input v-model="queryParams.planId" placeholder="请输入生产计划" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="生产作业" prop="jobId">
				<el-input v-model="queryParams.jobId" placeholder="请输入生产作业" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="产品" prop="materialId">
				<el-input v-model="queryParams.materialId" placeholder="请输入产品" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="完工日期" style="width: 308px">
				<el-date-picker v-model="daterangeFinishDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="生产批号" prop="batchNo">
				<el-input v-model="queryParams.batchNo" placeholder="请输入生产批号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
					<el-option v-for="dict in product_finish_status" :key="dict.value" :label="dict.label"
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
					v-hasPermi="['mesProduct:productFinish:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['mesProduct:productFinish:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['mesProduct:productFinish:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['mesProduct:productFinish:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="productFinishList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="单号" align="center" prop="serialNo" />
			<el-table-column label="生产计划" align="center" prop="planNo" />
			<!-- <el-table-column label="计划排产" align="center" prop="scheduleId" /> -->
			<el-table-column label="生产作业" align="center" prop="jobName" />
			<el-table-column label="产品" align="center" prop="productName" />
			<el-table-column label="型号" align="center" prop="productModel" />
			<el-table-column label="规格" align="center" prop="productSpec" />
			<el-table-column label="单位" align="center" prop="productUnit" />
			
			
			<el-table-column label="完工日期" align="center" prop="finishDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.finishDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="生产数量" align="center" prop="finishQuantity" />
			<el-table-column label="生产批号" align="center" prop="batchNo" />
			<el-table-column label="状态" align="center" prop="status">
				<template #default="scope">
					<dict-tag :options="product_finish_status" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['mesProduct:productFinish:edit']">详情
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['mesProduct:productFinish:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改生产完工单对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="productFinishRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="单号" prop="serialNo">
					<el-input v-model="form.serialNo" placeholder="请输入单号" disabled/>
				</el-form-item>
				<el-form-item label="生产计划" prop="planNo">
					<el-input v-model="form.planNo" placeholder="请输入生产计划" disabled/>
				</el-form-item>
				<el-form-item label="计划排产" prop="scheduleNo">
					<el-input v-model="form.scheduleNo" placeholder="请输入计划排产" disabled/>
				</el-form-item>
				<el-form-item label="生产作业" prop="jobName">
					<el-input v-model="form.jobName" placeholder="请输入生产作业" disabled />
				</el-form-item>
				<el-form-item label="产品" prop="productName">
					<el-input v-model="form.productName" placeholder="请输入产品" disabled/>
				</el-form-item>
				<el-form-item label="完工日期" prop="finishDate">
					<el-date-picker clearable v-model="form.finishDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择完工日期" disabled>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="生产数量" prop="finishQuantity">
					<el-input v-model="form.finishQuantity" placeholder="请输入生产数量" disabled />
				</el-form-item>
				<el-form-item label="生产批号" prop="batchNo">
					<el-input v-model="form.batchNo" placeholder="请输入生产批号" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择状态" disabled>
						<el-option v-for="dict in product_finish_status" :key="dict.value" :label="dict.label"
							:value="dict.value"></el-option>
					</el-select>
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

<script setup name="ProductFinish">
	import {
		listProductFinish,
		getProductFinish,
		delProductFinish,
		addProductFinish,
		updateProductFinish,
		exportProductFinish
	} from "@/api/mesProduct/productFinish";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();



















	const {
		product_finish_status
	} = proxy.useDict('product_finish_status')





	const productFinishList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeFinishDate = ref([]);
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			planId: null,
			jobId: null,
			materialId: null,
			finishDate: null,
			batchNo: null,
			status: null,
		},
		rules: {
			batchNo: [{
				required: true,
				message: "生产批号不能为空",
				trigger: "blur"
			}],
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询生产完工单列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeFinishDate && '' != daterangeFinishDate) {
			queryParams.value.params["beginFinishDate"] = daterangeFinishDate.value[0];
			queryParams.value.params["endFinishDate"] = daterangeFinishDate.value[1];
		}
		listProductFinish(queryParams.value).then(response => {
			productFinishList.value = response.rows;
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
			jobId: null,
			materialId: null,
			finishDate: null,
			finishQuantity: null,
			batchNo: null,
			status: null,
			remark: null
		};
		proxy.resetForm("productFinishRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeFinishDate.value = [];
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
		title.value = "添加生产完工单";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getProductFinish(_id).then(response => {
			form.value = response.data;
			open.value = true;
			title.value = "修改生产完工单";
		});
	}

	function submitForm() {
		proxy.$refs["productFinishRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateProductFinish(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addProductFinish(form.value).then(response => {
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
		proxy.$modal.confirm('是否确认删除生产完工单编号为"' + _ids + '"的数据项？').then(function() {
			return delProductFinish(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有生产完工单数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportProductFinish(val).then(res => {
				proxy.download(res.msg);
			});
		})
	}

	getList();
</script>
