import { Container, Bitmap, Tween, Ease } from 'hilojs'
import GameAssets from './GameAssets'

/**
 * 玩家类
 */
export default class GamePlayer extends Container {
    /** @type {Number} 上限生命值 */
    static MaxHP = 10

    /** @type {Bitmap} 玩家 */
    player = null
    /** @type {Bitmap} 玩家光效 */
    shadow = null
    /** @type {Tween} 玩家光效动画 */
    tween = null
    /** @type {Bitmap} 玩家碰撞区域 */
    playerBox = null
    /** @type {String} 玩家方向 */
    direction = 'left'
    /** @type {Number} 生命值 */
    hp = 0
    /** @type {Boolean} 是否无敌模式 */
    isGod = false
    /** @type {Boolean} 是否死亡 */
    isDeath = false

    constructor(properties) {
        super(properties);

        let image = GameAssets.query('player');
        let player = this.player = new Bitmap({
            image: image,
            pivotX: image.width / 2,
            scaleX: 0.5,
            scaleY: 0.5
        });

        image = GameAssets.query('player_shadow');
        let shadow = this.shadow = new Bitmap({
            image: image,
            pivotX: image.width / 2,
            scaleX: 0.5,
            scaleY: 0.5
        });

        let playerBox = this.playerBox = new Bitmap({
            // image: GameAssets.query('background_header'),  // 测试碰撞区域
            y: 163,
            width: 100,
            height: 40
        });

        this.addChild(player, playerBox);
        this.init();
    }

    /**
     * 数据初始化
     */
    init() {
        this.hp = GamePlayer.MaxHP;
        this.player.x = this.width / 2;
        this.shadow.x = this.player.x;
        this.shadow.y = (this.player.getScaledHeight() - this.shadow.getScaledHeight()) / 2;
        this.shadow.alpha = 0;
        this.playerBox.x = this.player.x - 120;
        this.isDeath = false;
    }

    /**
     * 检测篮子的碰撞区域
     */
    hitTestBox(item, usePolyCollision) {
        return this.playerBox.hitTestObject(item, usePolyCollision);
    }

    /**
     * 生命值减少
     * @param {Number} num 伤害值
     * @returns {Boolean} 是否死亡
     */
    hurtDamage(num = 1) {
        if (!this.isGod) {
            this.hp -= num;
            if (this.hp <= 0) {
                this.isDeath = true;
            }
        }
        return this.isDeath;
    }

    /**
     * 不扣生命值 直接致死
     */
    hurtDeath() {
        if (!this.isGod) {
            this.isDeath = true;
        }
        return this.isDeath;
    }

    enterGodMode() {
        this.isGod = true;
        this.addChild(this.shadow);
        // 光效动画
        this.tween = Tween.to(this.shadow, {
            alpha: 1
        }, {
            duration: 600,
            loop: true,
            reverse: true
        });
    }

    exitGodMode() {
        this.isGod = false;
        this.tween.stop();
        this.removeChild(this.shadow);
    }

    /**
     * 改变方向
     * @param {'left' | 'right'} direction 
     */
    reverseDraw(direction) {
        if (direction === this.direction) return;

        const player = this.player;
        const shadow = this.shadow;
        const playerBox = this.playerBox;
        if (direction === 'left') {
            player.scaleX = 0.5;
            shadow.scaleX = 0.5;
            playerBox.x = player.x - 120;
            this.direction = direction;
        } else if (direction === 'right') {
            player.scaleX = -0.5;
            shadow.scaleX = -0.5;
            playerBox.x = player.x + 20;
            this.direction = direction;
        }
    }

}