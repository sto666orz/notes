import { Container, Bitmap, Graphics, Text } from 'hilojs'
import GameAssets from './GameAssets'

export default class ReadyScene extends Container {

    /** @type {Bitmap} 开始按钮 */
    buttonStart = null

    constructor(properties) {
        super(properties);
        this.init();
    }

    init() {
        const image = GameAssets.query('ready_image');
        // 透明背景层
        let background = new Graphics({
            alpha: 0.7
        });
        background.beginFill('#000000');
        background.drawRect(0, 0, this.width, this.height);
        background.endFill();

        let lanzi = new Bitmap({
            image: image,
            x: 111 + 312,
            y: 386 + 190,
            rect: [1199, 12, 311, 270],
            scaleX: 0.6,
            scaleY: 0.6
        });

        let help1 = new Bitmap({
            image: image,
            x: 111,
            y: 386,
            rect: [12, 345, 1050, 156],
            scaleX: 0.5,
            scaleY: 0.5
        });

        let help2 = new Bitmap({
            image: image,
            x: 229,
            y: 519,
            rect: [1086, 345, 589, 239],
            scaleX: 0.5,
            scaleY: 0.5
        });

        let help3 = new Bitmap({
            image: image,
            x: 146,
            y: 1032,
            rect: [12, 525, 911, 139],
            scaleX: 0.5,
            scaleY: 0.5
        });

        let help4 = new Bitmap({
            image: image,
            x: 84,
            y: 1140,
            rect: [12, 12, 1163, 309],
            scaleX: 0.5,
            scaleY: 0.5
        });

        

        let buttonStart = this.buttonStart = new Bitmap({
            image: image,
            rect: [1534, 12, 264, 264],
            scaleX: 0.5,
            scaleY: 0.5
        });

        buttonStart.x = 309;
        buttonStart.y = 783;

        this.addChild(background, lanzi, help1, help2, help3, help4, buttonStart);
    }

}