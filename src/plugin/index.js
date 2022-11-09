import config from "../config";
import http from "../utils/request";
import i18n from "../locale";
import { permissionHandler } from "../utils/permission";
import permission from "../utils/permission";
import * as Icons from "@element-plus/icons-vue";
import { message, messageBox } from "@/plugin/elementplus";
export default {
  install: (app) => {
    app.config.globalProperties.$config = config;
    app.config.globalProperties.$http = app.config.globalProperties.$ajax = http;
    app.config.globalProperties.$t = i18n.global.t;
    app.config.globalProperties.$hasPermission = app.config.globalProperties.$permission =
      permissionHandler;
    app.config.globalProperties.$message = message;
    app.config.globalProperties.$messageBox = messageBox;
    Object.keys(Icons).forEach((key) => {
      app.component(key == "Menu" ? "IconMenu" : key, Icons[key]); //IconMenu
    });
    app.directive("permission", permission);
    console.log(
      "\n"
        .concat(
          " %c ",
          config.system.APP_NAME,
          " v",
          require("../../package.json").version,
          "(",
          config.system.CORE_VERSION,
          ")"
        )
        .concat(" %c https://gitee.com/shengxp_760/vue-element-faster ", "\n"),
      "color: #fadfa3; background: #030307; padding:5px 0;",
      "background: #fadfa3; padding:5px 0;"
    );
  },
};
