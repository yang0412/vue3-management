import { createStore, createLogger } from "vuex";

const files = require.context("./modules", false, /\.js$/);
const modules = {};
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});
const debug = process.env.NODE_ENV !== "production";
export default createStore({
  modules: modules,
  plugins: debug ? [createLogger()] : [],
});
