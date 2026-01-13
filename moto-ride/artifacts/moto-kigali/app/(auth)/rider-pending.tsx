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
                  )}
                </View>
                <Text style={[styles.checkLabel, { color: item.done ? colors.foreground : colors.mutedForeground }]}>
                  {item.label}
                </Text>
                <Text style={[styles.checkStatus, { color: item.done ? colors.success : colors.secondary }]}>
                  {item.done ? "Done" : "Pending"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "25" }]}>
          <Feather name="bell" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            You'll receive an SMS notification once your account is approved.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.demoBtn, { backgroundColor: colors.success, borderColor: colors.success }]}
          onPress={handleSimulateApproval}
          activeOpacity={0.85}
        >
          <Feather name="zap" size={18} color="#fff" />
          <Text style={styles.demoBtnText}>Simulate Approval (Demo)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Feather name="log-out" size={15} color={colors.mutedForeground} />
          <Text style={[styles.logoutText, { color: colors.mutedForeground }]}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 },
  iconWrap: { marginBottom: 8 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  checklist: { gap: 12 },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 12 },
