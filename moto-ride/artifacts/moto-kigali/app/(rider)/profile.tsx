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
