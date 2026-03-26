import Phaser from 'phaser'
import { TILESET_TILES, type RoomData, getRoomAt } from '../maps'

import tilesImg from '../assets/Dungeon Gathering Free Version/Set 1.png'
import playerIdleImg from '../assets/DG Knight Expansion Pack Free Ver/Blue Knight idle Sprite-sheet 16x16.png'
import playerRunImg from '../assets/DG Knight Expansion Pack Free Ver/Blue Knight run Sprite-sheet 16x17.png'

import torchTopImg from '../assets/Dungeon Gathering Free Version/Torch Yellow.png'
import torchLeftImg from '../assets/Dungeon Gathering Free Version/Torch Yellow L.png'
import torchRightImg from '../assets/Dungeon Gathering Free Version/Torch Yellow R.png'

export class GameScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerObj!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private currentDirection: 'down' | 'right' | 'up' | 'left' = 'down';
    private worldCoords = { x: 0, y: 0 };
    private currentRoom!: RoomData;
    private wallLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private floorLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private puddleLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private torches: Phaser.GameObjects.Sprite[] = [];
    private playerCollider: Phaser.Physics.Arcade.Collider | null = null;
    private isChangingRoom = false;

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
        // 0. Configuration des contrôles (une seule fois)
        this.cursors = this.input.keyboard!.createCursorKeys();

        // 1. Animations (une seule fois)
        this.createAnimations();

        // 2. Charger la salle initiale (0,0)
        this.loadRoom(0, 0);
    }

    private createAnimations() {
        // Animations de repos (Idle)
        this.anims.create({
            key: 'idle-down',
            frames: this.anims.generateFrameNumbers('playerIdle', {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('playerIdle', {start: 8, end: 15}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-up',
            frames: this.anims.generateFrameNumbers('playerIdle', {start: 16, end: 23}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-left',
            frames: this.anims.generateFrameNumbers('playerIdle', {start: 24, end: 31}),
            frameRate: 8,
            repeat: -1
        });

        // Animations de course (Run)
        this.anims.create({
            key: 'run-down',
            frames: this.anims.generateFrameNumbers('playerRun', {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run-right',
            frames: this.anims.generateFrameNumbers('playerRun', {start: 8, end: 15}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run-up',
            frames: this.anims.generateFrameNumbers('playerRun', {start: 16, end: 23}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run-left',
            frames: this.anims.generateFrameNumbers('playerRun', {start: 24, end: 31}),
            frameRate: 8,
            repeat: -1
        });

        // Animations de torche
        this.anims.create({
            key: 'torch_top_anim',
            frames: this.anims.generateFrameNumbers('torchTop'),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'torch_left_anim',
            frames: this.anims.generateFrameNumbers('torchLeft'),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'torch_right_anim',
            frames: this.anims.generateFrameNumbers('torchRight'),
            frameRate: 10,
            repeat: -1
        });
    }

    private loadRoom(worldX: number, worldY: number, spawnAt: {x?: number, y?: number} = {}) {
        if (this.isChangingRoom) return;
        this.isChangingRoom = true;

        this.worldCoords = { x: worldX, y: worldY };
        this.currentRoom = getRoomAt(worldX, worldY);
        
        // Nettoyer l'ancienne salle
        if (this.playerCollider) {
            this.physics.world.removeCollider(this.playerCollider);
            this.playerCollider = null;
        }
        this.wallLayer?.destroy();
        this.floorLayer?.destroy();
        this.puddleLayer?.destroy();
        this.torches.forEach(t => t.destroy());
        this.torches = [];

        const floorData: number[][] = this.currentRoom.floors;
        const wallData: number[][] = this.currentRoom.walls;
        const puddleData: number[][] = this.currentRoom.puddles;
        const torchData: number[][] = this.currentRoom.torches;

        // Créer les tilemaps
        const floorMap = this.make.tilemap({data: floorData, tileWidth: 16, tileHeight: 16});
        const wallMap = this.make.tilemap({data: wallData, tileWidth: 16, tileHeight: 16});
        const puddleMap = this.make.tilemap({data: puddleData, tileWidth: 16, tileHeight: 16});

        const tilesetFloor = floorMap.addTilesetImage('myTileset', 'tiles');
        const tilesetWall = wallMap.addTilesetImage('myTileset', 'tiles');
        const tilesetPuddle = puddleMap.addTilesetImage('myTileset', 'tiles');

        if (tilesetFloor && tilesetWall && tilesetPuddle) {
            // 1. Couche de sol
            this.floorLayer = floorMap.createLayer(0, tilesetFloor, 0, 0);
            this.floorLayer?.setScale(3);

            // 2. Couche de flaques
            this.puddleLayer = puddleMap.createLayer(0, tilesetPuddle, 0, 0);
            this.puddleLayer?.setScale(3);
            this.puddleLayer?.setDepth(5); // Entre le sol (0) et le joueur (10)
            this.puddleLayer?.setTint(0x99ccff);
            this.puddleLayer?.setAlpha(0.8);
            
            // 3. Couche de murs
            this.wallLayer = wallMap.createLayer(0, tilesetWall, 0, 0);
            this.wallLayer?.setScale(3);

            // Activer les collisions pour les tuiles de mur
            this.wallLayer?.setCollisionByExclusion([-1]);

            // 4. Ajouter les torches depuis les données de la salle
            const tileScale = 3;
            const tileSize = 16 * tileScale;
            const offset = tileSize / 2;

            torchData.forEach((row, y) => {
                row.forEach((tile, x) => {
                    let torch: Phaser.GameObjects.Sprite | null = null;
                    
                    if (tile === TILESET_TILES.TORCH_TOP) {
                        torch = this.add.sprite(x * tileSize + offset, y * tileSize + offset, 'torchTop');
                        torch.play('torch_top_anim');
                    } else if (tile === TILESET_TILES.TORCH_LEFT) {
                        torch = this.add.sprite(x * tileSize + tileSize + (tileSize / 2), y * tileSize + offset, 'torchLeft');
                        torch.play('torch_left_anim');
                    } else if (tile === TILESET_TILES.TORCH_RIGHT) {
                        torch = this.add.sprite(x * tileSize - (tileSize / 2), y * tileSize + offset, 'torchRight');
                        torch.play('torch_right_anim');
                    }

                    if (torch) {
                        torch.setScale(tileScale);
                        torch.setDepth(9); // Torches au-dessus du joueur et des murs
                        this.torches.push(torch);
                    }
                });
            });

            // 5. Gérer le joueur
            const defaultX = (16 * 16 * 3) / 2;
            const defaultY = (16 * 16 * 3) / 2;
            const posX = spawnAt.x ?? defaultX;
            const posY = spawnAt.y ?? defaultY;

            if (!this.playerObj) {
                this.playerObj = this.physics.add.sprite(posX, posY, 'playerIdle');
                this.playerObj.setScale(3);
                this.playerObj.play('idle-down');
                this.playerObj.body.setSize(12, 10);
                this.playerObj.body.setOffset(2, 6);
                this.playerObj.setDepth(10); // S'assurer que le joueur est au-dessus du sol/murs
            } else {
                this.playerObj.setPosition(posX, posY);
                this.playerObj.setDepth(10); // Remonter le joueur au-dessus des nouveaux layers
            }

            // Collision entre le joueur et les murs
            this.playerCollider = this.physics.add.collider(this.playerObj, this.wallLayer!);

            // On libère le flag après un court délai pour éviter les doubles chargements
            this.time.delayedCall(100, () => {
                this.isChangingRoom = false;
            });
        }
    }

    update() {
        if (!this.playerObj || !this.cursors) {
            return;
        };

        const speed = 150;
        let vx = 0;
        let vy = 0;

        let isMoving = false;

        if (this.cursors.left.isDown) {
            vx = -1;
            this.currentDirection = 'left';
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            vx = 1;
            this.currentDirection = 'right';
            isMoving = true;
        }

        if (this.cursors.up.isDown) {
            vy = -1;
            this.currentDirection = 'up';
            isMoving = true;
        } else if (this.cursors.down.isDown) {
            vy = 1;
            this.currentDirection = 'down';
            isMoving = true;
        }

        if (isMoving) {
            // Normalisation du vecteur de direction
            const vector = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
            this.playerObj.setVelocity(vector.x, vector.y);
            this.playerObj.play(`run-${this.currentDirection}`, true);
        } else {
            this.playerObj.setVelocity(0, 0);
            this.playerObj.play(`idle-${this.currentDirection}`, true);
        }

        // --- Gestion des transitions entre salles ---
        const worldWidth = 16 * 16 * 3;
        const worldHeight = 16 * 16 * 3;
        const margin = 20;

        // Sortie Haut
        if (this.playerObj.y < margin) {
            const spawnX = this.playerObj.x;
            const spawnY = worldHeight - margin - 30;
            this.loadRoom(this.worldCoords.x, this.worldCoords.y + 1, { x: spawnX, y: spawnY });
        }
        // Sortie Bas
        else if (this.playerObj.y > worldHeight - margin) {
            const spawnX = this.playerObj.x;
            const spawnY = margin + 30;
            this.loadRoom(this.worldCoords.x, this.worldCoords.y - 1, { x: spawnX, y: spawnY });
        }
        // Sortie Gauche
        else if (this.playerObj.x < margin) {
            const spawnX = worldWidth - margin - 30;
            const spawnY = this.playerObj.y;
            this.loadRoom(this.worldCoords.x - 1, this.worldCoords.y, { x: spawnX, y: spawnY });
        }
        // Sortie Droite
        else if (this.playerObj.x > worldWidth - margin) {
            const spawnX = margin + 30;
            const spawnY = this.playerObj.y;
            this.loadRoom(this.worldCoords.x + 1, this.worldCoords.y, { x: spawnX, y: spawnY });
        }
    }
}