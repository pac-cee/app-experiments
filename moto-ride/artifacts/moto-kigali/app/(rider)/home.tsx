import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { RideRequestSheet } from "@/components/notifications/RideRequestSheet";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useRider } from "@/context/RiderContext";
import { useBroker, BrokerRequest } from "@/context/BrokerContext";
import { getCustomerRequests, formatRequestTime } from "@/lib/riderService";
import { CustomerRequest, KIGALI_LOCATIONS } from "@/lib/mockData";

function RequestCard({ req, onPress }: { req: CustomerRequest; onPress: () => void }) {
  const colors = useColors();
  const initials = req.customer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.customerName, { color: colors.foreground }]}>{req.customer.name}</Text>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={11} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>{req.customer.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={[styles.timeAgo, { color: colors.mutedForeground }]}>{formatRequestTime(req.requestedAt)}</Text>
        </View>
        <View style={[styles.distBadge, { backgroundColor: colors.secondary + "18" }]}>
          <Text style={[styles.distText, { color: colors.secondary }]}>{req.distanceFromRider.toFixed(1)} km</Text>
        </View>
      </View>

      <View style={[styles.routeRow, { borderTopColor: colors.border }]}>
        <View style={styles.routePin}>
          <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.pinLine, { backgroundColor: colors.border }]} />
          <View style={[styles.pinDot, { backgroundColor: colors.secondary }]} />
        </View>
        <View style={{ flex: 1, gap: 14 }}>
          <Text style={[styles.locText, { color: colors.foreground }]} numberOfLines={1}>{req.pickup.name}</Text>
          <Text style={[styles.locText, { color: colors.foreground }]} numberOfLines={1}>{req.destination.name}</Text>
        </View>
        <TouchableOpacity
          style={[styles.viewBtn, { backgroundColor: colors.primary }]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function RiderHomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();
  const { isOnline, setIsOnline, setPendingCustomer, activeJob } = useRider();
  const { incomingRequest, updateStatus } = useBroker();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const bellAnim = useRef(new Animated.Value(0)).current;

  const hasIncoming = !!incomingRequest;

  useEffect(() => {
    if (hasIncoming) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(bellAnim, { toValue: -1, duration: 150, useNativeDriver: true }),
          Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.delay(2000),
        ])
      ).start();
    } else {
      bellAnim.setValue(0);
    }
  }, [hasIncoming]);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await getCustomerRequests(user.id);
    setRequests(data);
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleViewRequest = (req: CustomerRequest) => {
    setPendingCustomer(req);
    router.push("/rider-booking/customer-detail");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleAcceptBrokerRequest = (req: BrokerRequest) => {
    updateStatus(req.id, "accepted");
    const customerRequest: CustomerRequest = {
      id: req.id,
      customer: {
        id: req.customerId,
        name: req.customerName,
        phone: req.customerPhone,
        rating: req.customerRating,
        rides: req.customerRides,
      },
      pickup: req.pickup,
      destination: req.destination,
      vehicleType: req.vehicleType,
      distanceFromRider: 1.2,
      requestedAt: req.sentAt,
      status: "accepted",
    };
    setPendingCustomer(customerRequest);
    router.push("/rider-booking/customer-detail");
  };

  const handleDeclineBrokerRequest = (req: BrokerRequest) => {
    updateStatus(req.id, "declined");
  };

  if (activeJob && activeJob.status !== "completed") {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Active Ride</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
          <View style={[styles.activeJobCard, { backgroundColor: colors.card, borderColor: colors.secondary }]}>
            <MaterialCommunityIcons name="motorbike" size={36} color={colors.secondary} />
            <Text style={[styles.activeJobTitle, { color: colors.foreground }]}>You have an active ride</Text>
            <Text style={[styles.activeJobSub, { color: colors.mutedForeground }]}>
              {activeJob.pickup.name} → {activeJob.destination.name}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.resumeBtn, { backgroundColor: colors.secondary }]}
            onPress={() => router.push("/rider-booking/active-ride")}
            activeOpacity={0.85}
          >
            <Feather name="navigation" size={18} color="#fff" />
            <Text style={styles.resumeBtnText}>Resume Active Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome back,</Text>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{user?.name?.split(" ")[0] ?? "Rider"}</Text>
        </View>
        <View style={styles.headerRight}>
          {hasIncoming && (
            <Animated.View
              style={{
                transform: [{
                  rotate: bellAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ["-15deg", "0deg", "15deg"] }),
                }],
              }}
            >
              <View style={styles.bellWrap}>
                <Feather name="bell" size={22} color={colors.secondary} />
                <View style={[styles.bellBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.bellBadgeText}>!</Text>
                </View>
              </View>
            </Animated.View>
          )}
          <View style={styles.onlineToggle}>
            <Text style={[styles.onlineLabel, { color: isOnline ? colors.success : colors.mutedForeground }]}>
              {isOnline ? "Online" : "Offline"}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: colors.muted, true: colors.success + "60" }}
              thumbColor={isOnline ? colors.success : colors.mutedForeground}
            />
          </View>
        </View>
      </View>

      <View style={{ height: 220 }}>
        <MockMap
          pickup={requests[0]?.pickup ?? KIGALI_LOCATIONS[0]}
          destination={requests[1]?.pickup ?? KIGALI_LOCATIONS[3]}
          height={220}
        />
        <View style={[styles.mapOverlay, { backgroundColor: isOnline ? colors.success : "#EF4444" }]}>
          <View style={[styles.mapOverlayDot, { backgroundColor: "#fff" }]} />
          <Text style={styles.mapOverlayText}>{isOnline ? "Receiving requests" : "You're offline"}</Text>
        </View>
      </View>

      {!isOnline ? (
        <View style={styles.offlineBody}>
          <MaterialCommunityIcons name="wifi-off" size={56} color={colors.mutedForeground} />
          <Text style={[styles.offlineTitle, { color: colors.foreground }]}>You're offline</Text>
          <Text style={[styles.offlineSub, { color: colors.mutedForeground }]}>
            Go online to start receiving ride requests from customers.
          </Text>
          <TouchableOpacity
            style={[styles.goOnlineBtn, { backgroundColor: colors.success }]}
            onPress={() => setIsOnline(true)}
            activeOpacity={0.85}
          >
            <Feather name="zap" size={18} color="#fff" />
            <Text style={styles.goOnlineBtnText}>Go Online</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={[styles.listTitle, { color: colors.foreground }]}>
                {requests.length} Request{requests.length !== 1 ? "s" : ""} Nearby
              </Text>
              <TouchableOpacity onPress={handleRefresh}>
                <Feather name="refresh-cw" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="inbox" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No requests yet. Check back soon.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <RequestCard req={item} onPress={() => handleViewRequest(item)} />
          )}
        />
      )}

      <RideRequestSheet
        request={incomingRequest}
        onAccept={handleAcceptBrokerRequest}
        onDecline={handleDeclineBrokerRequest}
      />
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
  greeting: { fontSize: 12, fontFamily: "Inter_400Regular" },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 14 },
  bellWrap: { position: "relative" },
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadgeText: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff" },
  onlineToggle: { flexDirection: "row", alignItems: "center", gap: 8 },
  onlineLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  mapOverlay: {
    position: "absolute",
    bottom: 10,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapOverlayDot: { width: 7, height: 7, borderRadius: 3.5 },
  mapOverlayText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },
  offlineBody: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 32 },
  offlineTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  offlineSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  goOnlineBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  goOnlineBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  list: { padding: 16, gap: 12, paddingBottom: 100 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  listTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  emptyState: { alignItems: "center", paddingTop: 48, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customerName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  timeAgo: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  distBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  distText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderTopWidth: 1 },
  routePin: { alignItems: "center", gap: 0 },
  pinDot: { width: 8, height: 8, borderRadius: 4 },
  pinLine: { width: 1.5, height: 20 },
  locText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  viewBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  viewBtnText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  activeJobCard: {
    width: "100%",
    alignItems: "center",
    padding: 24,
    borderRadius: 18,
    borderWidth: 2,
    gap: 10,
  },
  activeJobTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  activeJobSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  resumeBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  resumeBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
});
