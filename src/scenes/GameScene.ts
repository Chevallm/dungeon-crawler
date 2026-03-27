import Phaser from 'phaser'
import { TILESET_TILES, type RoomData, getRoomAt, getVisitedRooms } from '../maps'

import tilesImg from '../assets/Dungeon Gathering Free Version/Set 1.png'
import playerIdleImg from '../assets/DG Knight Expansion Pack Free Ver/Blue Knight idle Sprite-sheet 16x16.png'
import playerRunImg from '../assets/DG Knight Expansion Pack Free Ver/Blue Knight run Sprite-sheet 16x17.png'

import torchTopImg from '../assets/Dungeon Gathering Free Version/Torch Yellow.png'
import torchLeftImg from '../assets/Dungeon Gathering Free Version/Torch Yellow L.png'
import torchRightImg from '../assets/Dungeon Gathering Free Version/Torch Yellow R.png'
import waterImg from '../assets/Dungeon Gathering Free Version/Water.png'
import puddleWaterImg from '../assets/Dungeon Gathering Free Version/Set 4.5.png'

export class GameScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };
    private playerObj!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private currentDirection: 'down' | 'right' | 'up' | 'left' = 'down';
    private worldCoords = { x: 0, y: 0 };
    private currentRoom!: RoomData;
    private wallLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private floorLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private puddleLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private torches: Phaser.GameObjects.Sprite[] = [];
    private waterFlows: Phaser.GameObjects.Sprite[] = [];
    private playerCollider: Phaser.Physics.Arcade.Collider | null = null;
    private isChangingRoom = false;
    private debugText!: Phaser.GameObjects.Text;
    private minimapGraphics!: Phaser.GameObjects.Graphics;
    private fullMapGraphics!: Phaser.GameObjects.Graphics;
    private mapKey!: Phaser.Input.Keyboard.Key;
    private isMapOpen = false;
    private mapOffset = { x: 0, y: 0 };
    private isDraggingMap = false;

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
        this.load.spritesheet('water', waterImg, {
            frameWidth: 16,
            frameHeight: 32
        });
        this.load.spritesheet('puddleWater', puddleWaterImg, {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        // 0. Configuration des contrôles (une seule fois)
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // 1. Animations (une seule fois)
        this.createAnimations();

        // 2. Charger la salle initiale (0,0)
        this.loadRoom(0, 0);

        // 3. Debug Overlay
        this.debugText = this.add.text(10, 10, '', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        }).setDepth(100).setScrollFactor(0);

        // 4. Minimap
        this.minimapGraphics = this.add.graphics().setDepth(100).setScrollFactor(0);
        this.drawMinimap();

        // 5. Full Map Graphics
        this.fullMapGraphics = this.add.graphics().setDepth(200).setScrollFactor(0).setVisible(false);
        this.mapKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        // 6. Gestion du Drag pour la carte
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isMapOpen && pointer.leftButtonDown()) {
                this.isDraggingMap = true;
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDraggingMap) {
                this.mapOffset.x += pointer.velocity.x;
                this.mapOffset.y += pointer.velocity.y;
                this.drawFullMap();
            }
        });

        this.input.on('pointerup', () => {
            this.isDraggingMap = false;
        });
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

        // Animation d'eau
        this.anims.create({
            key: 'water_flow_anim',
            frames: this.anims.generateFrameNumbers('water'),
            frameRate: 8,
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
        this.waterFlows.forEach(w => w.destroy());
        this.waterFlows = [];

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

            // 2. Couche de flaques/irrégularités
            this.puddleLayer = puddleMap.createLayer(0, tilesetPuddle, 0, 0);
            this.puddleLayer?.setScale(3);
            this.puddleLayer?.setDepth(1); // Entre le sol (0) et le joueur (10)
            this.puddleLayer?.setTint(0x99ccff);
            this.puddleLayer?.setAlpha(0.8);

            // 3. Ajouter les animations d'eau et les nouvelles flaques depuis les données de flaques
            const tileScale = 3;
            const tileSize = 16 * tileScale;
            const offset = tileSize / 2;

            puddleData.forEach((row, y) => {
                row.forEach((tile, x) => {
                    if (tile === TILESET_TILES.WATER_FLOW) {
                        const water = this.add.sprite(x * tileSize + (offset), y * tileSize + (offset) + 22, 'water');
                        water.setScale(tileScale, 2);
                        water.setDepth(3); // Même depth que puddleLayer
                        water.play('water_flow_anim');
                        this.waterFlows.push(water);
                        
                        // On efface la tuile virtuelle du layer
                        this.puddleLayer?.removeTileAt(x, y);
                    } else if (tile > -1) {
                        // Nouvelles flaques d'eau (Set 4.5.png)
                        const puddle = this.add.sprite(x * tileSize + offset, y * tileSize + offset, 'puddleWater', tile);
                        puddle.setScale(tileScale);
                        puddle.setDepth(1.5);
                        this.waterFlows.push(puddle); // Réutilisation du tableau pour le nettoyage
                        
                        this.puddleLayer?.removeTileAt(x, y);
                    }
                });
            });
            
            // 4. Couche de murs
            this.wallLayer = wallMap.createLayer(0, tilesetWall, 0, 0);
            this.wallLayer?.setScale(3);
            this.wallLayer?.setDepth(2);

            // Activer les collisions pour les tuiles de mur
            this.wallLayer?.setCollisionByExclusion([-1]);

            // 4. Ajouter les torches depuis les données de la salle
            const torchTileScale = 3;
            const torchTileSize = 16 * torchTileScale;
            const torchOffset = torchTileSize / 2;

            torchData.forEach((row, y) => {
                row.forEach((tile, x) => {
                    let torch: Phaser.GameObjects.Sprite | null = null;
                    
                    if (tile === TILESET_TILES.TORCH_TOP) {
                        torch = this.add.sprite(x * tileSize + offset, y * tileSize + torchOffset, 'torchTop');
                        torch.play('torch_top_anim');
                    } else if (tile === TILESET_TILES.TORCH_LEFT) {
                        torch = this.add.sprite(x * tileSize + tileSize + (tileSize / 2), y * tileSize + torchOffset, 'torchLeft');
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
            const worldWidth = 16 * 16 * 3;
            const worldHeight = 16 * 16 * 3;
            //const margin = 20;

            const defaultX = worldWidth / 2;
            const defaultY = worldHeight / 2;
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

            this.updateDebugInfo();
            this.drawMinimap();
            if (this.isMapOpen) {
                this.drawFullMap();
            }
        }
    }

    private drawFullMap() {
        if (!this.fullMapGraphics) return;
        this.fullMapGraphics.clear();

        const { width, height } = this.scale;
        
        // Fond sombre
        this.fullMapGraphics.fillStyle(0x000000, 0.50);
        this.fullMapGraphics.fillRect(0, 0, width, height);

        const visitedRooms = getVisitedRooms();
        const cellSize = 40;
        const gap = 10;
        const centerX = width / 2 + this.mapOffset.x;
        const centerY = height / 2 + this.mapOffset.y;

        visitedRooms.forEach((room, key) => {
            const [rx, ry] = key.split(',').map(Number);
            
            const relX = rx - this.worldCoords.x;
            const relY = ry - this.worldCoords.y;

            const x = centerX + relX * (cellSize + gap) - cellSize / 2;
            const y = centerY + relY * (cellSize + gap) - cellSize / 2;

            const isCurrent = relX === 0 && relY === 0;
            
            this.fullMapGraphics.fillStyle(isCurrent ? 0xffffff : 0x888888, 1);
            this.fullMapGraphics.fillRect(x, y, cellSize, cellSize);

            // Contours noirs
            this.fullMapGraphics.lineStyle(4, 0x000000, 1);
            this.fullMapGraphics.strokeRect(x, y, cellSize, cellSize);

            // Dessiner les sorties
            this.fullMapGraphics.lineStyle(4, 0x00ff00, 1);
            if (room.exits.top) {
                this.fullMapGraphics.lineBetween(x + cellSize/4, y, x + 3*cellSize/4, y);
            }
            if (room.exits.bottom) {
                this.fullMapGraphics.lineBetween(x + cellSize/4, y + cellSize, x + 3*cellSize/4, y + cellSize);
            }
            if (room.exits.left) {
                this.fullMapGraphics.lineBetween(x, y + cellSize/4, x, y + 3*cellSize/4);
            }
            if (room.exits.right) {
                this.fullMapGraphics.lineBetween(x + cellSize, y + cellSize/4, x + cellSize, y + 3*cellSize/4);
            }
        });
    }

    private toggleMap() {
        this.isMapOpen = !this.isMapOpen;
        this.fullMapGraphics.setVisible(this.isMapOpen);
        
        if (this.isMapOpen) {
            this.mapOffset = { x: 0, y: 0 }; // Réinitialiser le centrage sur le joueur
            this.drawFullMap();
            this.minimapGraphics.setVisible(false);
            this.debugText.setVisible(false);
        } else {
            this.isDraggingMap = false;
            this.minimapGraphics.setVisible(true);
            this.debugText.setVisible(true);
            this.drawMinimap();
        }
    }

    private updateDebugInfo() {
        if (!this.debugText) return;
        const exitsStr = [
            this.currentRoom.exits.top ? 'N' : '',
            this.currentRoom.exits.bottom ? 'S' : '',
            this.currentRoom.exits.left ? 'O' : '',
            this.currentRoom.exits.right ? 'E' : ''
        ].join('');
        this.debugText.setText(`Pos: ${this.worldCoords.x}, ${this.worldCoords.y}\nType: ${this.currentRoom.name}\nExits: ${exitsStr}`);
    }

    private drawMinimap() {
        if (!this.minimapGraphics) return;
        this.minimapGraphics.clear();

        const padding = 10;
        const size = 150;
        const { width } = this.scale;

        // Fond
        this.minimapGraphics.fillStyle(0x000000, 0.5);
        this.minimapGraphics.fillRect(width - size - padding, padding, size, size);

        const visitedRooms = getVisitedRooms();
        const cellSize = 15;
        const gap = 4;
        const centerX = width - size / 2 - padding;
        const centerY = size / 2 + padding;

        visitedRooms.forEach((room, key) => {
            const [rx, ry] = key.split(',').map(Number);
            
            const relX = rx - this.worldCoords.x;
            const relY = ry - this.worldCoords.y;

            const x = centerX + relX * (cellSize + gap) - cellSize / 2;
            const y = centerY + relY * (cellSize + gap) - cellSize / 2;

            // Ne dessiner que si c'est dans le carré de la minimap
            if (x > width - size - padding && x < width - padding - cellSize &&
                y > padding && y < padding + size - cellSize) {
                
                const isCurrent = relX === 0 && relY === 0;
                
                this.minimapGraphics.fillStyle(isCurrent ? 0xffffff : 0x888888, 1);
                this.minimapGraphics.fillRect(x, y, cellSize, cellSize);

                // Contours noirs
                this.minimapGraphics.lineStyle(1, 0x000000, 1);
                this.minimapGraphics.strokeRect(x, y, cellSize, cellSize);

                // Dessiner les sorties
                this.minimapGraphics.lineStyle(2, 0x00ff00, 1);
                if (room.exits.top) {
                    this.minimapGraphics.lineBetween(x + cellSize/4, y, x + 3*cellSize/4, y);
                }
                if (room.exits.bottom) {
                    this.minimapGraphics.lineBetween(x + cellSize/4, y + cellSize, x + 3*cellSize/4, y + cellSize);
                }
                if (room.exits.left) {
                    this.minimapGraphics.lineBetween(x, y + cellSize/4, x, y + 3*cellSize/4);
                }
                if (room.exits.right) {
                    this.minimapGraphics.lineBetween(x + cellSize, y + cellSize/4, x + cellSize, y + 3*cellSize/4);
                }
            }
        });
    }

    update() {
        if (!this.playerObj || !this.cursors) {
            return;
        };

        if (Phaser.Input.Keyboard.JustDown(this.mapKey)) {
            this.toggleMap();
        }

        const speed = 350;
        let vx = 0;
        let vy = 0;

        let isMoving = false;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            vx = -1;
            this.currentDirection = 'left';
            isMoving = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            vx = 1;
            this.currentDirection = 'right';
            isMoving = true;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            vy = -1;
            this.currentDirection = 'up';
            isMoving = true;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
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
            const spawnY = worldHeight - margin - 5;
            this.loadRoom(this.worldCoords.x, this.worldCoords.y - 1, { x: spawnX, y: spawnY });
        }
        // Sortie Bas
        else if (this.playerObj.y > worldHeight - margin) {
            const spawnX = this.playerObj.x;
            const spawnY = margin + 5;
            this.loadRoom(this.worldCoords.x, this.worldCoords.y + 1, { x: spawnX, y: spawnY });
        }
        // Sortie Gauche
        else if (this.playerObj.x < margin) {
            const spawnX = worldWidth - margin - 5;
            const spawnY = this.playerObj.y;
            this.loadRoom(this.worldCoords.x - 1, this.worldCoords.y, { x: spawnX, y: spawnY });
        }
        // Sortie Droite
        else if (this.playerObj.x > worldWidth - margin) {
            const spawnX = margin + 5;
            const spawnY = this.playerObj.y;
            this.loadRoom(this.worldCoords.x + 1, this.worldCoords.y, { x: spawnX, y: spawnY });
        }

        this.updateDebugInfo();
    }
}