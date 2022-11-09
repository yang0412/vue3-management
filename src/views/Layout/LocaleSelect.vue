<template>
  <el-dropdown style="line-height: 50px" ref="localePicker" trigger="click" @command="changeLocale">
    <div class="local-label">
      {{ currentLocaleLabel }}
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="item in localeList" :key="item.key">
          <el-dropdown-item :command="item.key" v-if="item.key != currentLocaleKey">
            {{ item.label }}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { computed, nextTick } from "vue";
import { useStore } from "vuex";
import { localeList } from "@/locale/index";
import { useRoute } from "vue-router";
import config from "@/config";
import i18n from "@/locale";
const store = useStore();

const currentLocaleKey = computed(() => store.state.locale.key);
const currentLocaleLabel = computed(() => {
  return localeList.find((a) => a.key == currentLocaleKey.value).label;
});
const route = useRoute();
function changeLocale(key) {
  store.commit("setLocale", key);
  nextTick().then(() => {
    setTimeout(() => {
      document.title = route.meta.title
        ? `${i18n.global.t(route.meta.title, key)} - ${config.system.APP_NAME}`
        : `${config.system.APP_NAME}`;
    }, 10);
  });
}
const textColor = computed(() => store.state.theme.textColor);
</script>

<style lang="scss" scoped>
.el-dropdown--small {
  line-height: 50px;
  .local-label {
    font-size: 12px;
  }
}
.local-label {
  // height: 20px;
  border: 1px solid var(--el-border-color-base);
  border-radius: var(--el-border-radius-base);
  position: relative;
  justify-content: center;
  align-items: center;
  display: inline-flex;
  color: v-bind(textColor);
  height: 100%;
  width: 60px;
  cursor: pointer;
}
</style>
