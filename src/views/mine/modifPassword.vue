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
      <el-form-item label="公司名称："> 两点文化 </el-form-item>
      <el-form-item label="原密码：">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"><el-input v-model="form.name" placeholder="请输入原密码" /></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"><el-input v-model="form.name" placeholder="请输入新密码" /></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="确认新密码：">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"><el-input v-model="form.name" placeholder="请输入新密码" /></el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.fromBox {
  padding: 20px;
}
</style>
