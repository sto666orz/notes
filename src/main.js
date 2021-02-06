import { createApp } from 'vue'
import router from "./routers/router"
import './assets/reset.css'
import './assets/app.scss'

import 'vant/lib/index.css';
import App from './App.vue'

const webApp = createApp(App)

webApp.use(router)
webApp.mount('#app')