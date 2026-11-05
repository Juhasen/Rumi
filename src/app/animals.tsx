import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { ChallengeShell } from "@/components/challenge-shell";
import { PlayMode } from "@/data/challenges";

export default function AnimalsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const playMode: PlayMode = mode === "practice" ? "practice" : "scored";

  return (
    <ChallengeShell
      topic="animals"
      playMode={playMode}
      renderCard={(challenge, pronunciationChecked) => {
        if (challenge.kind !== "animals") return null;

        return (
          <View className="w-full items-center">
            <Text className="text-pink-200 text-xs font-extrabold uppercase tracking-widest mb-4">
              Jakie to zwierzę po angielsku?
            </Text>

            {/* Animal Illustration inside glowing HUNTR/X frame */}
            <View className="w-52 h-44 rounded-3xl bg-[#140929] border-4 border-[#FF2A85] items-center justify-center mb-3 p-4">
              <Image
                source={challenge.image}
                style={{ width: 132, height: 132 }}
                resizeMode="contain"
              />
            </View>

            {/* Reveal English Animal Name after Pronunciation Check */}
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
                  ❓ Nazwij zwierzę i kliknij głośniczek
                </Text>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
