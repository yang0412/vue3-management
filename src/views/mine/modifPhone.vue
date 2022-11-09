<script setup>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
</script>

<template>
  <div class="fromBox">
    <el-form :model="form" label-width="150px">
      <el-form-item label="原手机号："> 18757143101 </el-form-item>
      <el-form-item label="原手机号验证码：">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"><el-input v-model="form.name" placeholder="请输入验证码" /></el-col>
          <el-col :span="12"
            ><el-button type="primary" @click="onSubmit">获取验证码</el-button></el-col
          >
        </el-row>
      </el-form-item>
      <el-form-item label="新手机号：">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"><el-input v-model="form.name" placeholder="请输入新手机号" /></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="新手机号验证码：">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"><el-input v-model="form.name" placeholder="请输入验证码" /></el-col>
          <el-col :span="12"
            ><el-button type="primary" @click="onSubmit">获取验证码</el-button></el-col
          >
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.fromBox {
  padding: 20px;
}
</style>
