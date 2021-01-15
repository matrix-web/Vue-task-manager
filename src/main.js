import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import messagePlugin from '@/utils/message.plugin'
import toolTipDirective from '@/directives/tooltip.directive'
import dateFilter from '@/filters/date.filter'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.component('Paginate', Paginate)
Vue.filter('dateFilter', dateFilter)
Vue.directive('tooltip', toolTipDirective)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
