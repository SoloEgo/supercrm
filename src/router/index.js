import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import firebase from 'firebase/app'

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        title: "Рабочий стол",
        icon: 'bi-laptop',
        inSidebar: true,
        forAdmin: false,
        meta: { layout: "main", auth: true },
        component: Home,
    },
    {
        path: "/sales",
        name: "Sales",
        title: 'Сделки',
        icon: 'bi-wallet2',
        inSidebar: true,
        forAdmin: false,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/Sales.vue"),
    },
    {
        path: "/contractors",
        name: "Contractors",
        title: 'Контрагенты',
        icon: 'bi-boxes',
        inSidebar: true,
        forAdmin: false,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/Contractors.vue"),
    },
    {
        path: "/login",
        name: "Login",
        title: 'Вход',
        icon: '',
        inSidebar: false,
        forAdmin: false,
        meta: { layout: "empty" },
        component: () =>
            import ("../views/Login.vue"),
    },
    {
        path: "/register",
        name: "Register",
        title: 'Регистрация',
        icon: '',
        inSidebar: false,
        forAdmin: false,
        meta: { layout: "empty" },
        component: () =>
            import ("../views/Register.vue"),
    },
    {
        path: "/tasks",
        name: "Tasks",
        title: 'Задачи',
        icon: 'bi-bookmarks',
        inSidebar: true,
        forAdmin: false,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/Categories.vue"),
    },
    {
        path: "/structure",
        name: "Structure",
        title: 'Структура',
        icon: 'bi-grid-1x2',
        inSidebar: true,
        forAdmin: true,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/Structure.vue"),
    },
    {
        path: "/users",
        name: "Users",
        title: 'Пользователи',
        icon: 'bi-people',
        inSidebar: true,
        forAdmin: true,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/Users.vue"),
    }, ,
    {
        path: "/notCenter",
        name: "Notifications",
        title: 'Уведомления',
        icon: 'bi-app-indicator',
        inSidebar: true,
        forAdmin: true,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/NotCenter.vue"),
    },

    // {
    //     path: "/history/detailrecord/:id",
    //     name: "Detail record",
    //     title: 'Расшифровка',
    //     icon: '',
    //     inSidebar: false,
    //     meta: { layout: "main", auth: true },
    //     component: () =>
    //         import ("../views/DetailRecord.vue"),
    // },
    // {
    //     path: "/history",
    //     name: "History",
    //     title: 'История',
    //     icon: 'bi-clock-history',
    //     inSidebar: true,
    //     meta: { layout: "main", auth: true },
    //     component: () =>
    //         import ("../views/History.vue"),
    // },
    // {
    //     path: "/planning",
    //     name: "Planning",
    //     title: 'Планирование',
    //     icon: 'bi-box-arrow-in-down',
    //     inSidebar: true,
    //     meta: { layout: "main", auth: true },
    //     component: () =>
    //         import ("../views/Planning.vue"),
    // },
    {
        path: "/profile",
        name: "Profile",
        title: 'Профиль',
        icon: '',
        inSidebar: false,
        meta: { layout: "main", auth: true },
        component: () =>
            import ("../views/Profile.vue"),
    },
    // {
    //     path: "/record",
    //     name: "Record",
    //     title: 'Новая запись',
    //     icon: 'bi-file-earmark-plus',
    //     inSidebar: true,
    //     meta: { layout: "main", auth: true },
    //     component: () =>
    //         import ("../views/Record.vue"),
    // },


];

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home,
//     children: [{
//       path: '/login',
//       name: 'Login',
//       meta: { layout: 'empty' },
//       component: () => import('../views/Login.vue')
//     }, {
//       path: '/categories',
//       name: 'Categories',
//       meta: { layout: 'main' },
//       component: () => import('../views/Categories.vue')
//     }]
//   }
// ];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser
    const requireAuth = to.matched.some(record => record.meta.auth)

    if (requireAuth && !currentUser) {
        next('/login?message=login')
    } else {
        next()
    }
})

export default router;