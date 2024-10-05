import type { Room, Score, Chip, RoomScore, RoomChip } from "../types.js";
import type { UserData } from "../Member/type.js";

export interface RoomData
  extends Pick<
    Room,
    | "id"
    | "name"
    | "initialPoint"
    | "returnPoint"
    | "bonusPoint"
    | "scoreRate"
    | "chipRate"
    | "gameAmount"
  > {
  users: (UserData & {
    totalScore: number;
    totalChip: number;
    totalPoint: number;
  })[];
}

export interface ScoreData extends Pick<RoomScore, "roomId" | "scoreOrder"> {
  userScores: Pick<Score, "id" | "input" | "score" | "userId">[];
}

export interface ChipData extends Pick<RoomChip, "roomId" | "chipOrder"> {
  userChips: Pick<Chip, "id" | "input" | "chip" | "userId">[];
}
