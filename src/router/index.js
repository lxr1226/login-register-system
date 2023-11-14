import { createWebHistory, createRouter } from 'vue-router'
// createRouter 用于创建路由的实例对象
// 使用 createWebHistory() 创建了一个基于 HTML5 History 模式的路由历史记录。

// import { MessageBox } from 'element-plus'
// 导入了 MessageBox 组件：
// MessageBox 接受一个参数作为警告提示的文本内容。
// ‘MessageBox’ 组件在 element-plus 包中未找到。这可能是因为 element-plus 并不直接提供 ‘MessageBox’ 组件。
// import axios from 'axios'
import { ElMessage } from 'element-plus'
import LogIn from '../views/LogIn.vue'
const routes = [
  {
    path: '/', // 路径,表示根路径
    redirect: {
      name: 'LogIn' // 重定向设置了重定向，当用户访问根路径时，会自动重定向到名为 'LogIn' 的路由。
    },
    component: LogIn// 跳转到的组件,component: 指定了该路径对应的组件，这里是 LogIn 组件。
  },
  {
    path: '/LogIn', // 路径
    name: 'LogIn', // 给路由设置了一个名字，这里是‘LogIn’
    component: () => import('../views/LogIn.vue') // 动态导入的方式指定了该路径对应的组件
  },
  {
    path: '/SignIn',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/HomePage',
    name: 'HomePage',
    component: () => import('../views/pages/HomePage.vue')
  },
  {
    path: '/ConnectionPage',
    name: 'ConnectionPage',
    component: () => import('../views/pages/ConnectionPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// 注册了一个全局前置守卫，用于在每次路由跳转之前进行身份验证。
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('token')
  if (to.path !== '/LogIn' && to.path !== '/SignIn' && !isAuthenticated) {
    next({ path: '/LogIn' })
    ElMessage({
      message: '请先登录！',
      type: 'warning'
    })
  } else next()
})
export default router
