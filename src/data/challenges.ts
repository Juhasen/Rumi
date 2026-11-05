export type Topic = "alphabet" | "colors";
export type PlayMode = "scored" | "practice";

export interface AlphabetChallenge {
  kind: "alphabet";
  id: string;
  upper: string;
  lower: string;
  spoken: string;
}

export interface ColorChallenge {
  kind: "colors";
  id: string;
  nameEn: string;
  namePl: string;
  hex: string;
  spoken: string;
}

export type Challenge = AlphabetChallenge | ColorChallenge;

export const ROUND_RULES: Record<
  Topic,
  { roundLength: number; winThreshold: number; language: string }
> = {
  alphabet: { roundLength: 10, winThreshold: 8, language: "pl-PL" },
  colors: { roundLength: 5, winThreshold: 4, language: "en-US" },
};

export const ALPHABET_CHALLENGES: AlphabetChallenge[] = [
  { kind: "alphabet", id: "a", upper: "A", lower: "a", spoken: "a" },
  { kind: "alphabet", id: "a_ogonek", upper: "Ą", lower: "ą", spoken: "ą" },
  { kind: "alphabet", id: "b", upper: "B", lower: "b", spoken: "be" },
  { kind: "alphabet", id: "c", upper: "C", lower: "c", spoken: "ce" },
  { kind: "alphabet", id: "c_acute", upper: "Ć", lower: "ć", spoken: "cie" },
  { kind: "alphabet", id: "d", upper: "D", lower: "d", spoken: "de" },
  { kind: "alphabet", id: "e", upper: "E", lower: "e", spoken: "e" },
  { kind: "alphabet", id: "e_ogonek", upper: "Ę", lower: "ę", spoken: "ę" },
  { kind: "alphabet", id: "f", upper: "F", lower: "f", spoken: "ef" },
  { kind: "alphabet", id: "g", upper: "G", lower: "g", spoken: "gie" },
  { kind: "alphabet", id: "h", upper: "H", lower: "h", spoken: "ha" },
  { kind: "alphabet", id: "i", upper: "I", lower: "i", spoken: "i" },
  { kind: "alphabet", id: "j", upper: "J", lower: "j", spoken: "jot" },
  { kind: "alphabet", id: "k", upper: "K", lower: "k", spoken: "ka" },
  { kind: "alphabet", id: "l", upper: "L", lower: "l", spoken: "el" },
  { kind: "alphabet", id: "l_stroke", upper: "Ł", lower: "ł", spoken: "eł" },
  { kind: "alphabet", id: "m", upper: "M", lower: "m", spoken: "em" },
  { kind: "alphabet", id: "n", upper: "N", lower: "n", spoken: "en" },
  { kind: "alphabet", id: "n_acute", upper: "Ń", lower: "ń", spoken: "eń" },
  { kind: "alphabet", id: "o", upper: "O", lower: "o", spoken: "o" },
  { kind: "alphabet", id: "o_acute", upper: "Ó", lower: "ó", spoken: "o z kreską" },
  { kind: "alphabet", id: "p", upper: "P", lower: "p", spoken: "pe" },
  { kind: "alphabet", id: "r", upper: "R", lower: "r", spoken: "er" },
  { kind: "alphabet", id: "s", upper: "S", lower: "s", spoken: "es" },
  { kind: "alphabet", id: "s_acute", upper: "Ś", lower: "ś", spoken: "eś" },
  { kind: "alphabet", id: "t", upper: "T", lower: "t", spoken: "te" },
  { kind: "alphabet", id: "u", upper: "U", lower: "u", spoken: "u" },
  { kind: "alphabet", id: "w", upper: "W", lower: "w", spoken: "wu" },
  { kind: "alphabet", id: "y", upper: "Y", lower: "y", spoken: "y" },
  { kind: "alphabet", id: "z", upper: "Z", lower: "z", spoken: "zet" },
  { kind: "alphabet", id: "z_acute", upper: "Ź", lower: "ź", spoken: "ziet" },
  { kind: "alphabet", id: "z_dot", upper: "Ż", lower: "ż", spoken: "żet" },
];

export const COLOR_CHALLENGES: ColorChallenge[] = [
  { kind: "colors", id: "red", nameEn: "RED", namePl: "Czerwony", hex: "#EF4444", spoken: "Red" },
  { kind: "colors", id: "blue", nameEn: "BLUE", namePl: "Niebieski", hex: "#2563EB", spoken: "Blue" },
  { kind: "colors", id: "green", nameEn: "GREEN", namePl: "Zielony", hex: "#22C55E", spoken: "Green" },
  { kind: "colors", id: "yellow", nameEn: "YELLOW", namePl: "Żółty", hex: "#FACC15", spoken: "Yellow" },
  { kind: "colors", id: "orange", nameEn: "ORANGE", namePl: "Pomarańczowy", hex: "#F97316", spoken: "Orange" },
  { kind: "colors", id: "purple", nameEn: "PURPLE", namePl: "Fioletowy", hex: "#9333EA", spoken: "Purple" },
  { kind: "colors", id: "pink", nameEn: "PINK", namePl: "Różowy", hex: "#EC4899", spoken: "Pink" },
  { kind: "colors", id: "black", nameEn: "BLACK", namePl: "Czarny", hex: "#111827", spoken: "Black" },
  { kind: "colors", id: "white", nameEn: "WHITE", namePl: "Biały", hex: "#FFFFFF", spoken: "White" },
  { kind: "colors", id: "brown", nameEn: "BROWN", namePl: "Brązowy", hex: "#78350F", spoken: "Brown" },
  { kind: "colors", id: "gray", nameEn: "GRAY", namePl: "Szary", hex: "#6B7280", spoken: "Gray" },
];

export function shuffleChallenges<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function drawRoundChallenges(topic: Topic): Challenge[] {
  const pool: readonly Challenge[] =
    topic === "alphabet" ? ALPHABET_CHALLENGES : COLOR_CHALLENGES;
  const count = ROUND_RULES[topic].roundLength;
  return shuffleChallenges(pool).slice(0, count);
}

export function drawNextPracticeChallenge(
  topic: Topic,
  currentId?: string
): Challenge {
  const pool: readonly Challenge[] =
    topic === "alphabet" ? ALPHABET_CHALLENGES : COLOR_CHALLENGES;
  const candidates = pool.filter((item) => item.id !== currentId);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function isRoundWon(topic: Topic, score: number): boolean {
  return score >= ROUND_RULES[topic].winThreshold;
}

// Self-check invariants at module load
if (
  ALPHABET_CHALLENGES.length !== 32 ||
  COLOR_CHALLENGES.length !== 11 ||
  drawRoundChallenges("alphabet").length !== 10 ||
  drawRoundChallenges("colors").length !== 5 ||
  !isRoundWon("alphabet", 8) ||
  isRoundWon("alphabet", 7) ||
  !isRoundWon("colors", 4) ||
  isRoundWon("colors", 3)
) {
  throw new Error("Domain invariant check failed in challenges.ts");
}
