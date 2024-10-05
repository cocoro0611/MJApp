//FIXME:関数のリファクタリング
import type { ScoreData, ChipData } from "$lib/models/Room/type.js";

export function scoreClick(
  score: ScoreData,
  scoreId: string,
  filteredScores: ScoreData[],
  inputValues: Record<string, number>
): {
  selectedScoreId: string;
  activeScoreIndex: number;
  updatedInputValues: Record<string, number>;
} {
  const activeScoreIndex = filteredScores.findIndex(
    (s) => s.scoreOrder === score.scoreOrder
  );
  let updatedInputValues = { ...inputValues };
  if (!(scoreId in updatedInputValues)) {
    const clickedUserScore = score.userScores.find((us) => us.id === scoreId);
    updatedInputValues[scoreId] = clickedUserScore
      ? clickedUserScore.input || 0
      : 0;
  }
  return { selectedScoreId: scoreId, activeScoreIndex, updatedInputValues };
}

export function navigateScore(
  direction: "left" | "right",
  selectedScoreId: string | null,
  activeScore: ScoreData | undefined
): string | null {
  if (!selectedScoreId || !activeScore) return null;
  const currentIndex = activeScore.userScores.findIndex(
    (us) => us.id === selectedScoreId
  );
  if (currentIndex === -1) return null;

  let newIndex: number;
  if (direction === "left") {
    newIndex =
      (currentIndex - 1 + activeScore.userScores.length) %
      activeScore.userScores.length;
  } else {
    newIndex = (currentIndex + 1) % activeScore.userScores.length;
  }

  return activeScore.userScores[newIndex].id;
}

export function chipClick(
  chip: ChipData,
  chipId: string,
  filteredChips: ChipData[],
  inputValues: Record<string, number>
): {
  selectedChipId: string;
  activeChipIndex: number;
  updatedInputValues: Record<string, number>;
} {
  const activeChipIndex = filteredChips.findIndex(
    (s) => s.chipOrder === chip.chipOrder
  );
  let updatedInputValues = { ...inputValues };
  if (!(chipId in updatedInputValues)) {
    const clickedUserChip = chip.userChips.find((us) => us.id === chipId);
    updatedInputValues[chipId] = clickedUserChip
      ? clickedUserChip.input || 0
      : 0;
  }
  return { selectedChipId: chipId, activeChipIndex, updatedInputValues };
}

export function navigateChip(
  direction: "left" | "right",
  selectedChipId: string | null,
  activeChip: ChipData | undefined
): string | null {
  if (!selectedChipId || !activeChip) return null;
  const currentIndex = activeChip.userChips.findIndex(
    (us) => us.id === selectedChipId
  );
  if (currentIndex === -1) return null;

  let newIndex: number;
  if (direction === "left") {
    newIndex =
      (currentIndex - 1 + activeChip.userChips.length) %
      activeChip.userChips.length;
  } else {
    newIndex = (currentIndex + 1) % activeChip.userChips.length;
  }

  return activeChip.userChips[newIndex].id;
}

export function addDigit(
  input: number,
  digit: number,
  inputType: "score" | "chip"
) {
  const currentStr = Math.abs(input).toString();
  const maxLength = inputType === "score" ? 4 : 2;

  if (currentStr.length < maxLength) {
    return input === 0
      ? digit
      : Number(`${Math.abs(input)}${digit}`) * (input < 0 ? -1 : 1);
  }
  return input;
}

export function toggleSign(input: number) {
  return -input;
}

export function backspace(input: number) {
  return Math.floor(Math.abs(input) / 10) * (input < 0 ? -1 : 1);
}
