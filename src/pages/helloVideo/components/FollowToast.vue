<template>
  <transition name="fade">
    <div v-show="toast" class="window-toast">
      <p class="toast-text">{{ toast }}</p>
    </div>
  </transition>
</template>

<script>
import { watchEffect } from 'vue'
export default {
  props: {
    toast: [String, Boolean]
  },
  emits: ['update:toast'],
  setup(props, context) {
    let toastTimer = null;

    watchEffect((val) => {
      clearTimeout(toastTimer);
      if (props.toast) {
        toastTimer = setTimeout(() => {
          context.emit('update:toast', null);
          toastTimer = null;
        }, 2000);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.window-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.24em 0.28em;
  border-radius: 0.2em;
  background: rgba(0, 0, 0, 0.68);
  .toast-text {
    font-size: 0.213333em;
    font-weight: 600;
    color: #ffffff;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>