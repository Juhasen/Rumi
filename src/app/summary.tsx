import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfettiBurst } from "@/components/confetti-burst";
import { JuicyButton } from "@/components/juicy-button";
import { ROUND_RULES, Topic, isRoundWon } from "@/data/challenges";
import { speakRoundSummary, stopSpeech } from "@/utils/audio";

export default function SummaryScreen() {
  const { topic: rawTopic, score: rawScore } = useLocalSearchParams<{
    topic?: string;
    score?: string;
  }>();

  const topic: Topic = rawTopic === "colors" ? "colors" : "alphabet";
  const score = Number.parseInt(rawScore ?? "0", 10) || 0;
  const total = ROUND_RULES[topic].roundLength;
  const threshold = ROUND_RULES[topic].winThreshold;
  const won = isRoundWon(topic, score);

  useEffect(() => {
    speakRoundSummary(won);
    return () => {
      stopSpeech();
    };
  }, [won]);

  const handleReplay = () => {
    stopSpeech();
    router.replace({
      pathname: topic === "colors" ? "/colors" : "/alphabet",
      params: { mode: "scored" },
    });
  };

  const handleReturnHome = () => {
    stopSpeech();
    router.replace("/");
  };

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
            onPress={handleReturnHome}
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
            onPress={handleReplay}
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
