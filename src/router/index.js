import Vue from 'vue'
import VueRouter from 'vue-router'
import Comm from '../pages/Comm'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        // 重定向
        redirect: '/index'
    },
    {
        path: '/',
        component: Comm,
        children: [{
            path: '/index',
            name: "index",
            component: () =>
                import ('../pages/index/Index'),

        }, {
            path: '/goods/index',
            name: "goods/index",
            component: () =>
                import ('../pages/goods/Index'),

        }, {
            path: '/goods/admin/create',
            name: "goods/admin/create",
            component: () =>
                import ('../pages/goods/admin/Create'),

        }, ]
    }
]

const isPro = process.env.NODE_ENV === 'production'


const router = new VueRouter({
    mode: isPro ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

export default router