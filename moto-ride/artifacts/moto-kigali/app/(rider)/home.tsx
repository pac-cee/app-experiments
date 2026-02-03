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
