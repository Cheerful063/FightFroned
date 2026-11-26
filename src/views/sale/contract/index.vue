<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
			<el-form-item label="合同编号" prop="contractNo">
				<el-input v-model="queryParams.contractNo" placeholder="请输入合同编号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="订单编号" prop="orderNo">
				<el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="业务员" prop="workStaff">
				<el-select v-model="queryParams.workStaff" placeholder="请选择业务员" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="客户名称" prop="customerId">
				<el-select v-model="queryParams.customerId" placeholder="请选择客户" clearable>
					<el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="交货日期" style="width: 308px;font-weight: bold;">
				<el-date-picker v-model="daterangeDeliveryDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="送货方式" prop="deliveryType">
				<el-select v-model="queryParams.deliveryType" placeholder="请选择送货方式" clearable>
					<el-option v-for="dict in scm_delivery_type" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="签订日期" style="width: 308px;font-weight: bold;">
				<el-date-picker v-model="daterangeSignDate" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="申请人" prop="applyUser">
				<el-select v-model="queryParams.applyUser" placeholder="请输入申请人" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="申请时间" style="width: 308px;font-weight: bold;">
				<el-date-picker v-model="daterangeApplyTime" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="申请状态" prop="applyStatus">
				<el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable>
					<el-option v-for="dict in apply_status" :key="dict.value" :label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="审核人" prop="auditUser">
				<!-- <el-input v-model="queryParams.auditUser" placeholder="请输入审核人" clearable @keyup.enter="handleQuery" /> -->
				<el-select v-model="queryParams.auditUser" placeholder="请输入审核人" clearable>
					<el-option v-for="u in userList" :key="u.userId" :label="u.nickName" :value="u.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="审核时间" style="width: 308px;font-weight: bold;">
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

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['sale:contract:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['sale:contract:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['sale:contract:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport"
					v-hasPermi="['sale:contract:export']">导出
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="订单编号" align="center" prop="orderNo" />
			<el-table-column label="客户名称" align="center" prop="customerName" />
			<el-table-column label="联系人" align="center" prop="contact" />
			<el-table-column label="联系方式" align="center" prop="contactTel" />
			<el-table-column label="金额合计" align="center" prop="contractAmount" />
			<el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
				<template #default="scope">
					<span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="申请人" align="center" prop="applyUserName" />
			<el-table-column label="申请时间" align="center" prop="applyTime" width="180">
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
			<el-table-column label="审核时间" align="center" prop="auditTime" width="180">
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
						v-hasPermi="['sale:contract:edit']">修改
					</el-button>
					<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['sale:contract:remove']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改销售合同对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form ref="contractRef" :model="form" :rules="rules" label-width="90px">

				<el-form-item label="订单编号" prop="orderNo">
					<el-input v-model="form.orderNo" placeholder="请选择订单编号">
						<template #append>
							<el-button @click="selectOrder">选择</el-button>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item label="送货方式" prop="deliveryType">
					<el-select v-model="form.deliveryType" placeholder="请选择送货方式" >
						<el-option v-for="dict in scm_delivery_type" :key="dict.value" :label="dict.label"
							:value="dict.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="收货地址" prop="address">
					<el-input v-model="form.address" placeholder="请输入收货地址" />
				</el-form-item>
				<el-form-item label="联系人" prop="contact">
					<el-input v-model="form.contact" placeholder="请输入联系人" />
				</el-form-item>
				<el-form-item label="联系方式" prop="contactTel">
					<el-input v-model="form.contactTel" placeholder="请输入联系电话" />
				</el-form-item>
				<el-form-item label="签订日期" prop="signDate">
					<el-date-picker clearable v-model="form.signDate" type="date" value-format="YYYY-MM-DD"
						placeholder="请选择签订日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" />
				</el-form-item>


				<el-divider content-position="center">合同明细信息</el-divider>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button type="primary" icon="Plus" @click="handleAddScmSaleContractDetail">添加</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="danger" icon="Delete" @click="handleDeleteScmSaleContractDetail">删除</el-button>
					</el-col>
				</el-row>
				<el-table :data="scmSaleContractDetailList" :row-class-name="rowScmSaleContractDetailIndex"
					@selection-change="handleScmSaleContractDetailSelectionChange" ref="scmSaleContractDetail">
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column label="序号" align="center" prop="index" width="50" />

					<el-table-column label="产品" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.materialName" placeholder="请选择" readonly >
								<template #append>
									<el-button @click="selectMaterial(scope.row)">选择</el-button>
								</template>
							</el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="型号" prop="materialModel" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.materialModel" placeholder="" readonly/>
						</template>
					</el-table-column>
					<el-table-column label="规格" prop="materialSpec" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.materialSpec" placeholder="" readonly/>
						</template>
					</el-table-column>
					<el-table-column label="单位" prop="materialUnit" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.materialUnit" placeholder="" readonly/>
						</template>
					</el-table-column>
					<el-table-column label="单价" prop="price" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.price" readonly />
						</template>
					</el-table-column>
					<el-table-column label="订货数量" prop="quantity" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.quantity" placeholder="请输入订货数量"
								@blur="calcAmount(scope.row)"/>
						</template>
					</el-table-column>

					<el-table-column label="金额" prop="amount" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.amount"  readonly />
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="detailRemark" width="150">
						<template #default="scope">
							<el-input v-model="scope.row.detailRemark" placeholder="请输入备注" />
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button v-if="form.id == null" type="primary" @click="submit(0)">确 定</el-button>
					<template v-else>
					    <el-button type="primary" @click="submit(0)">保 存</el-button>
					    <el-button type="success" @click="submit(1)">提 交</el-button>
					</template>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<OrderSelect :open="openOrderSelect" @onCancel="openOrderSelect = false" @onSelected="handleopenOrderSelect">
		</OrderSelect>
		
		<MaterialSelect :open="openMaterialSelect" @onCancel="openMaterialSelect = false" @onSelected="handleMaterialSelect"></MaterialSelect>
		
	</div>
</template>

<script setup name="Contract">
	import MaterialSelect from "@/components/Material/MaterialSelect"
	import OrderSelect from "@/components/Sale/OrderSelect"
	import {
		listCustomer
	} from "@/api/sale/customer"
	import {
		listUser
	} from "@/api/system/user"
	import {
		listContract,
		getContract,
		delContract,
		addContract,
		updateContract,
		exportContract
	} from "@/api/sale/contract";
	import {
		ElMessageBox
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();


	const daterangeAuditTime = ref([])




















	const {
		scm_delivery_type
	} = proxy.useDict('scm_delivery_type')










	const {
		apply_status
	} = proxy.useDict('apply_status')






	const {
		audit_status
	} = proxy.useDict('audit_status')









	const contractList = ref([]);
	const scmSaleContractDetailList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const checkedScmSaleContractDetail = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const daterangeDeliveryDate = ref([]);
	const daterangeSignDate = ref([]);
	const daterangeApplyTime = ref([]);
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			contractNo: null,
			orderNo: null,
			workStaff: null,
			customerId: null,
			deliveryDate: null,
			deliveryType: null,
			signDate: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
		},
		rules: {
			orderNo: [{ required: true, message: "订单编号不能为空", trigger: "blur" }],
			deliveryType: [{ required: true, message: "请选择送货方式", trigger: "change" }],
			address: [{ required: true, message: "收货地址不能为空", trigger: "blur" }],
			contact: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
			contactTel: [{ required: true, message: "联系方式不能为空", trigger: "blur" }],
			signDate: [{ required: true, message: "请选择签订日期", trigger: "change" }],
		},
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询销售合同列表 */
	function getList() {
		loading.value = true;
		queryParams.value.params = {};
		if (null != daterangeDeliveryDate && '' != daterangeDeliveryDate) {
			queryParams.value.params["beginDeliveryDate"] = daterangeDeliveryDate.value[0];
			queryParams.value.params["endDeliveryDate"] = daterangeDeliveryDate.value[1];
		}
		if (null != daterangeSignDate && '' != daterangeSignDate) {
			queryParams.value.params["beginSignDate"] = daterangeSignDate.value[0];
			queryParams.value.params["endSignDate"] = daterangeSignDate.value[1];
		}
		if (null != daterangeApplyTime && '' != daterangeApplyTime) {
			queryParams.value.params["beginApplyTime"] = daterangeApplyTime.value[0];
			queryParams.value.params["endApplyTime"] = daterangeApplyTime.value[1];
		}
		listContract(queryParams.value).then(response => {
			contractList.value = response.rows;
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
			contractNo: null,
			orderId: null,
			orderNo: null,
			workStaff: null,
			customerId: null,
			deliveryDate: null,
			address: null,
			contact: null,
			contactTel: null,
			deliveryType: null,
			contractAmount: null,
			signDate: null,
			applyUser: null,
			applyTime: null,
			applyStatus: null,
			auditUser: null,
			auditTime: null,
			auditStatus: null,
			auditComment: null,
			remark: null,
			deliveryFlag: null
		};
		scmSaleContractDetailList.value = [];
		proxy.resetForm("contractRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		daterangeDeliveryDate.value = [];
		daterangeSignDate.value = [];
		daterangeApplyTime.value = [];
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
		title.value = "添加销售合同";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getContract(_id).then(response => {
			form.value = response.data;
			scmSaleContractDetailList.value = response.data.scmSaleContractDetailList;
			open.value = true;
			title.value = "修改销售合同";
		});
	}

	/** 删除按钮操作 */
	function handleDelete(row) {
		const _ids = row.id || ids.value;
		proxy.$modal.confirm('是否确认删除销售合同编号为"' + _ids + '"的数据项？').then(function() {
			return delContract(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 合同明细序号 */
	function rowScmSaleContractDetailIndex({
		row,
		rowIndex
	}) {
		row.index = rowIndex + 1;
	}

	/** 合同明细添加按钮操作 */
	function handleAddScmSaleContractDetail() {
		let obj = {};
		obj.materialId = "";
		obj.price = "";
		obj.quantity = "";
		obj.amount = "";
		obj.detailRemark = "";
		scmSaleContractDetailList.value.push(obj);
	}

	/** 合同明细删除按钮操作 */
	function handleDeleteScmSaleContractDetail() {
		if (checkedScmSaleContractDetail.value.length == 0) {
			proxy.$modal.msgError("请先选择要删除的合同明细数据");
		} else {
			const scmSaleContractDetails = scmSaleContractDetailList.value;
			const checkedScmSaleContractDetails = checkedScmSaleContractDetail.value;
			scmSaleContractDetailList.value = scmSaleContractDetails.filter(function(item) {
				return checkedScmSaleContractDetails.indexOf(item.index) == -1
			});
		}
	}

	/** 复选框选中数据 */
	function handleScmSaleContractDetailSelectionChange(selection) {
		checkedScmSaleContractDetail.value = selection.map(item => item.index)
	}

	/** 导出按钮操作 */
	function handleExport() {
		ElMessageBox.confirm('是否确认导出所有销售合同数据项?', "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(function() {
			return exportContract(val).then(res => {
				proxy.download(res.msg);
			});
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

	const customerList = ref([])

	function getCustomers() {
		listCustomer({
			pageNum: 1,
			pageSize: 999
		}).then(res => {
			customerList.value = res.rows;
		})
	}

	const openOrderSelect = ref(false);

	function selectOrder() {
		openOrderSelect.value = true;
	}

	function handleopenOrderSelect(rows) {
		// console.log(rows)
		const order = rows[0];
		form.value.orderId = order.id;
		form.value.orderNo = order.orderNo;
		form.value.customerId = order.customerId
		openOrderSelect.value = false;

	}
	
	const openMaterialSelect = ref(false);
	const currentDetailRow = ref(null);
	
	function selectMaterial(row){
		currentDetailRow.value = row;
		openMaterialSelect.value = true;
	}
	
	function handleMaterialSelect(rows){
		// console.log(rows)
		const m = rows[0];
		const d = currentDetailRow.value;
		d.materialId = m.id;
		d.materialModel = m.model;
		d.materialName = m.name;
		d.materialSpec = m.specification;
		d.materialUnit = m.unit;
		d.price = m.price;
		d.amount = m.price * d.quantity;
		openMaterialSelect.value = false;
	}
	

	
	function submit(flag){
		proxy.$refs['contractRef'].validate(valid => {
			if(valid){
				form.value.scmSaleContractDetailList = scmSaleContractDetailList.value;
				
				if(flag === 1){
					form.value.applyStatus = "1";
				}else if(form.value.id == null){
					form.value.applyStatus = "0"; //新建的时候只保存 
				}
				
				if(form.value.id != null){
					updateContract(form.value).then(res => {
						proxy.$modal.msgSuccess(flag === 1 ? "提交成功" : "修改成功");
						open.value = false;
						getList();
					})
				}else{
					addContract(form.value).then(res => {
						proxy.$modal.msgSuccess(flag === 1 ? "提交成功" : "新建成功");
						open.value = false;
						getList();
					})
				}
			}
		})
	}

	function calcAmount(row){
		const price = Number(row.price) || 0;
		const quantity = Number(row.quantity) || 0;
		row.amount = price * quantity;
	}




	getUsers();
	getCustomers();
	getList();
</script>
