export const TILESET_TILES = {
    WALL_TOP_LEFT: 28 * 8 + 15,
    WALL_TOP: 28 * 9 + 6,
    WALL_TOP_RIGHT: 28 * 9 + 9,
    WALL_LEFT: 28 * 8 + 7,
    WALL_RIGHT: 28 * 8 + 5,
    WALL_BOTTOM_LEFT: 28 * 8 + 10,
    WALL_BOTTOM: 28 * 7 + 6,
    WALL_BOTTOM_RIGHT: 28 * 8 + 9,
    WALL_INNER_TOP_LEFT: 28 * 7 + 5,
    WALL_INNER_TOP: 28 * 7 + 6,
    WALL_INNER_LEFT: 28 * 8 + 5,
    WALL_INNER_BOTTOM_LEFT: 28 * 9 + 5,
    WALL_INNER_BOTTOM: 28 * 9 + 6,
    WALL_INNER_BOTTOM_RIGHT: 28 * 9 + 7,
    WALL_INNER_RIGHT: 28 * 8 + 7,
    WALL_INNER_TOP_RIGHT: 28 * 7 + 7,
    FLOOR: 28 * 13 + 8,
    FLOOR_CRACKED_1: 28 * 13 + 8,
    FLOOR_CRACKED_2: 28 * 13 + 9,
    FLOOR_CRACKED_3: 28 * 13 + 10,
    VOID: 28 * 8 + 6,
    FLOOR_TOP: 28 + 2,
    FLOOR_LEFT: 28 * 2 + 2,
    FLOOR_RIGHT: 28 * 3 + 2,
    FLOOR_BOTTOM: 28 * 4 + 2,
    FLAQUE_1: 28 * 12 + 11,
    FLAQUE_2: 28 * 12 + 12,
    FLAQUE_3: 28 * 13 + 11,
    FLAQUE_4: 28 * 13 + 12,
}

// Nouvelle carte "cool" avec deux salles et des piliers
const WTL = TILESET_TILES.WALL_TOP_LEFT;
const WT  = TILESET_TILES.WALL_TOP;
const WTR = TILESET_TILES.WALL_TOP_RIGHT;
const WL  = TILESET_TILES.WALL_LEFT;
const WR  = TILESET_TILES.WALL_RIGHT;
const WBL = TILESET_TILES.WALL_BOTTOM_LEFT;
const WB  = TILESET_TILES.WALL_BOTTOM;
const WBR = TILESET_TILES.WALL_BOTTOM_RIGHT;
const ITL = TILESET_TILES.WALL_INNER_TOP_LEFT;
const IT  = TILESET_TILES.WALL_INNER_TOP;
const ITR = TILESET_TILES.WALL_INNER_TOP_RIGHT;
const IL  = TILESET_TILES.WALL_INNER_LEFT;
const IR  = TILESET_TILES.WALL_INNER_RIGHT;
const IBL = TILESET_TILES.WALL_INNER_BOTTOM_LEFT;
const IB  = TILESET_TILES.WALL_INNER_BOTTOM;
const IBR = TILESET_TILES.WALL_INNER_BOTTOM_RIGHT;
const V   = TILESET_TILES.VOID;
const FT = TILESET_TILES.FLOOR_TOP;
const FL = TILESET_TILES.FLOOR_LEFT;
const FR = TILESET_TILES.FLOOR_RIGHT;
const FB = TILESET_TILES.FLOOR_BOTTOM;
const F   = TILESET_TILES.FLOOR;
const FC1 = TILESET_TILES.FLOOR_CRACKED_1;
const FC2 = TILESET_TILES.FLOOR_CRACKED_2;
const FC3 = TILESET_TILES.FLOOR_CRACKED_3;
const F1 = TILESET_TILES.FLAQUE_1;
const F2 = TILESET_TILES.FLAQUE_2;
const F3 = TILESET_TILES.FLAQUE_3;
const F4 = TILESET_TILES.FLAQUE_4;
const _   = -1;

export interface RoomData {
    walls: number[][];
    floors: number[][];
    puddles: number[][];
    name: string;
    exits: {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };
}

