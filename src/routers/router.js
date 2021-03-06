import { createRouter, createWebHashHistory } from "vue-router"
import Index from './Index'


const Router = createRouter({
  history: createWebHashHistory(),
  routes: Index
});

Router.beforeEach((to, from, next) => {
  const meta = to.meta || {};
  // 设置标题
  if ( to.meta.title ) {
    document.title = meta.title;
  }
  // 设置页面最大宽度限制
  const html = document.querySelector('html');
  if ( meta.root ) {
    html.setAttribute('ipad', `${meta.root}`);
  } else if ( html.getAttribute('id') ) {
    html.removeAttribute('id');
  }
  next()
})

export default Router;