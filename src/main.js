import { createApp } from 'vue'
import App from './App.vue'
import router from './router'// 导入了 Vue 路由器。导入了一个名为 router 的自定义模块，该模块对应的文件路径为 ./router。这个自定义模块是你自己定义的路由配置文件，可能包含了路由的路径、名称和组件等信息。
// 导入全局样式表
import './assets/css/global.css'
// 引入所有的ElementUI组件库
import ElementPlus from 'element-plus'
// 引入ElementUI样式
import 'element-plus/dist/index.css'
// 使用 import * as icons 导入 Element Plus 提供的所有图标组件，并在 Vue 应用中注册这些组件。
import * as icons from '@element-plus/icons-vue'
// import validator from 'validator'
import axios from 'axios'
// 创建 Vue 应用实例
const app = createApp(App)
// 遍历 icons 对象的键，并使用 app.component() 方法将每个图标组件注册到 Vue 应用中。
Object.keys(icons).forEach(key => {
  app.component(key, icons[key])
})
// 设置 axios 为 Vue 应用的全局属性 $http。
app.config.globalProperties.$http = axios
// 设置 axios 的基础URL
axios.defaults.baseURL = 'http://150.158.53.178:2053'
// 配置token
// axios.interceptors.request.use(async (config) => {
//   // 检查token是否存在
//   try {
//     await axios.post('/api/test/Test')
//   } catch (error) {
//     console.error(error)
//   }

//   // if (window.sessionStorage.getItem('token')) {
//   //   // 检查token是否过期
//   //   const expirationDate = new Date(window.sessionStorage.getItem('expirationDate'))
//   //   if (expirationDate > new Date()) {
//   //     // token有效，将token添加到请求的headers中
//   //     config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('token')}`
//   //   } else {
//   //     // token过期，刷新token
//   //     // 调用刷新token的接口，获取新的token
//   //     // 例如：api.get('/refresh-token')，根据你的具体接口进行调整
//   //     // 成功获取到新的token后，更新sessionStorage中的token和expirationDate
//   //     // 然后将新的token添加到请求的headers中
//   //     try {
//   //       const response = await axios.post('/api/test/refresh')
//   //       const newToken = response.headers.authorization
//   //       // 将新的token添加到请求的headers中
//   //       config.headers.Authorization = `Bearer ${newToken}`
//   //       // 成功获取到新的token后，更新sessionStorage中的token和expirationDate
//   //       window.sessionStorage.setItem('token', newToken)
//   //       const newExpirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 假设token有效期为1天
//   //       window.sessionStorage.setItem('expirationDate', newExpirationDate)
//   //       // 将新的token添加到请求的headers中
//   //       config.headers.Authorization = `Bearer ${newToken}`
//   //     } catch (error) {
//   //       // 刷新token失败，处理错误逻辑
//   //       console.error('刷新token失败', error)
//   //       // 可以跳转到登录页或者执行其他逻辑
//   //     }
//   //   }
//   // }
//   return config
// }, error => {
//   error.data = {
//     message: '服务器异常~'
//   }
//   return Promise.reject(error)
// })
// 响应拦截器
// axios.interceptors.response.use(response => {
//   // 检查响应中是否包含新的token
//   if (response.headers.authorization) {
//     // 更新sessionStorage中的token和expirationDate
//     window.sessionStorage.setItem('token', response.headers.authorization)
//     // 获取并设置新的token的过期时间
//     const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 假设token有效期为1天
//     window.sessionStorage.setItem('expirationDate', expirationDate)
//   }
//   return response
// }, error => {
//   // 处理错误响应
//   return Promise.reject(error)
// })

app.use(ElementPlus)// 注册 Element Plus 组件库，使用Element Plus 组件库
// app.use(validator)
app.config.productionTip = false
// 使用 app.use(router) 注册路由使用路由。
app.use(router)
app.mount('#app')
