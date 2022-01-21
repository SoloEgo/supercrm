import Vue from "vue";
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate'
import Bootstrap from 'bootstrap'
import PortalVue from 'portal-vue'
import VueCookies from 'vue-cookies'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from '@/filters/date.filter';
import currencyFilter from '@/filters/currency.filter';
import tooltipDirective from '@/directives/tooltip.directive'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import LoaderContent from '@/components/app/LoaderContent'
import "./registerServiceWorker";
import 'materialize-css/dist/js/materialize.min'
import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/database'
import ds from 'firebase/firestore'
import BootstrapVue from 'bootstrap-vue';


Vue.config.productionTip = false;
Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.use(VueCookies)
Vue.use(BootstrapVue)
Vue.$cookies.config('7d')
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('LoaderContent', LoaderContent)
Vue.component('Paginate', Paginate)

const config = {
    apiKey: "AIzaSyBRnuLWtVJPHwID_3V-uDbW4Gp4sXE1uas",
    authDomain: "my-crm-fca31.firebaseapp.com",
    projectId: "my-crm-fca31",
    storageBucket: "my-crm-fca31.appspot.com",
    messagingSenderId: "169169778793",
    appId: "1:169169778793:web:bb6804d441baba22a50af8",
    measurementId: "G-8TD59M8M7X",
    databaseURL: "https://my-crm-fca31-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(config);



let app

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        // Vue.directive('click-outside', {
        //     priority: 700,
        //     bind() {
        //         let self = this
        //         this.event = function(event) {
        //             self.vm.$emit(self.expression, event)
        //         }
        //         this.el.addEventListener('click', this.stopProp)
        //         document.body.addEventListener('click', this.event)
        //     },

        //     unbind() {
        //         this.el.removeEventListener('click', this.stopProp)
        //         document.body.removeEventListener('click', this.event)
        //     },
        //     stopProp(event) { event.stopPropagation() }
        // })

        app = new Vue({
            router,
            store,
            render: (h) => h(App),
        }).$mount("#app");


    }
})