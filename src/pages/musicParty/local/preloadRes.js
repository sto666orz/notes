import { Howl } from 'howler'

const insModules = import.meta.globEager('../../../assets/images/musicParty2020/stage/ins_*.png')
const bgModules = import.meta.globEager('../../../assets/images/musicParty2020/stage/bg_*.png')
const spritesModules = import.meta.globEager('../../../assets/images/musicParty2020/sprites/*.png')

const christmasSounds = import.meta.globEager('../../../assets/sounds/musicParty2020/christmas/*.mp3')
const newyearSounds = import.meta.globEager('../../../assets/sounds/musicParty2020/newyear/*.mp3')


/**
 * vite文件加载方式
 * @returns {String} 图片地址
 */
const getModSrc = (modules, fileName) => {
  const moduleKeys = Object.keys(modules);
  const find = moduleKeys.find(item => ~item.indexOf(fileName) );
  return find ? modules[find].default : '';
}

export const ImagesRes = [
  // 乐器按钮
  {
      id: 'diangangqin',
      src: getModSrc(insModules, 'ins_diangangqin@2x.png')
  },
  {
    id: 'xiaotiqin',
    src: getModSrc(insModules, 'ins_xiaotiqin@2x.png')
  },
  {
      id: 'jita',
      src: getModSrc(insModules, 'ins_jita@2x.png')
  },
  {
      id: 'dianjita',
      src: getModSrc(insModules, 'ins_dianjita@2x.png')
  },
  {
      id: 'beisi',
      src: getModSrc(insModules, 'ins_beisi@2x.png')
  },
  {
      id: 'jueshigu',
      src: getModSrc(insModules, 'ins_beisi@2x.png')
  },
  {
      id: 'hechengqi',
      src: getModSrc(insModules, 'ins_hechengqi@2x.png')
  },
  {
      id: 'xueqiaoling',
      src: getModSrc(insModules, 'ins_xueqiaoling@2x.png')
  },
  {
      id: 'dianzigu',
      src: getModSrc(insModules, 'ins_dianzigu@2x.png')
  },
  {
      id: 'xiaohao',
      src: getModSrc(insModules, 'ins_xiaohao@2x.png')
  },
  // 精灵动画
  {
      id: 'sprites_xiaohao',
      src: getModSrc(spritesModules, 'xiaohao.png')
  },
  {
      id: 'sprites_beisi',
      src: getModSrc(spritesModules, 'beisi.png')
  },
  {
      id: 'sprites_xiaotiqin',
      src: getModSrc(spritesModules, 'xiaotiqin.png')
  },
  {
      id: 'sprites_xueqiaoling',
      src: getModSrc(spritesModules, 'xueqiaoling.png')
  },
  {
      id: 'sprites_diangangqin',
      src: getModSrc(spritesModules, 'diangangqin.png')
  },
  {
      id: 'sprites_dianzigu',
      src: getModSrc(spritesModules, 'dianzigu.png')
  },
  {
      id: 'sprites_dianjita',
      src: getModSrc(spritesModules, 'dianjita.png')
  },
  {
      id: 'sprites_xiaohao',
      src: getModSrc(spritesModules, 'xiaohao.png')
  },
  {
      id: 'sprites_jita',
      src: getModSrc(spritesModules, 'jita.png')
  },
  {
      id: 'sprites_jueshigu',
      src: getModSrc(spritesModules, 'jueshigu.png')
  },
  {
      id: 'sprites_hechengqi',
      src: getModSrc(spritesModules, 'hechengqi.png')
  },
  // aha
  {
      id: 'aha_christmas',
      src: getModSrc(spritesModules, 'aha_christmas.png')
  },
  {
      id: 'aha_newyear',
      src: getModSrc(spritesModules, 'aha_newyear.png')
  },
  {
      id: 'run_christmas',
      src: getModSrc(spritesModules, 'run_christmas.png')
  },
  {
      id: 'run_newyear',
      src: getModSrc(spritesModules, 'run_newyear.png')
  },
  // 场景背景
  {
      id: 'bg_newyear',
      src: getModSrc(bgModules, 'bg_newyear@2x.png')
  },
  {
      id: 'bg_christmas',
      src: getModSrc(bgModules, 'bg_christmas@2x.png')
  }
];

