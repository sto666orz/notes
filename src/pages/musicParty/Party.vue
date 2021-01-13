<template>
  <layout-party :class="[loading ? 'page-load' : 'page-wrap', theme]">
    <template #stage>
      <div class="party-stage">
        <party-boy
          v-for="(item, index) in boysList"
          @slideDown="removeSkin(index)"
          :visible="item.visible"
          :index="item.index"
          :hit="item.isHit"
          :skin="item.skin"
          :key="item.index"
        >
          <div ref="hits" @click="removeSkin(index)" class="hit-box"></div>
        </party-boy>
        <party-boy
          :index="0"
          :skin="leadSinger ? `run_${theme}` : `aha_${theme}`"
        >
          <div class="hit-box" @click="changeSong()"></div>
        </party-boy>
      </div>
    </template>

    <template #bottom>
      <div class="party-bottom">
        <div class="compose">
          <div
            vvvvv-if="userRecord"
            class="button-lottery"
            @click="linkToLottery()"
          ></div>
          <div v-if="composeStatus === 1" class="button-music disbled"></div>
          <div v-else-if="composeStatus === 2" class="button-music music">
            <i class="button-reset" @click="restartGame()"></i>
          </div>
          <div v-else class="button-music" @click="composeMusic(false)"></div>

          <div
            v-if="composeStatus === 0"
            class="button-tostage"
            @click="changeTheme()"
          ></div>
        </div>

        <party-ins
          class="ins-first"
          label="first"
          :exclude="boysSkin"
          @moveing="itemMoving"
          @moveEnd="itemMoveEnd"
        >
        </party-ins>
        <party-ins
          class="ins-second"
          label="second"
          :exclude="boysSkin"
          @moveing="itemMoving"
          @moveEnd="itemMoveEnd"
        >
        </party-ins>
      </div>

      <action-great
        v-model:visible="visibles.great"
        :theme="theme"
        @share="shareView()"
      ></action-great>
    </template>
    <button
      v-if="composeStatus === 0"
      class="button-help"
      @click="learnVisible = true"
    ></button>

    <popup-ask
      v-model:visible="visibles.ask"
      @apply="composeMusic(true)"
    ></popup-ask>

    <learn-game 
      v-model:visible="visibles.learn"
      :theme="theme"
      @step="nextLearn"
    ></learn-game>

    <!-- <fast-share
      v-model:visible="visibles.share"
      :shareKey="userShareKey"
    ></fast-share> -->

    <stage-loading
      :theme="theme"
      v-model:visible="visibles.load"
      @completed="changeThemeEnd"
    ></stage-loading>

  </layout-party>
</template>

<script>

import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'

// import FastShare from "./components/public/fastShare.vue";
import LayoutParty from "./components/layout/Party.vue";
import ActionGreat from "./components/ActionGreat.vue";

import PopupAsk from "./components/PopupAsk.vue";
import PartyIns from "./components/PartyIns.vue";
import PartyBoy from "./components/PartyBoy.vue";
import LearnGame from "./components/LearnGame.vue";
import StageLoading from "./components/StageLoading.vue";
import SoundControl from "./local/soundControl";
import { hitTestBox } from "@utils/util";

/**
 * @typedef {Object} Boy
 * @property {Number} index  编号
 * @property {Boolean} isHit 是否碰撞
 * @property {String} skin 皮肤名称
 * @property {Boolean} visible 是否显示
 */

