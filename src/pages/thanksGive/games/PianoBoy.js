import { Container, Bitmap, TextureAtlas, Sprite } from 'hilojs'
import GameAssets from './GameAssets'

import { LEVELS } from './GameConfig'


/**
 * 弹琴男孩类(序列帧动画)
 */
export default class PianoBoy extends Container {

    /** @type {Bitmap} 背景 */
    bgImage = null
    /** @type {Sprite} 钢琴 */
    piano = null
    /** @type {Sprite} 男孩 */
    boy = null
    /** @type {Number} 播放速度 */
    speed = 0

    constructor(properties) {
        super(properties);
        this.init();
    }

    init() {
        const bgImage = this.bgImage = new Bitmap({
            image: GameAssets.query('background_header'),
            scaleX: 0.5,
            scaleY: 0.5
        });

        const pianoAtlas = new TextureAtlas( GameAssets.queryFrames('piano') );
        const boyAtlas = new TextureAtlas( GameAssets.queryFrames('boy') );

        const piano = this.piano = new Sprite({
            y: 219,
            width: 750,
            height: 71,
            interval: 1
        });
        piano.addFrame( pianoAtlas.getSprite('shot') );

        const boy = this.boy = new Sprite({
            x: 235,
            width: 280,
            height: 364,
            interval: 1
        });
        boy.addFrame( boyAtlas.getSprite('shot') );

        this.playSpeed(LEVELS.length);
        this.stopAnimation();

        this.addChild(bgImage, piano, boy);
    }

    stopAnimation() {
        this.piano.stop();
        this.boy.stop();
    }

    playAnimation() {
        this.piano.play();
        this.boy.play();
    }

    /**
     * 设置播放速度
     * @param {Number} speed 
     */
    playSpeed(speed) {
        this.piano.interval = speed * 3;
        this.boy.interval = speed;
    }

    /**
     * 根据等级自动计算播放速度
     * @param {*} level 当前等级
     */
    setLevelSpeed(level) {
        const MinSpeed = 6; // 最慢播放帧率 太慢感觉会不好
        const speed = Math.min(LEVELS.length - level, MinSpeed);
        this.playSpeed(speed);
    }

}