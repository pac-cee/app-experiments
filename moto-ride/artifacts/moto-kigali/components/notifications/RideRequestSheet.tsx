import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { BrokerRequest } from "@/context/BrokerContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = 340;

interface Props {
  request: BrokerRequest | null;
  onAccept: (req: BrokerRequest) => void;
  onDecline: (req: BrokerRequest) => void;
}

export function RideRequestSheet({ request, onAccept, onDecline }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentRequest, setCurrentRequest] = useState<BrokerRequest | null>(null);

  useEffect(() => {
    if (request && (request.status === "pending" || request.status === "viewed")) {
      setCurrentRequest(request);
      setTimeLeft(30);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else if (!request || (request.status !== "pending" && request.status !== "viewed")) {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT + 20,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        if (!request) setCurrentRequest(null);
      });
    }
  }, [request?.id, request?.status]);

  useEffect(() => {
    if (!currentRequest) return;
    if (timeLeft <= 0) {
      dismiss();
      return;
    }
    const t = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, currentRequest]);

  const dismiss = () => {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT + 20,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  if (!currentRequest) return null;

  const req = currentRequest;
  const initials = req.customerName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const timerColor = timeLeft <= 10 ? "#EF4444" : timeLeft <= 20 ? colors.secondary : colors.success;
  const bottomPad = Platform.OS === "web" ? 90 : insets.bottom + 72;

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          backgroundColor: colors.card,
          paddingBottom: bottomPad,
          transform: [{ translateY: slideAnim }],
          shadowColor: "#000",
        },
      ]}
