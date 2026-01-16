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
