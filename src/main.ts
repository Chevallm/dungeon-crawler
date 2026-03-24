import Phaser from 'phaser'
import './style.css'
import { TILESET_TILES, type RoomData, getRoomAt } from './maps'

import tilesImg from './assets/Dungeon Gathering Free Version/Set 1.png'

import playerIdleImg from './assets/DG Knight Expansion Pack Free Ver/Blue Knight idle Sprite-sheet 16x16.png'
import playerRunImg from './assets/DG Knight Expansion Pack Free Ver/Blue Knight run Sprite-sheet 16x17.png'

import torchTopImg from './assets/Dungeon Gathering Free Version/Torch Yellow.png'
import torchLeftImg from './assets/Dungeon Gathering Free Version/Torch Yellow L.png'
import torchRightImg from './assets/Dungeon Gathering Free Version/Torch Yellow R.png'

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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload(this: Phaser.Scene) {
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

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let playerObj: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
let currentDirection: 'down' | 'right' | 'up' | 'left' = 'down';
let worldCoords = { x: 0, y: 0 };
let currentRoom: RoomData;
let wallLayer: Phaser.Tilemaps.TilemapLayer | null = null;
let floorLayer: Phaser.Tilemaps.TilemapLayer | null = null;
let puddleLayer: Phaser.Tilemaps.TilemapLayer | null = null;
let torches: Phaser.GameObjects.Sprite[] = [];
let playerCollider: Phaser.Physics.Arcade.Collider | null = null;
let isChangingRoom = false;


function create(this: Phaser.Scene) {
    // 0. Configuration des contrôles (une seule fois)
    cursors = this.input.keyboard!.createCursorKeys();

    // 1. Animations (une seule fois)
    createAnimations(this);

    // 2. Charger la salle initiale (0,0)
    loadRoom.call(this, 0, 0);
}

function createAnimations(scene: Phaser.Scene) {
    // Animations de repos (Idle)
    scene.anims.create({
        key: 'idle-down',
        frames: scene.anims.generateFrameNumbers('playerIdle', {start: 0, end: 7}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'idle-right',
        frames: scene.anims.generateFrameNumbers('playerIdle', {start: 8, end: 15}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'idle-up',
        frames: scene.anims.generateFrameNumbers('playerIdle', {start: 16, end: 23}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'idle-left',
        frames: scene.anims.generateFrameNumbers('playerIdle', {start: 24, end: 31}),
        frameRate: 8,
        repeat: -1
    });

    // Animations de course (Run)
    scene.anims.create({
        key: 'run-down',
        frames: scene.anims.generateFrameNumbers('playerRun', {start: 0, end: 7}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'run-right',
        frames: scene.anims.generateFrameNumbers('playerRun', {start: 8, end: 15}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'run-up',
        frames: scene.anims.generateFrameNumbers('playerRun', {start: 16, end: 23}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'run-left',
        frames: scene.anims.generateFrameNumbers('playerRun', {start: 24, end: 31}),
        frameRate: 8,
        repeat: -1
    });

    // Animations de torche
    scene.anims.create({
        key: 'torch_top_anim',
        frames: scene.anims.generateFrameNumbers('torchTop'),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'torch_left_anim',
        frames: scene.anims.generateFrameNumbers('torchLeft'),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'torch_right_anim',
        frames: scene.anims.generateFrameNumbers('torchRight'),
        frameRate: 10,
        repeat: -1
    });
}

function loadRoom(this: Phaser.Scene, worldX: number, worldY: number, spawnAt: {x?: number, y?: number} = {}) {
    if (isChangingRoom) return;
    isChangingRoom = true;

    worldCoords = { x: worldX, y: worldY };
    currentRoom = getRoomAt(worldX, worldY);
    
    // Nettoyer l'ancienne salle
    if (playerCollider) {
        this.physics.world.removeCollider(playerCollider);
        playerCollider = null;
    }
    wallLayer?.destroy();
    floorLayer?.destroy();
    puddleLayer?.destroy();
    torches.forEach(t => t.destroy());
    torches = [];

    const floorData: number[][] = currentRoom.floors;
    const wallData: number[][] = currentRoom.walls;
    const puddleData: number[][] = currentRoom.puddles;

    // Créer les tilemaps
    const floorMap = this.make.tilemap({data: floorData, tileWidth: 16, tileHeight: 16});
    const wallMap = this.make.tilemap({data: wallData, tileWidth: 16, tileHeight: 16});
    const puddleMap = this.make.tilemap({data: puddleData, tileWidth: 16, tileHeight: 16});

    const tilesetFloor = floorMap.addTilesetImage('myTileset', 'tiles');
    const tilesetWall = wallMap.addTilesetImage('myTileset', 'tiles');
    const tilesetPuddle = puddleMap.addTilesetImage('myTileset', 'tiles');

    if (tilesetFloor && tilesetWall && tilesetPuddle) {
        // 1. Couche de sol
        floorLayer = floorMap.createLayer(0, tilesetFloor, 0, 0);
        floorLayer?.setScale(3);

        // 2. Couche de flaques
        puddleLayer = puddleMap.createLayer(0, tilesetPuddle, 0, 0);
        puddleLayer?.setScale(3);
        puddleLayer?.setDepth(5); // Entre le sol (0) et le joueur (10)
        puddleLayer?.setTint(0x99ccff);
        puddleLayer?.setAlpha(0.8);
        
        // 3. Couche de murs
        wallLayer = wallMap.createLayer(0, tilesetWall, 0, 0);
        wallLayer?.setScale(3);

        // Activer les collisions pour les tuiles de mur
        wallLayer?.setCollisionByExclusion([-1]);

        // 4. Ajouter les torches automatiquement sur les murs
        const tileScale = 3;
        const tileSize = 16 * tileScale;
        const offset = tileSize / 2;

        wallData.forEach((row, y) => {
            row.forEach((tile, x) => {
                let torch: Phaser.GameObjects.Sprite | null = null;
                
                if (tile === TILESET_TILES.WALL_TOP && x % 4 === 0) {
                    torch = this.add.sprite(x * tileSize + offset, y * tileSize + offset, 'torchTop');
                    torch.play('torch_top_anim');
                } else if (tile === TILESET_TILES.WALL_LEFT && y % 5 === 2) {
                    torch = this.add.sprite(x * tileSize + tileSize + (tileSize / 2), y * tileSize + offset, 'torchLeft');
                    torch.play('torch_left_anim');
                } else if (tile === TILESET_TILES.WALL_RIGHT && y % 5 === 2) {
                    torch = this.add.sprite(x * tileSize - (tileSize / 2), y * tileSize + offset, 'torchRight');
                    torch.play('torch_right_anim');
                }

                if (torch) {
                    torch.setScale(tileScale);
                    torch.setDepth(9); // Torches au-dessus du joueur et des murs
                    torches.push(torch);
                    this.tweens.add({
                        targets: torch,
                        repeat: -1,
                    });
                }
            });
        });

        // 5. Gérer le joueur
        const defaultX = (16 * 16 * 3) / 2;
        const defaultY = (16 * 16 * 3) / 2;
        const posX = spawnAt.x ?? defaultX;
        const posY = spawnAt.y ?? defaultY;

        if (!playerObj) {
            playerObj = this.physics.add.sprite(posX, posY, 'playerIdle');
            playerObj.setScale(3);
            playerObj.play('idle-down');
            playerObj.body.setSize(12, 10);
            playerObj.body.setOffset(2, 6);
            playerObj.setDepth(10); // S'assurer que le joueur est au-dessus du sol/murs
        } else {
            playerObj.setPosition(posX, posY);
            playerObj.setDepth(10); // Remonter le joueur au-dessus des nouveaux layers
        }

        // Collision entre le joueur et les murs
        playerCollider = this.physics.add.collider(playerObj, wallLayer!);

        // On libère le flag après un court délai pour éviter les doubles chargements
        this.time.delayedCall(100, () => {
            isChangingRoom = false;
        });
    }
}

function update(this: Phaser.Scene) {
    if (!playerObj || !cursors) {
        return;
    };

    const speed = 150;
    let vx = 0;
    let vy = 0;

    let isMoving = false;

    if (cursors.left.isDown) {
        vx = -1;
        currentDirection = 'left';
        isMoving = true;
    } else if (cursors.right.isDown) {
        vx = 1;
        currentDirection = 'right';
        isMoving = true;
    }

    if (cursors.up.isDown) {
        vy = -1;
        currentDirection = 'up';
        isMoving = true;
    } else if (cursors.down.isDown) {
        vy = 1;
        currentDirection = 'down';
        isMoving = true;
    }

    if (isMoving) {
        // Normalisation du vecteur de direction
        const vector = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
        playerObj.setVelocity(vector.x, vector.y);
        playerObj.play(`run-${currentDirection}`, true);
    } else {
        playerObj.setVelocity(0, 0);
        playerObj.play(`idle-${currentDirection}`, true);
    }

    // --- Gestion des transitions entre salles ---
    const worldWidth = 16 * 16 * 3;
    const worldHeight = 16 * 16 * 3;
    const margin = 20;

    // Sortie Haut
    if (playerObj.y < margin) {
        const spawnX = playerObj.x;
        const spawnY = worldHeight - margin - 30;
        loadRoom.call(this, worldCoords.x, worldCoords.y + 1, { x: spawnX, y: spawnY });
    }
    // Sortie Bas
    else if (playerObj.y > worldHeight - margin) {
        const spawnX = playerObj.x;
        const spawnY = margin + 30;
        loadRoom.call(this, worldCoords.x, worldCoords.y - 1, { x: spawnX, y: spawnY });
    }
    // Sortie Gauche
    else if (playerObj.x < margin) {
        const spawnX = worldWidth - margin - 30;
        const spawnY = playerObj.y;
        loadRoom.call(this, worldCoords.x - 1, worldCoords.y, { x: spawnX, y: spawnY });
    }
    // Sortie Droite
    else if (playerObj.x > worldWidth - margin) {
        const spawnX = margin + 30;
        const spawnY = playerObj.y;
        loadRoom.call(this, worldCoords.x + 1, worldCoords.y, { x: spawnX, y: spawnY });
    }
}
