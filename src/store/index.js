import Vue from 'vue'
import Vuex from 'vuex'
import ligacao from './modules/ligacao'
import atender from '../components/Atender.vue'
import login from '../components/Login.vue'
import teclado from '../components/Teclado.vue'
import tecladoligacao from '../components/TecladoLigacao.vue'
import emligacao from '../components/Ligacao.vue'
import telaprincipal from '../components/TelaPrincipal.vue'

Vue.use(Vuex)
Vue.component('telaprincipal', telaprincipal)
Vue.component('atender', atender)
Vue.component('login', login)
Vue.component('emligacao', emligacao)
Vue.component('teclado', teclado)
Vue.component('tecladoligacao', tecladoligacao)
export default new Vuex.Store({
    modules: {
        ligacao,
    },

})