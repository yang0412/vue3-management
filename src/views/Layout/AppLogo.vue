<template>
  <div
    class="logo-container"
    :class="{
      'logo-container-flat': $config.system.LAYOUT_DIRECTION != 'lefttop',
      'logo-container-collapse': isCollapse,
    }"
  >
    <img
      src="@/assets/img/logo.png"
      v-if="isCollapse && $config.system.LAYOUT_DIRECTION == 'lefttop'"
    />
    <div
      style="font-size: 25px; font-weight: 500"
      :style="{ color: $store.state.theme.textColor }"
      v-else
    >
      {{ $config.system.APP_NAME }}
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.logo-container {
  height: 50px;
  line-height: 50px;
  text-align: center;
  vertical-align: middle;
  img {
    height: 40px;
    width: 40px;
    margin: 5px;
  }
}
.logo-container-collapse {
  img {
    width: 40px;
  }
}
.logo-container-flat {
  float: left;
  padding-left: 15px;
  padding-right: 15px;
  img {
    width: 100px;
  }
}
.logo-container-flat.logo-container-collapse {
  img {
    width: 40px;
  }
}
</style>
