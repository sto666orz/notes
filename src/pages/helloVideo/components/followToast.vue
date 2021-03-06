<template>
    <transition name="fade">
        <div v-show="toastTimer > 0" class="window-toast">
            <p class="toast-text">{{toastText}}</p>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            toastText: '',          // 全局唯一非模态提示
            toastTimer: 0,           // time计时器
        }
    },
    methods: {
        viewToast(text, time = 2000) {
            this.toastText = text;
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => {
                this.toastTimer = 0;
            }, time);
        }
    }
}
</script>

<style lang="less" scoped>
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
        color: #FFFFFF;
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>