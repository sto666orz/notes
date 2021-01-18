import { Container, Bitmap, Graphics } from 'hilojs'
import GameAssets from './GameAssets'

export default class PauseScene extends Container {

    /** @type {Bitmap} 上半部分 */
    viewTop = null
    /** @type {Bitmap} 下半部分 */
    viewBottom = null

    constructor(properties) {
        super(properties);
        this.init();
    }

    init() {
        const image = GameAssets.query('pause_image');
        // 透明背景层
        let background = new Graphics({
            alpha: 0.7
        });
        background.beginFill('#000000');
        background.drawRect(0, 0, this.width, this.height);
        background.endFill();

        let viewTop = this.viewTop = new Bitmap({
            image: image,
            rect: [5, 1036, 952, 398],
            scaleX: 0.5,
            scaleY: 0.5
        });

        let viewBottom = this.viewBottom = new Bitmap({
            image: image,
            rect: [5, 5, 879, 1021],
            scaleX: 0.5,
            scaleY: 0.5
        });

        viewTop.x = 135;
        viewTop.y = 414;

        viewBottom.x = 156;
        viewBottom.y = 719;

        this.addChild(background, viewTop, viewBottom);
    }


}