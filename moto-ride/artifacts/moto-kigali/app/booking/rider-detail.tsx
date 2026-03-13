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
