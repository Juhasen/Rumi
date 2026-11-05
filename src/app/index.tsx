import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { JuicyButton } from "@/components/juicy-button";
import { PlayMode } from "@/data/challenges";
import { stopSpeech } from "@/utils/audio";

export default function HomeScreen() {
  const [playMode, setPlayMode] = useState<PlayMode>("scored");

  const startAlphabet = () => {
    stopSpeech();
    router.push({ pathname: "/alphabet", params: { mode: playMode } });
  };

  const startColors = () => {
    stopSpeech();
    router.push({ pathname: "/colors", params: { mode: playMode } });
  };

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
          onPress={startAlphabet}
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
          onPress={startColors}
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
