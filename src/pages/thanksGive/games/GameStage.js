import { Stage, Ticker, Tween, Bitmap } from 'hilojs'
import { FPS, SCREEN } from './GameConfig'

/**
 * 获取缩放倍数
 */
function getStageScale() {
    const innerWidth = document.documentElement.clientWidth || window.outerWidth || document.body.clientWidth;
    const innerHeight = document.documentElement.clientHeight || window.outerHeight || document.body.clientHeight;
    return Math.min( innerWidth / SCREEN.WIDTH ,  innerHeight / SCREEN.HEIGHT );
}

/**
 * 游戏舞台类
 */
export default class GameStage extends Stage {
    // 舞台实际宽度
    stageWidth = 0
    // 舞台实际高度
    stageHeight = 0

    ticker = new Ticker(FPS)

    constructor(canvas) {
        const SCALE = getStageScale();

        super({
            renderType: 'canvas',
            container: canvas,
            width: SCREEN.WIDTH,
            height: SCREEN.HEIGHT,
            scaleX: SCALE,
            scaleY: SCALE,
        });

        this.stageWidth = SCREEN.WIDTH;
        this.stageHeight = SCREEN.HEIGHT;

        // 创建定时器
        this.ticker.addTick(Tween);
        this.ticker.addTick(this);
        this.ticker.start(true);
    }

    /**
     * 窗口改变大小
     */
    changeSize() {
        const SCALE = getStageScale();
        this.scaleX = SCALE;
        this.scaleY = SCALE;
        this.resize(this.stageWidth, this.stageHeight, true);
    }

    destroy() {
        this.removeAllChildren();
        if (this.ticker) {
            this.ticker.stop();
        }
    }

}