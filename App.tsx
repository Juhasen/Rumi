import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-amber-100">
      <Text className="text-3xl font-bold text-amber-800">Rumi</Text>
      <Text className="mt-2 text-lg text-amber-700">Nauka alfabetu i kolorów</Text>
      <StatusBar style="auto" />
    </View>
  );
}
