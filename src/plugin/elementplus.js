import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'

export const message=function(option) {
    return new Promise((resolve)=>{
        const module=()=>import('element-plus/es/components/message/style/css')
        module().then(()=>{
            resolve(ElMessage(option))
        })                
    })
}

export const messageBox={
    confirm:function(){
        let arg=arguments
        return new Promise((resolve)=>{
            const module=()=>import('element-plus/es/components/message-box/style/css')
            module().then(()=>{
                resolve(ElMessageBox.confirm(...arg))
            })                
        })
    }    
}

export const notification=function(option) {
    return new Promise((resolve)=>{
        const module=()=>import('element-plus/es/components/notification/style/css')
        module().then(()=>{
            resolve(ElNotification(option))
        })                
    })
}

