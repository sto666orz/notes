import { Bitmap } from 'hilojs'
import GameAssets from './GameAssets'
import { FPS } from './GameConfig'

const safeTime = 1000 / FPS * 1.5;

/**
 * 掉落音符类
 */
export default class EnemyMusic extends Bitmap {

    /** @type {EnemyMusic[]} 内存池 - 避免反复创建销毁 */
    static EnemyPool = []

    /** 能否对player造成伤害 */
    isDangerous = false
    /** 当前加速次数 */
    speed = 0
    /** 物体初速度 */
    velocity = 1.0
    /** 重力加速度 */
    gravity = 1.0

    constructor(isDangerous) {
        const image = GameAssets.query('music');
        super({
            image: image,
            rect: isDangerous ? [0, 200, 162, 180] : [0, 0, 162, 180],
            pivotX: 81,  //162 / 2
            pivotY: 90,  //162 / 2
            scaleX: 0.5,
            scaleY: 0.5,
        });
        this.isDangerous = isDangerous;
    }

    /**
     * 初始化速度
     * @param {Number} speed 初速度
     * @param {Number} gravity 加速度
     */
    init(velocity = 1.0, gravity = 1.0) {
        this.velocity = velocity;
        this.gravity = gravity;
        this.speed = 0;
    }

    /**
     * 更新并返回加速度
     * @param {Number} delayTime 绘制延迟时间
     */
    updateSpeed(delayTime) {
        let ratio = delayTime > safeTime ? delayTime / safeTime : 1; // 防止卡顿机型速度不一致
        return ( ((++this.speed) / 10 * (this.gravity * 0.5) ) + this.velocity ) * ratio;
    }
    

    /**
     * 生产
     * @param {Boolean} isDangerous 是否造成伤害(即红色音符)
     */
    static produce(isDangerous) {
        if (EnemyMusic.EnemyPool.length > 0) {
            const item = EnemyMusic.EnemyPool.pop();
            item.init();
            item.visible = true;
            if (isDangerous !== item.isDangerous) {
                item.isDangerous = isDangerous;
                item.setImage(GameAssets.query('music'), isDangerous ? [0, 200, 162, 180] : [0, 0, 162, 180]);
            }
            return item;
        }
        return new EnemyMusic(isDangerous);
    }

    /**
     * 回收
     * @param {EnemyMusic} item 
     */
    static reclaim(item) {
        if ( !~EnemyMusic.EnemyPool.indexOf(item) ) {
            EnemyMusic.EnemyPool.push(item);
            item.visible = false;
            item.removeFromParent();
        }
        // console.log('reclaim ==>', EnemyMusic.EnemyPool.length);
    }

    /**
     * 释放所有cache并从显示对象移除
     */
    static destroy() {
        EnemyMusic.EnemyPool.forEach(item => {
            item.removeFromParent();
        });
        EnemyMusic.EnemyPool = [];
    }

}