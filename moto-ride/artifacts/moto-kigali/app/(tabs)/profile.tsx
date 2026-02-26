import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

function Avatar({ name, size = 70 }: { name: string; size?: number }) {
  const colors = useColors();
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.36, color: "#fff" }]}>{initials}</Text>
    </View>
  );
}

function MenuItem({ icon, label, sublabel, onPress, danger = false }: {
  icon: string; label: string; sublabel?: string; onPress: () => void; danger?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? "#FEF2F2" : colors.muted }]}>
        <Feather name={icon as any} size={18} color={danger ? colors.destructive : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, { color: danger ? colors.destructive : colors.foreground }]}>{label}</Text>
        {sublabel && <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{sublabel}</Text>}
      </View>
      {!danger && <Feather name="chevron-right" size={18} color={colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout().then(() => router.replace("/(auth)/welcome"));
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => logout().then(() => router.replace("/(auth)/welcome")) },
      ]);
    }
  };

  if (!user) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 80 }]}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Avatar name={user.name} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
            <View style={styles.infoRow}>
              <Feather name="phone" size={13} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{user.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="mail" size={13} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]} numberOfLines={1}>{user.email}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statsRow]}>
          {[
            { label: "Total Rides", value: "4", icon: "navigation" },
            { label: "Avg Rating", value: "4.8", icon: "star" },
            { label: "Member Since", value: "May 2025", icon: "calendar" },
          ].map(({ label, value, icon }) => (
            <View key={label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={icon as any} size={18} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
            </View>
          ))}
        </View>

