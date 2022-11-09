import storage from '@/utils/storage'
import i18n,{setI18nLanguage} from '@/locale'
const defaultState={
	key:"zh-cn",
}
const storageKey='locale'
export default {
	state: defaultState,
	mutations: {
        reload(state){
            console.debug('reload '+storageKey)
			let data=storage.get(storageKey);
			if(data){
				Object.keys(data).forEach(k=>{
					state[k]=data[k]
				})
				setI18nLanguage(i18n,state.key)
			}
        },
		clear(){
			console.debug('clear '+storageKey)
		},
		setLocale(state,key){
			state.key=key
			setI18nLanguage(i18n,key)
			console.debug('change '+storageKey,key)
			storage.set(storageKey+'.key',state.key)
		}
	}
}
