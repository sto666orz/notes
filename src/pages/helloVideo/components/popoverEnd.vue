<template>
    <div class="model-mask">
        <div class="popover-end">
            <p class="end-text">恭喜你，本节课已学完</p>
            <div v-if="nextText" class="end-button">
                <div class="left-button" @click="resetPlay">
                    <p class="button-text">重新学习</p>
                </div>
                <div class="right-button" @click="nextPlay">
                    <p class="button-text">{{nextText}}</p>
                </div>
            </div>
            <div v-else class="end-button">
                <div class="right-button" @click="resetPlay">
                    <p class="button-text">重新学习</p>
                </div>
            </div>
            <div class="popover-close" @click="closeView"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        nextText: String,
        currentTime: Number
    },
    data() {
        return {
            //
        }
    },
    methods: {
        closeView() {
            this.$emit('close', this.currentTime);
        },
        resetPlay() {
            this.$emit('reset', this.currentTime);
        },
        nextPlay() {
            this.$emit('next', this.currentTime);
        }
    }
}
</script>

<style lang="less" scoped>

// 绝对定位
.position-absolute(@top: auto, @right: auto, @bottom: auto, @left: auto) {
    position: absolute;
    top: @top;
    left: @left;
    right: @right;
    bottom: @bottom;
}
// 垂直居中
.position-center(@width, @height) {
    .position-absolute(50%, auto, auto, 50%);
    width: @width;
    height: @height;
    transform: translate(-50%, -50%);
}

.model-mask {
    .position-absolute(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0.75);
}
.popover-end {
    .position-center(4.653333em, 2.026667em);
    text-align: center;
    box-sizing: border-box;
    padding: 0.4em 0.4em 0.28em;
    border-radius: 0.2em;
    background-color: #FFFFFF;
    .end-text {
        font-size: 0.28em;
        color: #4A4A4A;
    }
    .end-button {
        display: flex;
        margin-top: 0.32em;
        .left-button, .right-button {
            flex: 1;
            height: 0.613333em;
            line-height: 0.6em;
            border-width: 0.026667em;
            border-style: solid;
            border-radius: 0.333333em;
            .button-text {
                font-size: 0.213333em;
            }
        }
        .left-button {
            color: #838383;
            border-color: #E9E9E9;
            background-color: #FFFFFF;
        }
        .right-button {
            color: #FFFFFF;
            border-color: #FD5E02;
            background-color: #FD5E02;
        }
        .left-button + .right-button {
            margin-left: 0.306667em;
        }
    }
    .popover-close {
        .position-absolute(-0.6em, 0);
        width: 0.44em;
        height: 0.44em;
        background: url("~@/assets/images/classPackage/video/icon_close.png") center center no-repeat;
        background-size: 100%;
    }
}
</style>