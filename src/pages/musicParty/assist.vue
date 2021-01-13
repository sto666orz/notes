<template>
    <layout-party :class="[loading ? 'page-load' : 'page-wrap', theme]">
        <template #stage>
            <div class="party-stage" :class="{'animation-stop': !startPlay}">
                <party-boy v-for="item in boysList"
                    :visible="item.visible"
                    :index="item.index"
                    :hit="item.isHit"
                    :skin="item.skin"
                    :key="item.index">
                </party-boy>
                <party-boy :index="0" :skin="leadSinger ? `run_${theme}` : `aha_${theme}`">
                </party-boy>
                <div class="photo-main">
                    <div class="photo-frames" :class="{ 'photo-mask': !startPlay }">
                        <button v-if="!startPlay" class="button-play" @click="playMusic()"></button>
                        <div class="photo-info">
                            <p class="friend">
                                <img class="user-avatar" :src="shareAvatar" alt="">
                                <span class="user-name">{{shareName}}</span>
                            </p>
                            <p class="song-name"></p>
                        </div>
                    </div>
                    <div class="music-name"></div>
                </div>
            </div>
        </template>

        <template #bottom>
            <div class="party-bottom">
                <div class="content">
                    <button class="button" :class="[isAssisted ? 'assisted' : 'assist']" @click="assistTo()"></button>
                    <button class="button start" @click="linkToHome()"></button>
                </div>
            </div>
        </template>

        <popup-assist :visible.sync="assistVisible"></popup-assist>

        <user-register :visible.sync="loginVisible" @success="regSuccess"></user-register>

        <stage-loading :theme="theme"
            :visible.sync="loadVisible"
            @completed="changeThemeEnd">
        </stage-loading>
    </layout-party>
</template>

<script>
// import UserRegister from './components/public/userRegister.vue'
import LayoutParty from './components/layout/Party.vue'
import PartyBoy from './components/PartyBoy.vue'
import PopupAssist from './components/PopupAssist.vue'
import StageLoading from './components/StageLoading.vue'

import SoundControl from './local/soundControl'
import { getUserToken, getUserInfo } from './local/util'
import { hideWxShare } from './local/shareUtil'
import { isWeiXin, getCookie, initWxInfoAuth } from 'util/base'
import httpRequest from 'service/musicParty2020'


export default {
    components: {
        LayoutParty,
        PartyBoy,
        PopupAssist,
        StageLoading,
        UserRegister
    },
    data() {
        return {
            loading: false,
             /** @type {'christmas' | 'newyear'} */
            theme: 'christmas',
            /** @type {Boy[]} */
            boysList: [],
            leadSinger: false,      // aha是否再唱歌
            startPlay: false,       // 是否开始播放
            loadVisible: false,     // 载入窗口
            assistVisible: false,   // 助力成功窗口
            loginVisible: false,
            isAssisted: false,      // 是否已助力
            shareAvatar: null,
            shareName: null,
            shareUser: null,
        }
    },
    methods: {
        linkToHome(path) {
            this.$router.push({
                path: '/musicParty/home',
                query: { ...this.$route.query, share_key: undefined }
            });

            this.$sa.track('WebClick', {
                button_name: '去制作_1'
            });
        },
        assistTo() {
            this.$sa.track('WebClick', {
                button_name: '助力按钮'
            });

            if ( !this.checkWxAuth() ) return;
            if ( !this.checkLogin() ) return;

            if (this.isAssisted) return;

            this.$loading.open({ message: '正在助力', magIcon: '' });

            getUserInfo().then(({ nickname, avatar }) => {
                const params = {
                    nickname: nickname,
                    portrait: avatar
                };
                return httpRequest.assistTo(this.shareUser, params).then(res => {
                    const { code, data, msg } = res;
                    if (code == 200) {
                        this.assistVisible = true;
                        this.isAssisted = true;
                    } else if (code == 100112) {
                        this.showToast('不能给自己助力哦~');
                    } else if (code == 170003) {
                        this.showToast('活动已经结束');
                    } else if (code == 100108) {
                        this.showToast('助力机会已经用完');
                    } else {
                        this.showToast(msg);
                    }
                    this.$loading.close();
                });
            }).catch(() => {
                this.showToast('网络异常，请重新尝试');
                this.$loading.close();
            });
            
        },
        playMusic() {
            this.startPlay = true;
            SoundControl.replay(this.leadSinger);
        },
        changeThemeEnd(theme) {
            this.theme = theme;
            // 刷新声音缓存
            SoundControl.refresh(theme);
        },
        regSuccess() {
            this.loginVisible = false;
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
        showToast(msg, duration = 2000) {
            this.$toast({
                message: msg,
                align: 'center',
                duration: duration //消失时间
            });
        }
    },
    created() {
        hideWxShare();
        this.checkWxAuth();
        // 初始化
        this.boysList = [
            { index: 1, isHit: false, skin: '', visible: true },
            { index: 2, isHit: false, skin: '', visible: true },
            { index: 3, isHit: false, skin: '', visible: true },
            { index: 4, isHit: false, skin: '', visible: true },
            { index: 5, isHit: false, skin: '', visible: true },
        ];
        SoundControl.cache(this.boysList);

        const { share_key } = this.$route.query;
        if ( !share_key ) {
            this.showToast('分享参数错误', 5000);
            return;
        }

        this.loading = true;
        httpRequest.getMusicInfo(share_key).then(res => {
            const { code, data, msg } = res;
            if (code == 200) {
                const format = JSON.parse(data);
                format.boys.forEach((item, index) => {
                    const boy = this.boysList[index];
                    boy.index = item.index;
                    boy.skin = item.skin;
                });
                this.theme = format.theme === 'newyear' ? 'christmas' : 'newyear';
                this.leadSinger = format.vocal;
                this.shareAvatar = format.avatar;
                this.shareName = format.nickname;
                this.shareUser = format.current;

                this.loadVisible = true;
                // vue下一帧渲染的特性 所以需要两帧回调
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        this.loading = false;
                    });
                });
            } else {
                this.showToast(msg);
            }
        });

        this.$sa.track('$pageview', {
            $title: 'VIP陪练与你一起抽好礼',
            $url: window.location.href
        });
    },
    beforeDestroy() {
        SoundControl.stop();
        SoundControl.clear();
    }
}
</script>


