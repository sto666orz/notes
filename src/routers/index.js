import Home from '../pages/Home.vue'
import NotFound from '../pages/NotFound.vue'

// 添加所有routers
const routerModules = import.meta.globEager('./modules/*.js')
const routersAll = Object.keys(routerModules).reduce((arr, key) => {
  return arr.concat( routerModules[key].default );
}, []);

export default [
  {
    path: '/',
    component: Home,
    meta: {
      title: '毕俊的主页',
      root: 75
    }
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound
  },
  ...routersAll
]