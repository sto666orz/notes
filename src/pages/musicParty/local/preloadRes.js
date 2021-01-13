import { Howl } from 'howler'

// const abc = (import('../../../assets/images/musicParty2020/stage/ins_diangangqin@2x.png'))
import diangangqin from '../../../assets/images/musicParty2020/stage/ins_diangangqin@2x.png'
import jita from '../../../assets/images/musicParty2020/stage/ins_jita@2x.png'
import dianjita from '../../../assets/images/musicParty2020/stage/ins_dianjita@2x.png'
import beisi from '../../../assets/images/musicParty2020/stage/ins_beisi@2x.png'
import jueshigu from '../../../assets/images/musicParty2020/stage/ins_jueshigu@2x.png'
import hechengqi from '../../../assets/images/musicParty2020/stage/ins_hechengqi@2x.png'
import xueqiaoling from '../../../assets/images/musicParty2020/stage/ins_xueqiaoling@2x.png'
import dianzigu from '../../../assets/images/musicParty2020/stage/ins_dianzigu@2x.png'
import xiaohao from '../../../assets/images/musicParty2020/stage/ins_xiaohao@2x.png'
import sprites_xiaohao from '../../../assets/images/musicParty2020/sprites/xiaohao.png'
import sprites_beisi from '../../../assets/images/musicParty2020/sprites/beisi.png'
import sprites_xiaotiqin from '../../../assets/images/musicParty2020/sprites/xiaotiqin.png'
import sprites_xueqiaoling from '../../../assets/images/musicParty2020/sprites/xueqiaoling.png'
import sprites_diangangqin from '../../../assets/images/musicParty2020/sprites/diangangqin.png'
import sprites_dianzigu from '../../../assets/images/musicParty2020/sprites/dianzigu.png'
import sprites_dianjita from '../../../assets/images/musicParty2020/sprites/dianjita.png'
import sprites_jita from '../../../assets/images/musicParty2020/sprites/jita.png'
import sprites_jueshigu from '../../../assets/images/musicParty2020/sprites/jueshigu.png'
import sprites_hechengqi from '../../../assets/images/musicParty2020/sprites/hechengqi.png'
import boy_christmas from '../../../assets/images/musicParty2020/sprites/boy_christmas.png'
import boy_newyear from '../../../assets/images/musicParty2020/sprites/boy_newyear.png'
import aha_christmas from '../../../assets/images/musicParty2020/sprites/aha_christmas.png'
import aha_newyear from '../../../assets/images/musicParty2020/sprites/aha_newyear.png'
import run_christmas from '../../../assets/images/musicParty2020/sprites/run_christmas.png'
import run_newyear from '../../../assets/images/musicParty2020/sprites/run_newyear.png'
import bg_newyear from '../../../assets/images/musicParty2020/stage/bg_newyear@2x.png'
import bg_christmas from '../../../assets/images/musicParty2020/stage/bg_christmas@2x.png'

console.log(diangangqin);

export const ImagesRes = [
  // 乐器按钮
  {
    id: 'diangangqin',
    src: diangangqin
  },
  {
    id: 'jita',
    src: jita
  },
  {
    id: 'dianjita',
    src: dianjita
  },
  {
    id: 'beisi',
    src: beisi
  },
  {
    id: 'jueshigu',
    src: jueshigu
  },
  {
    id: 'hechengqi',
    src: hechengqi
  },
  {
    id: 'xueqiaoling',
    src: xueqiaoling
  },
  {
    id: 'dianzigu',
    src: dianzigu
  },
  {
    id: 'xiaohao',
    src: xiaohao
  },
  // 精灵动画
  {
    id: 'sprites_xiaohao',
    src: sprites_xiaohao
  },
  {
    id: 'sprites_beisi',
    src: sprites_beisi
  },
  {
    id: 'sprites_xiaotiqin',
    src: sprites_xiaotiqin
  },
  {
    id: 'sprites_xueqiaoling',
    src: sprites_xueqiaoling
  },
  {
    id: 'sprites_diangangqin',
    src: sprites_diangangqin
  },
  {
    id: 'sprites_dianzigu',
    src: sprites_dianzigu
  },
  {
    id: 'sprites_dianjita',
    src: sprites_dianjita
  },
  {
    id: 'sprites_jita',
    src: sprites_jita
  },
  {
    id: 'sprites_jueshigu',
    src: sprites_jueshigu
  },
  {
    id: 'sprites_hechengqi',
    src: sprites_hechengqi
  },
  // 两个男孩
  {
    id: 'boy_christmas',
    src: boy_christmas
  },
  {
    id: 'boy_newyear',
    src: boy_newyear
  },
  // aha
  {
    id: 'aha_christmas',
    src: aha_christmas
  },
  {
    id: 'aha_newyear',
    src: aha_newyear
  },
  {
    id: 'run_christmas',
    src: run_christmas
  },
  {
    id: 'run_newyear',
    src: run_newyear
  },
  // 场景背景
  {
    id: 'bg_newyear',
    src: bg_newyear
  },
  {
    id: 'bg_christmas',
    src: bg_christmas
  }
];

