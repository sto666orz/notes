<template>
    <div class="page-wrap">
        <div class="header"></div>
        <ul v-if="errorType === 0" class="record-list">
            <li class="record-item" v-for="(item, index) in dataList" :key="index">
                <div class="up">
                    <div class="stick">
                        <span class="label">奖品 {{index + 1}}</span>
                        <button class="scan-btn" @click="editAddress(item)" v-if="item.prize_type == 2">
                            {{item.address_id ? '编辑收货地址' : '添加收货地址'}}
                        </button>
                    </div>
                </div>
                <div class="down">
                    <div class="base-wrap">
                        <span class="label">奖品名称</span>
                        <span class="content" v-if="item.prize_type == 2">{{item.prize_name}}</span>
                        <span class="content" v-else>精品课五折券</span>
                    </div>
                    <div class="base-wrap">
                        <span class="label">获奖时间</span>
                        <span class="content">{{item.award_time.replace('T',' ')}}</span>
                    </div>
                    <div class="address-info" v-if="item.address_id">
                        <div class="line">
                            <h5 class="label">收件人姓名</h5>
                            <p class="content">{{item.name}}</p>
                        </div>
                        <div class="line">
                            <h5 class="label">收件人手机</h5>
                            <p class="content">{{item.phone}}</p>
                        </div>
                        <div class="line">
                            <h5 class="label">收货地址</h5>
                            <p class="content">{{`${item.province}${item.city}${item.district}${item.detail}`}}</p>
                        </div>
                    </div>
                    <button class="button-bind" v-if="item.prize_type == 1" @click="linkCoupon()">去绑定</button>
                </div>
            </li>
        </ul>
        <div v-else class="main">
            <div v-if="errorType === 1" class="view-aha empty">
                <p class="text">暂无奖品哦～</p>
            </div>
            <div v-else-if="errorType === 2" class="view-aha error">
                <p class="text">网络异常～</p>
                <button class="button">重试</button>
            </div>
            <div v-else-if="errorType === 3" class="view-aha error">
                <p class="text">服务器出错啦～</p>
                <button class="button">重试</button>
            </div>
        </div>
        <div v-if="errorType !== 0" class="footer"></div>

        <address-pop :update="fetchList" ref="addressPop"></address-pop>
    </div>
</template>

<script>
import AddressPop from './components/address.vue'
import { setStore, getStore, isWeiXin } from 'util/base'
import { wxShare } from 'util/wxBase'
import httpRequest from 'service/musicParty2020'
import { getUserToken } from './local/util'
import { hideWxShare } from './local/shareUtil'


export default {
    components: {
        AddressPop
    },
    data() {
        return {
            scroll: null,
            dataList: [],
            errorType: 0, // 错误类型  0无错误  1空列表  2网络错误  3服务器错误
            stateEnd: false
        }
    },
    methods: {
        fetchList() {
            this.$loading.open({ message: '加载中', magIcon: '' });
            httpRequest.prizeRecord().then(res => {
                const { code, data, msg } = res;
                if (code == 200) {
                    if (!data || data.length === 0) {
                        this.errorType = 1;
                    } else {
                        this.errorType = 0;
                        this.dataList = data;
                    }
                } else {
                    this.errorType = 3;
                }
                this.$loading.close();
            }).catch(() => {
                this.errorType = 2;
                this.$loading.close();
            });
        },
        linkCoupon() {
            window.location.href = 'https://apptz4JimVS3433.h5.xiaoeknow.com/coupon/get/cou_5f3e23f156825-95S72U';
        },
        /**
         * @desc Toast 提示
         */
        Toast(msg) {
            this.$toast({
                message: msg,
                align: 'center',
                duration : 2500 //消失时间
            });
        },
        editAddress(item) {
            if (this.stateEnd) {
                return this.Toast('活动已经结束');
            }
            this.$refs.addressPop.show(item);
        }
    },
    created() {
        hideWxShare();
    },
    mounted() {
        httpRequest.activityInfo().then(res => {
            const { code, data, msg } = res;
            if (code == 200) {
                this.stateEnd = data.end_state;
                this.fetchList();
            } else {
                this.Toast(msg);
            }
        }).catch(() => {
            this.Toast('网络异常，请重新尝试');
        });
    },
    beforeRouteEnter(to, from, next) {
        const userToken = getUserToken();
        if (!userToken) {
            next({
                path: '/musicParty/lottery',
                query: to.query
            });
        } else {
            next();
        }
    }
}
</script>


<style src="./public/screen.css">
</style>

<style lang="less" scoped>
@import url("../../assets/css/mixin.less");

