<template>
  <div class="login-bg" style="width: 100%;height:100%;">
    <div class="login-main-bg">
      <div class="login-main">
        <img class="login" src="../../assets/img/logo-black.png" alt />
        <!-- 登录 -->
        <el-form ref="usernameLoginForm" :model="form"  :rules="rules">
          <div class="login-form">
            <el-form-item prop="username">
              <div class="login-group">
                <label class="login-label">登录账号</label>
                <input
                  type="text"
                  autocomplete="off"
                  placeholder="请输入账号"
                  @keyup.enter="login();"
                  v-model="form.username"
                  tabindex="1"
                  class="input-item"
                  maxlength="100"
                />
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="login-group">
                <label class="login-label">登录密码</label>
                <input
                  type="password"
                  autocomplete="new-password"
                  style="width:70%"
                  spellcheck="false"
                  @keyup.enter="login();"
                  v-model="form.password"
                  placeholder="请输入密码"
                  tabindex="2"
                  class="input-item"
                  value
                  maxlength="50"
                />
                <div class="fr">
                  <el-checkbox v-model="form.rememberme" label="记住密码" size="large" title="有效期90天"></el-checkbox>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="kaptcha">
              <div class="login-group">
                <label class="login-label">验证码</label>
                <input
                  type="text"
                  spellcheck="false"
                  @keyup.enter="login();"
                  v-model="form.kaptcha"
                  placeholder="验证吗"
                  class="input-item"
                  maxlength="4"
                  tabindex="4"
                />
                <img class="codeimg" :src="captchaForm.img" @click="getCaptchaImg" alt v-if="captchaForm.img" />
              </div>
            </el-form-item>
            
            <div class="login-btn">
              <button class="btn btn-primary" type="button" :disabled="loading" long @click="login" tabindex="5">
                <span>登&nbsp;录</span>
                <!-- <span v-else>登录。。。。。。</span> -->
              </button>
            </div>
          </div>
         </el-form>
        <div class="login-copyright">Copyright © 2022 
          <template v-if="$config.system.COMPANY_NAME">
            <a v-if="$config.system.COMPANY_SITE" :href="$config.system.COMPANY_SITE" target="_blank" tabindex="-1" style="margin: 0 5px" >
            {{$config.system.COMPANY_NAME}}
            </a>
            <a v-else tabindex="-1" style="margin: 0 5px" >
            {{$config.system.COMPANY_NAME}}
            </a>
          </template>
        </div>
      </div>
    </div>
     <div class="demo-spin-article" v-show="loadingPercent>0" >
        <!-- <Spin size="large" fix >
                <Icon type="ios-loading" size=28 class="demo-spin-icon-load" ></Icon>
                <div>
                <Progress :percent="(loadingPercent/6*100).toFixed(0)" :stroke-width="20" status="active" text-inside />
                加载基础数据{{loadingPercent}}/7
                </div>
            </Spin> -->
    </div>  
  </div>
</template>

<script>

import topRoutes from '@/router/topRoute'
import authApi from '@/api/auth'
import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        username: this.$store.state.user.rememberme.username,
        password: this.$store.state.user.rememberme.password,
        tenant:'',
        kaptcha:'',
        rememberme:!!this.$store.state.user.rememberme.username,
        signature:''
      },
      rules: {
        username: [
          {
            required: true,
            message: '账号不能为空',
            trigger: 'change',
          },
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'change',
          },
        ],
        kaptcha: [
          {
            required: true,
            message: '验证码不能为空',
            trigger: 'change',
          },
          // {
          //   asyncValidator(rule, value, callback) {
          //     putValidKaptchaApi({code:value,signature:self.captchaForm.signature}).then(data=>{
          //       if(!!data && data.code==0){
          //         callback();
          //       }
          //       else{
          //         callback(new Error(data.message));
          //       }
          //     })
          //     .catch(()=>{
          //       callback(new Error("验证码错误"));
          //     })
          //   }
          // }
        ],
      },
      captchaForm:{

      },
      loadingPercent:0
    };
  },
  mounted(){
    this.getCaptchaImg()
  },
  methods:{
    getCaptchaImg(){
      authApi.getKaptcha().then(d=>{
        if(!!d && d.code=='200'){
          this.captchaForm=Object.assign({},{img:'data:image/png;base64,'+d.data.img,signature:d.data.signature})
        }
      })
    },
    async login(){
      const validForm=await this.validForm();
      if(!validForm){
        return
      }
      const loading = ElLoading.service({
        lock: true,
        text: '正在加载',
        // background: 'rgba(0, 0, 0, 0.7)',
      })
      this.form.signature=this.captchaForm.signature
      authApi.login(this.form).then(d=>{
        console.log(d)
        if(!!d && d.code=='200'){
          this.$store.commit('setToken',d.data)
          this.$store.commit('setRememberme',this.form)
          Promise.all([this.getUserMenus(),this.getUserPermissions()]).then(()=>{
            this.$store.commit('setUser',{token:d.data.token,name:d.data.user.username,expire:d.data.expire})
            this.$router.push('/')
            loading.close()
          })
          .catch(()=>{
            loading.close()
          })
        }
        else{
          this.$message({
            message: d.message,
            type: 'warning',
          })
          loading.close()
        }
      }).catch(()=>{
        loading.close()
      })
    },
    getUserMenus(){
      return authApi.getUserMenus().then(d=>{
        console.log(d)
        if(!!d && d.code=='200'){
          this.$store.commit('setLeftMenu',{menuList:d.data})
          this.$store.commit('setTopMenu',{menuList:topRoutes})
          return Promise.resolve()
        }
        else{
          return Promise.reject()
        }
      }).catch(()=>{
        return Promise.reject()
      })
    },
    getUserPermissions(){
      return authApi.getUserPermissions().then(d=>{
        console.log(d)
        if(!!d && d.code=='200'){
          this.$store.commit('setPermissions',{permissions:d.data || []})
          return Promise.resolve()
        }
        else{
          return Promise.reject()
        }
      }).catch(()=>{
        return Promise.reject()
      })
    },
    validForm(){
      return new Promise((res,rej)=>{
        this.$refs.usernameLoginForm.validate(valid=>{
          res(valid)
        })
      })
      
    }
  }
};
</script>
<style lang="scss" scoped>
.login-main-bg{
  background: url("../../assets/img/left_bg.png") no-repeat center right;
  background-size: 100% 100%;
  top: 0;
  bottom: 0;
  left: 0;
  width: 48%;
  position: absolute;
  z-index: 0;
  display: flex;
  justify-content: center;
  /*上下居中*/
  align-items: center;
}
.login-bg {
  overflow: auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  top: 0;
  background: url("../../assets/img/right_bg.png") no-repeat center center;
  background-size: cover;
}


