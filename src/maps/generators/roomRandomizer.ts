import { TILESET_TILES } from '../data/tilesets';
import type {RoomData} from '../types';

export function randomizeFloor(room: RoomData) {
    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            if (room.floors[y][x] === TILESET_TILES.FLOOR) {
                if (Math.random() < 0.05) {
                    const variants = [
                        TILESET_TILES.FLOOR_CRACKED_1,
                        TILESET_TILES.FLOOR_CRACKED_2,
                        TILESET_TILES.FLOOR_CRACKED_3
                    ];
                    room.floors[y][x] = variants[Math.floor(Math.random() * variants.length)];
                }
            }
        }
    }
}

export function randomizePuddles(room: RoomData) {
    if (Math.random() < 0.4) {
        const px = 3 + Math.floor(Math.random() * 8);
        const py = 3 + Math.floor(Math.random() * 8);
        room.puddles[py][px] = TILESET_TILES.FLAQUE_1;
        room.puddles[py][px + 1] = TILESET_TILES.FLAQUE_2;
        room.puddles[py + 1][px] = TILESET_TILES.FLAQUE_3;
        room.puddles[py + 1][px + 1] = TILESET_TILES.FLAQUE_4;
    }
}
