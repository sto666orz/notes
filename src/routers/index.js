import Home from '../pages/Home.vue'
import NotFound from '../pages/NotFound.vue'

import musicParty2020 from './modules/musicParty2020'

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound
  },
  ...musicParty2020
]