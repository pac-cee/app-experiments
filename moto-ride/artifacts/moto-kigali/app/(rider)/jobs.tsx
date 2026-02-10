import { Feather } from "@expo/vector-icons";
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
import { getJobHistory } from "@/lib/riderService";
import { JobRecord } from "@/lib/mockData";

function StarRow({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Feather key={s} name="star" size={11} color={s <= rating ? "#F59E0B" : "#D1D5DB"} />
      ))}
    </View>
  );
}

function JobCard({ job }: { job: JobRecord }) {
  const colors = useColors();
  const date = new Date(job.date);
  const dateStr = date.toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-RW", { hour: "2-digit", minute: "2-digit" });
  const initials = job.customer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: job.status === "completed" ? colors.success : colors.muted }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.customerName, { color: colors.foreground }]}>{job.customer.name}</Text>
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>{dateStr} at {timeStr}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text style={[styles.price, { color: job.status === "completed" ? colors.success : colors.mutedForeground }]}>
            {job.status === "completed" ? `+${job.price.toLocaleString()} RWF` : "Cancelled"}
          </Text>
          {job.rating && <StarRow rating={job.rating} />}
        </View>
      </View>

      <View style={[styles.routeRow, { borderTopColor: colors.border }]}>
        <View style={styles.routePin}>
          <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.pinLine, { backgroundColor: colors.border }]} />
          <View style={[styles.pinDot, { backgroundColor: colors.secondary }]} />
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={[styles.locText, { color: colors.mutedForeground }]} numberOfLines={1}>{job.pickup.name}</Text>
          <Text style={[styles.locText, { color: colors.mutedForeground }]} numberOfLines={1}>{job.destination.name}</Text>
        </View>
        <View style={[styles.statusBadge, {
          backgroundColor: job.status === "completed" ? colors.success + "15" : colors.muted,
        }]}>
          <Text style={[styles.statusText, { color: job.status === "completed" ? colors.success : colors.mutedForeground }]}>
            {job.status === "completed" ? "Completed" : "Cancelled"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function JobsScreen() {
  const colors = useColors();
