import {
    Container, 
    Bitmap, 
    Ticker, 
    Graphics, 
    Text, 
    Tween, 
    Ease, 
    event as HiloEvent
} from 'hilojs'

import GameAssets from './GameAssets'
import GamePlayer from './GamePlayer'
import EnemyMusic from './EnemyMusic'
import PauseScene from './PauseScene'
import PianoBoy from './PianoBoy'

import { LEVELS, GOD_MODE } from './GameConfig'

/**
 * 游戏场景类
 */
export default class PlayScene extends Container {

    /** @type {PauseScene} 暂停场景 */
    pauseScene = null
    /** @type {Text} 分数绘制 */
    scoreText = null
    /** @type {Bitmap} 主要区域 */
    mainView = null
    /** @type {Bitmap} 触控区域 */
    pointerView = null
    /** @type {PianoBoy} 头部区域 */
    headerView = null
    /** @type {Bitmap} miss效果 */
    missEffect = null
    /** @type {GamePlayer} 音符数组 */
    gamePlayer = null
    /** @type {EnemyMusic[]} 音符数组 */
    enemy = []
    /** @type {Ticker} 定时器 */
    ticker = null

    /** @type {Number[]} 音符随机坐标数组 */
    positions = []
    /** @type {Text} 当前分数 */
    scoreTime = 0
    /** @type {Number} 当前游戏等级 */
    currentLevel = 0
    /** @type {Number} 进入精彩时刻的时间 */
    enterGodTime = 0

    constructor(properties) {
        super(properties);
        // 添加音符掉落位置
        const count = 5;
        for (let index = 0; index < count; index++) {
            this.positions.push( (this.width / count) * index );
        }

        let image = GameAssets.query('background_main');
        let mainView = this.mainView = new Bitmap({
            image: image,
            y: 364,
            scaleX: 0.5,
            scaleY: 0.5
        });

        image = GameAssets.query('miss');
        let missEffect = this.missEffect = new Bitmap({
            x: this.width / 2 - (image.width / 4),
            y: this.height / 2 - (image.height / 4),
            image: image,
            pivotX: image / 2,
            pivotY: image / 2,
            scaleX: 0.5,
            scaleY: 0.5,
            visible: false
        });

        let gamePlayer = this.gamePlayer = new GamePlayer({
            y: 855,
            width: 258,
            height: 288,
        });

        let headerView = this.headerView = new PianoBoy({
            x: 0,
            y: 0,
            width: this.width,
            height: 364
        });
        
        // 分数背景层
        let scoreBg = new Graphics();
        scoreBg.beginFill('#FDE792');
        scoreBg.drawCircle(654, 32, 30);
        scoreBg.endFill();
        scoreBg.cache();

        let scoreText = this.scoreText = new Text({
            x: 654,
            y: 50,
            width: 60,
            // height: 60,
            textAlign: 'center',
            // textVAlign: 'middle',
            color: '#163C83',
        });
        scoreText.setFont('24px Arial');

        let pointerView = this.pointerView = new Bitmap({
            image: GameAssets.query('background_footer'),
            y: 1122,
            scaleX: 0.5,
            scaleY: 0.5
        });
        this.touchBindPlayer(pointerView);

        this.addChild(mainView, missEffect, gamePlayer, headerView, scoreBg, scoreText, pointerView);

        this.pauseScene = new PauseScene({
            width: this.width,
            height: this.height
        });

        this.init();
    }

    init() {
        this.scoreTime = 0;
        this.currentLevel = 0;
        this.enterGodTime = 0;
        this.scoreText.text = Math.floor(this.scoreTime / 1000) + 'S';
        this.gamePlayer.x = (this.width - this.gamePlayer.width) / 2;
        this.gamePlayer.init();
        this.headerView.setLevelSpeed(this.currentLevel);
    }

    /**
     * 和绑定player移动事件监听关系
     * @param {Bitmap} pointerView 
     */
    touchBindPlayer(pointerView) {
        const gamePlayer = this.gamePlayer;
        let lastMoveX = 0;

        pointerView.on(HiloEvent.POINTER_START, e => {
            lastMoveX = e.stageX;
        });

        pointerView.on(HiloEvent.POINTER_MOVE, e => {
            let moveX = e.stageX - lastMoveX;

            gamePlayer.x = Math.max(gamePlayer.x + moveX, 0);
            gamePlayer.x = Math.min(gamePlayer.x, this.width - gamePlayer.width);
            // 防止短距离的抖动
            if ( Math.abs(moveX) >= 2.4 ) {
                gamePlayer.reverseDraw(moveX > 0 ? 'right': 'left');
            }

            lastMoveX = e.stageX;
        });
    }

