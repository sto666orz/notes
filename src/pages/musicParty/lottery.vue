<template>
    <div class="page-wrap">
        <div class="turntable-wrap" :class="{ disabled: userCount <= 0 }">
            <div class="turntable">
                <div class="turntable-arrow" ref="arrow"></div>
                <p class="turntable-start" @click="prizeDraw()">立即<br>抽奖</p>
            </div>
            <div class="turntable-fore">
                <p class="turntable-text">今日剩余<span> {{userCount}} </span>次抽奖机会</p>
            </div>
        </div>
        <div class="buttons-wrap">
            <button class="button-share" @click="shareTo()">邀好友助力，得抽奖机会</button>
            <br>
            <button class="button-rank" @click="loginLinkTo('/musicParty/rank')">查看我的助力榜 &gt;</button>
        </div>
        <button class="button-gift" @click="loginLinkTo('/musicParty/gift')">我的奖品</button>
        <button class="button-rule" @click="ruleVisible = true">活动规则</button>

        <div v-if="!stateEnd" class="fixed-back">
            <i class="button-back" @click="linkTo('/musicParty/party')"></i>
        </div>

        <popup-lottery :visible.sync="lotteryInfo.visible" 
            :lotteryName="lotteryInfo.name"
            :lotteryIcon="lotteryInfo.icon"
            :isVirtual="lotteryInfo.virtual">
        </popup-lottery>
        <popup-rule :visible.sync="ruleVisible"></popup-rule>
        <fast-share :visible.sync="shareVisible" :shareKey="userShareKey"></fast-share>

        <user-register :visible.sync="loginVisible" @success="regSuccess"></user-register>
    </div>
</template>

<script>
import FastShare from './components/public/fastShare.vue'
import PopupRule from './components/popupRule.vue'
import PopupLottery from './components/popupLottery.vue'
import UserRegister from './components/public/userRegister.vue'

import MkBridge from "mk-bridge"
import { newQueryString, getParams, isWeiXin, getCookie, getStore } from 'util/base'
import { getUserToken } from './local/util'
import { hideWxShare } from './local/shareUtil'
import transEvent from './local/transEvent'
import awardConfig from './local/awardConfig'
import httpRequest from 'service/musicParty2020'


function getRandom(n, m) {
    var num = Math.floor(Math.random() * (m - n + 1) + n)
    return num
}

// 三种转盘速度和效果配置
const transitionArray = [
    'transform 6s cubic-bezier(0.39,0.27,0,1)',
    'transform 6s cubic-bezier(0.39,0.27,0,1)',
    'transform 6s cubic-bezier(0.39,0.27,0,1)',
    'transform 5.5s cubic-bezier(0.63,0.36,0.03,1)',
    'transform 5s ease-in-out'
];


