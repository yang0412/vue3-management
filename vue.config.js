process.env.VUE_APP_VERSION = require("./package.json").version;
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const userConfig = require("./src/config/system");
const IconsResolver = require("unplugin-icons/resolver");
const { FileSystemIconLoader } = require("unplugin-icons/loaders");
const Icons = require("unplugin-icons/webpack");

module.exports = {
  productionSourceMap: false, //关闭生产环境sourcemap
  // chainWebpack: config => {
  //   config
  //     .plugin('html')
  //     .tap(args => {
  //       args[0].title= '你想设置的title名字'
  //       console.log('appConfig',appConfig)
  //       return args
  //     })
  // },
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");

    config.plugin("html").tap((args) => {
      args[0].title = userConfig.APP_NAME;
      return args;
    });
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    return {
      plugins: [
        AutoImport({
          resolvers: [ElementPlusResolver({ importStyle: false })],
        }),
        Components({
          resolvers: [
            // Auto register icon components
            // 自动注册图标组件
            IconsResolver({
              // enabledCollections: ['ep'],
            }),
            // 自动导入 Element Plus 组件
            ElementPlusResolver(),
          ],
        }),
        Icons({
          compiler: "vue3",
          // autoInstall: true,//不需要自动下载
          customCollections: {
            extra: FileSystemIconLoader("src/assets/svg", (svg) =>
              svg.replace(/^<svg /, '<svg fill="currentColor" ')
            ),
          },
        }),
      ].concat((process.argv || []).indexOf("--report") > -1 ? [new BundleAnalyzerPlugin()] : []),
    };
  },
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
