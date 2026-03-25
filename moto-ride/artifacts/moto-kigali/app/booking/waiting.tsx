import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBroker } from "@/context/BrokerContext";

type Phase = "sending" | "waiting" | "viewed" | "accepted" | "declined" | "timeout" | "cancelled";

const DOT_COUNT = 3;

function PulsingDots({ color }: { color: string }) {
  const anims = Array.from({ length: DOT_COUNT }, () => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay((DOT_COUNT - i - 1) * 200),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.dotsRow}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: color, opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }] },
          ]}
        />
      ))}
    </View>
  );
}

export default function WaitingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const { getRequest, cancelRequest } = useBroker();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [phase, setPhase] = useState<Phase>("sending");
  const [riderName, setRiderName] = useState("");
  const successScale = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!requestId) return;
    const interval = setInterval(() => {
      const req = getRequest(requestId);
      if (!req) return;
      setRiderName(req.rider.name.split(" ")[0]);

      if (req.status === phase) return;

      if (req.status === "sending") setPhase("sending");
      else if (req.status === "pending") setPhase("waiting");
      else if (req.status === "viewed") setPhase("viewed");
      else if (req.status === "accepted") {
        setPhase("accepted");
        clearInterval(interval);
        Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 6 }).start();
        setTimeout(() => {
          router.replace("/booking/price-confirm");
        }, 2200);
