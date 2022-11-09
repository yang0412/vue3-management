<script setup>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserInfo from "./userInfo.vue";
import ModifPassword from "./modifPassword.vue";
import ModifPhone from "./modifPhone.vue";

const router = useRouter();
const route = useRoute();
const data = reactive({});
</script>

<template>
  <div class="tabs">
    <el-tabs type="border-card">
      <el-tab-pane label="用户信息"><UserInfo /> </el-tab-pane>
      <el-tab-pane label="修改手机号"> <ModifPhone /></el-tab-pane>
      <el-tab-pane label="修改密码"> <ModifPassword /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="less" scoped></style>
