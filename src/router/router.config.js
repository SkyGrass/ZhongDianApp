import Home from '@/views/home'
import SubHome from '@/views/home/subIndex'

import So from '@/views/so'
import Query from '@/views/query'
/**
 * 基础路由
 * @type { *[] }
 */
const routerMap = [
  {
    path: '/',
    component: Home,
    redirect: '/home',
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/subhome',
    name: 'SubHome',
    component: SubHome,
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const dynamicRouterMap = [
  {
    path: '/so',
    name: 'so',
    component: So,
    meta: {
      title: '销售发出',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/so_form',
    name: 'so_form',
    component: () => import('@/views/so/form'),
    meta: {
      title: '销售发出',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/so_back',
    name: 'so_back',
    component: () => import('@/views/soback/form'),
    meta: {
      title: '销售回收',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/update',
    name: 'update_form',
    component: () => import('@/views/update/form'),
    meta: {
      title: '桶状态变更',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/clear_back',
    name: 'clear_back',
    component: () => import('@/views/clearback/form'),
    meta: {
      title: '清洗回收',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/other_back',
    name: 'other_back',
    component: () => import('@/views/otherback/form'),
    meta: {
      title: '其他回收',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/scan_scrap',
    name: 'scan_scrap',
    component: () => import('@/views/scanscrap/form'),
    meta: {
      title: '扫码报废',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/query',
    name: 'query',
    component: Query,
    meta: {
      title: '信息查询',
      redblue: false,
      keepAlive: false
    }
  }
]

export const constantRouterMap = routerMap.concat(dynamicRouterMap)
