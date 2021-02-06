<template>
  <layout-party :class="[loading ? 'page-load' : 'page-wrap', theme]">
    <template #stage>
      <div class="party-stage" :class="{ 'animation-stop': !startPlay }">
        <party-boy
          v-for="item in boysList"
          :visible="item.visible"
          :index="item.index"
          :hit="item.isHit"
          :skin="item.skin"
          :key="item.index"
        >
        </party-boy>
        <party-boy
          :index="0"
          :skin="leadSinger ? `run_${theme}` : `aha_${theme}`"
        >
        </party-boy>
        <div class="photo-main">
          <div class="photo-frames" :class="{ 'photo-mask': !startPlay }">
            <button
              v-if="!startPlay"
              class="button-play"
              @click="playMusic()"
            ></button>
            <div class="photo-info">
              <p class="friend">
                <img class="user-avatar" :src="shareAvatar" alt="" />
                <span class="user-name">{{ shareName }}</span>
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
          <button
            class="button"
            :class="[isAssisted ? 'assisted' : 'assist']"
            @click="assistTo()"
          ></button>
          <button class="button start" @click="linkToHome()"></button>
        </div>
      </div>
    </template>

    <popup-assist v-model:visible="assistVisible"></popup-assist>

    <stage-loading
      :theme="theme"
      v-model:visible="loadVisible"
      @completed="changeThemeEnd"
    >
    </stage-loading>
  </layout-party>
</template>

<script>
import { reactive, toRefs } from 'vue';
import LayoutParty from "./components/layout/Party.vue";
import PartyBoy from "./components/PartyBoy.vue";
import PopupAssist from "./components/PopupAssist.vue";
import StageLoading from "./components/StageLoading.vue";
import SoundControl from "./local/soundControl";

