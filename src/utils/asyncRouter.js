export function getAsyncRoutes(routes) {
  const res = []
  // 定义路由中需要的自定名
  const keys = ['path', 'name', 'children', 'redirect', 'meta', 'hidden']
  // 遍历路由数组去重组可用的路由
  routes.forEach(item => {
    const newItem = {}
    if (item.component) {
      newItem.component = resolve => require([`${item.component}`], resolve)
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
    if (newItem.children && newItem.children.length) {
      newItem.children = getAsyncRoutes(item.children)
    }
    res.push(newItem)
  })
  // 返回处理好且可用的路由数组
  debugger
  return res
}
