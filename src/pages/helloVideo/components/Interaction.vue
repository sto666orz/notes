<template>
  <div class="interaction">
    <header class="interaction-header">
      <i class="button-close" @click="closeView"></i>
    </header>

    <section v-if="mainView" class="interaction-view">
      <img
        v-if="questionCurrent.loading"
        class="loading-icon"
        src="../../../assets/images/loading-icon.svg"
        alt=""
      />
      <div
        v-else
        :class="{ 'upward-transition': !touches.moveing }"
        :style="{ transform: `translateY(-${analysisHeight}px)` }"
        @touchstart="startMoveAnalysis"
        @touchmove="moveAnalysis"
        @touchend="endMoveAnalysis"
      >
        <div class="question">
          <img
            v-if="questionsStem.image"
            class="fill-image"
            :src="questionsStem.image"
          />
          <div v-else class="question-text">
            <p class="normal-text">{{ questionsStem.text }}</p>
          </div>
        </div>
        <div
          class="options-group"
          :class="questionCurrent.horizontal ? 'is-horizontal' : 'is-vertical'"
        >
          <div
            v-for="(item, index) in questionOptions"
            :key="index"
            class="option"
          >
            <div class="option-view" @click="selectAnswer(item)">
              <img v-if="item.image" class="fill-image" :src="item.image" />
              <div v-else class="option-text">
                <p class="normal-text option-clamp">{{ item.text }}</p>
              </div>
            </div>
            <transition name="fade">
              <div
                v-show="selectedAnswer === item"
                class="option-border"
                :class="item.answer ? 'is-right' : 'is-wrong'"
              ></div>
            </transition>
          </div>
        </div>
        <div ref="analysisRef" class="transition-hotfix">
          <div class="analysis">
            <p class="analysis-title">本题解析</p>
            <template v-if="questionAnalysis.audio">
              <i
                v-show="isAudioEnd.analysisAudio"
                class="analysis-audio"
                @click="replayAudio('analysisAudio', analysisAudioRef)"
              >
              </i>
              <i
                v-show="!isAudioEnd.analysisAudio"
                class="analysis-audio is-play"
              >
              </i>
            </template>
            <div class="analysis-main">
              <p v-if="questionAnalysis.text" class="normal-text">
                {{ questionAnalysis.text }}
              </p>
              <img
                v-if="questionAnalysis.image"
                class="analysis-image"
                :src="questionAnalysis.image"
              />
            </div>
          </div>
        </div>

        <div class="audio-instance">
          <audio
            v-if="questionsStem.audio"
            :src="questionsStem.audio"
            @loadedmetadata="loadedmetadata(stemAudioRef)"
            @ended="playended('stemAudio')"
            @error="playerror('stemAudio')"
            ref="stemAudioRef"
          ></audio>

          <audio
            v-if="questionAnalysis.audio"
            :src="questionAnalysis.audio"
            @ended="playended('analysisAudio')"
            @error="playerror('analysisAudio')"
            preload="metadata"
            ref="analysisAudioRef"
          ></audio>
        </div>
      </div>
    </section>

    <!-- 功能按钮部分 -->
    <footer class="interaction-group">
      <template v-if="questionsStem.audio && !questionCurrent.loading">
        <span
          v-show="isAudioEnd.stemAudio"
          class="button-replay"
          @click="replayAudio('stemAudio', stemAudioRef)"
        ></span>
        <span
          v-show="!isAudioEnd.stemAudio"
          class="button-replay-disabled"
        ></span>
      </template>

      <span
        :class="
          selectedAnswer
            ? questionIndex >= questionsAdapter.length - 1
              ? 'button-continue'
              : 'button-next'
            : 'button-next-disabled'
        "
        @click="nextQuestion"
      >
      </span>
    </footer>

    <follow-toast v-model:toast="toast"></follow-toast>
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, nextTick, watch } from "vue";
import FollowToast from "./FollowToast.vue";

/**
 * @typedef {Object} questionsAdapter - 全局环境配置
 * @property {{text: String, image: String, audio: String}} stem - 题目题干
 * @property {{text: String, image: String, audio: String}} analysis - 题目解析
 * @property {{text: String, image: String, answer: Boolean}[]} options - 题目选项
 * @property {Boolean} horizontal - 是否横向展示
 * @property {Boolean} loading - 选项图片加载中
 */