.image-center(@url, @size: 100%) {
    background: ~"url(~@/assets/images/musicParty2020/other/@{url})" center center no-repeat;
    background-size: @size;
}

.page-wrap {
    position: relative;
    min-height: 100%;
    background:#F14727 url("~@/assets/images/musicParty2020/other/other_bg@2x.png") center 0 no-repeat;
    background-size: 100% auto;
    .header {
        position: absolute;
        top: 1.373333rem /* 103/75 */;
        left: 50%;
        transform: translateX(-50%);
        width: 5.333333rem /* 400/75 */;
        height: .986667rem /* 74/75 */;
        .image-center('title_record@2x.png');
    }
    .main {
        overflow: hidden;
        position: absolute;
        top: 2.733333rem /* 205/75 */;
        left: .4rem /* 30/75 */;
        right: .4rem /* 30/75 */;
        bottom: 2.56rem /* 192/75 */;
        border-radius: .2rem /* 15/75 */;
        background-color: #FFFFFF;
    }
    .record-list {
        padding: 2.733333rem /* 205/75 */ .4rem /* 30/75 */ .706667rem /* 53/75 */;
    }
    .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4.226667rem /* 317/75 */;
        background: url("~@/assets/images/musicParty2020/lottery/qianjing@2x.png") center center no-repeat;
        background-size: 100%;
    }
}

.record-item {
  margin-bottom: .213333rem /* 16/75 */;
    .up {
        position: relative;
        height: 1.306667rem /* 98/75 */;
        .stick {
            .fj(space-between);
            position: absolute;
            top: 0;
            left: -.213333rem /* 16/75 */;
            right: -.213333rem /* 16/75 */;
            bottom: -.213333rem /* 16/75 */;
            padding: 0 .746667rem /* 56/75 */;
            .image-center('img_title_bg@2x.png', 9.44rem /* 708/75 */);
        }
        .label {
            font-size: .4rem;
            font-weight: bold;
            color: #FFFFFF;
        }
        .scan-btn {
            padding-right: .267rem;
            background: url('~@/assets/images/musicParty2020/other/icon_arrow_r@2x.png') right center no-repeat;
            background-size: .213333rem /* 16/75 */;
            font-size: .32rem;
            color: #FFFFFF;
        }
    }
    .down {
        margin-top: -.133333rem /* 10/75 */;
        padding: .666667rem /* 50/75 */ .533333rem /* 40/75 */ .533333rem /* 40/75 */;
        background-color: #ffffff;
        border-radius: 0 0 .4rem .4rem;
        .base-wrap {
            margin-bottom: .4rem /* 30/75 */;
            .fj(space-between);
            &:last-child {
                margin-bottom: 0;
            }
        }
        .address-info {
            margin-top: .533rem;
            border-top: 2px solid rgba(237, 237, 237, 1);
            .line {
                padding-top: .533rem;
                .label {
                    margin-bottom: .333rem;
                }
            }
        }
        .label {
            font-size: .373rem;
            font-weight: bold;
            color: #555555;
            line-height: .373rem;
        }
        .content {
            font-size: .347rem;
            color: #555555;
            line-height: .347rem;
            // line-height: .533333rem /* 40/75 */;
        }
        .button-bind {
            display: block;
            width: 8.133333rem /* 610/75 */;
            height: 1.293333rem /* 97/75 */;
            margin: .853333rem /* 64/75 */ auto 0;
            border-radius: .653333rem /* 49/75 */;
            font-size: .453333rem /* 34/75 */;
            font-weight: 600;
            color: #5B2D00;
            background: linear-gradient(180deg, #FFEA00 0%, #FFB600 100%);
        }
    }
}

.view-aha {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3.626667rem /* 272/75 */;
    margin: 0 auto;
    .text {
        margin-bottom: .56rem /* 42/75 */;
        padding-top: 3.986667rem /* 299/75 */;
        line-height: .346667rem /* 26/75 */;
        font-size: .4rem /* 30/75 */;
        color: #9E9E9E;
    }
    .button {
        width: 3.146667rem /* 236/75 */;
        height: 1.36rem /* 102/75 */;
        border-radius: .72rem /* 54/75 */;
        font-size: .426667rem /* 32/75 */;
        font-weight: 500;
        color: #FFFFFF;
        background-color: #FD5E02;
    }

    &.empty {
        background: url("~@/assets/images/musicParty2020/other/ico_aha_oh@2x.png") center 0 no-repeat;
        background-size: 3.626667rem /* 272/75 */;
    }
    &.error {
        background: url("~@/assets/images/musicParty2020/other/ico_aha_sleep@2x.png") center 0 no-repeat;
        background-size: 3.626667rem /* 272/75 */;
    }
}

</style>