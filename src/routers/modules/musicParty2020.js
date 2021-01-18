import Home from '@pages/musicParty/Home.vue'
import Party from '@pages/musicParty/Party.vue'

export default [
  {
    path: '/musicparty/home',
    name: 'MusicPartyHome',
    component: Home,
    meta: {
        title: '双旦音乐派对',
        root: 50
    }
  },
  {
    path: '/musicparty/party',
    name: 'MusicPartyParty',
    component: Party,
    meta: {
        title: '双旦音乐派对',
        root: 50
    }
  },
]