export default {
  components: {
    FollowToast,
  },
  props: {
    // 是否竖屏
    portrait: {
      type: Boolean,
      default: true,
    },
    // 题目列表
    questions: {
      type: Array,
      required: true,
    },
    // 题目是否随机
    questionRandom: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["complete", "abort"],
  setup(props, context) {
    const data = reactive({
      /** @type {questionsAdapter[]} */
      questionsAdapter: [], // 当前问题数据适配
      analysisHeight: 0, // 当前解析DOM的高度
      selectedAnswer: null, // 当前问题选择的答案
      questionIndex: 0, // 当前访问的问题下标
      mainView: true, // 主要用来刷新DOM
      isAudioEnd: {
        // 题干音频是否播放完成
        stemAudio: false,
        analysisAudio: true,
      },
      touches: {
        lastX: 0,
        lastY: 0,
        moveing: false,
      },
      // 先统计着
      wrongCount: 0, // 错题统计
      rightCount: 0, // 对题统计
      toast: ''
    });

    /** @type {{ value: HTMLDivElement }} */
    const analysisRef = ref(null);
    /** @type {{ value: HTMLAudioElement }} */
    const audioRef = ref(null);
    /** @type {{ value: HTMLAudioElement }} */
    const analysisAudioRef = ref(null);
    /** @type {{ value: HTMLAudioElement }} */
    const stemAudioRef = ref(null);

    const questionCurrent = computed(() => {
      const index = data.questionIndex;
      if (index < 0 || index >= props.questions.length) {
        console.error("下发题目数据为空或下标越界");
        return null;
      }
      return data.questionsAdapter[index];
    });
    // 当前题目题干
    const questionsStem = computed(() => {
      const current = questionCurrent.value;
      return current ? current.stem : {};
    });
    // 当前题目选项
    const questionOptions = computed(() => {
      const current = questionCurrent.value;
      return current ? current.options : [];
    });
    // 当前题目解析
    const questionAnalysis = computed(() => {
      const current = questionCurrent.value;
      return current ? current.analysis : {};
    });

    function selectAnswer(item) {
      if (data.selectedAnswer !== null) return;
      data.selectedAnswer = item;
      if (!item.answer) {
        const analysis = analysisRef.value;
        data.analysisHeight = analysis.clientHeight;
      }
    }
    function nextQuestion() {
      if (!data.selectedAnswer) {
        data.toast = '请先选择当前答案';
        return;
      }
      // 统计对错
      data.selectedAnswer.answer ? data.rightCount++ : data.wrongCount++;
      if (data.questionIndex < data.questionsAdapter.length - 1) {
        data.questionIndex++;
      } else {
        context.emit("complete", data.rightCount, data.wrongCount);
      }
      data.analysisHeight = 0;
      data.selectedAnswer = null;
      data.isAudioEnd.stemAudio = false;
      data.isAudioEnd.analysisAudio = true;

      // 回弹动画看起来不协调 所以通过v-if去掉动画
      data.mainView = false;
      nextTick(() => {
        data.mainView = true;
      });
    }
    function closeView() {
      context.emit("abort");
    }
    function loadedmetadata(audio) {
      if (audio) {
        audio.play();
      }
    }
    function playended(name) {
      data.isAudioEnd[name] = true;
    }
    function playerror(name) {
      data.isAudioEnd[name] = true;
      console.log("音频加载失败");
    }
    // 重新播放 重置所有音频 且播放选中的那个
    function replayAudio(name, audio) {
      if (questionAnalysis.value.audio) {
        const analysisAudio = analysisAudioRef.value;
        analysisAudio.pause();
        analysisAudio.currentTime = 0;
        data.isAudioEnd.analysisAudio = true;
      }
      if (questionsStem.value.audio) {
        const stemAudio = stemAudioRef.value;
        stemAudio.pause();
        stemAudio.currentTime = 0;
        data.isAudioEnd.stemAudio = true;
      }
      data.isAudioEnd[name] = false;
      audio.play();
    }

    /** @param {TouchEvent} event */
    function startMoveAnalysis(event) {
      const touches = event.touches[0];
      data.touches.lastX = touches.clientX;
      data.touches.lastY = touches.clientY;
      data.touches.moveing = true;
    }
    /** @param {TouchEvent} event */
    function moveAnalysis(event) {
      // 错误答案才能来回移动
      if (!data.selectedAnswer || data.selectedAnswer.answer) return;
      const touches = event.touches[0];
      const offsetX = data.touches.lastX - touches.clientX;
      const offsetY = data.touches.lastY - touches.clientY;
      const transformX = data.portrait ? offsetY : -offsetX;
      const transformY = data.portrait ? -offsetX : offsetY;
      // 限制滚动位置
      const minAnalysisHeight = 0;
      const maxAnalysisHeight = analysisRef.value.clientHeight;
      // 模拟滚动
      let analysisHeight = Math.min(
        data.analysisHeight + transformY,
        maxAnalysisHeight
      );
      data.analysisHeight = Math.max(analysisHeight, minAnalysisHeight);

      data.touches.lastX = touches.clientX;
      data.touches.lastY = touches.clientY;
    }
    /** @param {TouchEvent} event */
    function endMoveAnalysis(event) {
      data.touches.moveing = false;
    }


    // created
    const questions = props.questionRandom
      ? [...props.questions].sort(() => 0.5 - Math.random())
      : props.questions;

    /** @type {questionsAdapter[]} */
    const questionsAdapter = questions.map((question) => {
      const stem = { text: "", image: "", audio: "" };
      const analysis = { text: "", image: "", audio: "" };
      // 题干部分
      question.question_stem.forEach((item) => {
        if (item.stem_type === 1) {
          stem.text = item.stem_content;
        } else if (item.stem_type === 2) {
          stem.image = item.stem_content;
        } else if (item.stem_type === 3) {
          stem.audio = item.stem_content;
        }
      });
      // 解析部分
      question.question_analysis.forEach((item) => {
        if (item.analysis_type === 1) {
          analysis.text = item.analysis_content;
        } else if (item.analysis_type === 2) {
          analysis.image = item.analysis_content;
        } else if (item.analysis_type === 3) {
          analysis.audio = item.analysis_content;
        }
      });

      /**
       * 选项部分
       * @type {{text: String, image: String, answer: Boolean}[]}
       */
      const options = question.question_option.slice(0, 2).map((item) => {
        return {
          answer: item.is_answer,
          image: item.option_img || "",
          text: item.option_text,
        };
      });
      if (question.options_order === 0) {
        options.sort(() => 0.5 - Math.random());
      }

      return {
        stem: stem,
        analysis: analysis,
        options: options,
        horizontal: true,
        loading: true,
      };
    });

    const createQuestionsAdapter = reactive(questionsAdapter);
    const verticalRatio = 3.5; // 横排排版要求的图片宽高比
    // 载入图片 计算如何显示
    createQuestionsAdapter.forEach((row, index) => {
      const loadAll = [];
      row.options.forEach((item) => {
        if (!item.image) return;
        loadAll.push(
          new Promise((resolve, reject) => {
            // 为了尽量减少占用带宽的影响
            // 每题相应进行短暂时间的延迟加载
            setTimeout(() => {
              let img = new Image();
              img.src = item.image;
              img.onload = () => resolve(img);
              img.onerror = () => reject();
            }, index * 500);
          })
        );
      });

      console.log('loadAll', loadAll);
      Promise.all(loadAll)
        .then((res) => {
          if (
            res.length === 2 &&
            res.every((img) => img.width / img.height >= verticalRatio)
          ) {
            row.horizontal = false;
          }
        })
        .finally(() => {
          row.loading = false;
        });
    });

    data.questionsAdapter = createQuestionsAdapter;

    return {
      ...toRefs(data),
      analysisRef,
      audioRef,
      analysisAudioRef,
      stemAudioRef,

      questionCurrent,
      questionsStem,
      questionOptions,
      questionAnalysis,

      selectAnswer,
      nextQuestion,
      closeView,
      loadedmetadata,
      playended,
      playerror,
      replayAudio,

      startMoveAnalysis,
      moveAnalysis,
      endMoveAnalysis,
    };
  }
};
</script>

<style lang="scss" scoped>

.background-fill {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
}
@mixin background-image($image) {
  background-image: url("../../../assets/images/classPackage/interaction/#{$image}");
}
@mixin background-setting($image, $width, $height) {
  width: $width;
  height: $height;
  @extend .background-fill;
  @include background-image($image);
}
@mixin position-absolute($top: 0, $left: 0, $right: 0, $bottom: 0) {
  position: absolute;
  top: $top;
  left: $left;
  right: $right;
  bottom: $bottom;
}

.interaction {
  width: 100%;
  height: 100%;
  color: #ffffff;
  background-color: #342b88;
  background-image: url("../../../assets/images/classPackage/interaction/background.jpg");
  background-size: cover;
}

.interaction-header {
  position: absolute;
  left: 0;
  right: 0;
  height: 0.853333em;
  // line-height: 0.853333em;
  text-align: center;
  z-index: 5;
  .title {
    display: flex;
    align-content: center;
    align-items: center;
    max-width: 80%;
    height: 100%;
    margin: 0 auto;
    .align-text {
      flex: 1;
      font-size: 0.266667em;
    }
  }
  .button-close {
    position: absolute;
    top: 50%;
    left: 0.28em;
    margin-top: -0.1em;
    @include background-setting("icon_close.png", 0.2em, 0.2em);
  }
}

.interaction-view {
  $radius: 0.066667em;
  $baseline: 0.2em;
  $basewidth: 5.64em;
  $baseheight: 4.28em;

  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  // bottom: 0.426667em;
  box-sizing: border-box;
  width: $basewidth;
  height: $baseheight;
  margin-top: -$baseheight / 2;
  margin-left: -$basewidth / 2;
  // 因为滚动区域的原因 需要这样限制
  padding: 0 $baseline;
  border-top: $baseline solid #463894;
  border-bottom: $baseline solid #463894;

  border-radius: 0.093333em;
  background-color: #463894;
  .fill-image {
    display: block;
    width: 100%;
    height: 100%;
    // object-fit: fill;
    object-fit: contain;
  }
  .normal-text {
    color: #4a4a4a;
    font-size: 0.2em;
    word-break: break-all;
  }

  .loading-icon {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
  }

  .transition-hotfix {
    padding-bottom: $baseline;
  }
  .upward-transition {
    touch-action: none;
    transition: transform 0.4s ease-in-out;
  }
  .question {
    overflow: hidden;
    box-sizing: border-box;
    height: 1.86em;
    border-radius: 0.08em;
    margin-bottom: 0.16em;
    background-color: #ffffff;
    .question-text {
      padding: 0.24em;
    }
  }
  .options-group {
    margin-bottom: 0.16em;
    .option {
      position: relative;
      padding-bottom: 0.066667em;
      border-radius: $radius;
      background-color: #8271d4;
      .option-view {
        border-radius: $radius;
        background-color: #ffffff;
        .option-text {
          overflow: hidden;
          padding: 0.226667em;
          max-height: 1.4em;
        }
        .option-clamp {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
        }
      }
      .option-border {
        @include position-absolute(0, 0, 0, 0.066667em);
        border-style: solid;
        border-width: 0.173333em;
        border-radius: $radius;
        &::after {
          content: "";
          position: absolute;
          top: -0.28em;
          right: -0.28em;
        }
        &.is-right {
          border-color: #2abc6f;
          &::after {
            @include background-setting("icon_right.png", 0.6em, 0.64em);
          }
        }
        &.is-wrong {
          border-color: #fd5e02;
          &::after {
            @include background-setting("icon_wrong.png", 0.6em, 0.64em);
          }
        }
      }
    }
  }
  .is-vertical {
    .option {
      width: 100%;
      & + .option {
        margin-top: 0.08em;
      }
      .option-view {
        height: 0.826667em;
      }
    }
  }
  .is-horizontal {
    display: flex;
    .option {
      flex: 1;
      & + .option {
        margin-left: 0.16em;
      }
      .option-view {
        height: 1.653333em;
      }
    }
  }

  .analysis {
    position: relative;
    box-sizing: border-box;
    padding: 0.24em;
    border-radius: $radius;
    background-color: #ffffff;
    color: #4a4a4a;
    .analysis-title {
      font-size: 0.213333em;
      font-weight: 600;
    }
    .analysis-image {
      @extend .fill-image;
    }
    .analysis-main {
      margin-top: 0.16em;
    }
    .analysis-audio {
      position: absolute;
      left: 1.16em;
      top: 0.24em;
      width: 0.36em;
      height: 0.24em;
      border-radius: 0.053333em;
      background: #52ca7c
        url("../../../assets/images/classPackage/interaction/icon_play.png")
        center center no-repeat;
      background-size: 0.36em;
      &.is-play {
        @include background-image("icon_playing.gif");
        background-size: 0.2em;
      }
    }
  }
}

.interaction-group {
  position: absolute;
  right: 0.4em;
  bottom: 0.426667em;
}

.audio-instance {
  overflow: hidden;
  width: 1px;
  height: 1px;
  visibility: hidden;
}

.in-button {
  display: block;
  width: 1.52em;
  height: 0.72em;
  margin-top: 0.16em;
  @extend .background-fill;
}
@mixin button-image($image) {
  @include background-image($image);
  &:active {
    opacity: 0.8;
  }
}
.button-next-disabled {
  @extend .in-button;
  @include button-image("button_next_disabled.png");
}
.button-replay-disabled {
  @extend .in-button;
  @include button-image("button_replay_disabled.png");
}
.button-next {
  @extend .in-button;
  @include button-image("button_next.png");
}
.button-replay {
  @extend .in-button;
  @include button-image("button_replay.png");
}
.button-continue {
  @extend .in-button;
  @include button-image("button_continue.png");
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>