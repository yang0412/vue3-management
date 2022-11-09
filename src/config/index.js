const files = require.context('./', false, /\.js$/);
const modules = {}

files.keys().forEach((key) => {
    if(key.indexOf('index.js')<0){
        const config=files(key)
        modules[key.replace(/(\.\/|\.js)/g, '')] = config.default || config
    }
})
// export default modules;
module.exports=modules;