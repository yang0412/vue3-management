import axios from "axios";
import appConfig from "../config";
import store from "../store";
import { notification, messageBox } from "@/plugin/elementplus";
import router from "@/router";
import { getMockData } from "./mockRequest";

axios.defaults.baseURL = appConfig.request.BASE_URL;
axios.defaults.timeout = appConfig.request.TIME_OUT;
const TOKEN_HEADER = appConfig.request.TOKEN_HEADER;
const mockMode = appConfig.request.MOCK;
console.debug("mockMode", mockMode);
axios.interceptors.request.use(
  function (config) {
    let token = store.state.user.token;
    if (token) {
      config.headers[TOKEN_HEADER] = token;
    }
    if (config.dataType == "form") {
      config.headers["Content-Type"] = "application/json;charset=UTF-8";
    }
    if (config.cache === false && config.method == "get") {
      config.params = config.params || {};
      config.params["_"] = new Date().getTime();
    }
    if (config.params) {
      Object.keys(config.params).forEach((item) => {
        const key = config.params[item];
        if (key === "" || key === null || key === undefined) {
          delete config.params[item];
        }
      });
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (response.status == 200 && response.data.code == 200) {
      return response;
    } else {
      notification({
        title: "请求错误",
        message: response.data.message,
        type: "error",
      });
      if (response.data.code == 20003) {
        store.commit("clear");
        router.replace({ path: "/login" });
      }
      return Promise.reject(response);
    }
  },
  function (error) {
    if (error.response) {
      console.log(
        "error0",
        error.response,
        error.response.data.message || `Status:${error.response.status}，未知错误！`
      );
      if (error.response.status == 401) {
        messageBox
          .confirm("登录已失效，请重新登录后再操作。", "无权限访问", {
            type: "error",
            closeOnClickModal: false,
            center: true,
            confirmButtonText: "重新登录",
          })
          .then(() => {
            store.commit("clear");
            router.replace({ path: "/login" });
          })
          .catch(() => {});
      } else if (error.response.status == 403) {
        messageBox
          .confirm("当前用户无权访问，请重新登录后再操作。", "无权限访问", {
            type: "error",
            closeOnClickModal: false,
            center: true,
            confirmButtonText: "重新登录",
          })
          .then(() => {
            store.commit("clear");
            router.replace({ path: "/login" });
          })
          .catch(() => {});
      } else {
        notification({
          title: "请求错误",
          message: error.response.data.message || "服务器异常",
          type: "error",
        });
      }
    } else {
      notification({
        title: "请求错误",
        message: "请求服务器无响应！",
        type: "error",
      });
    }
    return Promise.reject(error);
  }
);
var http = {
  /** get 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   * @param  {参数} config
   */
  get: function (url, params = {}, config = {}) {
    if (mockMode && config.mockMode !== false) {
      return getMockData({
        url: url,
        method: "get",
        params: params,
        config: config,
      });
    }
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: url,
        params: params,
        ...config,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /** post 请求
   * @param  {接口地址} url
   * @param  {请求参数} data
   * @param  {参数} config
   */
  post: function (url, data = {}, config = {}) {
    if (mockMode && config.mockMode !== false) {
      return getMockData({
        url: url,
        method: "post",
        data: data,
        config: config,
      });
    }
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: url,
        data: data,
        ...config,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /** put 请求
   * @param  {接口地址} url
   * @param  {请求参数} data
   * @param  {参数} config
   */
  put: function (url, data = {}, config = {}) {
    if (mockMode && config.mockMode !== false) {
      return getMockData({
        url: url,
        method: "put",
        data: data,
        config: config,
      });
    }
    return new Promise((resolve, reject) => {
      axios({
        method: "put",
        url: url,
        data: data,
        ...config,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /** patch 请求
   * @param  {接口地址} url
   * @param  {请求参数} data
   * @param  {参数} config
   */
  patch: function (url, data = {}, config = {}) {
    if (mockMode && config.mockMode !== false) {
      return getMockData({
        url: url,
        method: "patch",
        data: data,
        config: config,
      });
    }
    return new Promise((resolve, reject) => {
      axios({
        method: "patch",
        url: url,
        data: data,
        ...config,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /** delete 请求
   * @param  {接口地址} url
   * @param  {请求参数} data
   * @param  {参数} config
   */
  delete: function (url, data = {}, config = {}) {
    if (mockMode && config.mockMode !== false) {
      return getMockData({
        url: url,
        method: "delete",
        data: data,
        config: config,
      });
    }
    return new Promise((resolve, reject) => {
      axios({
        method: "delete",
        url: url,
        data: data,
        ...config,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /** jsonp 请求
   * @param  {接口地址} url
   * @param  {JSONP回调函数名称} name
   */
  jsonp: function (url, name = "jsonp") {
    return new Promise((resolve) => {
      var script = document.createElement("script");
      var _id = `jsonp${Math.ceil(Math.random() * 1000000)}`;
      script.id = _id;
      script.type = "text/javascript";
      script.src = url;
      window[name] = (response) => {
        resolve(response);
        document.getElementsByTagName("head")[0].removeChild(script);
        try {
          delete window[name];
        } catch (e) {
          window[name] = undefined;
        }
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  },
};

export default http;
