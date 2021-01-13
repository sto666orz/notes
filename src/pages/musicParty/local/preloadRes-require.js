import { Howl } from 'howler'

const modules = import.meta.globEager('../../../assets/images/musicParty2020/stage/ins_*.png')

console.log('modules', modules);

export const ImagesRes = [
  // 乐器按钮
  {
      id: 'diangangqin',
      src: require('@/assets/images/musicParty2020/stage/ins_diangangqin@2x.png')
  },
  {
      id: 'jita',
      src: require('@/assets/images/musicParty2020/stage/ins_jita@2x.png')
  },
  {
      id: 'dianjita',
      src: require('@/assets/images/musicParty2020/stage/ins_dianjita@2x.png')
  },
  {
      id: 'beisi',
      src: require('@/assets/images/musicParty2020/stage/ins_beisi@2x.png')
  },
  {
      id: 'jueshigu',
      src: require('@/assets/images/musicParty2020/stage/ins_jueshigu@2x.png')
  },
  {
      id: 'hechengqi',
      src: require('@/assets/images/musicParty2020/stage/ins_hechengqi@2x.png')
  },
  {
      id: 'xueqiaoling',
      src: require('@/assets/images/musicParty2020/stage/ins_xueqiaoling@2x.png')
  },
  {
      id: 'dianzigu',
      src: require('@/assets/images/musicParty2020/stage/ins_dianzigu@2x.png')
  },
  {
      id: 'xiaohao',
      src: require('@/assets/images/musicParty2020/stage/ins_xiaohao@2x.png')
  },
  // 精灵动画
  {
      id: 'sprites_xiaohao',
      src: require('@/assets/images/musicParty2020/sprites/xiaohao.png')
  },
  {
      id: 'sprites_beisi',
      src: require('@/assets/images/musicParty2020/sprites/beisi.png')
  },
  {
      id: 'sprites_xiaotiqin',
      src: require('@/assets/images/musicParty2020/sprites/xiaotiqin.png')
  },
  {
      id: 'sprites_xueqiaoling',
      src: require('@/assets/images/musicParty2020/sprites/xueqiaoling.png')
  },
  {
      id: 'sprites_diangangqin',
      src: require('@/assets/images/musicParty2020/sprites/diangangqin.png')
  },
  {
      id: 'sprites_dianzigu',
      src: require('@/assets/images/musicParty2020/sprites/dianzigu.png')
  },
  {
      id: 'sprites_dianjita',
      src: require('@/assets/images/musicParty2020/sprites/dianjita.png')
  },
  {
      id: 'sprites_xiaohao',
      src: require('@/assets/images/musicParty2020/sprites/xiaohao.png')
  },
  {
      id: 'sprites_jita',
      src: require('@/assets/images/musicParty2020/sprites/jita.png')
  },
  {
      id: 'sprites_jueshigu',
      src: require('@/assets/images/musicParty2020/sprites/jueshigu.png')
  },
  {
      id: 'sprites_hechengqi',
      src: require('@/assets/images/musicParty2020/sprites/hechengqi.png')
  },
  // aha
  {
      id: 'aha_christmas',
      src: require('@/assets/images/musicParty2020/sprites/aha_christmas.png')
  },
  {
      id: 'aha_newyear',
      src: require('@/assets/images/musicParty2020/sprites/aha_newyear.png')
  },
  {
      id: 'run_christmas',
      src: require('@/assets/images/musicParty2020/sprites/run_christmas.png')
  },
  {
      id: 'run_newyear',
      src: require('@/assets/images/musicParty2020/sprites/run_newyear.png')
  },
  // 场景背景
  {
      id: 'bg_newyear',
      src: require('@/assets/images/musicParty2020/stage/bg_newyear@2x.png')
  },
  {
      id: 'bg_christmas',
      src: require('@/assets/images/musicParty2020/stage/bg_christmas@2x.png')
  }
];