.login-main {
  overflow: visible;
  position: relative;
  left: -100px;
  width:440px;

}

.login-form {
  color: #323433;
  font-size: 14px;
  margin-top: 40px;
  :deep(.el-form-item__error){
    margin-top:-25px;
  }
}



.login-group {
  position: relative;
  margin-bottom: 32px;
  width: 100%;
  border-bottom: #b4b2b3 1px solid;
  &:hover {
    border-bottom: #0268ba 1px solid;
  }
  label.login-label {
	font-size: 16px;
    color: #676767;
    display: block;
    padding-left: 3px;
  }
  input.input-item {
    width: 100%;
    display: inline-block;
    background: none;
    border: none;
    height: 32px;
    padding: 6px 3px;
    line-height: 24px;
    outline: none;
    font-size: 15px;
    font-family: inherit;
  }
  button {
    position: absolute;
    right: 0;
  }
  .codeimg {
    position: absolute;
    right: 0;
    bottom:0
  }
}
.el-checkbox.el-checkbox--large :deep(.el-checkbox__label) {
    font-size: 15px;
}
.el-checkbox.is-checked :deep(.el-checkbox__label){
  color: #606266;
}
.el-checkbox :deep(.el-checkbox__input .el-checkbox__inner) {
    border-color: #337ab7;
}
.el-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #337ab7;
    border-color: #337ab7;
}
.login-group input::-webkit-input-placeholder {
  color: rgba(156, 156, 156, 0.95);
  font-size: 14px;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #e0ebfc inset;
  -webkit-text-fill-color: rgb(255, 255, 255);
}

.half-group {
  width: calc(50% - 10px);
  margin: 0;
}

.opration {
  display: inline-block;
  // padding-right: 60px;
}

.half-group select {
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  height: 36px;
  background: none;
}

.login-btn {
  margin-top: 30px;
  text-align: center;
  button {
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    width: 100%;
    height: 50px;
    border-radius: 5px;
    /* background: #0269b8; */
    font-size: 16px;
  }
  button:focus{
    // border:2px solid #6e9fca;
    box-shadow: 0 0 0px 2px rgb(45 140 240 / 20%);
  }
  button:disabled{
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
}

.login-fan {
  margin-top: 8px;
  text-align: right;
  a {
    color: #808080;
  }
}
.btn {
  margin: 0 5px;
  padding: 3px 15px;
  white-space: nowrap;
  border-color: transparent ;
  border-style: solid;
  border-width: 1px;
  display: inline-block;
  line-height: 24px;
  cursor: pointer;
  vertical-align: middle;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}
.btn:first-child {
  margin-left: 0;
}
.btn:last-child {
  margin-right: 0;
}
.btn img {
  vertical-align: middle;
}
.btn.btn-primary {
  background: #337ab7;
  color: #fff;
}

.login-error {
  margin: -10px 0 10px 0;
  height: 24px;
  color: #e63221;
}

.login-copyright {
  color: #333333;
  font-size: 12px;
  margin-top: 50px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  a {
    color:#337ab7;
    text-decoration: none;
  }
}

@media screen and (max-width: 500px) {
  .login-main-bg{
    width: 100%;
    }
  .login-main {
    left: 0px;
    padding:10px;
  }
  .login-bg {
    background: none
  }
  .login-main-bg{
    background: none;
    background-color:#fff;
  }
}
@media screen and (min-width:501px) and (max-width: 800px) {
  .login-main-bg{
    width: 80%;
  }
  .login-main {
    left: 0px;
    padding:10px;
  }
}
@media screen  and (min-width:801px) and (max-width: 1024px) {
  .login-main-bg{
    width: 60%;
  }
  .login-main {
    left: 0px;
    padding:10px;
  }
}
@media screen  and (min-width:1024px) and (max-width: 1365px) {
  .login-main-bg{
    width: 50%;
  }
  .login-main {
    left: 0px;
    padding:10px;
  }
}
</style>