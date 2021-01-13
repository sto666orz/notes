<template>
  <div id="main">
    <app-router></app-router>
  </div>
</template>

<script>
import AppRouter from './Router.vue'

export default {
  name: 'App',
  components: {
    AppRouter
  }
}
</script>


<style lang="scss" scoped>
#main {
  width: 100%;
  // max-width: 750px;
  height: 100%;
  margin: 0 auto;
  background-color: blanchedalmond;
}
</style>