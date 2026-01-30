import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export default function WelcomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <LinearGradient colors={["#0D47A1", "#1565C0", "#1976D2"]} style={styles.container}>
      <View style={[styles.content, { paddingTop: topPad + 40, paddingBottom: bottomPad + 20 }]}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="motorbike" size={52} color="#1565C0" />
          </View>
          <Text style={styles.appName}>MotoLink</Text>
          <Text style={styles.tagline}>Your ride, your price.{"\n"}Anywhere in Kigali.</Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: "map-marker-radius", text: "Real-time riders near you" },
            { icon: "handshake", text: "Negotiate your price directly" },
            { icon: "shield-check", text: "Verified riders only" },
          ].map(({ icon, text }) => (
            <View key={text} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name={icon as any} size={20} color="#1565C0" />
              </View>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => router.push("/(auth)/signup")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>I have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    gap: 16,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 26,
  },
  features: {
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 18,
    padding: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
