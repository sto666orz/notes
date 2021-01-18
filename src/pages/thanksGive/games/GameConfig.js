const assetsModules = import.meta.globEager('../../../assets/images/thanksGive/games/*.*')

// 游戏帧率
export const FPS = 60;

// 屏幕尺寸
export const SCREEN = {
    WIDTH: 750,
    HEIGHT: 1448
}

/**
 * vite文件加载方式
 * @returns {String} 图片地址
 */
const getModSrc = (modules, fileName) => {
    const moduleKeys = Object.keys(modules);
    const find = moduleKeys.find(item => ~item.indexOf(fileName) );
    return find ? modules[find].default : '';
  }

/**
 * 游戏难度配置
 * @typedef {Object[]} 游戏难度配置
 * @property {Number} time 升级下一等级时间
 * @property {Number} interval 间隔时间 需要是100毫秒的倍数
 * @property {Number} count 每次生成数量
 * @property {{velocity: Number, gravity: Number}} enemy 音符速度 - 初速度、加速度
 */
export const LEVELS = [
    {
        time: 8000,
        interval: 1500,
        count: 1,
        enemy: { velocity: 4, gravity: 0 }
    },
    {
        time: 14000,
        interval: 2000,
        count: 2,
        enemy: { velocity: 2.5, gravity: 0.5 }
    },
    {
        time: 25000,
        interval: 1000,
        count: 1,
        enemy: { velocity: 5, gravity: 1.5 }
    },
    {
        time: 35000,
        interval: 700,
        count: 1,
        enemy: { velocity: 6, gravity: 3 }
    },
    {
        time: 60000,
        interval: 600,
        count: 1,
        enemy: { velocity: 12, gravity: 4 }
    },
    {
        time: 80000,
        interval: 300,
        count: 1,
        enemy: { velocity: 17, gravity: 5 }
    },
    {
        time: 0,
        interval: 200,
        count: 1,
        enemy: { velocity: 21, gravity: 6 }
    }
];

// 精彩时刻配置
export const GOD_MODE = {
    enter: 35100,         // 触发时间
    duration: 1000 * 10, // 持续时间
    pause: 3000          // 暂停时间
}

// 图片资源配置
export const Resources = [
    {
        id: 'background_header',
        src: getModSrc(assetsModules, 'bg_header@2x.jpg')
    },
    {
        id: 'background_main',
        src: getModSrc(assetsModules, 'bg_main@2x.png')
    },
    {
        id: 'background_main2',
        src: getModSrc(assetsModules, 'bg_main2@2x.png')
    },
    {
        id: 'background_footer',
        src: getModSrc(assetsModules, 'bg_footer@2x.png')
    },
    {
        id: 'ready_image',
        src: getModSrc(assetsModules, 'ready_image@2x.png')
    },
    {
        id: 'pause_image',
        src: getModSrc(assetsModules, 'pause_image@2x.png')
    },
    {
        id: 'player',
        src: getModSrc(assetsModules, 'player@2x.png')
    },
    {
        id: 'player_shadow',
        src: getModSrc(assetsModules, 'player_shadow@2x.png')
    },
    {
        id: 'music',
        src: getModSrc(assetsModules, 'music@2x.png')
    },
    {
        id: 'piano',
        src: getModSrc(assetsModules, 'piano@2x.png')
    },
    {
        id: 'boy',
        src: getModSrc(assetsModules, 'boy@2x.png')
    },
    {
        id: 'miss',
        src: getModSrc(assetsModules, 'miss@2x.png')
    },
];

// 动画帧配置
export const ResourcesFrames = {
    "piano": {
        frames: [
            [0, 0, 1500, 142],
            [0, 170, 1500, 142],
            [0, 340, 1500, 142],
            [0, 510, 1500, 142],
            [0, 680, 1500, 142],
            [0, 850, 1500, 142],
        ],
        sprites: {
            "shot": [0, 1, 2, 3, 4, 5]
        }
    },
    "boy": {
        frames: [
            [0, 0, 560, 728],
            [0, 728, 560, 728],
            [0, 1456, 560, 728],
            [0, 2184, 560, 728],
            [0, 2912, 560, 728],
            [560, 0, 560, 728],
            [560, 728, 560, 728],
            [560, 1456, 560, 728],
            [560, 2184, 560, 728],
            [560, 2912, 560, 728],
            [1120, 0, 560, 728],
            [1120, 728, 560, 728],
            [1120, 1456, 560, 728],
            [1120, 2184, 560, 728],
        ],
        sprites: {
            "shot": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        }
    }
}
