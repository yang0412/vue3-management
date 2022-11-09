import typeUtil from "@/utils/type";
// import requestUrlMap from '@/assets/mock/index'

const getRequestUrlMap = function () {
  const requestUrlMap = () => import("../assets/mock/index");
  return requestUrlMap()
    .then((d) => {
      return Promise.resolve(d.default);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};
export const getMockData = function (config) {
  let url = config.url;
  let methodType = config.method;
  return new Promise((res, rej) => {
    getRequestUrlMap().then((requestUrlMap) => {
      let urlConfig = requestUrlMap["@" + methodType + ":" + url];
      if (!urlConfig) {
        urlConfig = requestUrlMap[url];
      }

      if (!urlConfig) {
        console.warn("未配置mock数据", url);
        urlConfig = { mock: "common/success.json" };
        // return Promise.reject(config);
      }
      if (!urlConfig.mock) {
        console.warn("未配置mock数据", url);
        urlConfig.mock = "common/success.json";
        // return Promise.reject("未配置mock数据");
      }
      if (typeUtil.isString(urlConfig.mock)) {
        const mockData = () => import("../assets/mock/data/" + urlConfig.mock);
        mockData()
          .then((d) => {
            const data = d.default;
            res(data);
          })
          .catch((e) => rej(e));
      } else if (typeUtil.isFunction(urlConfig.mock)) {
        const mockData = urlConfig.mock.call(this, config.data, config);
        res(mockData);
      } else {
        rej("mock配置错误");
      }
    });
  });
};