<style src="./public/screen.css">
</style>

<style lang="less" scoped>
.image-button(@image, @width, @height) {
    width: @width;
    height: @height;
    background: ~"url(~@/assets/images/musicParty2020/assist/@{image})" 0 0 no-repeat;
    background-size: 100%;
}
.absolute-fit {
    position: absolute;
    left: 0;
    right: 0;
}

@keyframes breath {
    0% {
        transform: scale(1, 1);
    }
    100% {
        transform: scale(1.15, 1.15);
    }
}

.page-load {
    visibility: hidden;
}
.party-stage {
    height: 100%;
    background-color: #FFFFFF;
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: 100% auto;
}
.party-bottom {
    height: 100%;
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100%;
    }

    .button {
        display: block;
        width: 8.533333rem /* 640/75 */;
        height: 1.36rem /* 102/75 */;
        border-radius: .72rem /* 54/75 */;
        border: .066667rem /* 5/75 */ solid #7F283A;
        background-repeat: no-repeat;
        background-position: center center;
        &.assist {
            background-color: #FE5535;
            background-image: url("~@/assets/images/musicParty2020/assist/type_zhuli@2x.png");
            background-size: 3.76rem /* 282/75 */;
        }
        &.start {
            background-color: #FFDC01;
            background-image: url("~@/assets/images/musicParty2020/assist/type_chuangzuo@2x.png");
            background-size: 4.72rem /* 354/75 */;
        }
        &.assisted {
            border-color: #909090;
            background-color: #B8B8B8;
            background-image: url("~@/assets/images/musicParty2020/assist/type_yizhuli@2x.png");
            background-size: 1.52rem /* 114/75 */;
        }
        & + .button {
            margin-top: .346667rem /* 26/75 */;
        }
    }
}
.photo-main:extend(.absolute-fit) {
    bottom: -.146667rem /* 11/75 */;
    z-index: 2;
    .music-name {
        position: absolute;
        top: -.733333rem /* 55/75 */;
        right: 0;
        height: 1.106667rem /* 83/75 */;
        background-repeat: no-repeat;
        background-size: 100%;
    }
}
.photo-frames {
    position: relative;
    width: 8.733333rem /* 655/75 */;
    height: 10.746667rem /* 806/75 */;
    margin: 0 auto;
    &.photo-mask {
        background: rgba(0, 0, 0, 0.38);
    }
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("~@/assets/images/musicParty2020/assist/pic_photo@2x.png") 0 0 no-repeat;
        background-size: 100%;
    }

    .button-play:extend(.absolute-fit) {
        top: 3.213333rem /* 241/75 */;
        margin: 0 auto;
        .image-button('ico_btn@2x.png', 2.32rem /* 174/75 */, 2.32rem /* 174/75 */);
        animation: breath 0.58s ease-in-out infinite alternate;
    }
    .photo-info:extend(.absolute-fit) {
        bottom: 0;
        height: 2.453333rem /* 184/75 */;
        .friend {
            text-align: center;
            padding-top: .346667rem /* 26/75 */;
            padding-bottom: .24rem /* 18/75 */;
        }
        .user-avatar {
            width: .853333rem /* 64/75 */;
            height: .853333rem /* 64/75 */;
            margin-right: .266667rem /* 20/75 */;
            border-radius: 100%;
            border: #7F283A solid .053333rem /* 4/75 */;
            vertical-align: middle;
        }
        .user-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            display: inline-block;
            vertical-align: middle;
            max-width: 3.333333rem /* 250/75 */;
            height: .6rem /* 45/75 */;
            line-height: .6rem /* 45/75 */;
            font-size: .426667rem /* 32/75 */;
            font-weight: 600;
            color: #7F283A;
        }
        .song-name {
            height: .613333rem /* 46/75 */;
            background-position: center 0;
            background-repeat: no-repeat;
            background-size: 5.706667rem /* 428/75 */;
        }
    }
}


// 配置主题
.christmas {
    background-color: #EAAD72;
    .party-stage {
        background-image: url("~@/assets/images/musicParty2020/stage/bg_christmas@2x.png");
    }
    .party-bottom {
        background-color: #B5681E;
    }
    .photo-main {
        .song-name {
            background-image: url("~@/assets/images/musicParty2020/assist/type@2x.png");
        }
        .music-name {
            width: 5.053333rem /* 379/75 */;
            background-image: url("~@/assets/images/musicParty2020/assist/pic_shengdan@2x.png");
        }
    }
}
.newyear {
    background-color: #B1E2EE;
    .party-stage {
        background-image: url("~@/assets/images/musicParty2020/stage/bg_newyear@2x.png");
    }
    .party-bottom {
        background-color: #FFCEB4;
    }
    .photo-main {
        .song-name {
            background-image: url("~@/assets/images/musicParty2020/assist/type2@2x.png");
        }
        .music-name {
            width: 6.16rem /* 462/75 */;
            background-image: url("~@/assets/images/musicParty2020/assist/pic_xinnian@2x.png");
        }
    }
}

</style>