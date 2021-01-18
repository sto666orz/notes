<template>
    <div class="popup-bg" :class="{ 'complete': showPoster }" >
        <div v-if="!showPoster" class="popup-content" ref="poster" key="poster">
            <img class="bg-image" src="@/assets/images/thanksGive/components/gameover@2x.png" alt="">
            <div class="header">
                <img class="avatar-image" :src="avatar" alt="">
                <p class="header-text">{{nickname}}</p>
                <p class="header-text">在母上大人从业挑战赛中获得成绩</p>
            </div>
            <div class="game-info">
                <p class="info-first"><span>游戏时长</span>{{scoreTime | timeText}}</p>
                <p class="info-second"><span>音符Miss</span>{{missCount}}个</p>
                <p class="info-three"><span>最优排名</span>{{playerRank | rankText}}</p>
            </div>
            <div class="qrcode" ref="qrcode"></div>
        </div>
        <div v-else class="popup-output" key="output">
            <div class="popup-center">
                <img :src="posterImageBase64" alt="" ref="content">
                <p v-if="!isApp" class="hold-tips">长按保存海报</p>
                <div class="button-group">
                    <div class="continue" @click="againGame()">继续挑战</div>
                    <div class="rank" @click="toRankList()">查看全国排名</div>
                    <div v-if="isApp" class="share" @click="shareForApp()"></div>
                </div>
                <!-- <div class="close-button" @click="closeView"></div> -->
            </div>
        </div>

        <div class="output" ref="output"></div>

        <!-- 用于生成海报时候的遮罩 -->
        <div v-if="!showPoster" class="full-msak"></div>

    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import AlloyFinger from 'alloyfinger'

import QRCode from 'qrcodejs2'
import MkBridge from "mk-bridge"
import $http from 'service/commonService'
import { isWeiXin, openAppWxFriend, getParams, appShareSaveImg, getStore } from 'util/base'

const EventPosition = MkBridge.container.isAPP
    ? 'app'
    : isWeiXin()
        ? '微信'
        : '外部';

function getShareConfig() {
    const queryObj = getParams();
    let utm_source = queryObj.utm_source || "";
    let utm_campaign = queryObj.utm_campaign || "";
    let utm_medium = queryObj.utm_campaign || "";
    // let utm_term = queryObj.utm_term || "";
    let utm_content = queryObj.utm_content || "";
    // let assist_channel = queryObj.assist_channel || "";
    // let assist_term = queryObj.assist_term || "";
    let assist_medium = queryObj.assist_medium || "";
    let assist_content = queryObj.assist_content || "";
    let assist_campaign = queryObj.assist_campaign || "";
    let params = {
        utm_source,
        utm_campaign,
        utm_medium,
        utm_term: getStore('uid') || '',
        utm_content,
        assist_channel: 'mkt_thanksgiving',
        assist_term: 'share',
        assist_medium,
        assist_content,
        assist_campaign,
    };

    let search = [];
    Object.keys(params).forEach(name => {
        search.push(name + '=' + params[name]);
    });
    search = '?' + search.join('&');

    return search;
}


export default {
    props: {
        nickname: String,
        avatar: String,
        missCount: Number,  // miss数量
        scoreTime: Number,  // 游戏成绩
        playerRank: Number, // 玩家排名
    },
    data() {
        return {
            isApp: MkBridge.container.isAPP,
            posterImageBase64: '',
            qrcodeImage: '',
            showPoster: false,
        }
    },
    methods: {
        toRankList() {
            this.$router.push({
                path: '/thanksGive/rankList',
                query: this.$route.query
            });

            this.$sa.track('WebClick', {
                'button_name': '查看全国排名',
                'button_position': '感恩节游戏结束弹窗',
                'event_position': EventPosition
            });
        },
        againGame() {
            this.$emit('againGame');
            this.closeView();

            this.$sa.track('WebClick', {
                'button_name': '继续挑战',
                'button_position': '感恩节游戏结束弹窗',
                'event_position': EventPosition
            });
        },
        shareForApp() {
            const shareParam = {
                shareType: 2,
                imgUrl: this.posterImageBase64
            }
            openAppWxFriend(shareParam);

            this.$sa.track('WebClick', {
                'button_name': '分享',
                'button_position': '感恩节游戏结束弹窗',
                'event_position': 'app'
            });
        },
        createQrcode() {
            const config = getShareConfig();
            $http.shortUrl({ url: `${window.location.origin}/thanksGive/home${config}` }).then(res=>{
                const { data: { data, code }, msg } = res;
                if(code == 200) {
                    const codeRef = this.$refs['qrcode'];
                    let qrcode = new QRCode(codeRef, {
                        text: data.short_url,
                        width: Math.floor(codeRef.offsetWidth),
                        height: Math.floor(codeRef.offsetHeight),
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.L
                    });
                    this.qrcodeImage = qrcode._oDrawing._elCanvas.toDataURL("image/png");

                    this.makePoster();
                } else {
                    this.Toast(msg);
                }
            }).catch(error=>{
                console.log(error, 'error');
            })
        },
        makePoster() {
            document.documentElement.scrollTop = document.body.scrollTop = 0;
            setTimeout(() => {
                const output = this.$refs['output'];
                const element = this.$refs['poster'];
                const width = element.offsetWidth * 1;
                const height = element.offsetHeight * 1;
                const options = {
                    width,
                    height,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0,
                    proxy: true,
                    useCORS: true,
                    onclone: true,
                    scale: Math.min(Math.ceil(window.devicePixelRatio || 1), 2),
                    removeContainer: true,
                    backgroundColor: null
                };
                // 转换为canvas
                (window.html2canvas || html2canvas)(element, options).then(canvas => {
                    output.appendChild(canvas);
                    // canvas转换为base64
                    this.posterImageBase64 = canvas.toDataURL("image/png");
                    this.showPoster = true;
                    this.$nextTick(() => {
                        this.longTap();
                    });
                });
            }, 250);
        },
        longTap() {
            new AlloyFinger(this.$refs['content'], {
                longTap: event => {
                    event.preventDefault();
                    this.$sa.track('LongPressPicture', {
                        action_name: '长按保存图片',
                        action_position: '感恩节游戏结束弹窗',
                        event_position: EventPosition
                    });

                    if (this.isApp) {
                        appShareSaveImg(this.posterImageBase64);
                    }
                }
            });

            // 通知父组件
            this.$emit('complete');
        },
        closeView() {
            this.$emit('closeView', false);
        }
    },
    mounted() {
        this.createQrcode();
    },
    filters: {
        rankText(val) {
            return val <= 70 
                ? `TOP${val}`
                : val <= 999
                ? val
                : '999+'
        },
        timeText(val) {
            let minutes = Math.floor(val / (60 * 1000));
            let seconds = Math.floor( (val - (minutes * 60 * 1000)) / 1000 );
            let milliseconds = val - ((minutes * 60 + seconds) * 1000);
            let ms = Math.floor(milliseconds / 10); // 要显示的毫秒是十位数级

            return `${minutes >= 1 ? minutes + '分' : ''}${seconds}秒${ms < 10 ? '0' + ms : ms}`;
        }
    }
}

