<template>
  <div>
    <el-form :inline="true" class="query-form">
      <el-form-item label="设备码" label-width="100px">
        <el-input v-model="queryForm.uniqueCode" placeholder="请输入设备码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-form :inline="true" class="query-form" v-if="!isBinding">
        <el-form-item label="工单" label-width="100px">
          <el-select v-model="queryForm.licenseOrderId" class="m-2" placeholder="请选择工单">
            <el-option
              v-for="item in orderList"
              :key="item.licenseOrderId"
              :label="item.orderName"
              :value="item.licenseOrderId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" label-width="100px">
          <el-input v-model="queryForm.machineName" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input
            v-model="queryForm.remark"
            type="textarea"
            placeholder="请输入班级名称"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, defineProps, defineExpose, watch } from "vue";
import { message } from "@/plugin/elementplus";
import schoolApi from "@/api/school";
const props = defineProps({
  id: {
    type: String,
    defalut: "",
  },
});
watch(props, (newval) => {
  isBinding.value = true;
  queryForm.uniqueCode = "";
});
const queryForm = reactive({
  uniqueCode: "",
});
const isBinding = ref(true);
//设备码验证
const search = () => {
  schoolApi.verification({ uniqueCode: queryForm.uniqueCode }).then((res) => {
    if (!res.result) {
      isBinding.value = false;
      getOrder();
    } else {
      isBinding.value = true;
      message({
        showClose: true,
        message: "该设备已绑定",
        type: "warning",
      });
    }
  });
};
//根据学校ID查询工单
const orderList = ref([]);
const getOrder = () => {
  schoolApi.orderBycustomerId({ distributorCustomerId: props.id }).then((res) => {
    orderList.value = res.result;
  });
};
defineExpose({
  queryForm: queryForm,
  isBinding: isBinding,
});
</script>
<style lang="scss" scoped></style>
