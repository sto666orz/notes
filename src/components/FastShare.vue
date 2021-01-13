<!-- 简易快速的分享组件 -->
<template>
    <transition name="fade">
        <div class="popup-bg" v-show="visible" @click.self="closeView()">
            <div v-if="isApp" class="popup-content">
                <p class="share-text">每邀1位好友助力<span>+1</span>次抽奖机会。</p>
                <div class="share-wrap">
                    <button class="share-friends" @click="friends()">分享给微信好友</button>
                    <button class="share-moments" @click="moments()">分享至朋友圈</button>
                </div>
                <i class="icon-popup-close" @click="closeView()"></i>
            </div>
            <img v-else-if="isWechat" class="wx-share-img" src="@/assets/images/musicParty2020/lottery/wechat_share@2x.png">
            <div v-else class="errors-text">请于APP/微信环境中打开后分享</div>
        </div>
    </transition>
</template>

<script>
import MkBridge from "mk-bridge"
import { isWeiXin, openAppWxFriend, openAppWxTimeline } from 'util/base'
import { getUserId, getUserInfo } from '../../local/util'
import { getShareConfig, ShareConfig, setWxShare } from '../../local/shareUtil'


export default {
    props: {
        visible: Boolean,
        shareKey: String
    },
    data() {
        return {
            isWechat: isWeiXin(),
            isApp: MkBridge.container.isAPP
        }
    },
    methods: {
        closeView() {
            this.$emit('update:visible', false);
        },
        friends() {
            getUserInfo().then(( { nickname, avatar } ) => {
                const url = this.shareKey ? '/assist' : '/home';
                const config = this.shareKey
                ? getShareConfig({
                        share_key: this.shareKey,
                        // share_uid: getUserId(),
                        // share_name: encodeURIComponent(nickname),
                        // share_avatar: encodeURIComponent(avatar),
                    }) 
                : getShareConfig();

                const shareParam = {
                    title: ShareConfig.friendsTitle,
                    content: ShareConfig.friendsText,
                    url: `${window.location.origin}/musicParty${url}${config}`,
                    shareType: 3,
                    shareImg: ShareConfig.shareIcon
                }

                openAppWxFriend(shareParam);
                this.handleGuide();
            });
        },
        moments() {
            getUserInfo().then(( { nickname, avatar } ) => {
                const url = this.shareKey ? '/assist' : '/home';
                const config = this.shareKey
                ? getShareConfig({
                        share_key: this.shareKey,
                        // share_uid: getUserId(),
                        // share_name: encodeURIComponent(nickname),
                        // share_avatar: encodeURIComponent(avatar),
                    }) 
                : getShareConfig();

                const shareParam = {
                    title: ShareConfig.momentsTitle,
                    content: ShareConfig.momentsTitle,
                    url: `${window.location.origin}/musicParty${url}${config}`,
                    shareType: 3,
                    shareImg: ShareConfig.shareIcon
                }

                openAppWxTimeline(shareParam);
                this.handleGuide();
            });
        },
        wxAssitsShare(shareKey) {
            getUserInfo().then(( { nickname, avatar } ) => {
                setWxShare('/assist', {
                    share_key: shareKey,
                    // share_uid: this.userId,
                    // share_name: encodeURIComponent(nickname),
                    // share_avatar: encodeURIComponent(avatar),
                });
            });
        },
        handleGuide() {
            this.$emit('completed', null);
        }
    },
    mounted() {
        // 非微信环境下提前获取头像进行缓存
        if ( !this.isWechat && getUserId() ) {
            getUserInfo();
        }
    },
    created() {
        if ( this.isWechat ) {
            // 微信环境需要修改全局分享配置
            this.$watch('shareKey', (val, oldVal) => {
                if (val && val !== oldVal) {
                    this.wxAssitsShare(val);
                } else if (!val) {
                    setWxShare('/home');
                }
            }, { immediate: true });
        }
    }
}
</script>


<style lang="less" scoped>

.share-btn(@url) {
    padding-top: 1.2rem + .16rem;
    font-size: .293333rem /* 22/75 */;
    color: #494C5C;
    background: ~"url(~@/assets/images/taowa/view/@{url}.png)" center 0 no-repeat;
    background-size: 1.2rem /* 90/75 */;
}

.popup-bg {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;

    .errors-text {
        margin: auto;
        font-size: 0.4rem /*30/75*/;
        color: #FFFFFF;
    }
    // 微信背景图
    .wx-share-img {
        position: absolute;
        top: .573333rem /* 43/75 */;
        right: .426667rem /* 32/75 */;
        width: 6.56rem /* 492/75 */;
        height: 3.786667rem /* 284/75 */;
    }
}
.popup-content {
    text-align: center;
    position: relative;
    width: 8rem /* 600/75 */;
    height: 5.4rem /* 405/75 */;
    margin: 0 auto;
    border-radius: .4rem;
    background-color: #FFFFFF;
    .share-text {
        margin-top: .8rem /* 60/75 */;
        line-height: .6rem /* 45/75 */;
        font-size: 0.4rem /*30/75*/;
        color: #333333;
        span {
            color: #FF3300;
        }
    }
    .share-wrap {
        margin-top: 1.026667rem;
        .share-friends {
            .share-btn('icon_wechat_friends');
        }
        .share-moments {
            .share-btn('icon_wechat_moments');
            margin-left: 1.6rem /* 120/75 */;
        }
    }
    .icon-popup-close {
        position: absolute;
        left: 50%;
        margin-left: -.466667rem /* 35/75 */;
        bottom: -.56rem /* 42/75 */ - .933333rem /* 70/75 */;
        width: .933333rem /* 70/75 */;
        height: .933333rem /* 70/75 */;
        background: url("~@/assets/images/icon_close@2x.png") center center no-repeat;
        background-size: 100%;
    }
}

// 打开/关闭动画
.fade-enter-active, .fade-leave-active {
    transition: background .3s linear;
    .popup-content, .wx-share-img {
        transition: all .27s ease-in-out;
    }
}
.fade-enter, .fade-leave-to {
    background-color: rgba(0, 0, 0, 0);
    .popup-content {
        transform: scale(.8, .8);
        opacity: 0;
    }
    .wx-share-img {
        transform: translate(7.5%, -15%);
        opacity: 0;
    }
}
</style>