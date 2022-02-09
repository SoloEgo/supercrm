import Vue from "vue";
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate'
import { ToastPlugin } from 'bootstrap-vue'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VueCookies from 'vue-cookies'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from '@/filters/date.filter';
import fileTypeFilter from '@/filters/fileType.filter';
import currencyFilter from '@/filters/currency.filter';
import tooltipDirective from '@/directives/tooltip.directive'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import LoaderContent from '@/components/app/LoaderContent'
import "./registerServiceWorker";
import firebase from "@/plugins/firebase"
import 'firebase/auth'
import 'firebase/database'
import { firestorePlugin } from 'vuefire'
import AsyncComputed from 'vue-async-computed'
import "@/assets/customize.scss";
import VCalendar from 'v-calendar';
import Multiselect from 'vue-multiselect'


Vue.config.productionTip = false;
Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.use(VueCookies)
Vue.$cookies.config('7d')
Vue.filter('date', dateFilter)
Vue.filter('fileTypeFilter', fileTypeFilter)
Vue.filter('currency', currencyFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('LoaderContent', LoaderContent)
Vue.component('Paginate', Paginate)
Vue.use(firestorePlugin)
Vue.use(AsyncComputed)
Vue.use(ToastPlugin)
Vue.use(VCalendar);
Vue.component('multiselect', Multiselect)

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