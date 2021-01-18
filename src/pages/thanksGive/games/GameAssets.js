import {
  LoadQueue
} from 'hilojs'
import {
  Resources,
  ResourcesFrames
} from './GameConfig'

const STATE_NOT = 0;
const STATE_LOADING = 1;
const STATE_REDAY = 2;

const queue = new LoadQueue();
let assets = {};
let isLoaded = STATE_NOT;

export default {
  // 载入资源
  load() {
    return new Promise(resolve => {
      function onComplete() {
        Resources.forEach(item => {
          assets[item.id] = queue.get(item.id).content;
        });
        isLoaded = STATE_REDAY;
        resolve();
      }
      queue.add(Resources);
      queue.on('complete', onComplete);
      queue.start();
      isLoaded = STATE_LOADING;
    });
  },
  // 获取下载进度
  getProgress() {
    return queue.getLoaded() / queue.getTotal();
  },
  // 资源是否已载入
  isLoaded() {
    return isLoaded === STATE_REDAY;
  },
  /**
   * 根据id获取资源
   * @param {String} id 
   * @returns {HTMLImageElement | null}
   */
  query(id) {
    return assets[id] || null;
  },
  /**
   * 根据id获取动画帧配置
   * @param {String} id 
   */
  queryFrames(id) {
    return !ResourcesFrames[id] ?
      {} :
      {
        image: this.query(id),
        frames: ResourcesFrames[id].frames,
        sprites: ResourcesFrames[id].sprites
      }
  }

}