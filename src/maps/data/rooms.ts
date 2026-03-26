import { TILESET_TILES } from './tilesets.ts';
import type {RoomData} from '../types';

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
const TT  = TILESET_TILES.TORCH_TOP;
const TL  = TILESET_TILES.TORCH_LEFT;
const TR  = TILESET_TILES.TORCH_RIGHT;
const FT = TILESET_TILES.FLOOR_TOP;
const FL = TILESET_TILES.FLOOR_LEFT;
const FR = TILESET_TILES.FLOOR_RIGHT;
const FB = TILESET_TILES.FLOOR_BOTTOM;
const F   = TILESET_TILES.FLOOR;
const _   = -1;

const empty16x16 = Array(16).fill(null).map(() => Array(16).fill(_));

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
        puddles: empty16x16,
        torches: [
            [_, _, _, TT, _, _, _, _, _, _, _, TT, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [TL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, TR],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [TL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, TR],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]
        ]
    },
    CENTERED_ROOM: {
        name: "Salle dans la salle",
        exits: { top: true, bottom: true, left: true, right: true },
        walls: [
            [WTL, WT, WT, WT, WT, WT, IBR, _, _, IBL, WT, WT, WT, WT, WT, WTR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _, ITL, IT, IT, ITR, _, _, ITL, IT, IT, ITR,  _,  _, WR],
            [WL,  _,  _, IL,  WTL, IB, IBR,_,_, IBL,  IB,  WTR,  IR,  _,  _, WR],
            [WL,  _,  _, IL,  IR,  _,  _,  _,  _,  _,  _, IL,  IR,  _,  _, WR],
            [IBR,  _,  _, IBL,  IBR,  _,  _,  _,  _,  _,  _, IBL, IBR,  _,  _, IBL],
            [_,   _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, _],
            [_,   _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, _],
            [ITR,  _,  _, ITL, ITR,  _,  _,  _,  _,  _,  _,  ITL, ITR,  _,  _, ITL],
            [WL,  _,  _, IL,  IR,  _,  _,  _,  _,  _,  _, IL,  IR,  _,  _, WR],
            [WL,  _,  _, IL,  WBL, IT,  ITR, _,  _, ITL, IT,  WBR, IR,  _,  _, WR],
            [WL,  _,  _, IBL, IB,  IB,  IBR, _,  _, IBL, IB,  IB,  IBR, _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WBL, WB, WB, WB, WB, WB, ITR, _, _, ITL, WB, WB, WB, WB, WB, WBR]
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
            [F, F, F, F, F, F, FB, FB, FB, FB, F, F, F, F, F, F]
        ],
        puddles: empty16x16,
        torches: [
            [_, _, _, TT, _, _, _, _, _, _, _, TT, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [TL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, TR],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [TL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, TR],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]
        ]
    },
    GENERIC_ROOM: {
        name: "Salle Générique",
        exits: { top: false, bottom: false, left: false, right: false },
        walls: [
            [WTL, WT, WT, WT, WT, WT, WT, WT, WT, WT, WT, WT, WT, WT, WT, WTR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WL,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _, WR],
            [WBL, WB, WB, WB, WB, WB, WB, WB, WB, WB, WB, WB, WB, WB, WB, WBR]
        ],
        floors: [
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F]
        ],
        puddles: empty16x16,
        torches: empty16x16
    }
};
