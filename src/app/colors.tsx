import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { CatalogShell } from "@/components/catalog-shell";
import { ChallengeShell } from "@/components/challenge-shell";
import { PlayMode } from "@/data/challenges";

export default function ColorsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  if (mode === "catalog") {
    return <CatalogShell topic="colors" />;
  }

  const playMode: PlayMode = mode === "practice" ? "practice" : "scored";

  return (
    <ChallengeShell
      topic="colors"
      playMode={playMode}
      renderCard={(challenge, pronunciationChecked) => {
        if (challenge.kind !== "colors") return null;

        return (
          <View className="w-full items-center">
            <Text className="text-cyan-200 text-xs font-extrabold uppercase tracking-widest mb-4">
              Jaki to kolor po angielsku?
            </Text>

            {/* Color Swatch inside high-contrast thick white frame */}
            <View
              style={{ backgroundColor: challenge.hex }}
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
                  {challenge.nameEn}
                </Text>
                <Text
                  style={{ width: "100%", textAlign: "center" }}
                  className="text-purple-300 text-base font-semibold mt-0.5"
                >
                  ({challenge.namePl})
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
        );
      }}
    />
  );
}
