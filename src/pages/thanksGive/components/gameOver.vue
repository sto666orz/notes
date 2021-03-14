<template>
  <div class="popup-bg" :class="{ complete: showPoster }">
    <div v-if="!showPoster" class="popup-content" ref="RefPoster" key="poster">
      <img
        class="bg-image"
        src="../../../assets/images/thanksGive/components/gameover@2x.png"
        alt=""
      />
      <div class="header">
        <img class="avatar-image" :src="avatar" alt="" />
        <p class="header-text">{{ nickname }}</p>
        <p class="header-text">在母上大人从业挑战赛中获得成绩</p>
      </div>
      <div class="game-info">
        <p class="info-first">
          <span>游戏时长</span>{{timeText(scoreTime)}}
        </p>
        <p class="info-second"><span>音符Miss</span>{{ missCount }}个</p>
        <p class="info-three">
          <span>最优排名</span>{{rankText(playerRank)}}
        </p>
      </div>
      <div class="qrcode" ref="RefQrcode"></div>
    </div>
    <div v-else class="popup-output" key="output">
      <div class="popup-center">
        <img :src="posterImageBase64" alt="" ref="RefContent" />
        <p class="hold-tips">长按保存海报</p>
        <div class="button-group">
          <div class="continue" @click="againGame()">继续挑战</div>
          <!-- <div class="rank" @click="toRankList()">查看全国排名</div> -->
        </div>
        <!-- <div class="close-button" @click="closeView"></div> -->
      </div>
    </div>

    <div class="output" ref="RefOutput"></div>

    <!-- 用于生成海报时候的遮罩 -->
    <div v-if="!showPoster" class="full-msak"></div>
  </div>
  <div v-show="loading" class="pop-mask">
    <img
      class="loading-icon"
      src="../../../assets/images/loading-icon.svg"
      alt="载入中..."
    />
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue';
// import QRCode from 'qrcodejs2';
import html2canvas from "html2canvas";
// import AlloyFinger from "alloyfinger";


export default {
  props: {
    nickname: String,
    avatar: String,
    missCount: Number, // miss数量
    scoreTime: Number, // 游戏成绩
    playerRank: Number, // 玩家排名
  },
  emits: ['closeView', 'againGame'],
  setup(props, context) {
    const RefPoster = ref(null);
    const RefQrcode = ref(null);
    const RefOutput = ref(null);
    const RefContent = ref(null);
    const data = reactive({
      posterImageBase64: '',
      qrcodeImage: '',
      showPoster: false,
      loading: false,
    });

    const againGame = () => {
      context.emit('againGame');
      context.emit('closeView');
    }

    const rankText = (val) => {
      return val <= 70 ? `TOP${val}` : val <= 999 ? val : "999+";
    }

    const timeText = (val) => {
      let minutes = Math.floor(val / (60 * 1000));
      let seconds = Math.floor((val - minutes * 60 * 1000) / 1000);
      let milliseconds = val - (minutes * 60 + seconds) * 1000;
      let ms = Math.floor(milliseconds / 10); // 要显示的毫秒是十位数级

      return `${minutes >= 1 ? minutes + "分" : ""}${seconds}秒${
        ms < 10 ? "0" + ms : ms
      }`;
    }

    const makePoster = () => {
      data.loading = true;
      document.documentElement.scrollTop = document.body.scrollTop = 0;
      setTimeout(() => {
        const element = RefPoster.value;
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
          backgroundColor: null,
        };
        // 转换为canvas
        html2canvas(element, options).then(canvas => {
          RefOutput.value.appendChild(canvas);
          // canvas转换为base64
          data.posterImageBase64 = canvas.toDataURL("image/png");
          data.showPoster = true;
          data.loading = false;
          /* this.$nextTick(() => {
            this.longTap();
          }); */
        });
      }, 100);
    }

    /* const createQrcode = () => {
      const element = RefQrcode.value;
      let qrcode = new QRCode(element, {
        text: 'data.short_url',
        width: Math.floor(element.offsetWidth),
        height: Math.floor(element.offsetHeight),
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L,
      });
      data.qrcodeImage = qrcode._oDrawing._elCanvas.toDataURL(
        "image/png"
      );

      makePoster();
    } */

    onMounted(() => {
      // createQrcode();
      makePoster();
    })

    return {
      ...toRefs(data),
      rankText,
      timeText,
      againGame,
      RefPoster,
      RefQrcode,
      RefOutput,
      RefContent,
    }
  }
}
</script>

<style lang="scss" scoped>
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
    width: 472px;
    height: 807px;
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
      width: 405px;
      margin: 0 auto 16px;
      padding-top: 58px;
      padding-bottom: 18px;
      border-bottom: 1px solid #7296da;
      .avatar-image {
        position: absolute;
        top: 58px;
        left: 15px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
      }
      .header-text {
        margin-left: 70px;
        font-size: 16px;
        color: #ffffff;
      }
    }
    .game-info {
      // text-align: center;
      position: relative;
      width: 405px;
      margin: 0 auto;
      p {
        line-height: 35px;
        font-size: 23px;
        color: #fd5e02;
        span {
          display: inline-block;
          width: 80px;
          font-size: 16px;
          color: #ffffff;
        }
      }

      .info-first {
        position: absolute;
        left: 27px;
      }
      .info-second {
        position: absolute;
        top: 45px;
        left: 27px;
      }
      .info-three {
        position: absolute;
        left: 226px;
      }
    }
    .qrcode {
      position: absolute;
      right: 63px;
      bottom: 31px;
      width: 130px;
      height: 130px;
      background-color: #ffffff;
      :deep(img) {
        width: 130px;
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
        width: 473px;
        max-width: 375PX; //兼容ipad
        margin: 0 auto;
      }
    }
  }

  .hold-tips {
    text-align: center;
    margin-top: 30px;
    line-height: 24px;
    font-size: 24px;
    color: #fff0b7;
  }

  @mixin create-button($width, $height) {
    width: $width;
    height: $height;
    line-height: $height;
    font-weight: 600;
    color: #ffffff;
    border-radius: 0.666667rem;
    background-color: #fd5e02;
  }

  .button-group {
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 28px 75px 0;
    .continue {
      @include create-button(210px, 70px);
      font-size: 32px;
    }
    .rank {
      @include create-button(210px, 70px);
      font-size: 32px;
    }
    .share {
      @include create-button(68px, 68px);
      background-image: url("../../../assets/images/thanksGive/components/share@2x.png");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 36px;
    }

    .continue + .rank {
      margin-left: 34px;
    }

    .rank + .share {
      margin-left: 34px;
    }
  }
}

.output {
  display: none;
}

.pop-mask {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
  .loading-icon {
    display: block;
  }
}
</style>