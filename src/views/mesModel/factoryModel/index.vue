<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="auto" class="query-form">
      <el-form-item label="生产线名称" prop="productLineName">
        <el-input
          v-model="queryParams.productLineName"
          placeholder="请输入生产线名称"
          clearable
          style="width: 160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item style="display: block">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['mesModel:factoryModel:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mesModel:factoryModel:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mesModel:factoryModel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['mesModel:factoryModel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factoryModelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="产品" align="center" prop="productName" />
      <el-table-column label="物料档案编号" align="center" prop="materialId" />
      <el-table-column label="生产线名称" align="center" prop="productLineName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mesModel:factoryModel:edit']"
          >修改</el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mesModel:factoryModel:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工厂建模对话框 -->
    <el-dialog :title="title" :model-value="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
<!--        <el-form-item label="物料档案编号" prop="materialId">
          <el-input v-model="form.materialId" placeholder="请输入物料档案编号" />
        </el-form-item> -->
        <el-form-item label="生产线名称" prop="productLineName">
          <el-input v-model="form.productLineName" placeholder="请输入生产线名称" />
        </el-form-item>
        <el-form-item label="产品" prop="productName">
          <el-input v-model="form.productName" placeholder="请选择产品" disabled>
            <template #append>
              <el-button @click="handleSelectMaterial">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="产品型号" prop="productModel">
          <el-input v-model="form.productModel" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="产品规格" prop="productSpecification">
          <el-input v-model="form.productSpecification" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <editor :value="form.remark" @input="form.remark = $event" :min-height="192"></editor>
        </el-form-item>
        <el-divider content-position="center">工厂建模明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddMesFactoryModelDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteMesFactoryModelDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="mesFactoryModelDetailList" :row-class-name="rowMesFactoryModelDetailIndex" @selection-change="handleMesFactoryModelDetailSelectionChange" ref="mesFactoryModelDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>

          <el-table-column label="设备" prop="equipmentId" width="200">
            <template #default="scope">
              <el-form-item :prop="'mesFactoryModelDetailList.' + scope.$index+'.equipmentId'"
                :rules="rules.equipmentId">
                <el-select v-model="scope.row.equipmentId" placeholder="请选择设备"
                  @change="handleEquipmentChange(scope.row.equipmentId,scope.$index)">
                  <el-option v-for="dict in equipmentIdOptions" :key="dict.dictValue"
                    :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="编码" prop="code" width="150"/>
          <el-table-column label="型号" prop="model" width="150"/>
          <el-table-column label="生产日期" prop="productDate" width="150"/>
          <el-table-column label="生产批号" prop="batchNo" width="150"/>
          <el-table-column label="制造商" prop="manufacturer" width="150"/>
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

<script>
import { listFactoryModel, getFactoryModel, delFactoryModel, addFactoryModel, updateFactoryModel, exportFactoryModel } from "@/api/mesModel/factoryModel";

import Editor from '@/components/MyEditor';
import MaterialSelect from '@/components/Material/MaterialSelect';
import {
  getEquipmentInfo
}from "@/api/baseInfo/equipmentInfo";

export default {
  name: "FactoryModel",
  components: {
    Editor,
    MaterialSelect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesFactoryModelDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工厂建模表格数据
      factoryModelList: [],
      // 工厂建模明细表格数据
      mesFactoryModelDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      materialSelectOpen: false,
      // 设置字典
      equipmentIdOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productLineName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialId:[
            {required: true, message: "物料档案编号不能为空", trigger: "blur"}
        ],
      productName: [
        { required: true, message: "产品不能为空", trigger: "change" }
      ],
        productLineName: [
          { required: true, message: "生产线名称不能为空", trigger: "blur" }
        ],
        equipmentId:[
          {required: true, message: "设备不能为空", trigger: "blur"}
        ]
      },

    };
  },
  created() {
    this.getList();
    this.getQueryData("query_equipment").then(res => {
      this.equipmentIdOptions = res.data;
    })
  },
  watch: {
    'mesFactoryModelDetailList': {
      handler(newVal, oldVal) {
        this.form.mesFactoryModelDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /* 选择名称后，更新当前设备其他相关信息 */
    handleEquipmentChange(eqId,index){
      if(!eqId){
        return;
      }
      let row = this.mesFactoryModelDetailList[index];
      getEquipmentInfo(eqId).then(res => {
        let equip = res.data;
        row.code = equip.code;
        row.model = equip.model;
        row.productDate = equip.productDate;
        row.batchNo = equip.batchNo;
        row.manufacturer = equip.manufacturer;
      });
    },
    handleSelectMaterial(){
      this.materialSelectOpen = true;
    },
    handleMaterialSelected(list){
      if(list && list.length > 0){
        this.material = list[0];
        this.form.materialId = this.material.id;
        this.form.productName = this.material.name;
        this.form.productModel = this.material.model;
        this.form.productSpecification = this.material.specification;
      }
      this.materialSelectOpen = false;
    },
    handleMaterialCancel(){
      this.materialSelectOpen = false;
    },

    /** 查询工厂建模列表 */
    getList() {
      this.loading = true;
      listFactoryModel(this.queryParams).then(response => {
        this.factoryModelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        materialId: null,
        productLineName: null,
        remark: null,
        mesFactoryModelDetailList: [],
      };
      this.mesFactoryModelDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工厂建模";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFactoryModel(id).then(response => {
        this.form = response.data;
        this.mesFactoryModelDetailList = response.data.mesFactoryModelDetailList;
        this.open = true;
        this.title = "修改工厂建模";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id != null) {
            updateFactoryModel(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFactoryModel(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除工厂建模编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFactoryModel(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 工厂建模明细序号 */
    rowMesFactoryModelDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 工厂建模明细添加按钮操作 */
    handleAddMesFactoryModelDetail() {
      let obj = {};
      obj.equipmentId = "";
      this.mesFactoryModelDetailList.push(obj);
    },
    /** 工厂建模明细删除按钮操作 */
    handleDeleteMesFactoryModelDetail() {
      if (this.checkedMesFactoryModelDetail.length == 0) {
        this.$alert("请先选择要删除的工厂建模明细数据", "提示", { confirmButtonText: "确定", });
      } else {
        //this.mesFactoryModelDetailList.splice(this.checkMesFactoryModelDetail[0].index - 1 ,1)
        //使用循环 和 splice 来删除所有选中的项
        for(let i = this.checkedMesFactoryModelDetail.length - 1; i >= 0; i--){
          this.mesFactoryModelDetailList.splice(this.checkedMesFactoryModelDetail[0].index - 1, 1);
        }

      }
    },
    /** 单选框选中数据 */
    handleMesFactoryModelDetailSelectionChange(selection) {
      // if (selection.length > 1) {
      //   this.$refs.mesFactoryModelDetail.clearSelection();
      //   this.$refs.mesFactoryModelDetail.toggleRowSelection(selection.pop());
      // } else {
        this.checkedMesFactoryModelDetail = selection;
      // }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工厂建模数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFactoryModel(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

<style scoped>
.query-form :deep(.el-form-item) {
  margin-right: 16px;
}
</style>
