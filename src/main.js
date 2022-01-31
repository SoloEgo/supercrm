import Vue from "vue";
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate'

//import Bootstrap from 'bootstrap'
// import "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
//import PortalVue from 'portal-vue'
import VueCookies from 'vue-cookies'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from '@/filters/date.filter';
import nameFilter from '@/filters/name.filter';
import currencyFilter from '@/filters/currency.filter';
import tooltipDirective from '@/directives/tooltip.directive'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import LoaderContent from '@/components/app/LoaderContent'
//import { VueAvatar } from 'vue-avatar-editor-improved'
import "./registerServiceWorker";
// import 'materialize-css/dist/js/materialize.min'
import firebase from "@/plugins/firebase"
import 'firebase/auth'
import 'firebase/database'
//import ds from 'firebase/firestore'
import { firestorePlugin } from 'vuefire'
import AsyncComputed from 'vue-async-computed'
//import { Picker } from 'emoji-mart-vue'
import "@/assets/customize.scss";


Vue.config.productionTip = false;
Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.use(VueCookies)
Vue.$cookies.config('7d')
Vue.filter('date', dateFilter)
Vue.filter('nameFilter', nameFilter)
Vue.filter('currency', currencyFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('LoaderContent', LoaderContent)
Vue.component('Paginate', Paginate)
Vue.use(firestorePlugin)
Vue.use(AsyncComputed)



let app

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: (h) => h(App),
        }).$mount("#app");
    }
})