import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
import moment from './plugins/moment'
import VueSweetalert2 from 'vue-sweetalert2';

import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)
Vue.use(moment)
Vue.use(VueSweetalert2);
Vue.config.productionTip = false


new Vue({
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')

// window.onbeforeunload = function() {
//     return "true"
// };