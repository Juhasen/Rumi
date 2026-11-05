import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { ChallengeShell } from "@/components/challenge-shell";
import { JuicyButton } from "@/components/juicy-button";
import { PlayMode } from "@/data/challenges";

export default function AlphabetScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const playMode: PlayMode = mode === "practice" ? "practice" : "scored";
  const [revealedHintId, setRevealedHintId] = useState<string | null>(null);

  return (
    <ChallengeShell
      topic="alphabet"
      playMode={playMode}
      renderCard={(challenge) => {
        if (challenge.kind !== "alphabet") return null;

        const isHintVisible = revealedHintId === challenge.id;

        return (
          <View className="w-full items-center">
            <Text className="text-purple-300 text-xs font-extrabold uppercase tracking-widest mb-3">
              Powiedz na głos, jaka to litera:
            </Text>

            {/* Side-by-side Uppercase (left) & Lowercase (right) */}
            <View className="flex-row items-stretch justify-center w-full gap-4 py-1">
              <View className="flex-1 items-center justify-center bg-[#140929] border-2 border-[#00F0FF]/70 rounded-3xl py-4 px-2">
                <Text className="text-[#00F0FF]/80 text-xs font-bold mb-1">
                  DUŻA
                </Text>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 76,
                    lineHeight: 110,
                    includeFontPadding: true,
                  }}
                  className="text-white font-black"
                >
                  {challenge.upper}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center bg-[#140929] border-2 border-[#FF2A85]/70 rounded-3xl py-4 px-2">
                <Text className="text-[#FF2A85]/90 text-xs font-bold mb-1">
                  MAŁA
                </Text>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 76,
                    lineHeight: 110,
                    includeFontPadding: true,
                  }}
                  className="text-[#F0ABFC] font-black"
                >
                  {challenge.lower}
                </Text>
              </View>
            </View>

            {/* Hint Button or Revealed Example Picture & Word (Practice Mode only) */}
            {playMode === "practice" && (
              <View className="mt-4 w-full">
                {!isHintVisible ? (
                  <JuicyButton
                    onPress={() => setRevealedHintId(challenge.id)}
                    accessibilityLabel="Pokaż podpowiedź z obrazkiem"
                    className="w-full bg-[#2B1454] border-2 border-[#FACC15] rounded-2xl py-3.5 px-4 flex-row items-center justify-center gap-3"
                  >
                    <Text style={{ fontSize: 28, lineHeight: 34 }}>💡</Text>
                    <Text className="text-[#FACC15] text-xl font-black">
                      Podpowiedź
                    </Text>
                  </JuicyButton>
                ) : (
                  <View className="w-full bg-[#140929] border-2 border-[#00F0FF] rounded-2xl py-2.5 px-4 flex-row items-center justify-center gap-4">
                    <Image
                      source={challenge.image}
                      style={{ width: 68, height: 68 }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{ fontSize: 26, lineHeight: 34 }}
                      className="text-[#00F0FF] font-black"
                    >
                      {challenge.exampleWord}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
