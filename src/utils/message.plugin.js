export default {
    install(Vue) {
        Vue.prototype.$message = function(html) {
            M.toast({html})
        }

        Vue.prototype.$error = function() {
            M.toast({html: `[Ошибка]: ${html}`})
        }
    }
}