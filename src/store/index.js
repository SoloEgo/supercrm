import Vue from "vue";
import Vuex from "vuex";
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'
import contractors from './contractors'
import sales from './sales'
Vue.use(Vuex);

export default new Vuex.Store({
    //const store = new Vuex.Store({
    state: {
        error: null
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
        }
    },
    actions: {
        async fetchCurrency() {
            const key = process.env.VUE_APP_CERRUNCY_API_KEY
            const res = await fetch(`https://freecurrencyapi.net/api/v2/latest?apikey=${key}&base_currency=RUB`)
            return await res.json()
        }
    },
    getters: {
        error: s => s.error
    },
    modules: {
        auth,
        info,
        category,
        record,
        contractors,
        sales
    },
});