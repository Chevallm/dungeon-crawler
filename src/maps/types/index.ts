export interface Exits {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

export interface RoomData {
    walls: number[][];
    floors: number[][];
    puddles: number[][];
    torches: number[][];
    name: string;
    exits: Exits;
}
