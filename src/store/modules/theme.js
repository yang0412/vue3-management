import storage from '@/utils/storage'
import tool from '@/utils/tool'
import colorTool from '@/utils/color'
import themeConfig from '@/config/theme'

const defaultState={
	size:'default',
	zIndex:3000,
	primary:'',
	bgColor:'',
	textColor:'',
	activeTextColor:'',
	sideBorderColor:'',
	key:themeConfig.defaultKey,
	// bgColor:'#ffffff',//#ffffff,#545c64
	// textColor:'#303133',//#303133,#fff
	// activeTextColor:'#409EFF',//#409EFF,#ffd04b
	// name:"default"
}
const DEFAULTSTATE=tool.copy(defaultState)
const storageKey='theme'
const getMenuHoverBgColor=function(bgColor){
	return colorTool.isDark(bgColor)?colorTool.lighten(bgColor,0.1):'#ecf5ff'
}
const changeHtmlColor=function(color){
	if(color.primary){
		document.documentElement.style.setProperty('--el-color-primary', color.primary);
		for (let i = 1; i <= 9; i++) {
			document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, colorTool.lighten(color.primary,i/10));
		}
		document.documentElement.style.setProperty(`--el-color-primary-darken-1`, colorTool.darken(color.primary,0.1));
	}
	// if(color.textColor){
	// 	document.documentElement.style.setProperty('--el-text-color-primary', color.textColor);
	// }
	if(color.bgColor){
		document.documentElement.style.setProperty('--el-bg-color-primary', color.bgColor);
		document.documentElement.style.setProperty('--el-menu-bg-color', color.bgColor);
		for (let i = 1; i <= 9; i++) {
			document.documentElement.style.setProperty(`--el-bg-color-primary-light-${i}`, colorTool.lighten(color.bgColor,i/10));
		}
	}
	if(color.bodyBgColor){
		document.documentElement.style.setProperty('--el-body-bg-color', color.bodyBgColor);
	}
}
export default {
	state: defaultState,
	mutations: {
        reload(state){
            console.debug('reload '+storageKey)
			let data=storage.get(storageKey);
			this.commit('changeTheme',data && Object.keys(data).length>0?data:{key:themeConfig.defaultKey})
			// if(data){
				// Object.keys(data).forEach(k=>{
				// 	state[k]=data[k]
				// })
			// }
			
        },
		clear(state){
			console.debug('clear '+storageKey)
			// Object.keys(DEFAULTSTATE).forEach(k=>{
			// 	state[k]=tool.copy(DEFAULTSTATE[k])
			// })
			// storage.clear(storageKey)
		},
		changeTheme(state,payload){
			console.debug('change '+storageKey,payload)
			let theme={}
			if(payload.key){
				theme=themeConfig.themes.find(a=>a.key==payload.key)
			}
			const req=Object.assign({},payload,theme || {})
			Object.keys(defaultState).forEach(k=>{
				if(req[k]!=null && req[k]!=undefined){
					state[k]=req[k];
					storage.set(storageKey+'.'+k,state[k])
				}
			})
			changeHtmlColor(req)
		}
	},
	getters:{
		menuHoverBgColor(state){
			return getMenuHoverBgColor(state.bgColor)
		}
	}
}
