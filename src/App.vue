<template>
  <el-config-provider :size="size" :zIndex="zIndex" :locale="currentLocale">
    <router-view v-if="routeLoaded"/>
  </el-config-provider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus'
import { ref, computed, nextTick, provide } from 'vue'
import { useStore } from 'vuex'
import {localeList} from '@/locale/index'
const store=useStore()
store.commit('reload')
const zIndex=computed(()=>store.state.theme.zIndex);
console.debug('zIndex',zIndex.value)
const size=computed(()=>store.state.theme.size);
console.debug('size',size.value)
const currentLocaleKey=computed(()=>store.state.locale.key);
console.debug('locale',currentLocaleKey)
const currentLocale=computed(()=>{
  return localeList.find(a=>a.key==currentLocaleKey.value).locale
})

const routeLoaded=ref(true)
const reload=function(){
  routeLoaded.value=false;
  nextTick().then(()=>{
    routeLoaded.value=true;
    console.debug('reload page')
  })
}
provide('reload',reload)
//屏幕宽度大小
const onWindowResize=function(){
  const clientWidth = document.body.clientWidth;
  console.debug('clientWidth',clientWidth)
  if(clientWidth < 500){
    store.commit('setIsMobile',true)
  }else{
    store.commit('setIsMobile',false)
  }
}
onWindowResize();
window.addEventListener('resize', onWindowResize);

</script>
<style lang="scss">
@import '@/assets/css/base.scss';

</style>
