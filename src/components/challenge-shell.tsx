import { router } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { JuicyButton } from "@/components/juicy-button";
import {
  Challenge,
  PlayMode,
  ROUND_RULES,
  Topic,
  drawNextPracticeChallenge,
  drawRoundChallenges,
} from "@/data/challenges";
import {
  speakChallenge,
  stopSpeech,
  triggerScoreFeedback,
} from "@/utils/audio";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

interface ChallengeShellProps {
  topic: Topic;
  playMode: PlayMode;
  renderCard: (
    challenge: Challenge,
    pronunciationChecked: boolean
  ) => React.ReactNode;
}

export function ChallengeShell({
  topic,
  playMode,
  renderCard,
}: ChallengeShellProps) {
  const reducedMotion = useReducedMotion();

  const [roundItems] = useState<Challenge[]>(() =>
    playMode === "scored" ? drawRoundChallenges(topic) : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceChallenge, setPracticeChallenge] = useState<Challenge | null>(
    () => (playMode === "practice" ? drawNextPracticeChallenge(topic) : null)
  );
  const [score, setScore] = useState(0);
  const [pronunciationChecked, setPronunciationChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    animateCardEntrance();
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentChallenge: Challenge | null =
    playMode === "scored"
      ? roundItems[currentIndex] ?? null
      : practiceChallenge;

  const returnToMenu = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    stopSpeech();
    router.replace("/");
  };

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
      router.replace({
        pathname: "/summary",
        params: { topic, score: String(nextScore) },
      });
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
        {currentChallenge
          ? renderCard(currentChallenge, pronunciationChecked)
          : null}
      </Animated.View>

      {/* Bottom Action Area: Speaker first, then Self-Score (+ / -) or Next */}
      <View className="mt-2 gap-3">
        {!pronunciationChecked ? (
          <Animated.View style={speakerAnimatedStyle}>
            <JuicyButton
              onPress={handlePronunciationCheck}
              accessibilityLabel="Posłuchaj prawidłowej wymowy"
              className="py-7 px-6 rounded-3xl border-4 bg-[#7E22CE] border-[#00F0FF] items-center justify-center"
            >
              <Text style={{ fontSize: 54, lineHeight: 64 }}>🔊</Text>
              <Text className="text-white text-2xl font-black mt-1">
                Sprawdź wymowę
              </Text>
            </JuicyButton>
          </Animated.View>
        ) : (
          <>
            <Animated.View style={speakerAnimatedStyle}>
              <JuicyButton
                onPress={handlePronunciationCheck}
                accessibilityLabel="Posłuchaj jeszcze raz"
                className="py-3 px-5 rounded-2xl border-2 bg-[#1C2559] border-[#00F0FF] flex-row items-center justify-center gap-3"
              >
                <Text className="text-2xl">🔊</Text>
                <Text className="text-white text-lg font-extrabold">
                  Posłuchaj jeszcze raz
                </Text>
              </JuicyButton>
            </Animated.View>

            {playMode === "scored" ? (
              <View className="flex-row gap-4">
                {/* Minus Button (Incorrect) */}
                <View className="flex-1">
                  <JuicyButton
                    onPress={() => handleSelfScore(false)}
                    disabled={isTransitioning}
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
                    disabled={isTransitioning}
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
                disabled={isTransitioning}
                accessibilityLabel="Następna karta"
                className="bg-[#0284C7] border-4 border-[#00F0FF] py-5 rounded-3xl items-center justify-center"
              >
                <Text className="text-white text-2xl font-black">
                  Dalej ➔
                </Text>
              </JuicyButton>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
