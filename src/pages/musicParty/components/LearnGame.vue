<template>
  <div v-if="visible" class="beginner">
    <layout-party>
      <template #stage>
        <party-boy
          v-if="stepCurrent <= 2"
          @slideDown="removeSkin()"
          :index="learnBoy.index"
          :hit="learnBoy.isHit"
          :skin="learnBoy.skin"
        >
          <div ref="RefsHits" @click="removeSkin()" class="hit-box"></div>
        </party-boy>
        <party-boy
          v-else-if="stepCurrent === 3"
          :index="0"
          :skin="`aha_${theme}`"
        >
          <div ref="RefsHits" @click="nextStep()" class="hit-box"></div>
        </party-boy>

        <div class="learn-help">
          <p class="title">新手引导 {{ stepCurrent }}/3</p>
          <template v-if="stepCurrent === 1">
            <p>将下方的乐器池中的音乐</p>
            <p>拖动给舞台中的演奏者</p>
            <p>可以添加伴奏</p>
          </template>
          <template v-else-if="stepCurrent === 2">
            <p>将舞台上演奏家的乐器拖</p>
            <p>入乐器池，可以取消伴奏</p>
          </template>
          <template v-else-if="stepCurrent === 3">
            <p>反复点击主唱</p>
            <p>可以控制它唱歌</p>
          </template>
          <img
            class="aha"
            src="../../../assets/images/musicParty2020/learn/pic_new_aha@2x.png"
            alt=""
          />
        </div>
      </template>

      <template #bottom>
        <i class="button-next" @click="nextStep()">{{
          stepCurrent === 3 ? "开始创作" : "下一步"
        }}</i>

        <party-ins
          v-if="stepCurrent === 1"
          class="ins-first"
          label="learnFirst"
          @moveing="itemMoving"
          @moveEnd="itemMoveEnd"
        >
        </party-ins>

        <img
          v-if="stepCurrent === 1"
          class="hand-first"
          src="../../../assets/images/musicParty2020/learn/effect_hand@2x.png"
        />
        <img
          v-else-if="stepCurrent === 2"
          class="hand-second"
          src="../../../assets/images/musicParty2020/learn/effect_hand@2x.png"
        />
        <img
          v-else-if="stepCurrent === 3"
          class="hand-three"
          src="../../../assets/images/musicParty2020/learn/effect_hand@2x.png"
        />
      </template>

      <img
        class="button-skip"
        src="../../../assets/images/musicParty2020/learn/skip@2x.png"
        @click="skipLearn()"
      />
    </layout-party>
  </div>
</template>

<script>
import { watch, ref, reactive } from "vue";
import LayoutParty from "./layout/Party.vue";
import PartyIns from "./PartyIns.vue";
import PartyBoy from "./PartyBoy.vue";
import { hitTestBox } from "@utils/util";

export default {
  components: {
    LayoutParty,
    PartyIns,
    PartyBoy,
  },
  props: {
    visible: Boolean,
    theme: String,
  },
  emits: ['step'],
  setup(props, context) {
    // 新手引导当前步骤
    const stepCurrent = ref(0);
    const learnBoy = reactive({
      index: 4,
      isHit: false,
      skin: ""
    });
    const learnAha = reactive({
      isSong: false
    });

    const notify = () => {
      context.emit(
        'step',
        stepCurrent.value,
        { ...learnBoy },
        { ...learnAha },
      );
    }

    // 按钮 下一步
    const nextStep = () => {
      if (stepCurrent.value === 0) {
        notify();
      } else if (stepCurrent.value === 1) {
        learnBoy.skin = "diangangqin";
        notify();
      } else if (stepCurrent.value === 2) {
        learnBoy.skin = "";
        notify();
      } else if (stepCurrent.value === 3) {
        learnAha.isSong = true;
        notify();
      }
      stepCurrent.value = Math.min(stepCurrent.value + 1, 3);
    }

    const removeSkin = () => {
      if (stepCurrent.value === 2) {
        nextStep();
      }
    }

    const RefsHits = ref(null);
    const itemMoving = (name, clientX, clientY) => {
      learnBoy.isHit = hitTestBox(RefsHits, clientX, clientY);
    }
    const itemMoveEnd = (name) => {
      if (learnBoy.isHit && stepCurrent.value === 1) {
        nextStep();
      }
      learnBoy.isHit = false;
    }

    const skipLearn = () => {
      stepCurrent.value = 3;
      nextStep();
    }

    watch(() => props.visible, (val) => {
      if (val) {
        stepCurrent.value = 0;
        learnBoy.skin = "";
        learnAha.isSong = false;
        nextStep();
      }
    }, {
      immediate: true
    });

    return {
      theme: props.theme,
      RefsHits,
      stepCurrent,
      learnBoy,
      learnAha,
      removeSkin,
      itemMoving,
      itemMoveEnd,
      skipLearn,
      nextStep,
    }
  }
}
</script>

<style lang="scss" scoped>
.beginner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);

  .ins-first {
    margin: 39px auto 0;
    /* /deep/ .ins-cover {
      display: none;
    } */
    :deep(.ins-cover) {
      display: none;
    }
  }
  .button-skip {
    position: absolute;
    top: 47px;
    right: 50px;
    width: 100px;
    height: 42px;
  }
  .hit-box {
    position: absolute;
    top: 30px;
    left: 30px;
    right: 30px;
    bottom: 30px;
  }
}

@keyframes effectfirst {
  0%,
  35% {
    opacity: 0;
  }
  50% {
    top: 60px;
    left: 75px;
    opacity: 0.9;
  }
  85% {
    top: -290px;
    left: 160px;
    opacity: 0.7;
  }
  100% {
    top: -290px;
    left: 160px;
    opacity: 0;
  }
}

@keyframes effectsecond {
  0%,
  35% {
    opacity: 0;
  }
  50% {
    top: -290px;
    left: 160px;
    opacity: 0.9;
  }
  85% {
    top: -160px;
    opacity: 0.7;
  }
  100% {
    top: -160px;
    opacity: 0;
  }
}
@keyframes effectthree {
  0%,
  80% {
    transform: rotate(0);
    opacity: 1;
  }
  50% {
    transform: rotate(21deg);
    opacity: 0.75;
  }
}

.hand-first,
.hand-second,
.hand-three {
  position: absolute;
  width: 104px;
  height: 104px;
  pointer-events: none;
}

.hand-first {
  top: 60px;
  left: 75px;
  animation: effectfirst 3.3s infinite;
}
.hand-second {
  top: -290px;
  left: 160px;
  animation: effectsecond 3.1s infinite;
}
.hand-three {
  top: -290px;
  left: 375px;
  animation: effectthree 1.5s infinite;
}

.learn-help {
  // box-sizing: border-box;
  position: absolute;
  left: 92px;
  bottom: 461px;
  padding: 19px 41px;
  width: 527px;
  line-height: 42px;
  font-size: 30px;
  font-weight: 500;
  border-radius: 26px;
  color: #ffffff;
  background-color: #ff6536;
  .title {
    position: absolute;
    left: 25px;
    top: -58px;
  }
  .aha {
    position: absolute;
    bottom: -6px;
    right: -71px;
    width: 198px;
  }
}

.button-next {
  text-align: center;
  position: absolute;
  top: 137px;
  left: 210px;
  width: 330px;
  height: 84px;
  line-height: 84px;
  border: 2px solid #ffffff;
  border-radius: 42px;
  font-size: 30px;
  color: #ffffff;
}
</style>
