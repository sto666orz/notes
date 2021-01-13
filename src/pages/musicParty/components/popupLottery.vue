<template>
    <popup-view :visible="visible" @close="closeView">
        <div class="container">
            <p class="title">恭喜您<br>获得VIP陪练双旦好礼</p>
            <div class="icon">
                <img class="lottery-image" :src="lotteryIcon" alt="">
            </div>
            <p class="text" :class="{ 'virtual': isVirtual }">{{lotteryName}}</p>

            <button v-if="isVirtual" class="button-link" @click="linkTo('https://apptz4JimVS3433.h5.xiaoeknow.com/coupon/get/cou_5f3e23f156825-95S72U')">去绑定</button>
            <button v-else class="button-link" @click="linkTo('/musicParty/gift')">去查看</button>
            <p class="tips2">您也可至获奖记录中查看</p>
        </div>
    </popup-view>
</template>

<script>
import PopupView from './public/popupView.vue'

export default {
    components: {
        PopupView
    },
    props: {
        visible: Boolean,
        lotteryName: String,    // 奖品名称
        lotteryIcon: String,    // 奖品图标
        isVirtual: Boolean      // 是否虚拟奖
    },
    methods: {
        closeView() {
            this.$emit('update:visible', false)
                .$emit('close', null);
        },
        linkTo(path) {
            if (this.isVirtual) {
                window.location.href = path;
            } else {
                this.$router.push({
                    path: path,
                    query: this.$route.query
                });
            }
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    text-align: center;
    padding-top: .866667rem /* 65/75 */;
    padding-bottom: .6rem /* 45/75 */;
    width: 8.666667rem /* 650/75 */;
    .title {
        line-height: .666667rem /* 50/75 */;
        margin-bottom: .546667rem /* 41/75 */;
        font-size: .48rem /* 36/75 */;
        font-weight: 600;
        color: #333333;
    }
    .tips {
        line-height: .533333rem /* 40/75 */;
        margin-bottom: .066667rem /* 5/75 */;
        font-size: .373333rem /* 28/75 */;
        color: #9E9E9E;
    }
    .icon {
        padding: .24rem /* 18/75 */ 0;
        margin: 0 2.426667rem /* 182/75 */ .333333rem /* 25/75 */;
        border-radius: .4rem /* 30/75 */;
        background-color: #F5F5F5;
        .lottery-image {
            display: block;
            width: 3.333333rem /* 250/75 */;
            height: 3.333333rem /* 250/75 */;
            margin: 0 auto;
        }
    }
    .text {
        line-height: .56rem /* 42/75 */;
        margin-bottom: .52rem /* 39/75 */;
        font-size: .4rem /* 30/75 */;
        font-weight: 600;
        color: #333333;
        &.virtual {
            color: #F14727;
        }
    }
    .button-link {
        width: 7.333333rem /* 550/75 */;
        height: 1.333333rem /* 100/75 */;
        margin-bottom: .266667rem /* 20/75 */;
        font-size: .426667rem /* 32/75 */;
        font-weight: 600;
        border-radius: .666667rem /* 50/75 */;
        color: #FFFFFF;
        background-color: #FD5E02;
    }
    .tips2 {
        line-height: .493333rem /* 37/75 */;
        font-size: .346667rem /* 26/75 */;
        color: #9B9B9B;
    }
}
</style>