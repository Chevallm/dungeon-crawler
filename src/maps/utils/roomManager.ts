import type {RoomData} from '../types';
import { ROOMS } from '../data/rooms';
import { TILESET_TILES } from '../data/tilesets';
import { randomizeFloor, randomizePuddles } from '../generators/roomRandomizer';

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

    const constraints = getConstraints(x, y);

    // Filtrer les salles qui respectent les contraintes
    let possibleRooms = Object.values(ROOMS).filter(room => {
        if (room.name === "Salle Générique") return false; // Ne pas utiliser la salle générique comme base aléatoire
        if (constraints.top !== undefined && room.exits.top !== constraints.top) return false;
        if (constraints.bottom !== undefined && room.exits.bottom !== constraints.bottom) return false;
        if (constraints.left !== undefined && room.exits.left !== constraints.left) return false;
        if (constraints.right !== undefined && room.exits.right !== constraints.right) return false;
        return true;
    });

    let room: RoomData;

    if (possibleRooms.length === 0) {
        room = generateDynamicRoom(constraints);
    } else {
        // Prendre une salle aléatoire parmi celles possibles
        const baseRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)];
        room = JSON.parse(JSON.stringify(baseRoom));
    }

    randomizeFloor(room);
    randomizePuddles(room);
    worldMap.set(key, room);
    return room;
}

function getConstraints(x: number, y: number) {
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

    return constraints;
}

    function generateDynamicRoom(constraints: any): RoomData {
    const FT = TILESET_TILES.FLOOR_TOP;
    const FB = TILESET_TILES.FLOOR_BOTTOM;
    const FL = TILESET_TILES.FLOOR_LEFT;
    const FR = TILESET_TILES.FLOOR_RIGHT;

    const dynamicRoom = JSON.parse(JSON.stringify(ROOMS.GENERIC_ROOM)) as RoomData;
    dynamicRoom.exits = {
        top: !!constraints.top,
        bottom: !!constraints.bottom,
        left: !!constraints.left,
        right: !!constraints.right
    };

    const TT = TILESET_TILES.TORCH_TOP;
    const TL = TILESET_TILES.TORCH_LEFT;
    const TR = TILESET_TILES.TORCH_RIGHT;
    const _ = -1;

    // Ajouter des torches par défaut pour les salles dynamiques
    dynamicRoom.torches[0][3] = TT;
    dynamicRoom.torches[0][12] = TT;
    dynamicRoom.torches[4][0] = TL;
    dynamicRoom.torches[11][0] = TL;
    dynamicRoom.torches[4][15] = TR;
    dynamicRoom.torches[11][15] = TR;

    // Ouvrir les murs et mettre les flèches au sol uniquement si la sortie existe
    if (dynamicRoom.exits.top) {
        dynamicRoom.walls[0][7] = _; dynamicRoom.walls[0][8] = _;
        dynamicRoom.floors[0][7] = FT; dynamicRoom.floors[0][8] = FT;
    }

    if (dynamicRoom.exits.bottom) {
        dynamicRoom.walls[15][7] = _; dynamicRoom.walls[15][8] = _;
        dynamicRoom.floors[15][7] = FB; dynamicRoom.floors[15][8] = FB;
    }

    if (dynamicRoom.exits.left) {
        dynamicRoom.walls[7][0] = _; dynamicRoom.walls[8][0] = _;
        dynamicRoom.floors[7][0] = FL; dynamicRoom.floors[8][0] = FL;
    }

    if (dynamicRoom.exits.right) {
        dynamicRoom.walls[7][15] = _; dynamicRoom.walls[8][15] = _;
        dynamicRoom.floors[7][15] = FR; dynamicRoom.floors[8][15] = FR;
    }

    return dynamicRoom;
}
