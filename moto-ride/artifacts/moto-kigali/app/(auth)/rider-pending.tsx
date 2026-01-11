import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const CHECKLIST = [
  { label: "Identity verification", done: true },
  { label: "Vehicle registration check", done: false },
  { label: "Driver's license validation", done: false },
  { label: "Background check", done: false },
];

export default function RiderPendingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSimulateApproval = async () => {
    if (!user) return;
    await setUser({ ...user, status: "approved" });
    router.replace("/(rider)/home");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/welcome");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad }]}>
      <View style={styles.body}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.secondary + "20" }]}>
            <MaterialCommunityIcons name="clock-outline" size={48} color={colors.secondary} />
          </View>
        </Animated.View>

        <Text style={[styles.title, { color: colors.foreground }]}>Application Under Review</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Our team is verifying your details. This usually takes up to 24 hours.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Verification Progress</Text>
          <View style={styles.checklist}>
            {CHECKLIST.map((item, i) => (
              <View key={i} style={styles.checkItem}>
                <View style={[styles.checkCircle, { backgroundColor: item.done ? colors.success + "20" : colors.muted }]}>
                  {item.done ? (
                    <Feather name="check" size={13} color={colors.success} />
                  ) : (
                    <Feather name="clock" size={13} color={colors.mutedForeground} />