// 声音资源
export const SoundsRes = {
  christmas: [{
      id: 'song_christmas_beisi',
      alias: 'beisi',
      src: require('../../../assets/sounds/musicParty2020/christmas/beisi.mp3')
    },
    {
      id: 'song_christmas_diangangqin',
      alias: 'diangangqin',
      src: require('../../../assets/sounds/musicParty2020/christmas/diangangqin.mp3')
    },
    {
      id: 'song_christmas_dianjita',
      alias: 'dianjita',
      src: require('../../../assets/sounds/musicParty2020/christmas/dianjita.mp3')
    },
    {
      id: 'song_christmas_dianzigu',
      alias: 'dianzigu',
      src: require('../../../assets/sounds/musicParty2020/christmas/dianzigu.mp3')
    },
    {
      id: 'song_christmas_hechengqi',
      alias: 'hechengqi',
      src: require('../../../assets/sounds/musicParty2020/christmas/hechengqi.mp3')
    },
    {
      id: 'song_christmas_jita',
      alias: 'jita',
      src: require('../../../assets/sounds/musicParty2020/christmas/jita.mp3')
    },
    {
      id: 'song_christmas_jueshigu',
      alias: 'jueshigu',
      src: require('../../../assets/sounds/musicParty2020/christmas/jueshigu.mp3')
    },
    {
      id: 'song_christmas_vocal',
      alias: 'vocal',
      src: require('../../../assets/sounds/musicParty2020/christmas/vocal.mp3')
    },
    {
      id: 'song_christmas_xiaohao',
      alias: 'xiaohao',
      src: require('../../../assets/sounds/musicParty2020/christmas/xiaohao.mp3')
    },
    {
      id: 'song_christmas_xiaotiqin',
      alias: 'xiaotiqin',
      src: require('../../../assets/sounds/musicParty2020/christmas/xiaotiqin.mp3')
    },
    {
      id: 'song_christmas_xueqiaoling',
      alias: 'xueqiaoling',
      src: require('../../../assets/sounds/musicParty2020/christmas/xueqiaoling.mp3')
    }
  ],
  newyear: [{
      id: 'song_newyear_beisi',
      alias: 'beisi',
      src: require('../../../assets/sounds/musicParty2020/newyear/beisi.mp3')
    },
    {
      id: 'song_newyear_diangangqin',
      alias: 'diangangqin',
      src: require('../../../assets/sounds/musicParty2020/newyear/diangangqin.mp3')
    },
    {
      id: 'song_newyear_dianjita',
      alias: 'dianjita',
      src: require('../../../assets/sounds/musicParty2020/newyear/dianjita.mp3')
    },
    {
      id: 'song_newyear_dianzigu',
      alias: 'dianzigu',
      src: require('../../../assets/sounds/musicParty2020/newyear/dianzigu.mp3')
    },
    {
      id: 'song_newyear_hechengqi',
      alias: 'hechengqi',
      src: require('../../../assets/sounds/musicParty2020/newyear/hechengqi.mp3')
    },
    {
      id: 'song_newyear_jita',
      alias: 'jita',
      src: require('../../../assets/sounds/musicParty2020/newyear/jita.mp3')
    },
    {
      id: 'song_newyear_jueshigu',
      alias: 'jueshigu',
      src: require('../../../assets/sounds/musicParty2020/newyear/jueshigu.mp3')
    },
    {
      id: 'song_newyear_vocal',
      alias: 'vocal',
      src: require('../../../assets/sounds/musicParty2020/newyear/vocal.mp3')
    },
    {
      id: 'song_newyear_xiaohao',
      alias: 'xiaohao',
      src: require('../../../assets/sounds/musicParty2020/newyear/xiaohao.mp3')
    },

    {
      id: 'song_newyear_xiaotiqin',
      alias: 'xiaotiqin',
      src: require('../../../assets/sounds/musicParty2020/newyear/xiaotiqin.mp3')
    },
    {
      id: 'song_newyear_xueqiaoling',
      alias: 'xueqiaoling',
      src: require('../../../assets/sounds/musicParty2020/newyear/xueqiaoling.mp3')
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