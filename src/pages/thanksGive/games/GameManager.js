import { EventMixin, event as HiloEvent } from 'hilojs'
import GameAssets from './GameAssets'
import GameStage from './GameStage'

import ReadyScene from './ReadyScene'
import PlayScene from './PlayScene'


/**
 * 游戏管理类
 */
export default class GameManager {
    /** @type {GameStage} 舞台 */
    stage = null
    /** @type {ReadyScene} 开始游戏界面 */
    readyScene = null
    /** @type {PlayScene} 游戏中界面 */
    playScene = null

    constructor(canvas) {
        // 载入资源
        GameAssets.load().then(() => {
            this.init(canvas);
        }).catch(err => {
            console.log('init', err);
        });

        // 合并Event类
        Object.assign(this, EventMixin);

        // 创建舞台
        this.stage = new GameStage(canvas);
    }

    /**
     * 绘制进度文本
     * @param {HTMLElement} el 
     */
    drawProgress(el) {
        el.style.display = 'block';
        const clock = setInterval(() => {
            const progress = GameAssets.getProgress();
            if (progress >= 1) {
                el.style.display = 'none';
                clearInterval(clock);
            } else {
                el.innerText = '加载中: ' + (progress * 100).toFixed(2) + '%';
            }
        }, 33);
    }

    /**
     * 初始化游戏
     * @param {HTMLCanvasElement} canvas 
     */
    init() {
        const stage = this.stage;

        stage.enableDOMEvent(HiloEvent.POINTER_START, true);  // 启用触摸事件
        stage.enableDOMEvent(HiloEvent.POINTER_MOVE, true);  // 启用触摸事件

        // 游戏场景
        const playScene = this.playScene = new PlayScene({
            width: stage.width, 
            height: stage.height
        });
        playScene.addTo(this.stage);

        // 开始游戏场景
        const readyScene = this.readyScene = new ReadyScene({
            width: stage.width,
            height: stage.height
        });
        // 开始按钮监听
        readyScene.buttonStart.on(HiloEvent.POINTER_START, e => {
            e.stopImmediatePropagation && e.stopImmediatePropagation();
            // 是否开始游戏回调 
            let isStartGame = true;
            this.fire('startBefore', {
                callback: (result) => {
                    isStartGame = !!result;
                }
            });
            if (isStartGame) {
                this.gameReady();
            }
        });
        readyScene.addTo(this.stage);

        // this.fire('stageInit');
    }

    /**
     * 恢复场景为初始值
     */
    toReadyScene() {
        this.playScene.init();
        this.readyScene.visible = true;
    }

    /**
     * 开始游戏
     */
    gameReady() {
        this.readyScene.visible = false;
        this.playScene.runGame();

        this.playScene.on('gameover', ( { detail } ) => {
            console.log(`你一共坚持了${detail.time}毫秒, Miss数量:${detail.miss}`);
            this.fire('gameover', detail);
        }, true);
    }

    /**
     * 大小改变
     */
    changeSize() {
        this.stage.changeSize();
    }

    /**
     * 游戏销毁
     */
    destroy() {
        if (this.playScene.ticker) {
            this.playScene.ticker.stop();
        }
        this.stage.destroy();
        this.readyScene = null;
        this.playScene = null;
    }

}