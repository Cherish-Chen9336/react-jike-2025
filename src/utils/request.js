//  axios 的封装处理
import axios from 'axios'
import { getToken, removeToken } from './token'
import router from '@/router'

// 1. 根域名配置
// 2. 超时时间
// 3. 请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000,
})

// 添加请求拦截器
// 在请求发送之前， 做拦截 插入一些自定义的配置 【参数处理】
request.interceptors.request.use(
  (config) => {
    // 操作config 注入token 数据
    // 1. 获取token

    // 2. 按照后端的格式要求做token 拼接
    const token = getToken()
    if (token) {
      // 等号左边为 axios 固定写法   等号右边 为后端规定
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
// 在响应返回到客户端之前 做拦截 重点处理返回的数据
request.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 监控 401 token 失效
    console.dir(error)
    if (error.response.status === 401) {
      // 清除失效token
      removeToken()
      // 跳转登录
      router.navigate('/login')
      window.location.reload() //强制重新刷新
    }

    return Promise.reject(error)
  }
)

export { request }
