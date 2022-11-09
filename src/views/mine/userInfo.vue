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
      <el-form-item label="公司名称：">
        <el-input v-model="form.name" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="统一社会信用代码：">
        <el-input v-model="form.name" placeholder="请输入统一社会信用代码" />
      </el-form-item>
      <el-form-item label="公司地址：">
        <el-input v-model="form.name" placeholder="请输入公司地址" />
      </el-form-item>
      <el-form-item label="银行卡号：">
        <el-input v-model="form.name" placeholder="请输入银行卡号" />
      </el-form-item>
      <el-form-item label="开户银行：">
        <el-input v-model="form.name" placeholder="请输入开户银行" />
      </el-form-item>
      <el-form-item label="开户行支行：">
        <el-input v-model="form.name" placeholder="请输入开户行支行" />
      </el-form-item>
      <el-form-item label="联系方式：">
        <el-input v-model="form.name" placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="上级公司名称：">
        <el-input v-model="form.name" placeholder="请输入上级公司名称" />
      </el-form-item>
      <el-form-item label="上级公司地址：">
        <el-input v-model="form.name" placeholder="请输入上级公司地址" />
      </el-form-item>
      <el-form-item label="上级公司联系方式：">
        <el-input v-model="form.name" placeholder="请输入上级公司联系方式" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>复制信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.fromBox {
  padding: 20px;
}
</style>
