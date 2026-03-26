import Phaser from 'phaser'
import './style.css'
import { GameScene } from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'app',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 800
    },
    render: {
        pixelArt: true,
        antialias: false,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
            debug: false,
            fixedStep: true
        }
    },
    scene: GameScene
};

new Phaser.Game(config);
