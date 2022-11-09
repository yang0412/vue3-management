//STORAGE_KEY为空，多key模式
const STORAGE_KEY='';
var localstorage = {

    set: function(key, value, object,callback) {
        var keys=key.split('.').filter(m=>m!='');
        if(STORAGE_KEY.length>0){            
            let current=object || JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
            let cb=()=>{
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
            }
            if(current!=undefined && current!=null && keys.length>0){
                let firstKey=keys.shift();
                if(keys.length>0){
                    if(current[firstKey]==undefined){
                        current[firstKey]={}
                    }
                    this.set(keys.join('.'),value,current[firstKey],callback?callback:cb);
                    return;
                }
                else{
                    current[firstKey]=value;
                }
            }
            else{
                current[key]=value;
            }
            callback?callback():cb();
        }
        else{
            if(keys.length>0){
                let firstKey=keys.shift();
                const storeKey=firstKey;
                let current=object;
                let currentValue=null;
                let skip=false;
                if(current){
                    currentValue=current[firstKey]
                }
                else{
                    current=JSON.parse(window.localStorage.getItem(firstKey) || '{}');
                    if(keys.length>0){
                        firstKey=keys.shift();
                        currentValue=current[firstKey];
                    }
                    else{
                        current=value
                        skip=true
                    }                    
                }
                let cb=()=>{
                    window.localStorage.setItem(storeKey, JSON.stringify(current));
                }
                if(keys.length>0){
                    if(currentValue==undefined){
                        currentValue={}
                    }
                    this.set(keys.join('.'),value,currentValue,callback?callback:cb);
                    return
                }
                else{
                    skip?'':current[firstKey]=value;
                }
                callback?callback():cb();
            }            
        }
    },
    get: function(key,object) {
        var keys=key.split('.').filter(m=>m!='');
        if(STORAGE_KEY.length>0){
            let current=object || JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
            if(current!=undefined && current!=null && keys.length>0){
                let firstKey=keys.shift();
                if(keys.length>0){
                    return this.get(keys.join('.'),current[firstKey]);
                }
                else{
                    return current[key];
                }
            }
            else{
                return undefined;
            }
        }
        else{
            if(keys.length>0){
                let firstKey=keys.shift();
                var current=undefined;
                var currentValue=undefined;
                if(object){
                    current=object;
                    currentValue=object[firstKey]
                }
                else{
                    current=JSON.parse(window.localStorage.getItem(firstKey) || '{}');
                    currentValue=current
                }
                if(keys.length>0){
                    return this.get(keys.join('.'),current);
                }
                else{
                    return currentValue;
                }
            }
            else{
                return undefined;
            }
        }
    },
    clear: function(key,object) {
        if(key==undefined){
            if(STORAGE_KEY.length>0){
                window.localStorage.removeItem(STORAGE_KEY);
            }
            else{
                window.localStorage.clear();
            }
            
        }
        else{
            if(STORAGE_KEY.length>0){
                var current=this.get(key);
                if(current!=undefined && current!=null){
                    this.set(key,undefined)
                }
            }
            else{
                window.localStorage.removeItem(key);
            }
            
        }
    }
}
export default localstorage;