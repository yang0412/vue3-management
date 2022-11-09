export default {
  "/login": {
    mock: "login.json", //登录
  },
  "/kaptcha": {
    mock: "kaptcha.json",
  },
  "@get:/user/permissions": {
    mock: "userPermissions.json",
  },
  "@get:/organization/all": {
    mock: "orgList.json",
  },
};
