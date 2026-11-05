import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

interface JuicyButtonProps {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

export function JuicyButton({
  onPress,
  disabled = false,
  className,
  style,
  accessibilityLabel,
  children,
}: JuicyButtonProps) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: disabled ? 0.38 : 1,
  }));

  const handlePressIn = () => {
    if (disabled || reducedMotion) return;
    scale.set(
      withTiming(0.95, {
        duration: 110,
        easing: EASE_OUT,
        reduceMotion: ReduceMotion.System,
      })
    );
  };

  const handlePressOut = () => {
    if (disabled || reducedMotion) return;
    scale.set(
      withSpring(1, {
        duration: 240,
        dampingRatio: 0.72,
        reduceMotion: ReduceMotion.System,
      })
    );
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      hitSlop={8}
      pressRetentionOffset={16}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      <Animated.View className={className} style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
