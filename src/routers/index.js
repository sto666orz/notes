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
    component: Home
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound
  },
  ...routersAll
]