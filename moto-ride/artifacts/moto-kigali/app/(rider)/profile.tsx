import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useRider } from "@/context/RiderContext";
import { getJobHistory } from "@/lib/riderService";
import { JobRecord } from "@/lib/mockData";

function Avatar({ name, size = 70 }: { name: string; size?: number }) {
  const colors = useColors();
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }]}>
      <Text style={{ fontSize: size * 0.36, fontFamily: "Inter_700Bold", color: "#fff" }}>{initials}</Text>
    </View>
  );
}

function MenuItem({ icon, label, sublabel, onPress, danger = false, rightNode }: {
  icon: string; label: string; sublabel?: string; onPress: () => void; danger?: boolean; rightNode?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? "#FEE2E2" : colors.muted }]}>
        <Feather name={icon as any} size={18} color={danger ? colors.destructive : colors.foreground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, { color: danger ? colors.destructive : colors.foreground }]}>{label}</Text>
        {sublabel && <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{sublabel}</Text>}
      </View>
      {rightNode ?? <Feather name="chevron-right" size={18} color={colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

export default function RiderProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isOnline, setIsOnline } = useRider();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 84 : insets.bottom + 64;

  const [jobs, setJobs] = useState<JobRecord[]>([]);

  useEffect(() => {
    if (user) getJobHistory(user.id).then(setJobs);
  }, [user]);

  const completed = jobs.filter((j) => j.status === "completed");
  const totalEarnings = completed.reduce((sum, j) => sum + j.price, 0);
  const todayEarnings = completed
    .filter((j) => new Date(j.date).toDateString() === new Date().toDateString())
    .reduce((sum, j) => sum + j.price, 0);
  const avgRating = completed.filter((j) => j.rating).reduce((sum, j, _, arr) => sum + (j.rating ?? 0) / arr.length, 0);

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Avatar name={user.name} size={72} />
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
            <Text style={[styles.userPhone, { color: colors.mutedForeground }]}>{user.phone}</Text>
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success + "20" }]}>
              <Feather name="shield" size={12} color={colors.success} />
              <Text style={[styles.verifiedText, { color: colors.success }]}>Verified Rider</Text>
            </View>
          </View>
          {user.plate && (
            <View style={[styles.plateBadge, { backgroundColor: colors.foreground }]}>
              <Text style={[styles.plateText, { color: colors.background }]}>{user.plate}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="sun" size={20} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{todayEarnings.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Today (RWF)</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="trending-up" size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{totalEarnings.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total (RWF)</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="briefcase" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{completed.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rides</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="star" size={20} color="#F59E0B" />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rating</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ACCOUNT</Text>
          <MenuItem icon="user" label="Personal Info" sublabel={user.email ?? user.phone} onPress={() => {}} />
          <MenuItem icon="map-pin" label="Home Address" sublabel={user.homeAddress ?? "Not set"} onPress={() => {}} />
          <MenuItem
            icon="power"
            label="Status"
            sublabel={isOnline ? "Online — receiving requests" : "Offline"}
            onPress={() => setIsOnline(!isOnline)}
            rightNode={
              <View style={[styles.onlinePill, { backgroundColor: isOnline ? colors.success + "20" : colors.muted }]}>
                <View style={[styles.onlineDot, { backgroundColor: isOnline ? colors.success : colors.mutedForeground }]} />
                <Text style={[styles.onlinePillText, { color: isOnline ? colors.success : colors.mutedForeground }]}>
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            }
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>VEHICLE</Text>
          <MenuItem
            icon="truck"
            label="Vehicle Type"
            sublabel={user.vehicleType ? user.vehicleType.charAt(0).toUpperCase() + user.vehicleType.slice(1) : "Not set"}
            onPress={() => {}}
          />
          <MenuItem icon="credit-card" label="License Plate" sublabel={user.plate ?? "Not set"} onPress={() => {}} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>SUPPORT</Text>
          <MenuItem icon="help-circle" label="Help & Support" onPress={() => {}} />
          <MenuItem icon="file-text" label="Terms of Service" onPress={() => {}} />
