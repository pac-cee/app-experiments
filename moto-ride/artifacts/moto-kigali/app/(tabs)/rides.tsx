import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { getRideHistory } from "@/lib/rideService";
import { RideRecord } from "@/lib/mockData";
import { StarRating } from "@/components/ui/StarRating";

function RideCard({ ride }: { ride: RideRecord }) {
  const colors = useColors();
  const isCompleted = ride.status === "completed";
  const date = new Date(ride.date);
  const dateStr = date.toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-RW", { hour: "2-digit", minute: "2-digit" });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.vehicleIcon, { backgroundColor: colors.primary + "15" }]}>
          <MaterialCommunityIcons name="motorbike" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={[styles.riderName, { color: colors.foreground }]}>{ride.rider.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: isCompleted ? "#DCFCE7" : "#FEF2F2" }]}>
              <Text style={[styles.statusText, { color: isCompleted ? "#166534" : "#991B1B" }]}>
                {isCompleted ? "Completed" : "Cancelled"}
              </Text>
