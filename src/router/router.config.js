import Home from '@/views/home'
import SubHome from '@/views/home/subIndex'

import PuPrint from '@/views/puprint'
import In from '@/views/in'
import Out from '@/views/out'
import Cm from '@/views/cm'
import StockQuery from '@/views/query'
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
    path: '/puprint',
    name: 'puprint',
    component: PuPrint,
    meta: {
      title: '进货单',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/puprint_form',
    name: 'puprint_form',
    component: () => import('@/views/puprint/form'),
    meta: {
      title: '到货打印',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/pureprint_form',
    name: 'pureprint_form',
    component: () => import('@/views/pureprint/form'),
    meta: {
      title: '标签打印',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/in',
    name: 'in',
    component: In,
    meta: {
      title: '采购入库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/in_form',
    name: 'in_form',
    component: () => import('@/views/in/form'),
    meta: {
      title: '采购入库',
      keepAlive: false
    }
  },
  {
    path: '/out',
    name: 'out',
    component: Out,
    meta: {
      title: '发料',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/out_form',
    name: 'out_form',
    component: () => import('@/views/out/form'),
    meta: {
      title: '发料',
      keepAlive: false
    }
  }, {
    path: '/cm',
    name: 'cm',
    component: Cm,
    meta: {
      title: '点料',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/cm_form',
    name: 'cm_form',
    component: () => import('@/views/cm/form'),
    meta: {
      title: '点料',
      keepAlive: false
    }
  },
  {
    path: '/trans',
    name: 'tran_form',
    component: () => import('@/views/trans/form'),
    meta: {
      title: '货位调整',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/stock',
    name: 'stock',
    component: StockQuery,
    meta: {
      title: '库存查询',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/query/detail'),
    meta: {
      title: '库存台账',
      redblue: false,
      keepAlive: false
    }
  }
]

export const constantRouterMap = routerMap.concat(dynamicRouterMap)