</script>

<style lang="less" scoped>

.popup-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: -1;

    &.complete {
        z-index: auto;
    }

    .full-msak {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #071227;
    }
    .popup-content {
        position: relative;
        width: 6.293333rem /*472/75*/;
        height: 10.76rem /*807/75*/;
        font-weight: 600;
        .bg-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .header {
            position: relative;
            width: 5.4rem /*405/75*/;
            margin: 0 auto 0.213333rem /*16/75*/;
            padding-top: 0.773333rem /*58/75*/;
            padding-bottom: 0.24rem /*18/75*/;
            border-bottom: 1px solid #7296DA;
            .avatar-image {
                position: absolute;
                top: 0.773333rem /*58/75*/;
                left: 0.2rem /*15/75*/;
                width: 0.533333rem /*40/75*/;
                height: 0.533333rem /*40/75*/;
                border-radius: 100%;
            }
            .header-text {
                margin-left: 0.933333rem /*70/75*/;
                font-size: 0.213333rem /*16/75*/;
                color: #FFFFFF;
            }
        }
        .game-info {
            // text-align: center;
            position: relative;
            width: 5.4rem /*405/75*/;
            margin: 0 auto;
            p {
                line-height: 0.466667rem /*35/75*/;
                font-size: 0.306667rem /*23/75*/;
                color: #FD5E02;
                span {
                    display: inline-block;
                    width: 1.066667rem /*80/75*/;
                    font-size: 0.213333rem /*16/75*/;
                    color: #FFFFFF;
                }
            }

            .info-first {
                position: absolute;
                left: 0.36rem /*27/75*/;
            }
            .info-second {
                position: absolute;
                top: 0.6rem /*45/75*/;
                left: 0.36rem /*27/75*/;
            }
            .info-three {
                position: absolute;
                left: 3.013333rem /*226/75*/;
            }
        }
        .qrcode {
            position: absolute;
            right: 0.84rem /*63/75*/;
            bottom: 0.413333rem /*31/75*/;
            width: 1.733333rem /*130/75*/;
            height: 1.733333rem /*130/75*/;
            background-color: #FFFFFF;
            :deep(img) {
                width: 1.733333rem /*130/75*/;
            }
        }
    }
    .popup-output {
        position: relative;
        height: 100%;
        .popup-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            img {
                display: block;
                width: 6.306667rem /*473/75*/;
                max-width: 375px; //兼容ipad
                margin: 0 auto;
            }
        }
    }

    .hold-tips {
        text-align: center;
        margin-top: 0.4rem /*30/75*/;
        line-height: 0.32rem /*24/75*/;
        font-size: 0.32rem /*24/75*/;
        color: #FFF0B7;
    }

    .create-button(@width, @height) {
        width: @width;
        height: @height;
        line-height: @height;
        font-weight: 600;
        color: #FFFFFF;
        border-radius: 0.666667rem;
        background-color: #FD5E02;
    }

    .button-group {
        display: flex;
        justify-content: center;
        text-align: center;
        margin: 0.373333rem /*28/75*/ 1rem /*75/75*/ 0;
        .continue {
            .create-button(2.8rem /*210/75*/, 0.933333rem /*70/75*/);
            font-size: 0.426667rem /*32/75*/;
        }
        .rank {
            .create-button(3.36rem /*252/75*/, 0.933333rem /*70/75*/);
            font-size: 0.426667rem /*32/75*/;
        }
        .share {
            .create-button(0.906667rem /*68/75*/, 0.906667rem /*68/75*/);
            // font-size: 0.226667rem /*17/75*/;
            background-image: url("~@/assets/images/thanksGive/components/share@2x.png");
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 0.48rem /*36/75*/;
        }

        .continue + .rank {
            margin-left: 0.453333rem /*34/75*/;
        }

        .rank + .share {
            margin-left: 0.453333rem /*34/75*/;
        }
    }
}

.output {
    display: none;
}

</style>