// 声音资源
export const SoundsRes = {
  christmas: [{
      id: 'song_christmas_beisi',
      alias: 'beisi',
      src: import('../../../assets/sounds/musicParty2020/christmas/beisi.mp3')
    },
    {
      id: 'song_christmas_diangangqin',
      alias: 'diangangqin',
      src: import('../../../assets/sounds/musicParty2020/christmas/diangangqin.mp3')
    },
    {
      id: 'song_christmas_dianjita',
      alias: 'dianjita',
      src: import('../../../assets/sounds/musicParty2020/christmas/dianjita.mp3')
    },
    {
      id: 'song_christmas_dianzigu',
      alias: 'dianzigu',
      src: import('../../../assets/sounds/musicParty2020/christmas/dianzigu.mp3')
    },
    {
      id: 'song_christmas_hechengqi',
      alias: 'hechengqi',
      src: import('../../../assets/sounds/musicParty2020/christmas/hechengqi.mp3')
    },
    {
      id: 'song_christmas_jita',
      alias: 'jita',
      src: import('../../../assets/sounds/musicParty2020/christmas/jita.mp3')
    },
    {
      id: 'song_christmas_jueshigu',
      alias: 'jueshigu',
      src: import('../../../assets/sounds/musicParty2020/christmas/jueshigu.mp3')
    },
    {
      id: 'song_christmas_vocal',
      alias: 'vocal',
      src: import('../../../assets/sounds/musicParty2020/christmas/vocal.mp3')
    },
    {
      id: 'song_christmas_xiaohao',
      alias: 'xiaohao',
      src: import('../../../assets/sounds/musicParty2020/christmas/xiaohao.mp3')
    },
    {
      id: 'song_christmas_xiaotiqin',
      alias: 'xiaotiqin',
      src: import('../../../assets/sounds/musicParty2020/christmas/xiaotiqin.mp3')
    },
    {
      id: 'song_christmas_xueqiaoling',
      alias: 'xueqiaoling',
      src: import('../../../assets/sounds/musicParty2020/christmas/xueqiaoling.mp3')
    }
  ],
  newyear: [{
      id: 'song_newyear_beisi',
      alias: 'beisi',
      src: import('../../../assets/sounds/musicParty2020/newyear/beisi.mp3')
    },
    {
      id: 'song_newyear_diangangqin',
      alias: 'diangangqin',
      src: import('../../../assets/sounds/musicParty2020/newyear/diangangqin.mp3')
    },
    {
      id: 'song_newyear_dianjita',
      alias: 'dianjita',
      src: import('../../../assets/sounds/musicParty2020/newyear/dianjita.mp3')
    },
    {
      id: 'song_newyear_dianzigu',
      alias: 'dianzigu',
      src: import('../../../assets/sounds/musicParty2020/newyear/dianzigu.mp3')
    },
    {
      id: 'song_newyear_hechengqi',
      alias: 'hechengqi',
      src: import('../../../assets/sounds/musicParty2020/newyear/hechengqi.mp3')
    },
    {
      id: 'song_newyear_jita',
      alias: 'jita',
      src: import('../../../assets/sounds/musicParty2020/newyear/jita.mp3')
    },
    {
      id: 'song_newyear_jueshigu',
      alias: 'jueshigu',
      src: import('../../../assets/sounds/musicParty2020/newyear/jueshigu.mp3')
    },
    {
      id: 'song_newyear_vocal',
      alias: 'vocal',
      src: import('../../../assets/sounds/musicParty2020/newyear/vocal.mp3')
    },
    {
      id: 'song_newyear_xiaohao',
      alias: 'xiaohao',
      src: import('../../../assets/sounds/musicParty2020/newyear/xiaohao.mp3')
    },

    {
      id: 'song_newyear_xiaotiqin',
      alias: 'xiaotiqin',
      src: import('../../../assets/sounds/musicParty2020/newyear/xiaotiqin.mp3')
    },
    {
      id: 'song_newyear_xueqiaoling',
      alias: 'xueqiaoling',
      src: import('../../../assets/sounds/musicParty2020/newyear/xueqiaoling.mp3')
    }
  ]
};

const SourceCache = {};

export const preloadRes = {
  /**
   * 根据ID获取资源
   * @param {*} id 
   * @returns {HTMLImageElement | Howl | null}
   */
  get(id) {
    return SourceCache[id];
  },
  /**
   * 载入图片资源
   * @param {{id: String, src: String}[]} arrs 
   */
  addImages(arrs) {
    return new Promise((resolve, reject) => {
      const totalCount = arrs.length;
      let loadCount = 0;
      let errorCount = 0;

      if (totalCount === 0) {
        resolve();
      }

      const checkLoad = () => {
        if (loadCount + errorCount >= totalCount) {
          errorCount === 0 ? resolve() : reject();
        }
      };

      arrs.forEach(item => {
        if (SourceCache[item.id]) {
          loadCount++;
          checkLoad();
        } else {
          const img = new Image();
          img.src = item.src;
          img.onload = () => {
            SourceCache[item.id] = img;
            loadCount++;
            checkLoad();
          };
          img.onerror = () => {
            errorCount++;
            checkLoad();
          }
        }
      });
    });
  },
  /**
   * 载入声音资源
   * @param {{id: String, src: String, alias: String}[]} arrs 
   */
  addSounds(arrs) {
    return new Promise((resolve, reject) => {
      const totalCount = arrs.length;
      let loadCount = 0;
      let errorCount = 0;

      const checkLoad = () => {
        if (loadCount + errorCount >= totalCount) {
          errorCount === 0 ? resolve() : reject();
        }
      };

      arrs.forEach(item => {
        if (SourceCache[item.id]) {
          loadCount++;
          checkLoad();
        } else {
          const sound = new Howl({
            src: [item.src],
            preload: true,
            loop: true,
            autoplay: false,
            onload() {
              // SourceCache[item.id] = sound;
              loadCount++;
              checkLoad();
            },
            onloaderror() {
              errorCount++;
              checkLoad();
            }
          });
          SourceCache[item.id] = sound; // 直接添加到缓存里 没加载完也能用
        }
      });
    });
  },
  /**
   * 辅助函数 - 定时器
   * @param {Number} time 毫秒
   */
  addTicker(time) {
    return new Promise(r => {
      setTimeout(() => r(), time);
    });
  }
};