export const ROOMS: Record<string, RoomData> = {
    EMPTY_ROOM: {
        name: "Grande Salle Vide",
        exits: { top: true, bottom: true, left: true, right: true },
        walls: [
            [WTL, WT, WT, WT, WT, WT, IBR, _,  _,  IBL, WT, WT, WT, WT, WT, WTR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [IBR,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, IBL],
            [_,   _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, _],
            [_,   _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, _],
            [ITR,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, ITL],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WBL, WB, WB, WB, WB, WB, ITR, _,  _,  ITL, WB, WB, WB, WB, WB, WBR]
        ],
        floors: [
            [F, F, F, F, F, F, F, FT, FT, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [FL, F, F, F, F, F, F, F, F, F, F, F, F, F, F, FR],
            [FL, F, F, F, F, F, F, F, F, F, F, F, F, F, F, FR],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, FB, FB, F, F, F, F, F, F, F]
        ],
        puddles: Array(16).fill(null).map(() => Array(16).fill(_))
    },
    // Modèle simple pour toute autre configuration manquante (on ferme les murs selon besoin)
    GENERIC_ROOM: {
        name: "Petite Salle Adaptative",
        exits: { top: false, bottom: false, left: false, right: false }, // Sera surchargé ou utilisé comme fallback
        walls: [
            [WTL, WT, WT, WT, WT, WT, WT,  _, _, WT, WT, WT, WT, WT, WT, WTR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _, ITL, IT, IT, IT, IT, IT, IT, IT, IT, ITR,  _,  _, WR],
            [WL,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, WR],
            [WL,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, WR],
            [WL,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, WR],
            [ _,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, _],
            [ _,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, _],
            [WL,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, WR],
            [WL,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, WR],
            [WL,  _,  _, IL,  _,  _,  _,  _,  _,  _,  _,  _,  IR,  _,  _, WR],
            [WL,  _,  _, IBL, IB, IB, IB, _,  _, IB, IB, IB, IBR,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WBL, WB, WB, WB, WB, WB, WB, _,  _, WB, WB, WB, WB, WB, WB, WBR]
        ],
        floors: [
            [F, F, F, F, F, F, F, FT, FT, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [FL, F, F, F, F, F, F, F, F, F, F, F, F, F, F, FR],
            [FL, F, F, F, F, F, F, F, F, F, F, F, F, F, F, FR],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, FB, FB, F, F, F, F, F, F, F]
        ],
        puddles: Array(16).fill(null).map(() => Array(16).fill(_))
    }
};

// Gestion de la carte du monde par coordonnées
const worldMap = new Map<string, RoomData>();

