import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { useColors } from "@/hooks/useColors";
import { useRider } from "@/context/RiderContext";

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Feather key={s} name="star" size={14} color={s <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"} />
      ))}
    </View>
  );
}

export default function CustomerDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { pendingCustomer } = useRider();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!pendingCustomer) {
    router.back();
    return null;
  }

  const req = pendingCustomer;
  const initials = req.customer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const handleAgreePrice = () => {
    router.push("/rider-booking/price-accept");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Customer Request</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={{ height: 200, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <MockMap pickup={req.pickup} destination={req.destination} height={200} />
        </View>

        <View style={[styles.customerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.customerName, { color: colors.foreground }]}>{req.customer.name}</Text>
            <StarRow rating={req.customer.rating} />
            <Text style={[styles.statsText, { color: colors.mutedForeground }]}>
              {req.customer.rating.toFixed(1)} rating · {req.customer.rides} rides
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.success + "18" }]}
