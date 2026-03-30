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
              onPress={() => Linking.openURL(`tel:${req.customer.phone}`)}
            >
              <Feather name="phone" size={18} color={colors.success} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary + "18" }]}
              onPress={() => Linking.openURL(`sms:${req.customer.phone}`)}
            >
              <Feather name="message-square" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ROUTE</Text>
          <View style={styles.routeRow}>
            <View style={styles.routePin}>
              <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.pinLine, { backgroundColor: colors.border }]} />
              <View style={[styles.pinDot, { backgroundColor: colors.secondary }]} />
            </View>
            <View style={{ flex: 1, gap: 20 }}>
              <View>
                <Text style={[styles.routeLocLabel, { color: colors.mutedForeground }]}>PICKUP</Text>
                <Text style={[styles.routeLocName, { color: colors.foreground }]}>{req.pickup.name}</Text>
                <Text style={[styles.routeLocAddr, { color: colors.mutedForeground }]}>{req.pickup.address}</Text>
              </View>
              <View>
                <Text style={[styles.routeLocLabel, { color: colors.mutedForeground }]}>DESTINATION</Text>
                <Text style={[styles.routeLocName, { color: colors.foreground }]}>{req.destination.name}</Text>
                <Text style={[styles.routeLocAddr, { color: colors.mutedForeground }]}>{req.destination.address}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.infoRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoItem}>
            <Feather name="navigation" size={16} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Distance</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>{req.distanceFromRider.toFixed(1)} km</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoItem}>
            <Feather name="clock" size={16} color={colors.secondary} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Requested</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {Math.round((Date.now() - new Date(req.requestedAt).getTime()) / 60000)} min ago
            </Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoItem}>
            <Feather name="truck" size={16} color={colors.success} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Vehicle</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={1}>
              {req.vehicleType.charAt(0).toUpperCase() + req.vehicleType.slice(1)}
            </Text>
          </View>
        </View>

        <View style={[styles.negotiateBox, { backgroundColor: colors.secondary + "10", borderColor: colors.secondary + "30" }]}>
          <Feather name="info" size={16} color={colors.secondary} />
          <Text style={[styles.negotiateText, { color: colors.secondary }]}>
            Call or message the customer to negotiate a fare, then confirm the agreed price below.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.agreeBtn, { backgroundColor: colors.secondary }]}
          onPress={handleAgreePrice}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.agreeBtnText}>We Agreed a Price</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.declineBtn}>
          <Text style={[styles.declineText, { color: colors.mutedForeground }]}>Not interested</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
