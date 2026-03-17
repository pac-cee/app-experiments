import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { calcDistanceKm } from "@/lib/rideService";
import { RideStatus } from "@/lib/mockData";

const STEP_SPEED = 0.00015;

function StatusBadge({ status }: { status: RideStatus }) {
  const colors = useColors();
  const config: Record<string, { label: string; color: string; bg: string }> = {
    rider_en_route: { label: "Rider En Route", color: "#1565C0", bg: "#E3F2FD" },
    arrived: { label: "Rider Arrived!", color: "#2E7D32", bg: "#E8F5E9" },
    in_transit: { label: "Ride in Progress", color: "#E65100", bg: "#FFF3E0" },
    completed: { label: "Ride Completed", color: "#1B5E20", bg: "#E8F5E9" },
  };
  const c = config[status] ?? { label: status, color: colors.primary, bg: colors.muted };
  return (
    <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: c.color }]} />
      <Text style={[styles.statusText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

export default function TrackingScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeRide, updateStatus, setActiveRide } = useRide();

  const [riderPos, setRiderPos] = useState(
    activeRide ? { lat: activeRide.rider.lat, lng: activeRide.rider.lng } : null
  );
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);
  const [transitSeconds, setTransitSeconds] = useState(0);
  const [pendingStatus, setPendingStatus] = useState<RideStatus | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Apply pending status changes outside of state updater functions
  useEffect(() => {
    if (pendingStatus) {
      updateStatus(pendingStatus);
      setPendingStatus(null);
    }
  }, [pendingStatus]);

  useEffect(() => {
    if (!activeRide) return;
    if (activeRide.status === "completed") return;
    if (activeRide.status === "in_transit") {
      const t = setInterval(() => {
        setTransitSeconds((s) => {
          if (s >= 28) {
            clearInterval(t);
            setPendingStatus("completed");
            return s;
          }
          return s + 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
    if (activeRide.status !== "rider_en_route") return;

    const interval = setInterval(() => {
      setRiderPos((prev) => {
        if (!prev || !activeRide.pickup) return prev;
        const targetLat = activeRide.pickup.lat;