export default {
  components: {
    LayoutParty,
    PartyBoy,
    PopupAssist,
    StageLoading,
  },
  setup() {
    const boys = [1, 2, 3, 4, 5].map(index => {
      return {
        index: index,
        isHit: false,
        skin: "",
        visible: true
      }
    });

    const data = reactive({
      loading: false,
      /** @type {'christmas' | 'newyear'} */
      theme: "christmas",
      boysList: boys,
      leadSinger: false, // aha是否再唱歌
      startPlay: false, // 是否开始播放
      loadVisible: false, // 载入窗口
      assistVisible: false, // 助力成功窗口
      // loginVisible: false,
      isAssisted: false, // 是否已助力
      shareAvatar: null,
      shareName: null,
      // shareUser: null,
    });

    SoundControl.cache(data.boysList);


    const playMusic = () => {
      data.startPlay = true;
      SoundControl.replay(data.leadSinger);
    }

    const changeThemeEnd = (theme) => {
      data.theme = theme;
      // 刷新声音缓存
      SoundControl.refresh(theme);
    }

    return {
      ...toRefs(data),
      playMusic,
      changeThemeEnd,
    }
  },
  methods: {
    linkToHome(path) {
      this.$router.push({
        path: "/musicParty/home",
        query: { ...this.$route.query, share_key: undefined },
      });
    },
    assistTo() {
      if (!this.checkWxAuth()) return;
      if (!this.checkLogin()) return;

      if (this.isAssisted) return;

      this.$loading.open({ message: "正在助力", magIcon: "" });

      getUserInfo()
        .then(({ nickname, avatar }) => {
          const params = {
            nickname: nickname,
            portrait: avatar,
          };
          return httpRequest.assistTo(this.shareUser, params).then((res) => {
            const { code, data, msg } = res;
            if (code == 200) {
              this.assistVisible = true;
              this.isAssisted = true;
            } else if (code == 100112) {
              this.showToast("不能给自己助力哦~");
            } else if (code == 170003) {
              this.showToast("活动已经结束");
            } else if (code == 100108) {
              this.showToast("助力机会已经用完");
            } else {
              this.showToast(msg);
            }
            this.$loading.close();
          });
        })
        .catch(() => {
          this.showToast("网络异常，请重新尝试");
          this.$loading.close();
        });
    },
    /* playMusic() {
      this.startPlay = true;
      SoundControl.replay(this.leadSinger);
    }, */
    /* changeThemeEnd(theme) {
      this.theme = theme;
      // 刷新声音缓存
      SoundControl.refresh(theme);
    }, */
    /* regSuccess() {
      this.loginVisible = false;
    }, */
    /**
     * 检查微信授权信息
     */
    /* checkWxAuth() {
      if (isWeiXin() && !getCookie("wxInfo")) {
        // 调用微信非静默授权,获取头像
        initWxInfoAuth(() => {});
        return false;
      }
      return true;
    }, */
    /**
     * 检查登录情况
     */
    /* checkLogin() {
      if (!getUserToken()) {
        this.loginVisible = true;
        return false;
      }
      return true;
    }, */
    /* showToast(msg, duration = 2000) {
      this.$toast({
        message: msg,
        align: "center",
        duration: duration, //消失时间
      });
    }, */
  },
  created() {
    // hideWxShare();
    // this.checkWxAuth();
    // 初始化
    /* this.boysList = [
      { index: 1, isHit: false, skin: "", visible: true },
      { index: 2, isHit: false, skin: "", visible: true },
      { index: 3, isHit: false, skin: "", visible: true },
      { index: 4, isHit: false, skin: "", visible: true },
      { index: 5, isHit: false, skin: "", visible: true },
    ];
    SoundControl.cache(this.boysList); */

    /* const { share_key } = this.$route.query;
    if (!share_key) {
      this.showToast("分享参数错误", 5000);
      return;
    } */

    this.loading = true;
    httpRequest.getMusicInfo(share_key).then((res) => {
      const { code, data, msg } = res;
      if (code == 200) {
        const format = JSON.parse(data);
        format.boys.forEach((item, index) => {
          const boy = this.boysList[index];
          boy.index = item.index;
          boy.skin = item.skin;
        });
        this.theme = format.theme === "newyear" ? "christmas" : "newyear";
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
  },
  beforeDestroy() {
    SoundControl.stop();
    SoundControl.clear();
  },
};
</script>

<style lang="scss" scoped>
$stageUrl: "../../assets/images/musicParty2020/stage";
$assistUrl: "../../assets/images/musicParty2020/assist";

@mixin image-button($image, $width, $height) {
  width: $width;
  height: $height;
  background: "url(../../assets/images/musicParty2020/assist/#{$image})" 0 0 no-repeat;
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
  background-color: #ffffff;
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
    width: 640px;
    height: 102px;
    border-radius: 54px;
    border: 5px solid #7f283a;
    background-repeat: no-repeat;
    background-position: center center;
    &.assist {
      background-color: #fe5535;
      
      background-image: url("#{$assistUrl}/type_zhuli@2x.png");
      background-size: 282px;
    }
    &.start {
      background-color: #ffdc01;
      background-image: url("#{$assistUrl}/type_chuangzuo@2x.png");
      background-size: 354px;
    }
    &.assisted {
      border-color: #909090;
      background-color: #b8b8b8;
      background-image: url("#{$assistUrl}/type_yizhuli@2x.png");
      background-size: 114px;
    }
    & + .button {
      margin-top: 26px;
    }
  }
}
.photo-main {
  @extend .absolute-fit;
  bottom: -11px;
  z-index: 2;
  .music-name {
    position: absolute;
    top: -55px;
    right: 0;
    height: 83px;
    background-repeat: no-repeat;
    background-size: 100%;
  }
}
.photo-frames {
  position: relative;
  width: 655px;
  height: 806px;
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
    background: url("#{$assistUrl}/pic_photo@2x.png") 0 0 no-repeat;
    background-size: 100%;
  }

  .button-play {
    @extend .absolute-fit;
    top: 241px;
    margin: 0 auto;
    @include image-button('ico_btn@2x.png', 174px, 174px);
    animation: breath 0.58s ease-in-out infinite alternate;
  }
  .photo-info {
    @extend .absolute-fit;
    bottom: 0;
    height: 184px;
    .friend {
      text-align: center;
      padding-top: 26px;
      padding-bottom: 18px;
    }
    .user-avatar {
      width: 64px;
      height: 64px;
      margin-right: 20px;
      border-radius: 100%;
      border: #7f283a solid 4px;
      vertical-align: middle;
    }
    .user-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      display: inline-block;
      vertical-align: middle;
      max-width: 250px;
      height: 45px;
      line-height: 45px;
      font-size: 32px;
      font-weight: 600;
      color: #7f283a;
    }
    .song-name {
      height: 46px;
      background-position: center 0;
      background-repeat: no-repeat;
      background-size: 428px;
    }
  }
}

// 配置主题
.christmas {
  background-color: #eaad72;
  .party-stage {
    background-image: url("#{$stageUrl}/bg_christmas@2x.png");
  }
  .party-bottom {
    background-color: #b5681e;
  }
  .photo-main {
    .song-name {
      background-image: url("#{$assistUrl}/type@2x.png");
    }
    .music-name {
      width: 379px;
      background-image: url("#{$assistUrl}/pic_shengdan@2x.png");
    }
  }
}
.newyear {
  background-color: #b1e2ee;
  .party-stage {
    background-image: url("#{$stageUrl}/bg_newyear@2x.png");
  }
  .party-bottom {
    background-color: #ffceb4;
  }
  .photo-main {
    .song-name {
      background-image: url("#{$assistUrl}/type2@2x.png");
    }
    .music-name {
      width: 462px;
      background-image: url("#{$assistUrl}/pic_xinnian@2x.png");
    }
  }
}
</style>