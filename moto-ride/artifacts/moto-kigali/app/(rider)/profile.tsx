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

