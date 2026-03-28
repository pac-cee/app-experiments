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
      } else if (req.status === "declined") {
        setPhase("declined");
        clearInterval(interval);
      } else if (req.status === "timeout") {
        setPhase("timeout");
        clearInterval(interval);
      } else if (req.status === "cancelled") {
        setPhase("cancelled");
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [requestId, phase]);

  const handleCancel = () => {
    if (requestId) cancelRequest(requestId);
    router.back();
  };

  const handleRetry = () => {
    router.back();
  };

  const phaseConfig: Record<Phase, { title: string; subtitle: string; icon: string; iconColor: string; bg: string }> = {
    sending: {
      title: "Sending request...",
      subtitle: "Connecting you with your rider",
      icon: "send",
      iconColor: colors.primary,
      bg: colors.primary + "18",
    },
    waiting: {
      title: `Waiting for ${riderName || "rider"}`,
      subtitle: "Your rider has received your request",
      icon: "clock",
      iconColor: colors.secondary,
      bg: colors.secondary + "18",
    },
    viewed: {
      title: `${riderName || "Rider"} is reviewing`,
      subtitle: "They're checking your route details",
      icon: "eye",
      iconColor: colors.primary,
      bg: colors.primary + "18",
    },
    accepted: {
      title: `${riderName || "Rider"} accepted!`,
      subtitle: "Confirming your booking...",
      icon: "check-circle",
      iconColor: colors.success,
      bg: colors.success + "18",
    },
    declined: {
      title: "Request declined",
      subtitle: `${riderName || "The rider"} is unavailable right now. Try another rider.`,
      icon: "x-circle",
      iconColor: colors.destructive,
      bg: "#FEE2E2",
    },
    timeout: {
      title: "No response",
      subtitle: "The rider didn't respond in time. Please try another rider.",
      icon: "clock",
      iconColor: colors.destructive,
      bg: "#FEE2E2",
    },
    cancelled: {
      title: "Request cancelled",
      subtitle: "You cancelled the request.",
      icon: "x",
      iconColor: colors.mutedForeground,
      bg: colors.muted,
    },
  };

  const cfg = phaseConfig[phase];
  const isError = phase === "declined" || phase === "timeout" || phase === "cancelled";
  const isSuccess = phase === "accepted";
  const isLoading = !isError && !isSuccess;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad }]}>
      <View style={styles.body}>
        {isSuccess ? (
          <Animated.View style={[styles.successWrap, { transform: [{ scale: successScale }] }]}>
            <View style={[styles.successCircle, { backgroundColor: colors.success + "20" }]}>
              <Feather name="check-circle" size={64} color={colors.success} />
            </View>
          </Animated.View>
        ) : (
          <View style={styles.iconSection}>
            <Animated.View
              style={[
                styles.ring,
                { borderColor: cfg.iconColor + "30", transform: [{ scale: isLoading ? ringAnim : 1 }] },
              ]}
            />
            <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
              <Feather name={cfg.icon as any} size={40} color={cfg.iconColor} />
            </View>
          </View>
        )}

        <Text style={[styles.title, { color: colors.foreground }]}>{cfg.title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{cfg.subtitle}</Text>

        {isLoading && <PulsingDots color={cfg.iconColor} />}

        {isLoading && (
          <View style={[styles.riderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.riderAvatar, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="motorbike" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.riderName, { color: colors.foreground }]}>{riderName || "Your Rider"}</Text>
              <View style={[styles.statusPill, { backgroundColor: colors.secondary + "18" }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.statusPillText, { color: colors.secondary }]}>Request sent</Text>
              </View>
            </View>
          </View>
        )}

        {isError && (
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={handleRetry}
            activeOpacity={0.85}
          >
            <Feather name="refresh-cw" size={18} color="#fff" />
            <Text style={styles.retryBtnText}>Try Another Rider</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
          <Feather name="x" size={16} color={colors.mutedForeground} />
          <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 },
  iconSection: { position: "relative", alignItems: "center", justifyContent: "center", width: 120, height: 120 },
  ring: { position: "absolute", width: 110, height: 110, borderRadius: 55, borderWidth: 2 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center" },
  successWrap: {},
  successCircle: { width: 110, height: 110, borderRadius: 55, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22, marginTop: -8 },
  dotsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  riderCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  riderAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  riderName: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
