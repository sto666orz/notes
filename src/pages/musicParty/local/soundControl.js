import {
  preloadRes,
  SoundsRes
} from './preloadRes'

let SoundsCache = {}; // 音频缓存
let boysCache = []; // 参与者缓存

export default {
  // 刷新缓存
  refresh(theme) {
    SoundsRes[theme].forEach(item => {
      SoundsCache[item.alias] = preloadRes.get(item.id);
    });
  },
  /**
   * 缓存参与人
   * @param {*} players 
   */
  cache(players) {
    boysCache = players;
  },
  /**
   * 清理缓存
   */
  clear() {
    boysCache = [];
    SoundsCache = {};
  },
  // 暂停播放
  stop(skin = null) {
    if (!skin) {
      Object.keys(SoundsCache).forEach(key => {
        const item = SoundsCache[key];
        if (item.playing()) {
          item.stop();
        }
      });
    } else {
      SoundsCache[skin].stop();
    }
  },
  /**
   * 重新播放
   * @param {Boolean} vocal 主唱音乐
   */
  replay(vocal = false) {
    // 先全部停止
    this.stop();

    requestAnimationFrame(() => {
      boysCache.forEach(item => {
        if (item.skin) {
          SoundsCache[item.skin].play();
        }
      });
      if (vocal) {
        SoundsCache['vocal'].play();
      }
    });
  }
}
