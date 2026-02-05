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
