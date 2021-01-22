<template>
  <div class="game-wrap">
    <div class="canvas-center" ref="RefGame"></div>
    <div class="progress" ref="RefProgress"></div>
    <div class="portrait-tips">
      <img
        src="../../assets/images/thanksGive/components/portrait@2x.png"
        alt=""
      />
      <p class="tips">请旋转屏幕使用<span>竖屏</span>体验游戏</p>
    </div>
    <game-over
      v-if="gameover"
      :avatar="avatar"
      :nickname="nickname"
      :missCount="missCount"
      :scoreTime="scoreTime"
      :playerRank="playerRank"
      @complete="closeLoding"
      @againGame="againGame"
      @closeView="gameover = false"
    >
    </game-over>
  </div>
</template>

<script>
import { ref, reactive, toRefs , onMounted, onUnmounted } from 'vue';
import GameManager from "./games/GameManager";
import GameOver from "./components/GameOver.vue";

export default {
  components: {
    GameOver,
  },
  setup() {
    const userInfo = reactive({
      avatar: '',
      nickname: '游客',
      playCoin: 99,
      scoreTime: 0, // 游戏时间
      missCount: 0, // miss次数
      playerRank: 1,
    })

    const RefGame = ref(null);
    const RefProgress = ref(null);

    const againGame = () => {
      if (userInfo.playCoin <= 0) {
        // this.showTipsPop = true;
        console.log('次数不足');
      }
    }

    const submitScore = ({ time, miss }) => {
      // 此处是向服务器提交
      return Promise.resolve();
    }

    /** @type {gameManager} */
    let gameManager = null;

    const changeWindowHeight = () => {
      // IOS 旋转屏幕不延迟获取宽高 会导致宽高不准的bug
      setTimeout(() => {
        if (gameManager && gameManager.stage) {
          gameManager.stage.changeSize();
        }
      }, 100);
    }

    onMounted(() => {
      const gameManager = new GameManager(RefGame);
      // 游戏加载进度
      gameManager.drawProgress(RefProgress);
      // 监听游戏结束
      gameManager.on("gameover", ({ detail }) => {
        submitScore(detail).then(() => {
          gameManager.toReadyScene();
        });
      });
      window.addEventListener("resize", changeWindowHeight);
    })

    onUnmounted(() => {
      gameManager.destroy();
      window.removeEventListener("resize", changeWindowHeight);
    })
    
    return {
      ...toRefs(userInfo),
      RefGame,
      RefProgress,
    }
  }
}
</script>

<style lang="scss" scoped>
.game-wrap {
  font-family: "PingFang SC", miui, system-ui, -apple-system, BlinkMacSystemFont,
    Helvetica Neue, Helvetica, sans-serif;
  user-select: none;
  touch-action: none;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: #071227;
  background-image: url("../../assets/images/thanksGive/games/bg_repeat.png");
  background-position: 0 36vh;
  background-repeat: repeat-x;
  background-size: 270px auto;
  .canvas-center {
    position: relative;
    height: 100%;
    :deep(canvas) {
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background-color: #071227;
    }
  }

  .progress {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    line-height: 100vh;
    font-size: 45px;
    color: #ffffff;
    background-color: #071227;
  }
  .portrait-tips {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    img {
      display: block;
      width: 24vh;
    }
    .tips {
      margin-top: 4vh;
      font-size: 6vh;
      color: #ffffff;
      span {
        color: #f1d26b;
      }
    }
  }
}

/*竖屏*/
@media only screen and (orientation: portrait) {
  //
}
/*横屏*/
@media only screen and (orientation: landscape) {
  .portrait-tips {
    display: flex !important;
  }
}
</style>