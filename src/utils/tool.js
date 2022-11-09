import typeUtil from "./type";
let pro = {
  // copy:function(data) {
  //     const t = typeUtil.getType(data);
  //     let o;

  //     if (t === 'array') {
  //         o = [];
  //     } else if (t === 'object') {
  //         o = {};
  //     } else {
  //         return data;
  //     }

  //     if (t === 'array') {
  //         for (let i = 0; i < data.length; i++) {
  //             o.push(copy(data[i]));
  //         }
  //     } else if (t === 'object') {
  //         for (let i in data) {
  //             o[i] = copy(data[i]);
  //         }
  //     }
  //     return o;
  // },

  copy: (function () {
    "use strict";
    return function innerCopy(data) {
      const t = typeUtil.getType(data);
      let o;

      if (t === "array") {
        o = [];
        for (let i = 0; i < data.length; i++) {
          o.push(innerCopy(data[i]));
        }
      } else if (t === "object") {
        o = {};
        for (let i in data) {
          if (Object.prototype.hasOwnProperty.call(data, i)) {
            o[i] = innerCopy(data[i]);
          }
        }
      } else {
        return data;
      }
      return o;
    };
  })(),
  flatMap: (function () {
    "use strict";
    return function innerMap(arr) {
      let newArr = [];
      arr.forEach((item) => {
        newArr.push(item);
        if (item.children && item.children.length > 0) {
          newArr.push(...innerMap(item.children));
        }
      });
      return newArr;
    };
  })(),
  toCamelCase: function (s) {
    return s.replace(/([A-Z])/g, "_$1");
  },
  ensureNotNull: function (value) {
    if (typeUtil.isNull(value) || typeUtil.isUndefined(value)) {
      return 0;
    }
    return value;
  },
  deepLocate: (function () {
    "use strict";
    return function innerLocate(target, arr) {
      let newArr = [];
      arr.forEach((item) => {
        newArr.push(item);
        if (item.children && item.children.length > 0) {
          newArr.push(...innerLocate(item.children));
        }
      });
      return newArr;
    };
  })(),
  getParentNodes: (function () {
    "use strict";
    return function getInnerParentNodes(
      currentValue,
      allDatas,
      props = { label: "name", key: "id", children: "children" }
    ) {
      let parent = [];
      (allDatas || []).forEach((item) => {
        if (parent.length == 0) {
          if (currentValue == (item[props.key] || 0)) {
            parent.push(item);
          } else if (item[props.children] && item[props.children].length > 0) {
            const childArr = getInnerParentNodes(item[props.children]);
            if (childArr.length > 0) {
              parent.push(item);
              parent = parent.concat(childArr);
            }
          }
        }
      });
      return parent;
    };
  })(),

  formatDate: function (date, fmt) {
    // 获取年份
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1, //匹配到的结果yyyy，替换成后面的内容
        (date.getFullYear() + "").substr(4 - RegExp.$1.length) //(date.getFullYear() + "") 2019 + + "" 表示将数字转换成字符串
        //substr表示截取几位，假如传过来的是两位yy，就将2019截取4-2位成了19
      );
    }

    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };

    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + "";
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
      }
    }

    return fmt;
  },
};
function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
export default pro;
