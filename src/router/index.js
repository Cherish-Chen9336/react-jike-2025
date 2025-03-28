//配置页面  路由
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from '@/components/AuthRoute'
import Home from '@/pages/Home'
import Article from '@/pages/Article'
import Publish from '@/pages/Publish'

// 配置路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        // path: '/home',
        element: <Home />,
      },
      {
        path: '/article',
        element: <Article />,
      },
      {
        path: '/publish',
        element: <Publish />,
      },
    ],
  },
  {
    path: '/Login',
    element: <Login />,
  },
])

export default router
