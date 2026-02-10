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