    /**
     * 开始游戏
     */
    runGame() {
        this.init();
        this.headerView.playAnimation();

        const interval = 100;        // 定时器间隔
        const range = interval + 34; // 允许delayTime存在的误差
        let delayTime = 0;           // 记录player每帧间隔
        let interTime = 0;           // 记录interval的时间

        // 游戏时钟
        this.ticker = new Ticker();
        this.ticker.interval(() => {
            this.scoreTime += delayTime <= range ? delayTime : interval; // 超过误差则以定时器时间为准, 防止切后台等操作使时间拉长
            // console.assert(delayTime <= range, 'delayTime ==>', delayTime);  // TODO:::: 测试打印

            this.scoreText.text = Math.floor(this.scoreTime / 1000) + 'S';
            delayTime = 0;
            interTime += interval;
            // 生成音符和升级检测
            const level = LEVELS[this.currentLevel];
            if ( interTime % level.interval === 0 ) {
                this.produceEnemy();
                // 根据时间升级
                if ( level.time > 0 && interTime >= level.time ) {
                    this.currentLevel++;
                    this.headerView.setLevelSpeed(this.currentLevel);
                    console.log('游戏等级升级为', this.currentLevel);
                }
            }
            // 精彩时刻检测
            if (this.enterGodTime <= 0 && this.scoreTime >= GOD_MODE.enter) {
                this.enterGodTime = this.scoreTime;
                this.enterGodMode();
            }
        }, interval);
        this.ticker.start();

        /**
         * 敌人碰撞检测
         * @param {EnemyMusic} item 
         */
        const hitEnemyHandle = (item) => {
            if (!this.gamePlayer.hitTestBox(item)) return;

            if (item.isDangerous) {
                if (this.gamePlayer.hurtDeath()) {
                    // 需要下一帧再结束游戏 否则界面显示不太同步
                    this.gamePlayer.onUpdate = () => {
                        if (delayTime < interTime) {
                            this.scoreTime += delayTime;
                        }
                        this.gameOver();
                        this.gamePlayer.onUpdate = null;
                    }
                }
            }
            this.destroyEnemy(item, true);
        }

        this.gamePlayer.onUpdate = dt => {
            delayTime += dt;
            this.enemy.forEach(hitEnemyHandle);
        }
    }

    /**
     * 进入上帝模式
     */
    enterGodMode() {
        this.ticker.pause();
        this.destroyEnemyAll();
        this.gamePlayer.visible = false;
        this.gamePlayer.x = (this.width - this.gamePlayer.width) / 2;
        this.gamePlayer.reverseDraw('left');
        this.gamePlayer.enterGodMode();

        this.mainView.setImage( GameAssets.query('background_main2') );

        const ticker = new Ticker();
        ticker.timeout(() => {
            this.removeChild(this.pauseScene);
            this.gamePlayer.visible = true;
            this.ticker.resume();
            // 设置精彩时刻结束时间
            ticker.timeout(() => {
                this.exitGodMode();
            }, GOD_MODE.duration);

        }, GOD_MODE.pause);
        ticker.start();
        // 显示加个淡入效果
        this.pauseScene.alpha = 0;
        this.addChild(this.pauseScene);
        Tween.to(this.pauseScene, {
            alpha: 1
        }, {
            duration: 500
        });
    }

    /**
     * 退出上帝模式
     */
    exitGodMode() {
        this.mainView.setImage( GameAssets.query('background_main') );
        this.gamePlayer.exitGodMode();
    }

    /**
     * 游戏结束
     * @param {Number} time 最终成绩
     */
    gameOver() {
        this.fire('gameover', {
            time: this.scoreTime,
            miss: GamePlayer.MaxHP - this.gamePlayer.hp
        });

        this.gamePlayer.init();
        this.headerView.stopAnimation();
        this.ticker.stop();
        this.destroyEnemyAll();
        EnemyMusic.destroy();
    }

    /**
     * 生产音符
     */
    produceEnemy() {
        const level = LEVELS[this.currentLevel];
        const offsetX = 34 + 40;  // item的1/2宽度 + 34居中补偿
        const offsetY = 45;      // item的1/2高度
        const height = this.headerView.getScaledHeight();
        const positions = this.positions.sort(() => 0.5 - Math.random()).slice(0, level.count);
        // 根据配置的数量循环产生音符
        for (let i = 0; i < level.count; i++) {
            const item = EnemyMusic.produce(Math.random() >= 0.8 ? true : false);
            item.x = positions.pop() + offsetX;
            item.y = height - offsetY;
            item.init( level.enemy.velocity, level.enemy.gravity );
            item.onUpdate = delayTime => {
                item.y += item.updateSpeed(delayTime);
                // 落到地面
                if (item.y > this.pointerView.y) {
                    this.destroyEnemy(item, false);
                    if (!item.isDangerous) {
                        this.playMissEffect();
                        if (this.gamePlayer.hurtDamage(1)) {
                            this.gameOver();
                        }
                    }
                }
            }
            this.enemy.push(item);

            this.addChildAt( item, this.getChildIndex(this.headerView) );
        }
    }

    /**
     * 播放miss特效
     */
    playMissEffect() {
        // 上帝模式或正在播放则不重新播放
        if (!this.missEffect.visible && !this.gamePlayer.isGod) {
            const toY = this.missEffect.y;
            this.missEffect.visible = true;
            this.missEffect.y = this.pointerView.y;
            Tween.to(this.missEffect, {
                y: toY
            }, {
                duration: 360,
                ease: Ease.Quad.EaseOut,
                onComplete: () => {
                    this.missEffect.visible = false;
                }
            });
        }
    }

    /**
     * 销毁音符
     * @param {EnemyMusic} item 要销毁的音符
     * @param {Boolean} playEffect 是否播放动画
     */
    destroyEnemy(item, playEffect = false) {
        const index = this.enemy.indexOf(item);
        if (index >= 0) {
            this.enemy.splice(index, 1);
        }

        item.onUpdate = null;
        if (playEffect) {
            // 播放消失动画
            Tween.to(item, {
                rotation: 360,
                alpha: 0.2
            }, {
                duration: 266,
                ease: Ease.Quad.EaseInOut,
                onComplete: () => {
                    item.rotation = 0;
                    item.alpha = 1;
                    EnemyMusic.reclaim(item);
                }
            });
        } else {
            EnemyMusic.reclaim(item);
        }
    }

    destroyEnemyAll() {
        this.enemy.forEach(item => {
            EnemyMusic.reclaim(item);
        });
        this.enemy = [];
    }

}