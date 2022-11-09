import storage from "@/utils/storage";
import cookieUtil from "@/utils/cookie";
import tool from "@/utils/tool";
var AES = require("crypto-js/aes");
var EncUtf8 = require("crypto-js/enc-utf8");

const defaultState = {
  token: "",
  permissions: [],
  rememberme: {},
  info: {},
};
const DEFAULTSTATE = tool.copy(defaultState);
const storageKey = "user";
const SECRETKEY = "Vue-Element-Faster@2022";
export default {
  state: defaultState,
  mutations: {
    reload(state) {
      console.debug("reload " + storageKey);
      let data = storage.get(storageKey);
      if (data) {
        Object.keys(data).forEach((k) => {
          state[k] = data[k];
        });
      }
      state.token = cookieUtil.get("token");
      const remembermeData = cookieUtil.get("rememberme");
      if (remembermeData) {
        const obj = JSON.parse(AES.decrypt(remembermeData, SECRETKEY).toString(EncUtf8));
        state.rememberme = {
          loginName: obj.loginName,
          password: obj.password,
        };
      }
    },
    clear(state) {
      console.debug("clear " + storageKey);
      Object.keys(DEFAULTSTATE).forEach((k) => {
        state[k] = tool.copy(DEFAULTSTATE[k]);
      });
      storage.clear(storageKey);
      cookieUtil.del("token");
    },
    setToken(state, payload) {
      state.token = payload.token;
    },
    setPermissions(state, payload) {
      state.permissions = payload.permissions;
      storage.set(storageKey + ".permissions", state.permissions);
    },
    setUser(state, payload) {
      console.debug("setUser", payload);
      state.token = payload.token;
      state.info.loginName = payload.name;
      storage.set(storageKey + ".info", state.info);
      // storage.clear(storageKey+".token")
      cookieUtil.set("token", payload.token, payload.expire);
    },
    setRememberme(state, payload) {
      if (payload.rememberme) {
        state.rememberme = {
          loginName: payload.loginName,
          password: payload.password,
        };
        const data = AES.encrypt(JSON.stringify(state.rememberme), SECRETKEY).toString();

        cookieUtil.set("rememberme", data, 30 * 24 * 60 * 60);
      } else {
        state.rememberme = {};
        cookieUtil.del("rememberme");
      }
    },
  },
  getters: {
    isLogin(state) {
      return state.info.loginName != undefined && state.info.loginName != null;
    },
  },
};