export function getRoomAt(x: number, y: number): RoomData {
    const key = `${x},${y}`;
    if (worldMap.has(key)) {
        return worldMap.get(key)!;
    }

    // Salle d'origine (0,0) est toujours une EMPTY_ROOM (4 sorties)
    if (x === 0 && y === 0) {
        const firstRoom = JSON.parse(JSON.stringify(ROOMS.EMPTY_ROOM)) as RoomData;
        randomizeFloor(firstRoom);
        randomizePuddles(firstRoom);
        worldMap.set(key, firstRoom);
        return firstRoom;
    }

    // Analyser les contraintes imposées par les voisins
    // Si un voisin a une sortie vers cette salle, nous DEVONS avoir une entrée correspondante.
    // Si un voisin N'A PAS de sortie vers cette salle, nous NE DEVONS PAS avoir une entrée correspondante.
    // Si le voisin n'est pas encore généré, c'est libre (mais influencera le futur).

    const constraints: {
        top?: boolean;
        bottom?: boolean;
        left?: boolean;
        right?: boolean;
    } = {};

    const neighborTop = worldMap.get(`${x},${y - 1}`);
    const neighborBottom = worldMap.get(`${x},${y + 1}`);
    const neighborLeft = worldMap.get(`${x - 1},${y}`);
    const neighborRight = worldMap.get(`${x + 1},${y}`);

    if (neighborTop) constraints.top = neighborTop.exits.bottom;
    if (neighborBottom) constraints.bottom = neighborBottom.exits.top;
    if (neighborLeft) constraints.left = neighborLeft.exits.right;
    if (neighborRight) constraints.right = neighborRight.exits.left;

    // Filtrer les salles qui respectent les contraintes
    let possibleRooms = Object.values(ROOMS).filter(room => {
        if (constraints.top !== undefined && room.exits.top !== constraints.top) return false;
        if (constraints.bottom !== undefined && room.exits.bottom !== constraints.bottom) return false;
        if (constraints.left !== undefined && room.exits.left !== constraints.left) return false;
        if (constraints.right !== undefined && room.exits.right !== constraints.right) return false;
        return true;
    });

    // Si aucune salle ne correspond exactement, on en crée une à la volée basée sur GENERIC_ROOM
    if (possibleRooms.length === 0) {
        console.warn(`Generating dynamic room for constraints at ${x},${y}`, constraints);
        const dynamicRoom = JSON.parse(JSON.stringify(ROOMS.GENERIC_ROOM)) as RoomData;
        dynamicRoom.exits = {
            top: !!constraints.top,
            bottom: !!constraints.bottom,
            left: !!constraints.left,
            right: !!constraints.right
        };
        // Ouvrir les murs et mettre les flèches au sol
        if (dynamicRoom.exits.top) { 
            dynamicRoom.walls[0][7] = _; dynamicRoom.walls[0][8] = _;
            dynamicRoom.floors[0][7] = FT; dynamicRoom.floors[0][8] = FT;
        } else {
            dynamicRoom.floors[0][7] = F; dynamicRoom.floors[0][8] = F;
        }
        if (dynamicRoom.exits.bottom) { 
            dynamicRoom.walls[15][7] = _; dynamicRoom.walls[15][8] = _;
            dynamicRoom.floors[15][7] = FB; dynamicRoom.floors[15][8] = FB;
        } else {
            dynamicRoom.floors[15][7] = F; dynamicRoom.floors[15][8] = F;
        }
        if (dynamicRoom.exits.left) { 
            dynamicRoom.walls[7][0] = _; dynamicRoom.walls[8][0] = _;
            dynamicRoom.floors[7][0] = FL; dynamicRoom.floors[8][0] = FL;
        } else {
            dynamicRoom.floors[7][0] = F; dynamicRoom.floors[8][0] = F;
        }
        if (dynamicRoom.exits.right) { 
            dynamicRoom.walls[7][15] = _; dynamicRoom.walls[8][15] = _;
            dynamicRoom.floors[7][15] = FR; dynamicRoom.floors[8][15] = FR;
        } else {
            dynamicRoom.floors[7][15] = F; dynamicRoom.floors[8][15] = F;
        }
        
        // Personnaliser le sol de la salle pour qu'elle soit unique
        randomizeFloor(dynamicRoom);
        randomizePuddles(dynamicRoom);

        worldMap.set(key, dynamicRoom);
        return dynamicRoom;
    }

    // Choisir une salle au hasard parmi les possibles
    const newRoomTemplate = possibleRooms[Math.floor(Math.random() * possibleRooms.length)];
    // On clone pour éviter les mutations
    const newRoom = JSON.parse(JSON.stringify(newRoomTemplate)) as RoomData;

    // Personnaliser le sol de la salle pour qu'elle soit unique
    randomizeFloor(newRoom);
    randomizePuddles(newRoom);

    worldMap.set(key, newRoom);
    return newRoom;
}

function randomizeFloor(room: RoomData) {
    const variations = [FC1, FC2, FC3];
    // Probabilité qu'une tuile de sol normale soit remplacée par une fissure (ex: 5%)
    const crackProbability = 0.05;

    for (let y = 0; y < room.floors.length; y++) {
        for (let x = 0; x < room.floors[y].length; x++) {
            if (room.floors[y][x] === F) {
                if (Math.random() < crackProbability) {
                    const variation = variations[Math.floor(Math.random() * variations.length)];
                    room.floors[y][x] = variation;
                }
            }
        }
    }
}

function randomizePuddles(room: RoomData) {
    const variations = [F1, F2, F3, F4];
    // Probabilité qu'une tuile de sol normale reçoive une flaque (ex: 2%)
    const puddleProbability = 0.02;

    for (let y = 0; y < room.floors.length; y++) {
        for (let x = 0; x < room.floors[y].length; x++) {
            // On ne met des flaques que sur le sol normal ou fissuré (pas sur les flèches ou murs)
            const floorTile = room.floors[y][x];
            const wallTile = room.walls[y][x];

            // Pas dans un mur (wallTile must be _)
            // Pas sur une sortie (les bords 0 et 15 sont réservés aux murs/portes)
            const isInside = x > 0 && x < 15 && y > 0 && y < 15;

            if (wallTile === _ && isInside && (floorTile === F || floorTile === FC1 || floorTile === FC2 || floorTile === FC3)) {
                if (Math.random() < puddleProbability) {
                    const variation = variations[Math.floor(Math.random() * variations.length)];
                    room.puddles[y][x] = variation;
                }
            }
        }
    }
}
