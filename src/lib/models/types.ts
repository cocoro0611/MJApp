import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Chip = {
    id: string;
    input: number;
    chip: number;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    userId: string;
};
export type Room = {
    id: string;
    name: string;
    initialPoint: number;
    returnPoint: number;
    bonusPoint: string;
    scoreRate: number;
    chipRate: number;
    gameAmount: number;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type RoomChip = {
    roomId: string;
    chipId: string;
    chipOrder: number;
    createdAt: Generated<Timestamp>;
};
export type RoomScore = {
    roomId: string;
    scoreId: string;
    scoreOrder: number;
    createdAt: Generated<Timestamp>;
};
export type RoomUser = {
    roomId: string;
    userId: string;
    userOrder: number;
    createdAt: Generated<Timestamp>;
};
export type Score = {
    id: string;
    input: number;
    score: number;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    userId: string;
};
export type User = {
    id: string;
    name: string;
    icon: string;
    isDefault: boolean;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type DB = {
    Chip: Chip;
    Room: Room;
    RoomChip: RoomChip;
    RoomScore: RoomScore;
    RoomUser: RoomUser;
    Score: Score;
    User: User;
};