export default {
    components: {
        PopupRule,
        FastShare,
        PopupLottery,
        UserRegister,
    },
    data() {
        return {
            lastAngelEnd: -30, // 上次旋转角度
            isPrized: false, // 正在抽奖
            ruleVisible: false,        // 规则弹窗
            shareVisible: false,        // 分享弹窗
            loginVisible: false,
            lotteryInfo: {
                visible: false,      // 中奖弹窗
                name: '',
                icon: ''
            },
            userCount: 0,
            userShareKey: null,
            stateEnd: false
        }
    },
    methods: {
        rotateArrow(id) {
            this.isPrized = true;
            const arrow = this.$refs['arrow'];
            // 先把箭头重置为第一圈的当前角度
            transEvent.setStyleAttribute(arrow, {
                transition: 'transform 0s linear',
                transform: `rotate(${ this.lastAngelEnd % 360 }deg)`
            });
            const base = 360 * 9; //先转满n圈
            const safety = 3; // 安全角度边距
            const award = awardConfig[id];
            const result = getRandom(award.angle[0] + safety, award.angle[1] - safety); // 最后一圈角度
            const angelEnd = this.lastAngelEnd = (base + result); // 结束角度数，负数代表逆时针旋转
            setTimeout(() => {
                transEvent.setStyleAttribute(arrow, {
                    transition: transitionArray[ getRandom(0, transitionArray.length - 1) ], // 随机一个转速动画
                    transform: `rotate(${angelEnd}deg)`
                });
                transEvent.addTranEvent(arrow, () => {
                    // 下一帧调用 不然弹窗出现太快 视觉效果不好
                    requestAnimationFrame(() => {
                        this.isPrized = false;
                        if (id != '99') {
                            this.lotteryInfo.name = award.name;
                            this.lotteryInfo.virtual = award.virtual;
                            this.lotteryInfo.icon = award.icon;
                            this.lotteryInfo.visible = true;
                        }
                    });
                }, 6000);
            }, 99);
        },
        // 抽奖
        prizeDraw() {
            if (this.isPrized) return;
            if (this.userCount <= 0) return;

            if ( !this.checkWxAuth() ) return;
            if ( !this.checkLogin() ) return;

            this.$loading.open({ message: '', magIcon: '' });
            httpRequest.prizeDraw().then(res => {
                const { code, data, msg } = res;
                if (code == 200) {
                    this.getUserCount();
                    this.rotateArrow(data.prize_number);
                } else if (code == 100102) {
                    this.userCount = 0;
                    this.showToast('你的抽奖机会已经用完啦');
                } else if (code == 170003) {
                    this.showToast('活动已经结束');
                } else {
                    this.showToast(msg);
                }
                this.$loading.close();
            }).catch(() => {
                this.$loading.close();
            });
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        regSuccess() {
            this.loginVisible = false;
            this.getUserShareKey();
            this.getUserCount();
        },
        // 获取次数
        getUserCount() {
            httpRequest.lotteryCount().then(res => {
                const { code, data, msg } = res;
                if (code == 200) {
                    this.userCount = data.count;
                } else if (code == 170003) {
                    this.stateEnd = true;
                    this.showToast('活动已经结束');
                } else {
                    this.showToast(msg);
                }
            });
        },
        // 获取用户分享的key
        getUserShareKey() {
            httpRequest.playerInfo().then(res => {
                const { code, data, msg } = res;
                if (code == 200) {
                    if (data.music_id) {
                        this.userShareKey = data.music_id;
                    }
                } else {
                    this.showToast(msg);
                }
            }).catch(() => {
                this.showToast('获取分享信息失败，请刷新重试');
                hideWxShare();
            });
        },
        shareTo() {
            if ( !this.checkWxAuth() ) return;
            if ( !this.checkLogin() ) return;

            this.shareVisible = true;

            this.$sa.track('WebClick', {
                button_name: '分享_3'
            });
        },
        linkTo(path, replace = false) {
            const params = {
                path: path,
                query: this.$route.query
            };
            replace ? this.$router.replace(params) : this.$router.push(params);
        },
        loginLinkTo(path, replace = false) {
            if ( !this.checkLogin() ) return;
            this.linkTo(path, replace);
        },
        /**
         * 检查微信授权信息
         */
        checkWxAuth() {
            if ( isWeiXin() && !getCookie('wxInfo') ) {
                // 调用微信非静默授权,获取头像
                initWxInfoAuth(() => {});
                return false;
            }
            return true;
        },
        /**
         * 检查登录情况
         */
        checkLogin() {
            if (!getUserToken()) {
                this.loginVisible = true;
                return false;
            }
            return true;
        },
        showToast(msg) {
            this.$toast({
                message: msg,
                align: 'center',
                duration: 2000 //消失时间
            });
        }
    },
    created() {
        this.$loading.open({ message: '加载中', magIcon: '' });
        httpRequest.activityInfo().then(res => {
            const { code, data, msg } = res;
            if (code == 200) {
                this.stateEnd = data.end_state;
            } else {
                this.showToast(msg);
            }
            this.$loading.close();
        }).catch(() => {
            this.$loading.close();
        });

        if ( getUserToken() ) {
            this.getUserShareKey();
            this.getUserCount();
        }

        this.$sa.track('$pageview', {
            $title: '双旦抽好礼',
            $url: window.location.href
        });
    }
}
</script>

<style src="./public/screen.css">
</style>

<style lang="less" scoped>

.full-image(@url) {
    background: ~"url(~@/assets/images/musicParty2020/lottery/@{url})" center center no-repeat;
    background-size: 100%;
}
.absolute-center(@width, @height) {
    position: absolute;
    left: 50%;
    width: @width;
    height: @height;
    margin-left: -@width / 2;
}

.page-wrap {
    position: relative;
    width: 100%;
    height: 23.866667rem /* 1790/75 */;
    margin: 0 auto;
    background: #F14727 url("~@/assets/images/musicParty2020/lottery/background@2x.png") center 0 no-repeat;
    background-size: 100% auto;

    .fixed-back {
        position: absolute;
        bottom: 0;
        right: 1.92rem /* 144/75 */;
        .button-back {
            position: fixed;
            bottom: 2.933333rem /* 220/75 */;
            width: 1.92rem /* 144/75 */;
            height: 1.92rem /* 144/75 */;
            .full-image('ico_back@2x.png');
        }
    }

    .button-gift, .button-rule {
        position: absolute;
        top: .28rem /* 21/75 */;
        width: 1.92rem /* 144/75 */;
        height: .573333rem /* 43/75 */;
        font-size: .346667rem /* 26/75 */;
        font-weight: 500;
    }
    .button-gift {
        left: 0;
        border-top-right-radius: .293333rem /* 22/75 */;
        border-bottom-right-radius: .293333rem /* 22/75 */;
        color: #E42400;
        background-color: #FFFFFF;
    }
    .button-rule {
        right: 0;
        border-top-left-radius: .293333rem /* 22/75 */;
        border-bottom-left-radius: .293333rem /* 22/75 */;
        color: #FFFFFF;
        background-color: #FF982B;
    }
}
.turntable-wrap {
    position: relative;
    height: 12.706667rem /* 953/75 */;
    .turntable {
        .absolute-center(10rem /* 750/75 */, 10rem /* 750/75 */);
        bottom: 0;
        .full-image("turntable@2x.png");
    }
    .turntable-arrow {
        .absolute-center(4.826667rem /*326/75*/, 4.826667rem /*326/75*/);
        top: 50%;
        margin-top: -(4.826667rem / 2);
        .full-image("arrow@2x.png");
        transform: rotate(-30deg);
    }
    .turntable-start {
        text-align: center;
        .absolute-center(1.76rem /* 132/75 */, 1.76rem /* 132/75 */);
        top: 50%;
        transform: translateY(-50%);
        padding-top: .373333rem /* 28/75 */;
        line-height: .506667rem /* 38/75 */;
        font-size: .426667rem /* 32/75 */;
        font-weight: 600;
        border-radius: 100%;
        color: #FFEEAF;
    }
    &.disabled {
        .turntable-arrow {
            .full-image("arrow_disabled@2x.png");
        }
        .turntable-start {
            color: #FFFFFF;
        }
    }

    .turntable-fore {
        text-align: center;
        .absolute-center(10rem /* 750/75 */, 4.226667rem /* 317/75 */);
        bottom: -.48rem /* 36/75 */;
        .full-image("qianjing@2x.png");
        .turntable-text {
            position: absolute;
            left: 0;
            right: 0;
            bottom: .16rem /* 12/75 */;
            line-height: .493333rem /* 37/75 */;
            font-size: .346667rem /* 26/75 */;
            font-weight: 600;
            color: #FFFFFF;
            span {
                font-size: .426667rem /* 32/75 */;
            }
        }
    }
}
.buttons-wrap {
    text-align: center;
    padding-top: .48rem /* 36/75 */;
    .button-share {
        width: 7.653333rem /* 574/75 */;
        height: 1.293333rem /* 97/75 */;
        margin-bottom: .253333rem /* 19/75 */;
        font-size: .453333rem /* 34/75 */;
        font-weight: 600;
        color: #5B2D00;
        border-radius: .653333rem /* 49/75 */;
        background: linear-gradient(180deg, #FFEA00 0%, #FFB600 100%);
    }
    .button-rank {
        height: .493333rem /* 37/75 */;
        font-size: .346667rem /* 26/75 */;
        font-weight: 500;
        color: #FFFFFF;
        background-color: transparent;
    }
}

</style>

<style>
/* 本项目ipad独立设置 */
@media only screen and (min-device-width: 768px) {
    html {
        font-size: 52px !important;
    }
    #app {
        max-width: 520px;
    }
}
</style>