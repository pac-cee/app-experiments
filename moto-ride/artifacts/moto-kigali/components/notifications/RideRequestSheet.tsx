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
    >
      <View style={[styles.handle, { backgroundColor: colors.border }]} />

      <View style={[styles.alertBadge, { backgroundColor: "#FF6F00" }]}>
        <Feather name="bell" size={13} color="#fff" />
        <Text style={styles.alertText}>New Ride Request!</Text>
      </View>

      <View style={styles.customerRow}>
        <Animated.View style={[styles.avatarWrap, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: colors.card }]} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.customerName, { color: colors.foreground }]}>{req.customerName}</Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
              {req.customerRating.toFixed(1)} · {req.customerRides} rides
            </Text>
          </View>
        </View>
        <View style={[styles.timerCircle, { borderColor: timerColor }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={[styles.routeCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <View style={styles.routeRow}>
          <View style={styles.routePin}>
            <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.pinLine, { backgroundColor: colors.border }]} />
            <View style={[styles.pinDot, { backgroundColor: colors.secondary }]} />
          </View>
          <View style={{ flex: 1, gap: 12 }}>
            <View>
              <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>PICKUP</Text>
              <Text style={[styles.routeLoc, { color: colors.foreground }]} numberOfLines={1}>{req.pickup.name}</Text>
            </View>
            <View>
              <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>DROP-OFF</Text>
              <Text style={[styles.routeLoc, { color: colors.foreground }]} numberOfLines={1}>{req.destination.name}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.declineBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
          onPress={() => onDecline(req)}
          activeOpacity={0.8}
        >
          <Feather name="x" size={20} color={colors.destructive} />
          <Text style={[styles.declineBtnText, { color: colors.destructive }]}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.acceptBtn, { backgroundColor: colors.success }]}
          onPress={() => onAccept(req)}
          activeOpacity={0.85}
        >
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 14,
    elevation: 30,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    zIndex: 1000,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  alertBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
