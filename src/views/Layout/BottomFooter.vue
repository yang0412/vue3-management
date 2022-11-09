<template>
  <div class="copyright">
    <div class="copyright-inner">
      <span style="display: inline-block; height: 24px; line-height: 24px"
        >{{ $config.system.APP_NAME }} Copyright © 2022
        <template v-if="$config.system.FOOTER.COMPANY_NAME">
          <a
            v-if="$config.system.FOOTER.COMPANY_SITE"
            :href="$config.system.FOOTER.COMPANY_SITE"
            target="_blank"
            tabindex="-1"
            style="margin: 0 5px"
          >
            {{ $config.system.FOOTER.COMPANY_NAME }}
          </a>
          <span v-else tabindex="-1" style="margin: 0 5px">
            {{ $config.system.FOOTER.COMPANY_NAME }}
          </span>
        </template>
      </span>
      <div style="margin: 0 auto" v-if="beian">
        <a
          target="_blank"
          href="/"
          style="display: inline-block; text-decoration: none; height: 26px; line-height: 26px"
        >
          <img
            src="../../assets/img/beian.png"
            style="display: inline-block; vertical-align: middle"
          />
          <p style="display: inline-block; margin: 0px 0px 0px 5px; color: rgb(2, 117, 88)">
            鲁公网安备 xxxxxxxxx号
          </p>
        </a>
        <span>| 网站备案/许可证号：鲁ICP备xxxxxxx号-2</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  beian: {
    //备案信息
    type: Boolean,
    default: false,
  },
});
</script>
<style lang="scss" scoped>
.copyright {
  font-size: 12px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  height: 100%;
  float: left;
  a {
    color: #337ab7;
    text-decoration: none;
    p {
      display: inline;
    }
  }
}
</style>
