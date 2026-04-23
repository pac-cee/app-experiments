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
