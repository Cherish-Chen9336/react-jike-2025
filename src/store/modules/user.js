// 和用户相关的状态管理

import { createSlice } from '@reduxjs/toolkit'
import { removeToken, request } from '@/utils'
import { getToken, setToken as _setToken } from '@/utils'
import { loginAPI, getProfileAPI } from '@/apis/user'

const userStore = createSlice({
  name: 'user',
  // 数据状态
  initialState: {
    token: getToken() || '',
    userInfo: {},
  },
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      // localStorage 也存一份
      _setToken(action.payload)
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo(state, action) {
      state.token = ''
      state.userInfo = {}
      removeToken()
    },
  },
})

// 解构获得actionCreater对象
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

// 获取reducer 函数
const userReducer = userStore.reducer

// 异步方法 完成登录获取token
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    // 1. 发送异步请求
    const res = await loginAPI(loginForm)
    // 2. 提交同步ction进行token 的存入
    dispatch(setToken(res.data.token))
  }
}

// 获取个人用户信息异步方法
const fetchUserInfo = () => {
  return async (dispatch) => {
    // 1. 发送异步请求
    const res = await getProfileAPI()
    // console.log(res)

    dispatch(setUserInfo(res.data))
  }
}

export { fetchLogin, fetchUserInfo, clearUserInfo }

export default userReducer
