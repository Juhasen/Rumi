import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { JuicyButton } from "@/components/juicy-button";
import { PlayMode } from "@/data/challenges";
import { stopSpeech } from "@/utils/audio";

const RUMI_LOGO = require("../../assets/logo.png");

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

  const startAnimals = () => {
    stopSpeech();
    router.push({ pathname: "/animals", params: { mode: playMode } });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#120824] px-6 py-3 justify-between">
      <StatusBar style="light" />

      {/* Header with Rumi Logo */}
      <View className="flex-row items-center justify-center gap-3.5 mt-1">
        <View className="w-20 h-20 rounded-3xl border-2 border-[#00F0FF] overflow-hidden bg-[#120824] items-center justify-center">
          <Image
            source={RUMI_LOGO}
            style={{ width: 76, height: 76, borderRadius: 20 }}
            resizeMode="cover"
          />
        </View>
        <View className="items-start">
          <View className="bg-[#241046] border-2 border-[#00F0FF] px-3 py-0.5 rounded-full mb-1.5">
            <Text className="text-[#00F0FF] font-extrabold tracking-widest text-xs">
              ★ HUNTR/X • RUMI ★
            </Text>
          </View>
          <Text className="text-white text-3xl font-black tracking-tight">
            Cześć Laura! 💜
          </Text>
        </View>
      </View>

      {/* Play Mode Toggle (Na punkty vs Bez punktów vs Słownik) */}
      <View className="bg-[#1E0E3A] p-2 rounded-3xl border-2 border-purple-700/70 flex-row gap-1.5 my-2">
        <View className="flex-1">
          <JuicyButton
            onPress={() => setPlayMode("scored")}
            accessibilityLabel="Tryb gry na punkty"
            className={`py-2.5 px-2 rounded-2xl items-center justify-center ${
              playMode === "scored"
                ? "bg-[#9333EA] border-2 border-[#00F0FF]"
                : "bg-transparent"
            }`}
          >
            <Text className="text-2xl mb-0.5">🏆</Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className={`font-extrabold text-xs ${
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
            className={`py-2.5 px-2 rounded-2xl items-center justify-center ${
              playMode === "practice"
                ? "bg-[#0284C7] border-2 border-[#00F0FF]"
                : "bg-transparent"
            }`}
          >
            <Text className="text-2xl mb-0.5">📖</Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className={`font-extrabold text-xs ${
                playMode === "practice" ? "text-white" : "text-purple-300"
              }`}
            >
              Bez punktów
            </Text>
          </JuicyButton>
        </View>

        <View className="flex-1">
          <JuicyButton
            onPress={() => setPlayMode("catalog")}
            accessibilityLabel="Tryb słownika — lista wszystkich elementów do odsłuchania"
            className={`py-2.5 px-2 rounded-2xl items-center justify-center ${
              playMode === "catalog"
                ? "bg-[#DB2777] border-2 border-[#00F0FF]"
                : "bg-transparent"
            }`}
          >
            <Text className="text-2xl mb-0.5">🔊</Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className={`font-extrabold text-xs ${
                playMode === "catalog" ? "text-white" : "text-purple-300"
              }`}
            >
              Słownik
            </Text>
          </JuicyButton>
        </View>
      </View>

      {/* Topic Tiles */}
      <View className="flex-1 justify-center gap-3.5">
        {/* Polish Alphabet Tile */}
        <JuicyButton
          onPress={startAlphabet}
          accessibilityLabel="Nauka polskiego alfabetu"
          className="w-full bg-[#231145] border-4 border-[#A855F7] rounded-3xl p-4 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <View className="bg-purple-900/80 self-start px-3 py-0.5 rounded-full mb-1.5 border border-purple-400/50">
              <Text className="text-purple-200 text-xs font-bold">
                POLSKI •{" "}
                {playMode === "scored"
                  ? "10 LITER"
                  : playMode === "practice"
                  ? "SWOBODNIE"
                  : "LISTA 32"}
              </Text>
            </View>
            <Text className="text-white text-2xl font-black">Alfabet</Text>
            <Text className="text-purple-200 text-xs font-medium mt-0.5">
              Duże i małe litery od A do Ż
            </Text>
          </View>
          <View className="bg-[#3B1771] border-2 border-[#00F0FF] w-20 h-20 rounded-2xl flex-row items-center justify-center px-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-[#00F0FF] text-2xl font-black text-center"
            >
              A{"\u00A0"}a
            </Text>
          </View>
        </JuicyButton>

        {/* English Colors Tile */}
        <JuicyButton
          onPress={startColors}
          accessibilityLabel="Nauka kolorów po angielsku"
          className="w-full bg-[#161B44] border-4 border-[#00F0FF] rounded-3xl p-4 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <View className="bg-sky-900/80 self-start px-3 py-0.5 rounded-full mb-1.5 border border-cyan-400/50">
              <Text className="text-cyan-200 text-xs font-bold">
                ENGLISH •{" "}
                {playMode === "scored"
                  ? "5 KOLORÓW"
                  : playMode === "practice"
                  ? "SWOBODNIE"
                  : "LISTA 11"}
              </Text>
            </View>
            <Text className="text-white text-2xl font-black">Kolory</Text>
            <Text className="text-cyan-200 text-xs font-medium mt-0.5">
              Angielskie nazwy kolorów
            </Text>
          </View>
          <View className="bg-[#1E2A63] border-2 border-[#FF2A85] w-20 h-20 rounded-2xl items-center justify-center">
            <Text className="text-4xl">🎨</Text>
          </View>
        </JuicyButton>

        {/* English Animals Tile */}
        <JuicyButton
          onPress={startAnimals}
          accessibilityLabel="Nauka zwierząt po angielsku"
          className="w-full bg-[#2A103C] border-4 border-[#FF2A85] rounded-3xl p-4 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <View className="bg-pink-900/80 self-start px-3 py-0.5 rounded-full mb-1.5 border border-pink-400/50">
              <Text className="text-pink-200 text-xs font-bold">
                ENGLISH •{" "}
                {playMode === "scored"
                  ? "5 ZWIERZĄT"
                  : playMode === "practice"
                  ? "SWOBODNIE"
                  : "LISTA 12"}
              </Text>
            </View>
            <Text className="text-white text-2xl font-black">Zwierzęta</Text>
            <Text className="text-pink-200 text-xs font-medium mt-0.5">
              Angielskie nazwy zwierząt
            </Text>
          </View>
          <View className="bg-[#44155B] border-2 border-[#00F0FF] w-20 h-20 rounded-2xl items-center justify-center">
            <Text className="text-4xl">🦁</Text>
          </View>
        </JuicyButton>
      </View>

      {/* Footer */}
      <View className="items-center pb-1">
        <Text className="text-purple-400 text-xs font-semibold">
          {playMode === "scored"
            ? "Wygrana: 8/10 alfabet • 4/5 kolory i zwierzęta"
            : playMode === "practice"
            ? "Tryb nauki: ćwicz we własnym tempie bez limitu"
            : "Słownik: kliknij dowolny wiersz, aby odsłuchać wymowę"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
