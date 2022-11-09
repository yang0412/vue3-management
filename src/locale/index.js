import { createI18n } from 'vue-i18n'
import tool from '@/utils/tool'
import config from '@/config'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import enUs from 'element-plus/lib/locale/lang/en'
export const localeList=[
    {
        key:'zh-cn',
        label:'中文',
        locale:zhCn
    },
    {
        key:'en',
        label:'English',
        locale:enUs
    }
]
async function getLocaleMessages(locale){
    const localeFormat=tool.toCamelCase(locale).replace('_','-').toLowerCase()
    const messages = await import(
        /* webpackChunkName: "locale-[request]" */ `./lang/${localeFormat}.js`
      )
      const elMessages = localeList.find(a=>a.key==localeFormat).locale
      return {
        el: elMessages,
		...messages.default
      }
}
export  function setI18n(options){
    const i18n = createI18n(options)    
    setI18nLanguage(i18n, options.locale)
    return i18n
}
export async function setI18nLanguage(i18n, locale){
    const messages = await getLocaleMessages(locale)
      // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages)

    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        i18n.global.locale.value = locale
    }
}
const i18n=setI18n({locale:config.system.LOCALE,fallbackLocale:config.system.LOCALE,silentFallbackWarn:true,silentTranslationWarn:true})
export default i18n