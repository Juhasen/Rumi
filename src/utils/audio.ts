import { AudioPlayer, AudioSource, createAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Challenge, ROUND_RULES } from "../data/challenges";

const CHALLENGE_AUDIO_MAP: Record<string, AudioSource> = {
  // Polish Alphabet (32 letters — Microsoft Paulina pl-PL)
  a: require("../../assets/audio/pl/a.wav"),
  a_ogonek: require("../../assets/audio/pl/a_ogonek.wav"),
  b: require("../../assets/audio/pl/b.wav"),
  c: require("../../assets/audio/pl/c.wav"),
  c_acute: require("../../assets/audio/pl/c_acute.wav"),
  d: require("../../assets/audio/pl/d.wav"),
  e: require("../../assets/audio/pl/e.wav"),
  e_ogonek: require("../../assets/audio/pl/e_ogonek.wav"),
  f: require("../../assets/audio/pl/f.wav"),
  g: require("../../assets/audio/pl/g.wav"),
  h: require("../../assets/audio/pl/h.wav"),
  i: require("../../assets/audio/pl/i.wav"),
  j: require("../../assets/audio/pl/j.wav"),
  k: require("../../assets/audio/pl/k.wav"),
  l: require("../../assets/audio/pl/l.wav"),
  l_stroke: require("../../assets/audio/pl/l_stroke.wav"),
  m: require("../../assets/audio/pl/m.wav"),
  n: require("../../assets/audio/pl/n.wav"),
  n_acute: require("../../assets/audio/pl/n_acute.wav"),
  o: require("../../assets/audio/pl/o.wav"),
  o_acute: require("../../assets/audio/pl/o_acute.wav"),
  p: require("../../assets/audio/pl/p.wav"),
  r: require("../../assets/audio/pl/r.wav"),
  s: require("../../assets/audio/pl/s.wav"),
  s_acute: require("../../assets/audio/pl/s_acute.wav"),
  t: require("../../assets/audio/pl/t.wav"),
  u: require("../../assets/audio/pl/u.wav"),
  w: require("../../assets/audio/pl/w.wav"),
  y: require("../../assets/audio/pl/y.wav"),
  z: require("../../assets/audio/pl/z.wav"),
  z_acute: require("../../assets/audio/pl/z_acute.wav"),
  z_dot: require("../../assets/audio/pl/z_dot.wav"),

  // English Colors (11 colors — Microsoft Zira en-US)
  red: require("../../assets/audio/en/red.wav"),
  blue: require("../../assets/audio/en/blue.wav"),
  green: require("../../assets/audio/en/green.wav"),
  yellow: require("../../assets/audio/en/yellow.wav"),
  orange: require("../../assets/audio/en/orange.wav"),
  purple: require("../../assets/audio/en/purple.wav"),
  pink: require("../../assets/audio/en/pink.wav"),
  black: require("../../assets/audio/en/black.wav"),
  white: require("../../assets/audio/en/white.wav"),
  brown: require("../../assets/audio/en/brown.wav"),
  gray: require("../../assets/audio/en/gray.wav"),
};

const SUMMARY_AUDIO = {
  win: require("../../assets/audio/pl/win.wav"),
  retry: require("../../assets/audio/pl/retry.wav"),
};

let activePlayer: AudioPlayer | null = null;
let audioConfigured = false;

async function ensureAudioConfigured(): Promise<void> {
  if (audioConfigured) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
    audioConfigured = true;
  } catch {
    // Ignore if unsupported
  }
}

function playBundledAudio(source: AudioSource, onFallback?: () => void): void {
  try {
    if (activePlayer) {
      activePlayer.pause();
      activePlayer.remove();
      activePlayer = null;
    }
    const player = createAudioPlayer(source);
    activePlayer = player;
    player.play();
  } catch {
    onFallback?.();
  }
}

export async function speakChallenge(challenge: Challenge): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics may be unsupported on some emulators
  }

  await ensureAudioConfigured();
  Speech.stop();

  const source = CHALLENGE_AUDIO_MAP[challenge.id];
  if (source) {
    playBundledAudio(source, () => {
      Speech.speak(challenge.spoken, {
        language: ROUND_RULES[challenge.kind].language,
        rate: 0.85,
      });
    });
    return;
  }

  Speech.speak(challenge.spoken, {
    language: ROUND_RULES[challenge.kind].language,
    rate: 0.85,
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

  await ensureAudioConfigured();
  Speech.stop();
  playBundledAudio(won ? SUMMARY_AUDIO.win : SUMMARY_AUDIO.retry);
}

export function stopSpeech(): void {
  try {
    if (activePlayer) {
      activePlayer.pause();
      activePlayer.remove();
      activePlayer = null;
    }
  } catch {
    // Ignore cleanup errors
  }
  Speech.stop();
}
