module.exports = {
  APP_NAME: "代理商CRM", //应用名称
  CORE_VERSION: "2022.3", //核心版本，若变化，表示与旧版本部分不兼容
  BREAD_CRUMB: "left", //面包屑内容是左侧菜单还是顶部菜单的路径 left,top,none
  TOP_NAV: false, //是否显示顶部菜单，默认 false ，显示内容为 BREAD_CRUMB
  SHOW_TAG: true, //顶部是否显示tag栏
  LAYOUT_DIRECTION: "lefttop", //布局格式 top,topleft,lefttop
  LOCALE: "zh-cn", //默认语言
  FOOTER: {
    SHOW: true, //是否显示底部footer栏
    FIX: true, //是否固定底部footer栏
    BEIAN: false, //footer是否显示备案信息
    COMPANY_NAME: "", //公司名称
    COMPANY_SITE: "", //点击公司名称跳转的链接
  },
};
