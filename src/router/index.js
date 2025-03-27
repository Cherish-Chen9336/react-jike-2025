//配置页面  路由
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/Login',
    element: <Login />,
  },
])

export default router
