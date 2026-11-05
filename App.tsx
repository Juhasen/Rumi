import "./global.css";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ConfettiBurst } from "./src/components/ConfettiBurst";
import { JuicyButton } from "./src/components/JuicyButton";
import {
  Challenge,
  PlayMode,
  ROUND_RULES,
  Topic,
  drawNextPracticeChallenge,
  drawRoundChallenges,
  isRoundWon,
} from "./src/data/challenges";
import {
  speakChallenge,
  speakRoundSummary,
  stopSpeech,
  triggerScoreFeedback,
} from "./src/utils/audio";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

type ScreenState = "home" | "playing" | "summary";

function RumiGame() {
  const reducedMotion = useReducedMotion();

  const [screen, setScreen] = useState<ScreenState>("home");
  const [playMode, setPlayMode] = useState<PlayMode>("scored");
  const [topic, setTopic] = useState<Topic>("alphabet");

  // Round & challenge state
  const [roundItems, setRoundItems] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceChallenge, setPracticeChallenge] = useState<Challenge | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [pronunciationChecked, setPronunciationChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // UI-thread shared values for game-feel juice
  const cardScale = useSharedValue(1);
  const cardTranslateX = useSharedValue(0);
  const cardTranslateY = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const speakerScale = useSharedValue(1);
  const scoreScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.get(),
    transform: [
      { translateX: cardTranslateX.get() },
      { translateY: cardTranslateY.get() },
      { scale: cardScale.get() },
    ],
  }));

  const speakerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: speakerScale.get() }],
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.get() }],
  }));

  const animateCardEntrance = () => {
    if (reducedMotion) {
      cardOpacity.set(1);
      cardScale.set(1);
      cardTranslateX.set(0);
      cardTranslateY.set(0);
      return;
    }
    cardOpacity.set(0);
    cardScale.set(0.95);
    cardTranslateX.set(0);
    cardTranslateY.set(0);
    cardOpacity.set(
      withTiming(1, {
        duration: 180,
        easing: EASE_OUT,
        reduceMotion: ReduceMotion.System,
      })
    );
    cardScale.set(
      withSpring(1, {
        duration: 260,
        dampingRatio: 0.78,
        reduceMotion: ReduceMotion.System,
      })
    );
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      stopSpeech();
    };
  }, []);

  const startSession = (selectedTopic: Topic, selectedMode: PlayMode = playMode) => {
    stopSpeech();
    setTopic(selectedTopic);
    setPlayMode(selectedMode);
    setScore(0);
    setCurrentIndex(0);
    setPronunciationChecked(false);
    setIsTransitioning(false);

    if (selectedMode === "scored") {
      setRoundItems(drawRoundChallenges(selectedTopic));
      setPracticeChallenge(null);
    } else {
      setPracticeChallenge(drawNextPracticeChallenge(selectedTopic));
      setRoundItems([]);
    }

    setScreen("playing");
    animateCardEntrance();
  };

  const returnToMenu = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    stopSpeech();
    setIsTransitioning(false);
    setScreen("home");
  };

  const currentChallenge: Challenge | null =
    playMode === "scored"
      ? roundItems[currentIndex] ?? null
      : practiceChallenge;

  const handlePronunciationCheck = () => {
    if (!currentChallenge || isTransitioning) return;

    setPronunciationChecked(true);
    speakChallenge(currentChallenge);

    if (!reducedMotion) {
      speakerScale.set(
        withSequence(
          withTiming(1.16, { duration: 100, easing: EASE_OUT }),
          withSpring(1, { duration: 240, dampingRatio: 0.65 })
        )
      );
      cardScale.set(
        withSequence(
          withTiming(1.04, { duration: 110, easing: EASE_OUT }),
          withSpring(1, { duration: 240, dampingRatio: 0.75 })
        )
      );
    }
  };

  const advanceToNextChallenge = (nextScore: number) => {
    if (playMode === "practice") {
      const nextItem = drawNextPracticeChallenge(topic, currentChallenge?.id);
      setPracticeChallenge(nextItem);
      setPronunciationChecked(false);
      setIsTransitioning(false);
      animateCardEntrance();
      return;
    }

    const total = ROUND_RULES[topic].roundLength;
    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
      setPronunciationChecked(false);
      setIsTransitioning(false);
      animateCardEntrance();
    } else {
      setIsTransitioning(false);
      setScreen("summary");
      const won = isRoundWon(topic, nextScore);
      speakRoundSummary(won);
    }
  };

  const handleSelfScore = (correct: boolean) => {
    if (!pronunciationChecked || isTransitioning) return;

    setIsTransitioning(true);
    stopSpeech();
    triggerScoreFeedback(correct);

    const nextScore = correct ? score + 1 : score;
    if (correct) {
      setScore(nextScore);
    }

    if (!reducedMotion) {
      if (correct) {
        cardTranslateY.set(
          withSequence(
            withTiming(-14, { duration: 110, easing: EASE_OUT }),
            withSpring(0, { duration: 200, dampingRatio: 0.7 })
          )
        );
        cardScale.set(
          withSequence(
            withTiming(1.06, { duration: 110, easing: EASE_OUT }),
            withSpring(1, { duration: 200, dampingRatio: 0.75 })
          )
        );
        scoreScale.set(
          withSequence(
            withTiming(1.3, { duration: 110, easing: EASE_OUT }),
            withSpring(1, { duration: 240, dampingRatio: 0.65 })
          )
        );
      } else {
        cardTranslateX.set(
          withSequence(
            withTiming(-12, { duration: 55 }),
            withTiming(12, { duration: 55 }),
            withTiming(-8, { duration: 55 }),
            withTiming(8, { duration: 55 }),
            withTiming(0, { duration: 55 })
          )
        );
      }
    }

    transitionTimerRef.current = setTimeout(() => {
      advanceToNextChallenge(nextScore);
    }, 280);
  };

  const handlePracticeNext = () => {
    if (!pronunciationChecked || isTransitioning) return;
    setIsTransitioning(true);
    stopSpeech();
    advanceToNextChallenge(score);
  };

  // ==================== HOME SCREEN ====================
  if (screen === "home") {
    return (
      <SafeAreaView className="flex-1 bg-[#120824] px-6 py-4 justify-between">
        <StatusBar style="light" />

        {/* Header */}
        <View className="items-center mt-2">
          <View className="bg-[#241046] border-2 border-[#00F0FF] px-4 py-1.5 rounded-full mb-3">
            <Text className="text-[#00F0FF] font-extrabold tracking-widest text-xs">
              ★ HUNTR/X • RUMI ★
            </Text>
          </View>
          <Text className="text-white text-4xl font-black tracking-tight text-center">
            Cześć Laura! 💜
          </Text>
          <Text className="text-purple-200 text-base font-medium mt-1 text-center">
            Wybierz tryb i zacznij zabawę!
          </Text>
        </View>

        {/* Play Mode Toggle (Na punkty vs Swobodna nauka) */}
        <View className="bg-[#1E0E3A] p-2 rounded-3xl border-2 border-purple-700/70 flex-row gap-2 my-3">
          <View className="flex-1">
            <JuicyButton
              onPress={() => setPlayMode("scored")}
              accessibilityLabel="Tryb gry na punkty"
              className={`py-3.5 px-3 rounded-2xl items-center justify-center ${
                playMode === "scored"
                  ? "bg-[#9333EA] border-2 border-[#00F0FF]"
                  : "bg-transparent"
              }`}
            >
              <Text className="text-2xl mb-0.5">🏆</Text>
              <Text
                className={`font-extrabold text-sm ${
                  playMode === "scored" ? "text-white" : "text-purple-300"
                }`}
              >
                Na punkty
              </Text>
            </JuicyButton>
          </View>

          <View className="flex-1">
            <JuicyButton
              onPress={() => setPlayMode("practice")}
              accessibilityLabel="Tryb swobodnej nauki bez punktów"
              className={`py-3.5 px-3 rounded-2xl items-center justify-center ${
                playMode === "practice"
                  ? "bg-[#0284C7] border-2 border-[#00F0FF]"
                  : "bg-transparent"
              }`}
            >
              <Text className="text-2xl mb-0.5">📖</Text>
              <Text
                className={`font-extrabold text-sm ${
                  playMode === "practice" ? "text-white" : "text-purple-300"
                }`}
              >
                Bez punktów
              </Text>
            </JuicyButton>
          </View>
        </View>

        {/* Topic Tiles */}
        <View className="flex-1 justify-center gap-5">
          {/* Polish Alphabet Tile */}
          <JuicyButton
            onPress={() => startSession("alphabet")}
            accessibilityLabel="Nauka polskiego alfabetu"
            className="bg-[#231145] border-4 border-[#A855F7] rounded-3xl p-5 flex-row items-center justify-between"
          >
            <View className="flex-1 pr-3">
              <View className="bg-purple-900/80 self-start px-3 py-1 rounded-full mb-2 border border-purple-400/50">
                <Text className="text-purple-200 text-xs font-bold">
                  POLSKI • {playMode === "scored" ? "10 LITER" : "SWOBODNIE"}
                </Text>
              </View>
              <Text className="text-white text-3xl font-black">Alfabet</Text>
              <Text className="text-purple-200 text-sm font-medium mt-1">
                Duże i małe litery od A do Ż
              </Text>
            </View>
            <View className="bg-[#3B1771] border-2 border-[#00F0FF] w-24 h-24 rounded-2xl items-center justify-center">
              <Text className="text-[#00F0FF] text-4xl font-black">A a</Text>
            </View>
          </JuicyButton>

          {/* English Colors Tile */}
          <JuicyButton
            onPress={() => startSession("colors")}
            accessibilityLabel="Nauka kolorów po angielsku"
            className="bg-[#161B44] border-4 border-[#00F0FF] rounded-3xl p-5 flex-row items-center justify-between"
          >
            <View className="flex-1 pr-3">
              <View className="bg-sky-900/80 self-start px-3 py-1 rounded-full mb-2 border border-cyan-400/50">
                <Text className="text-cyan-200 text-xs font-bold">
                  ENGLISH • {playMode === "scored" ? "5 KOLORÓW" : "SWOBODNIE"}
                </Text>
              </View>
              <Text className="text-white text-3xl font-black">Kolory</Text>
              <Text className="text-cyan-200 text-sm font-medium mt-1">
                Angielskie nazwy kolorów
              </Text>
            </View>
            <View className="bg-[#1E2A63] border-2 border-[#FF2A85] w-24 h-24 rounded-2xl items-center justify-center">
              <Text className="text-4xl">🎨</Text>
            </View>
          </JuicyButton>
        </View>

        {/* Footer */}
        <View className="items-center pb-1">
          <Text className="text-purple-400 text-xs font-semibold">
            {playMode === "scored"
              ? "Cel wygranej: 8/10 w alfabecie • 4/5 w kolorach"
              : "Tryb nauki: ćwicz we własnym tempie bez limitu"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== SUMMARY SCREEN ====================
  if (screen === "summary") {
    const total = ROUND_RULES[topic].roundLength;
    const threshold = ROUND_RULES[topic].winThreshold;
    const won = isRoundWon(topic, score);

    return (
      <SafeAreaView className="flex-1 bg-[#120824] px-6 py-6 justify-between items-center">
        <StatusBar style="light" />
        {won && <ConfettiBurst />}

        <View className="items-center mt-6">
          <View className="bg-[#241046] border-2 border-[#00F0FF] px-5 py-1.5 rounded-full mb-4">
            <Text className="text-[#00F0FF] font-extrabold text-xs tracking-widest">
              {topic === "alphabet" ? "ALFABET POLSKI" : "ANGIELSKIE KOLORY"}
            </Text>
          </View>
          <Text className="text-6xl mb-3">{won ? "🏆🌟" : "💪✨"}</Text>
          <Text className="text-white text-4xl font-black text-center">
            {won ? "Brawo Laura!" : "Prawie się udało!"}
          </Text>
          <Text className="text-purple-200 text-lg font-semibold text-center mt-2">
            {won
              ? "Wygrałaś tę rundę śpiewająco!"
              : "Spróbuj jeszcze raz, na pewno się uda!"}
          </Text>
        </View>

        {/* Score Card */}
        <View
          className={`w-full rounded-3xl p-7 items-center border-4 ${
            won
              ? "bg-[#24114A] border-[#00F0FF]"
              : "bg-[#26123B] border-[#FF2A85]"
          }`}
        >
          <Text className="text-purple-200 text-base font-bold uppercase tracking-wider">
            Twój wynik
          </Text>
          <Text className="text-white text-7xl font-black my-2">
            {score} / {total}
          </Text>
          <View className="bg-[#120824] px-4 py-1.5 rounded-full border border-purple-500/40">
            <Text className="text-purple-300 text-sm font-semibold">
              Wymagane do wygranej: {threshold} / {total}
            </Text>
          </View>
        </View>

        {/* Actions — huge icons for 5-year-old Laura */}
        <View className="w-full flex-row gap-5 mb-2">
          <View className="flex-1">
            <JuicyButton
              onPress={returnToMenu}
              accessibilityLabel="Wróć do domu"
              className="bg-[#1F113B] border-4 border-purple-400 py-6 rounded-3xl items-center justify-center"
            >
              <Text
                style={{ fontSize: 56, lineHeight: 68 }}
                className="text-center"
              >
                🏠
              </Text>
            </JuicyButton>
          </View>

          <View className="flex-1">
            <JuicyButton
              onPress={() => startSession(topic, "scored")}
              accessibilityLabel="Zagraj od nowa"
              className="bg-[#9333EA] border-4 border-[#00F0FF] py-6 rounded-3xl items-center justify-center"
            >
              <Text
                style={{ fontSize: 56, lineHeight: 68 }}
                className="text-center"
              >
                🔄
              </Text>
            </JuicyButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== PLAYING SCREEN ====================
  const totalInRound = ROUND_RULES[topic].roundLength;

  return (
    <SafeAreaView className="flex-1 bg-[#120824] px-5 py-3 justify-between">
      <StatusBar style="light" />

      {/* Top HUD */}
      <View className="flex-row items-center justify-between">
        <JuicyButton
          onPress={returnToMenu}
          accessibilityLabel="Wróć do domu"
          className="bg-[#231242] border-2 border-purple-400 px-4 py-2 rounded-2xl items-center justify-center"
        >
          <Text style={{ fontSize: 28, lineHeight: 34 }}>🏠</Text>
        </JuicyButton>

        <View className="bg-[#1F103A] border border-purple-600/60 px-4 py-2 rounded-2xl">
          <Text className="text-purple-200 font-extrabold text-base">
            {playMode === "scored"
              ? `${currentIndex + 1} / ${totalInRound}`
              : "📖 Nauka"}
          </Text>
        </View>

        {playMode === "scored" ? (
          <Animated.View
            style={scoreAnimatedStyle}
            className="bg-[#28124D] border-2 border-[#00F0FF] px-4 py-2 rounded-2xl flex-row items-center"
          >
            <Text className="text-[#00F0FF] font-black text-base">
              ⭐ {score}
            </Text>
          </Animated.View>
        ) : (
          <View className="w-16" />
        )}
      </View>

      {/* Main Challenge Card */}
      <Animated.View
        style={cardAnimatedStyle}
        className="bg-[#1F103C] border-4 border-[#A855F7] rounded-3xl p-6 items-center justify-center my-2 min-h-[260px]"
      >
        {currentChallenge?.kind === "alphabet" ? (
          <View className="w-full items-center">
            <Text className="text-purple-300 text-xs font-extrabold uppercase tracking-widest mb-4">
              Powiedz na głos, jaka to litera:
            </Text>

            {/* Side-by-side Uppercase (left) & Lowercase (right) */}
            <View className="flex-row items-stretch justify-center w-full gap-5 py-2">
              <View className="flex-1 items-center justify-center bg-[#140929] border-2 border-[#00F0FF]/70 rounded-3xl py-5 px-2">
                <Text className="text-[#00F0FF]/80 text-xs font-bold mb-2">
                  DUŻA
                </Text>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 80,
                    lineHeight: 114,
                    includeFontPadding: true,
                  }}
                  className="text-white font-black"
                >
                  {currentChallenge.upper}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center bg-[#140929] border-2 border-[#FF2A85]/70 rounded-3xl py-5 px-2">
                <Text className="text-[#FF2A85]/90 text-xs font-bold mb-2">
                  MAŁA
                </Text>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 80,
                    lineHeight: 114,
                    includeFontPadding: true,
                  }}
                  className="text-[#F0ABFC] font-black"
                >
                  {currentChallenge.lower}
                </Text>
              </View>
            </View>
          </View>
        ) : currentChallenge?.kind === "colors" ? (
          <View className="w-full items-center">
            <Text className="text-cyan-200 text-xs font-extrabold uppercase tracking-widest mb-4">
              Jaki to kolor po angielsku?
            </Text>

            {/* Color Swatch inside high-contrast thick white frame */}
            <View
              style={{ backgroundColor: currentChallenge.hex }}
              className="w-56 h-40 rounded-3xl border-[10px] border-white mb-3"
            />

            {/* Reveal English Color Name after Pronunciation Check */}
            {pronunciationChecked ? (
              <View className="items-center mt-1 w-full">
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 32,
                    lineHeight: 42,
                  }}
                  className="text-[#00F0FF] font-black"
                >
                  {currentChallenge.nameEn}
                </Text>
                <Text
                  style={{ width: "100%", textAlign: "center" }}
                  className="text-purple-300 text-base font-semibold mt-0.5"
                >
                  ({currentChallenge.namePl})
                </Text>
              </View>
            ) : (
              <View className="items-center mt-1 w-full">
                <Text
                  style={{ width: "100%", textAlign: "center" }}
                  className="text-purple-300 text-lg font-bold"
                >
                  ❓ Nazwij kolor i kliknij głośniczek
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </Animated.View>

      {/* Speaker Button (Pronunciation Check) */}
      <Animated.View style={speakerAnimatedStyle}>
        <JuicyButton
          onPress={handlePronunciationCheck}
          accessibilityLabel="Posłuchaj prawidłowej wymowy"
          className={`py-4 px-6 rounded-3xl border-4 flex-row items-center justify-center gap-3 ${
            pronunciationChecked
              ? "bg-[#1C2559] border-[#00F0FF]"
              : "bg-[#7E22CE] border-[#00F0FF]"
          }`}
        >
          <Text className="text-4xl">🔊</Text>
          <View>
            <Text className="text-white text-xl font-black">
              {pronunciationChecked ? "Posłuchaj jeszcze raz" : "Sprawdź wymowę"}
            </Text>
            <Text className="text-cyan-200 text-xs font-semibold">
              {pronunciationChecked
                ? "Teraz oceń odpowiedź poniżej!"
                : "Kliknij głośniczek po odpowiedzi"}
            </Text>
          </View>
        </JuicyButton>
      </Animated.View>

      {/* Self-Score (+ / -) or Practice Next */}
      <View className="mt-2">
        {!pronunciationChecked && (
          <Text className="text-center text-amber-300 text-xs font-bold mb-2">
            🔒 Najpierw kliknij głośniczek, aby odblokować przyciski
          </Text>
        )}

        {playMode === "scored" ? (
          <View className="flex-row gap-4">
            {/* Minus Button (Incorrect) */}
            <View className="flex-1">
              <JuicyButton
                onPress={() => handleSelfScore(false)}
                disabled={!pronunciationChecked || isTransitioning}
                accessibilityLabel="Odpowiedź błędna, brak punktu"
                className="bg-[#DC2626] border-4 border-red-300 py-5 rounded-3xl items-center justify-center"
              >
                <Text className="text-white text-5xl font-black leading-none">
                  −
                </Text>
                <Text className="text-red-100 text-sm font-extrabold mt-1">
                  Jeszcze nie
                </Text>
              </JuicyButton>
            </View>

            {/* Plus Button (Correct) */}
            <View className="flex-1">
              <JuicyButton
                onPress={() => handleSelfScore(true)}
                disabled={!pronunciationChecked || isTransitioning}
                accessibilityLabel="Odpowiedź poprawna, dodaj punkt"
                className="bg-[#16A34A] border-4 border-green-300 py-5 rounded-3xl items-center justify-center"
              >
                <Text className="text-white text-5xl font-black leading-none">
                  +
                </Text>
                <Text className="text-green-100 text-sm font-extrabold mt-1">
                  Dobrze!
                </Text>
              </JuicyButton>
            </View>
          </View>
        ) : (
          <JuicyButton
            onPress={handlePracticeNext}
            disabled={!pronunciationChecked || isTransitioning}
            accessibilityLabel="Następna karta"
            className="bg-[#0284C7] border-4 border-[#00F0FF] py-5 rounded-3xl items-center justify-center"
          >
            <Text className="text-white text-2xl font-black">
              Dalej ➔
            </Text>
          </JuicyButton>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <RumiGame />
    </SafeAreaProvider>
  );
}
