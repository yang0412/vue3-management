<template>
  <div class="search-box">
    <h2>筛选条件：</h2>
    <el-form :inline="true" :model="queryForm" class="query-form">
      <el-form-item label="客户类型">
        <el-select
          v-model="queryForm.customerType"
          class="m-2"
          :clearable="true"
          placeholder="请选择客户类型"
        >
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getSchoolList">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-content">
    <h2>学校列表：</h2>
    <el-table :data="schoolList" border v-loading="loading" max-height="500">
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column label="客户类型">
        <template #default="scope">
          <div>
            {{ type.filter((item) => item.value == scope.row["customerType"])[0].label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="installedQuantity" label="已安装数量" />
      <el-table-column prop="registerQuantity" label="总共注册数量" />
    </el-table>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import agentApi from "@/api/agent";
const route = useRoute();
//客户类型
const type = ref([
  {
    label: "学校",
    value: "school",
  },
  {
    label: "个人",
    value: "personal",
  },
  {
    label: "培训机构",
    value: "train",
  },
]);
const queryForm = reactive({
  distributorId: route.params.id,
  customerType: "school",
});
const loading = ref(false);
const schoolList = ref([]);
const getSchoolList = () => {
  loading.value = true;
  agentApi
    .schoollist(queryForm)
    .then((res) => {
      loading.value = false;
      schoolList.value = res.result || [];
      console.log(schoolList.value);
    })
    .catch((err) => {
      loading.value = false;
    });
};
getSchoolList();
</script>
<style lang="scss" scoped></style>
