import store from '@/store'
import typeUtil from '@/utils/type'
export const permissionHandler=(value,and)=>{
    const roles = store.state.user.permissions

    let hasPermission=false;
    if (value) {
        let checkValue=[];
        if(typeUtil.isArray(value)){
            checkValue=checkValue.concat(value);
        }
        if(typeUtil.isString(value)){
            checkValue.push(value)
        }
        if (checkValue.length > 0) {
            if(and){
                hasPermission = checkValue.every(role => {
                    return roles.includes(role)
                })
            }
            else{
                hasPermission = checkValue.some(role => {
                    return roles.includes(role)
                })
            }
        }
    }
    return hasPermission
}
export default {
    mounted(el, binding) {
        if(!permissionHandler(binding.value,binding.modifiers.and)){
            el.parentNode && el.parentNode.removeChild(el)
        }
    },
    updated(el, binding){
        if(!permissionHandler(binding.value,binding.modifiers.and)){
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}
