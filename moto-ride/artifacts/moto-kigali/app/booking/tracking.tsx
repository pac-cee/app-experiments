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
        const targetLng = activeRide.pickup.lng;
        const dLat = targetLat - prev.lat;
        const dLng = targetLng - prev.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < 0.0003) {
          clearInterval(interval);
          setPendingStatus("arrived");
          return { lat: targetLat, lng: targetLng };
        }
        const step = Math.min(STEP_SPEED, dist);
        const ratio = step / dist;
        const newLat = prev.lat + dLat * ratio;
        const newLng = prev.lng + dLng * ratio;
        const distKm = calcDistanceKm(newLat, newLng, targetLat, targetLng);
        setEtaSeconds(Math.round((distKm / 30) * 3600));
        return { lat: newLat, lng: newLng };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [activeRide?.status]);

  if (!activeRide) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>No active ride</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/")} style={[styles.btn, { backgroundColor: colors.primary, marginTop: 16 }]}>
          <Text style={styles.btnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatEta = () => {
    if (etaSeconds === null) return "Calculating...";
    if (etaSeconds < 60) return "< 1 min";
    return `${Math.round(etaSeconds / 60)} min`;
  };

  const formatTransit = () => {
    const pct = Math.min((transitSeconds / 28) * 100, 100);
    return pct;
  };

  const handleStartRide = () => updateStatus("in_transit");

  const handleEndRide = () => {
    updateStatus("completed");
  };

  const handleRideComplete = () => {
    router.replace("/booking/rating");
  };

  const statusLabels: Record<string, string> = {
    rider_en_route: "Your rider is on the way",
    arrived: "Your rider has arrived!",
