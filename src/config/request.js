export default {
  BASE_URL: process.env.NODE_ENV === "production" ? process.env.VUE_APP_API_URL : "/api", //API接口地址默认前缀
  TIME_OUT: 3000, //超时时间
  TOKEN_HEADER: "X-Access-Token", //api接口的token前缀
  MOCK: false, //是否模拟数据请求，
};
