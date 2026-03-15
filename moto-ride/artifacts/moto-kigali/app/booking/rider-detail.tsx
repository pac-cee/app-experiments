import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { useAuth } from "@/context/AuthContext";
import { useBroker } from "@/context/BrokerContext";
import { StarRating } from "@/components/ui/StarRating";
import { VehicleType, MOCK_RIDERS, KIGALI_LOCATIONS } from "@/lib/mockData";

function VehicleIcon({ vehicle, color }: { vehicle: VehicleType; color: string }) {
  if (vehicle === "moto") return <MaterialCommunityIcons name="motorbike" size={22} color={color} />;
  if (vehicle === "cab") return <MaterialCommunityIcons name="car" size={22} color={color} />;
  return <Feather name="truck" size={20} color={color} />;
}

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const colors = useColors();
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }]}>
      <Text style={{ fontSize: size * 0.36, fontFamily: "Inter_700Bold", color: "#fff" }}>{initials}</Text>
    </View>
  );
}

export default function RiderDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { pendingRider, pendingPickup, pendingDestination, pendingVehicle, setPendingRider, setPendingPickup, setPendingDestination } = useRide();
  const { addRequest } = useBroker();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;

  // Seed mock data if context was lost (e.g. on reload)
  React.useEffect(() => {
    if (!pendingRider) {
      setPendingRider(MOCK_RIDERS[0]);
      if (!pendingPickup) setPendingPickup(KIGALI_LOCATIONS[0]);
      if (!pendingDestination) setPendingDestination(KIGALI_LOCATIONS[3]);
    }
  }, []);

  if (!pendingRider) return null;

  const rider = pendingRider;

  const handleCall = () => Linking.openURL(`tel:${rider.phone}`);
  const handleSms = () => {
    const msg = encodeURIComponent("Hi, I'd like to book a ride with you via MotoLink.");
    Linking.openURL(`sms:${rider.phone}?body=${msg}`);
  };

  const handleSendRequest = () => {
    if (!pendingPickup || !pendingDestination) return;
    const requestId = addRequest({
      rider,
      customerId: user?.id ?? "cust_anon",
      customerName: user?.name ?? "Customer",
      customerPhone: user?.phone ?? "+250788000001",
      customerRating: 4.8,
      customerRides: 14,
      pickup: pendingPickup,
      destination: pendingDestination,
      vehicleType: pendingVehicle ?? "moto",
    });
    router.push(`/booking/waiting?requestId=${requestId}`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Rider Info</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}>
        <View style={[styles.profileSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.profileTop}>
            <View style={{ position: "relative" }}>
              <Avatar name={rider.name} size={80} />
              {rider.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                  <Feather name="check" size={10} color="#fff" />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.riderName, { color: colors.foreground }]}>{rider.name}</Text>
              <View style={styles.ratingRow}>
                <StarRating value={Math.round(rider.rating)} size={16} readonly />
                <Text style={[styles.ratingNum, { color: colors.foreground }]}>{rider.rating.toFixed(1)}</Text>
                <Text style={[styles.ratingCount, { color: colors.mutedForeground }]}>({rider.rides} rides)</Text>
              </View>
              {rider.verified && (
                <View style={styles.verifiedRow}>
                  <Feather name="shield" size={12} color={colors.success} />
                  <Text style={[styles.verifiedText, { color: colors.success }]}>Verified Rider</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.detailRow, { borderTopColor: colors.border }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Plate</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>{rider.plate}</Text>
            </View>
            <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Vehicle</Text>
              <View style={styles.vehicleRow}>
                <VehicleIcon vehicle={rider.vehicle} color={colors.primary} />
                <Text style={[styles.detailValue, { color: colors.foreground }]}>
                  {rider.vehicle === "moto" ? "Moto" : rider.vehicle === "cab" ? "Cab" : "Truck"}
                </Text>
              </View>
            </View>
            <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Total Rides</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>{rider.rides}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.sendRequestBtn, { backgroundColor: colors.primary }]}
          onPress={handleSendRequest}
          activeOpacity={0.85}
        >
          <View style={[styles.sendRequestIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="send" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sendRequestTitle}>Send In-App Request</Text>
            <Text style={styles.sendRequestSub}>Notify {rider.name.split(" ")[0]} directly</Text>
          </View>
          <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <View style={[styles.dividerRow, { gap: 10, alignItems: "center" }]}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or contact directly</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={[styles.contactBtn, styles.callBtn, { backgroundColor: colors.success }]}
            onPress={handleCall}
            activeOpacity={0.85}
          >
            <Feather name="phone" size={22} color="#fff" />
            <Text style={styles.contactBtnText}>Call Rider</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contactBtn, styles.smsBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleSms}
            activeOpacity={0.85}
          >
            <Feather name="message-square" size={22} color={colors.foreground} />
            <Text style={[styles.smsBtnText, { color: colors.foreground }]}>Send SMS</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.agreeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/booking/price-confirm")}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={20} color={colors.foreground} />
          <Text style={[styles.agreeBtnText, { color: colors.foreground }]}>We already agreed a price</Text>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
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
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  closeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { padding: 16, gap: 16 },
  profileSection: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  profileTop: { flexDirection: "row", gap: 16, padding: 18, alignItems: "flex-start" },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: { flex: 1, gap: 6 },
  riderName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingNum: { fontSize: 15, fontFamily: "Inter_700Bold" },
  ratingCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  verifiedText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  detailRow: { flexDirection: "row", borderTopWidth: 1 },
  detailItem: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 4 },
  detailDivider: { width: 1 },
  detailLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  detailValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  vehicleRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sendRequestBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendRequestIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sendRequestTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  sendRequestSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", marginTop: 2 },
  dividerRow: { flexDirection: "row" },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  contactButtons: { flexDirection: "row", gap: 12 },
  contactBtn: {
