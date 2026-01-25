import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { UserRole } from "@/lib/mockData";

export default function RoleSelectScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);
    await setUser({ ...user, role: selected, status: "active" });
    setLoading(false);
    if (selected === "customer") {
      router.replace("/(tabs)/");
    } else {
      router.replace("/(auth)/rider-register");
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad }]}>
      <View style={styles.top}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary + "15" }]}>
          <MaterialCommunityIcons name="motorbike" size={38} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>How will you use MotoLink?</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Choose your role to get the best experience
        </Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: selected === "customer" ? colors.primary : colors.border,
              borderWidth: selected === "customer" ? 2.5 : 1.5,
            },
          ]}
          onPress={() => setSelected("customer")}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="user" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Customer</Text>
          <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
            Book moto-taxis and rides across Kigali at negotiated prices
          </Text>
          <View style={styles.cardFeatures}>
            {["Find nearby riders", "Negotiate prices", "Live tracking"].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Feather name="check" size={13} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
              </View>
            ))}
          </View>
          {selected === "customer" && (
            <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={12} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: selected === "rider" ? colors.secondary : colors.border,
              borderWidth: selected === "rider" ? 2.5 : 1.5,
            },
          ]}
          onPress={() => setSelected("rider")}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.secondary + "15" }]}>
            <MaterialCommunityIcons name="motorbike" size={32} color={colors.secondary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Rider</Text>
          <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
            Earn money by giving rides to customers in your area
          </Text>
          <View style={styles.cardFeatures}>
            {["See customer requests", "Agree your own price", "Track earnings"].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Feather name="check" size={13} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
              </View>
            ))}
          </View>
          {selected === "rider" && (
            <View style={[styles.selectedBadge, { backgroundColor: colors.secondary }]}>
              <Feather name="check" size={12} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: selected ? colors.primary : colors.muted,
            opacity: loading ? 0.7 : 1,
          },
        ]}
        onPress={handleContinue}
        disabled={!selected || loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.btnText, { color: selected ? "#fff" : colors.mutedForeground }]}>
            {selected === "rider" ? "Continue to Registration" : "Get Started"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  top: { alignItems: "center", paddingTop: 24, paddingBottom: 28, gap: 10 },
  logoCircle: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  cards: { flexDirection: "row", gap: 12, marginBottom: 24 },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  cardTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  cardDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  cardFeatures: { gap: 5, marginTop: 4 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  featureText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnText: { fontSize: 17, fontFamily: "Inter_700Bold" },
});
