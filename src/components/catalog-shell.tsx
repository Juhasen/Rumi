import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { JuicyButton } from "@/components/juicy-button";
import {
  Challenge,
  Topic,
  getPoolForTopic,
} from "@/data/challenges";
import { speakChallenge, stopSpeech } from "@/utils/audio";

interface CatalogShellProps {
  topic: Topic;
}

const TOPIC_TITLES: Record<Topic, string> = {
  alphabet: "Alfabet (A–Ż)",
  colors: "Kolory (EN)",
  animals: "Zwierzęta (EN)",
};

export function CatalogShell({ topic }: CatalogShellProps) {
  const items = getPoolForTopic(topic);
  const [activeId, setActiveId] = useState<string | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
      stopSpeech();
    };
  }, []);

  const returnToMenu = () => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    stopSpeech();
    router.replace("/");
  };

  const handleSelectItem = (item: Challenge) => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    setActiveId(item.id);

    const clearHighlight = () => {
      setActiveId((prev) => (prev === item.id ? null : prev));
    };

    speakChallenge(item, clearHighlight);
    clearTimerRef.current = setTimeout(clearHighlight, 900);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#120824] px-5 pt-3 pb-2">
      <StatusBar style="light" />

      {/* Top HUD */}
      <View className="flex-row items-center justify-between mb-3">
        <JuicyButton
          onPress={returnToMenu}
          accessibilityLabel="Wróć do domu"
          className="bg-[#231242] border-2 border-purple-400 px-4 py-2 rounded-2xl items-center justify-center"
        >
          <Text style={{ fontSize: 28, lineHeight: 34 }}>🏠</Text>
        </JuicyButton>

        <View className="bg-[#1F103A] border border-[#00F0FF]/60 px-4 py-2 rounded-2xl">
          <Text className="text-[#00F0FF] font-extrabold text-base">
            🔊 {TOPIC_TITLES[topic]}
          </Text>
        </View>

        <View className="w-14" />
      </View>

      {/* Scrollable List of All Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, gap: 10 }}
        renderItem={({ item }) => {
          const isActive = activeId === item.id;

          return (
            <JuicyButton
              onPress={() => handleSelectItem(item)}
              accessibilityLabel={`Odtwórz wymowę: ${item.spoken}`}
              className={`w-full rounded-3xl p-3.5 flex-row items-center justify-between border-2 ${
                isActive
                  ? "bg-[#2C1458] border-[#00F0FF]"
                  : "bg-[#1F103C] border-purple-500/60"
              }`}
            >
              {item.kind === "alphabet" && (
                <View className="flex-row items-center flex-1 gap-3.5 pr-2">
                  <View className="bg-[#140929] border-2 border-[#00F0FF] w-24 h-16 rounded-2xl flex-row items-center justify-center px-2">
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      className="text-white text-2xl font-black"
                    >
                      {item.upper}
                      {"\u00A0"}
                      <Text className="text-[#F0ABFC]">{item.lower}</Text>
                    </Text>
                  </View>

                  <Image
                    source={item.image}
                    style={{ width: 52, height: 52 }}
                    resizeMode="contain"
                  />

                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-white text-lg font-black"
                    >
                      {item.exampleWord}
                    </Text>
                    <Text className="text-purple-300 text-xs font-bold">
                      Wymowa: „{item.spoken}”
                    </Text>
                  </View>
                </View>
              )}

              {item.kind === "colors" && (
                <View className="flex-row items-center flex-1 gap-4 pr-2">
                  <View
                    style={{ backgroundColor: item.hex }}
                    className="w-16 h-16 rounded-2xl border-4 border-white"
                  />
                  <View className="flex-1">
                    <Text className="text-white text-2xl font-black">
                      {item.nameEn}
                    </Text>
                    <Text className="text-purple-200 text-sm font-bold">
                      {item.namePl}
                    </Text>
                  </View>
                </View>
              )}

              {item.kind === "animals" && (
                <View className="flex-row items-center flex-1 gap-4 pr-2">
                  <View className="bg-[#140929] border-2 border-[#FF2A85] w-16 h-16 rounded-2xl items-center justify-center p-1.5">
                    <Image
                      source={item.image}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-2xl font-black">
                      {item.nameEn}
                    </Text>
                    <Text className="text-purple-200 text-sm font-bold">
                      {item.namePl}
                    </Text>
                  </View>
                </View>
              )}

              <View
                className={`w-12 h-12 rounded-2xl items-center justify-center border ${
                  isActive
                    ? "bg-[#7E22CE] border-[#00F0FF]"
                    : "bg-[#2B1454] border-purple-400/50"
                }`}
              >
                <Text style={{ fontSize: 22, lineHeight: 28 }}>🔊</Text>
              </View>
            </JuicyButton>
          );
        }}
      />
    </SafeAreaView>
  );
}
