import {Scene} from "phaser";

import tilesImg from './assets/Dungeon Gathering Free Version/Set 1.png'

import playerIdleImg from './assets/DG Knight Expansion Pack Free Ver/Blue Knight idle Sprite-sheet 16x16.png'
import playerRunImg from './assets/DG Knight Expansion Pack Free Ver/Blue Knight run Sprite-sheet 16x17.png'

import torchTopImg from './assets/Dungeon Gathering Free Version/Torch Yellow.png'
import torchLeftImg from './assets/Dungeon Gathering Free Version/Torch Yellow L.png'
import torchRightImg from './assets/Dungeon Gathering Free Version/Torch Yellow R.png'


export class GameScene extends Scene {

    private readonly cursors = this.input.keyboard!.createCursorKeys();
    private playerObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private playerDirection: 'down' | 'right' | 'left' | 'up' = 'down';
    private coordinates = { x: 0, y: 0 };

    private layers = {
        walls: null,
        floor: null,
        puddle: null,
    };

    constructor() {
        super('GameScene');
    }

    preload() {
        // Tileset
        this.load.image('tiles', tilesImg);
        // Joueur (Blue Knight)
        this.load.spritesheet('playerIdle', playerIdleImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('playerRun', playerRunImg, {
            frameWidth: 16,
            frameHeight: 17
        });
        this.load.spritesheet('torchTop', torchTopImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('torchLeft', torchLeftImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('torchRight', torchRightImg, {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {

    }

    update() {

    }

}