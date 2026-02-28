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

        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.menuSection, { color: colors.mutedForeground }]}>Account</Text>
          <MenuItem icon="edit-2" label="Edit Profile" sublabel="Update name, photo, email" onPress={() => {}} />
          <MenuItem icon="bell" label="Notifications" sublabel="Manage alerts" onPress={() => {}} />
          <MenuItem icon="shield" label="Safety" sublabel="Emergency contacts" onPress={() => {}} />
        </View>

        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.menuSection, { color: colors.mutedForeground }]}>Support</Text>
          <MenuItem icon="help-circle" label="Help & FAQ" onPress={() => {}} />
          <MenuItem icon="message-square" label="Contact Support" onPress={() => {}} />
        </View>

        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuItem icon="log-out" label="Sign Out" onPress={handleLogout} danger />
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>MotoLink v1.0 · Kigali, Rwanda</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: "Inter_700Bold" },
  userName: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  menuSection: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  menuLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  menuSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  version: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 8 },
});