// 声音资源
export const SoundsRes = {
  christmas: [{
      id: 'song_christmas_beisi',
      alias: 'beisi',
      src: getModSrc(christmasSounds, 'beisi.mp3')
    },
    {
      id: 'song_christmas_diangangqin',
      alias: 'diangangqin',
      src: getModSrc(christmasSounds, 'diangangqin.mp3')
    },
    {
      id: 'song_christmas_dianjita',
      alias: 'dianjita',
      src: getModSrc(christmasSounds, 'dianjita.mp3')
    },
    {
      id: 'song_christmas_dianzigu',
      alias: 'dianzigu',
      src: getModSrc(christmasSounds, 'dianzigu.mp3')
    },
    {
      id: 'song_christmas_hechengqi',
      alias: 'hechengqi',
      src: getModSrc(christmasSounds, 'hechengqi.mp3')
    },
    {
      id: 'song_christmas_jita',
      alias: 'jita',
      src: getModSrc(christmasSounds, 'jita.mp3')
    },
    {
      id: 'song_christmas_jueshigu',
      alias: 'jueshigu',
      src: getModSrc(christmasSounds, 'jueshigu.mp3')
    },
    {
      id: 'song_christmas_vocal',
      alias: 'vocal',
      src: getModSrc(christmasSounds, 'vocal.mp3')
    },
    {
      id: 'song_christmas_xiaohao',
      alias: 'xiaohao',
      src: getModSrc(christmasSounds, 'xiaohao.mp3')
    },
    {
      id: 'song_christmas_xiaotiqin',
      alias: 'xiaotiqin',
      src: getModSrc(christmasSounds, 'xiaotiqin.mp3')
    },
    {
      id: 'song_christmas_xueqiaoling',
      alias: 'xueqiaoling',
      src: getModSrc(christmasSounds, 'xueqiaoling.mp3')
    }
  ],
  newyear: [{
      id: 'song_newyear_beisi',
      alias: 'beisi',
      src: getModSrc(newyearSounds, 'xueqiaoling.mp3')
    },
    {
      id: 'song_newyear_diangangqin',
      alias: 'diangangqin',
      src: getModSrc(newyearSounds, 'diangangqin.mp3')
    },
    {
      id: 'song_newyear_dianjita',
      alias: 'dianjita',
      src: getModSrc(newyearSounds, 'dianjita.mp3')
    },
    {
      id: 'song_newyear_dianzigu',
      alias: 'dianzigu',
      src: getModSrc(newyearSounds, 'dianzigu.mp3')
    },
    {
      id: 'song_newyear_hechengqi',
      alias: 'hechengqi',
      src: getModSrc(newyearSounds, 'hechengqi.mp3')
    },
    {
      id: 'song_newyear_jita',
      alias: 'jita',
      src: getModSrc(newyearSounds, 'jita.mp3')
    },
    {
      id: 'song_newyear_jueshigu',
      alias: 'jueshigu',
      src: getModSrc(newyearSounds, 'jueshigu.mp3')
    },
    {
      id: 'song_newyear_vocal',
      alias: 'vocal',
      src: getModSrc(newyearSounds, 'vocal.mp3')
    },
    {
      id: 'song_newyear_xiaohao',
      alias: 'xiaohao',
      src: getModSrc(newyearSounds, 'xiaohao.mp3')
    },

    {
      id: 'song_newyear_xiaotiqin',
      alias: 'xiaotiqin',
      src: getModSrc(newyearSounds, 'xiaotiqin.mp3')
    },
    {
      id: 'song_newyear_xueqiaoling',
      alias: 'xueqiaoling',
      src: getModSrc(newyearSounds, 'xueqiaoling.mp3')
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