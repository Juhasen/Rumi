import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const HUNTRIX_PARTICLES = [
  { id: 0, color: "#00F0FF", left: "8%", delay: 0, dx: -18, size: 14 },
  { id: 1, color: "#FF2A85", left: "16%", delay: 120, dx: 22, size: 12 },
  { id: 2, color: "#A855F7", left: "24%", delay: 60, dx: -14, size: 16 },
  { id: 3, color: "#FACC15", left: "33%", delay: 210, dx: 16, size: 12 },
  { id: 4, color: "#00F0FF", left: "42%", delay: 90, dx: -20, size: 15 },
  { id: 5, color: "#FF2A85", left: "51%", delay: 30, dx: 18, size: 14 },
  { id: 6, color: "#22C55E", left: "60%", delay: 170, dx: -16, size: 12 },
  { id: 7, color: "#A855F7", left: "69%", delay: 80, dx: 24, size: 16 },
  { id: 8, color: "#00F0FF", left: "78%", delay: 140, dx: -22, size: 13 },
  { id: 9, color: "#FACC15", left: "86%", delay: 40, dx: 14, size: 15 },
  { id: 10, color: "#FF2A85", left: "92%", delay: 190, dx: -15, size: 12 },
] as const;

function ConfettiPiece({
  color,
  left,
  delay,
  dx,
  size,
}: (typeof HUNTRIX_PARTICLES)[number]) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    progress.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(1, {
              duration: 2100,
              easing: Easing.bezier(0.23, 1, 0.32, 1),
              reduceMotion: ReduceMotion.System,
            })
          ),
          -1,
          false
        )
      )
    );
  }, [delay, progress, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: p < 0.85 ? 1 : 1 - (p - 0.85) / 0.15,
      transform: [
        { translateY: p * 540 },
        { translateX: Math.sin(p * Math.PI * 3) * dx },
        { rotate: `${Math.round(p * 360)}deg` },
      ],
    };
  });

  if (reducedMotion) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: -20,
          left,
          width: size,
          height: size * 1.6,
          borderRadius: 4,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ConfettiBurst() {
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden z-20"
    >
      {HUNTRIX_PARTICLES.map((p) => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </View>
  );
}