export default {
  components: {
    // FastShare,
    LayoutParty,
    ActionGreat,
    PopupAsk,
    PartyIns,
    PartyBoy,
    LearnGame,
    StageLoading,
  },
  setup() {
    const route = useRoute();

    const loading = ref(false);
    const theme = ref(route.query.theme === "newyear" ? "christmas" : "newyear");
    const boysList = reactive( [1, 2, 3, 4, 5].map(index => {
      return {
        index: index,
        isHit: false,
        skin: "",
        visible: true
      }
    }) );
    const boysSkin = computed(() => {
      return boysList.filter((item) => item.skin).map((item) => item.skin);
    });
    // aha是否再唱歌
    const leadSinger = ref(false);
    // 按钮合成状态  0未合成  1合成中  2已合成
    const composeStatus = ref(0);
    // 弹窗合集
    const visibles = reactive({
      ask: false,   // 询问弹窗
      rule: false,  // 活动规则弹窗
      load: false,  // 载入弹窗
      learn: false, // 新手引导
      great: false, // 合成音乐弹窗
      share: false, // 分享弹窗
    });

    // 重新制作
    const restartGame = () => {
      leadSinger.value = true;
      boysList.forEach((item) => {
        item.skin = "";
      });
      SoundControl.replay(leadSinger.value);
      composeStatus.value = 0;
      visible.great = false;
    }

    const hits = ref(null);
    // 物品移动事件
    const itemMoving = (name, clientX, clientY) => {
      console.log('itemMoving', name, clientX, clientY, hits);
      /* if (this.composeStatus !== 0) return;
      const hits = this.$refs["hits"];
      const list = this.boysList;
      hits.forEach((item, index) => {
        list[index].isHit = hitTestBox(item, clientX, clientY);
      }); */
    }
    // 物品移动结束事件
    const itemMoveEnd = (name) => {
      if (composeStatus.value !== 0) return;
      boysList.forEach((item, index) => {
        if (item.isHit) {
          item.skin = name;
        }
        item.isHit = false;
      });
      SoundControl.replay(leadSinger.value);
    }
    // 切换主唱
    const changeSong = () => {
      if (composeStatus.value !== 0) return;

      leadSinger.value = !leadSinger.value;
      if (leadSinger.value) {
        SoundControl.replay(true);
      } else {
        SoundControl.stop("vocal");
      }
    }
    // 移除皮肤
    const removeSkin = (index) => {
      if (composeStatus.value !== 0) return;

      const boy = boysList[index];
      SoundControl.stop(boy.skin);
      boy.skin = "";
    }

    // 开始切换主题
    const changeTheme = () => {
      visibles.load = true;
      SoundControl.stop();
    }
    // 主题加载完毕
    const changeThemeEnd = (themeName) => {
      theme.value = themeName;
      // 刷新声音缓存
      SoundControl.refresh(themeName);
      SoundControl.cache(boysList);
      SoundControl.replay(leadSinger.value);
      // 页面标题
      document.title = themeName === "christmas" ? "圣诞老人的小屋" : "新年的欢乐广场";
    }

    /**
     * 新手引导 - 下一步
     * @param {Number} index
     * @param {Boy} boy
     * @param {{ isSong: Boolean }} aha
     */
    const nextLearn = (index, boy, aha) => {
      const find = boysList.find(item => item.index === boy.index);
      if (!find) return;

      if (index === 0) {
        if (find.skin) {
          SoundControl.stop(find.skin);
        }
        find.visible = false;
      } else if (index === 1) {
        find.skin = boy.skin;
        SoundControl.replay(leadSinger.value);
      } else if (index === 2) {
        find.skin = boy.skin;
        SoundControl.stop(boy.skin);
        find.visible = true;
      } else if (index >= 3) {
        visibles.learn = false;
        find.visible = true;
        leadSinger.value = aha.isSong;
        SoundControl.replay(aha.isSong);
      }
    }

    const composeMusic = (force = false) => {
      if (force) {
        SoundControl.stop();
        composeStatus.value = 1;
        // 模拟请求
        setTimeout(() => {
          composeStatus.value = 2;
          visibles.great = true;
          //SoundControl.replay(leadSinger.value);
        }, 2000);
      }else if (this.boysSkin.length === 0) {
        visibles.ask = true;
      } else {
        composeMusic(true); // 直接发布
      }
    }

    const linkToLottery = () => {
      console.log('linkToLottery');
    }

    const shareView = () => {
      visibles.share = true;
    }

    onUnmounted(() => {
      SoundControl.stop();
      SoundControl.clear();
    });

    /* onBeforeRouteLeave((to, from, next) => {
      // 因为音乐无法直接播放会导致bug 所以此页面不给直接访问 需要通过其它页面点击跳转过来
      if (from.name === null) {
        next({
          path: "/musicParty/home",
          query: to.query
        });
      } else {
        next();
      }
    }); */

    return {
      loading,
      theme,
      boysList,
      boysSkin,
      leadSinger,
      composeStatus,
      visibles,
      restartGame,

      hits, // ref?
      itemMoving,
      itemMoveEnd,
      changeSong,
      removeSkin,
      changeTheme,
      changeThemeEnd,
      nextLearn,
      composeMusic,
      linkToLottery,
      shareView,
    }
  }
}
</script>


<style lang="scss" scoped>
@mixin bg-image($image) {
  background-image: url("../../assets/images/musicParty2020/stage/#{$image}");
}
@mixin create-button($image, $width, $height) {
  position: absolute;
  width: $width;
  height: $height;
  // background: "url(../../assets/images/musicParty2020/stage/#{$image})" 0 0 no-repeat;
  @include bg-image($image);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100%;
}

.page-load {
  visibility: hidden;
}
.page-wrap {
  .button-help {
    @include create-button('ico_help@2x.png', 65px, 65px);
    top: 24px;
    left: 24px;
  }
}
.party-stage {
  height: 100%;
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: 100% auto;
  .hit-box {
    position: absolute;
    top: 30px;
    left: 30px;
    right: 30px;
    bottom: 30px;
  }
}
.party-bottom {
  padding-top: 39px;
  height: 100%;
  @include bg-image("rope@2x.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  .ins-first {
    margin: 0 auto 0.773333rem /* 58/75 */;
  }
  .ins-second {
    margin: 0 auto;
  }
}
.compose {
  position: absolute;
  top: -27px;
  left: 0;
  right: 0;
  .button-lottery {
    @include create-button('ico_choujiang@2x.png', 148px, 114px);
    left: 12px;
    bottom: 0;
  }
  .button-tostage {
    right: 12px;
    bottom: 0;
  }
  .button-music {
    @include create-button('ico_hecheng@2x.png', 418px, 104px);
    left: 166px;
    bottom: 0;
    &.disbled {
      @include bg-image("ico_hecheng_ing@2x.png");
    }
    .button-reset {
      @include create-button("ico_restart@2x.png", 155px, 82px);
      top: 11px;
      right: 11px;
    }
  }
}

// 配置主题
.page-wrap.christmas {
  background-color: #eaad72;
  .party-stage {
    @include bg-image("bg_christmas@2x.png");
    // background-image: url("~@/assets/images/musicParty2020/stage/bg_christmas@2x.png");
  }
  .party-bottom {
    background-color: #b5681e;
  }
  .button-tostage {
    @include create-button("ico_yuandan@2x.png", 148px, 114px);
  }
  .button-music.music {
    @include bg-image("music_christmas@2x.png");
  }
}
.page-wrap.newyear {
  background-color: #b1e2ee;
  .party-stage {
    @include bg-image("bg_newyear@2x.png");
    // background-image: url("~@/assets/images/musicParty2020/stage/bg_newyear@2x.png");
  }
  .party-bottom {
    background-color: #ffceb4;
  }
  .button-tostage {
    @include create-button('ico_shengdan@2x.png', 148px, 114px);
  }
  .button-music.music {
    @include bg-image("music_newyear@2x.png");
  }
}
</style>
