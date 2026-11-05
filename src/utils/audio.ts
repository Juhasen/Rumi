import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Challenge, ROUND_RULES } from "../data/challenges";

const WIN_PHRASES = [
  "Brawo Laura! Wygrałaś rundę!",
  "Super Laura! Jesteś gwiazdą!",
  "Wspaniale Laura! Świetny wynik!",
];

const RETRY_PHRASES = [
  "Prawie się udało Laura! Spróbujmy jeszcze raz!",
  "Było bardzo blisko! Zagrajmy jeszcze raz!",
];

let lastPhraseIndex = -1;

function pickPhrase(pool: string[]): string {
  if (pool.length <= 1) return pool[0];
  let idx = Math.floor(Math.random() * pool.length);
  if (idx === lastPhraseIndex) {
    idx = (idx + 1) % pool.length;
  }
  lastPhraseIndex = idx;
  return pool[idx];
}

export async function speakChallenge(challenge: Challenge): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics may be unsupported on some emulators
  }

  Speech.stop();
  const language = ROUND_RULES[challenge.kind].language;
  // Slight pitch variation (audio-design SFX variation pattern) keeps repeated listens fresh
  const pitchOffset = (Math.random() - 0.5) * 0.06;

  Speech.speak(challenge.spoken, {
    language,
    rate: 0.85,
    pitch: 1.05 + pitchOffset,
  });
}

export async function triggerScoreFeedback(correct: boolean): Promise<void> {
  try {
    await Haptics.notificationAsync(
      correct
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
  } catch {
    // Ignore on unsupported devices
  }
}

export async function speakRoundSummary(won: boolean): Promise<void> {
  try {
    await Haptics.notificationAsync(
      won
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
  } catch {
    // Ignore on unsupported devices
  }

  Speech.stop();
  const phrase = pickPhrase(won ? WIN_PHRASES : RETRY_PHRASES);
  Speech.speak(phrase, {
    language: "pl-PL",
    rate: 0.92,
    pitch: 1.08,
  });
}

export function stopSpeech(): void {
  Speech.stop();
}
