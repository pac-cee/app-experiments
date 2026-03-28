import { Feather } from "@expo/vector-icons";
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
import { useRider } from "@/context/RiderContext";
import { JobStatus } from "@/lib/mockData";

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; action: string; nextStatus: JobStatus | null }> = {
  en_route_pickup: {
    label: "En Route to Pickup",
    color: "#1565C0",
    bg: "#E3F2FD",
    action: "I've Arrived at Pickup",
    nextStatus: "at_pickup",
  },
  at_pickup: {
    label: "At Pickup Location",
    color: "#2E7D32",
    bg: "#E8F5E9",
    action: "Start Ride",
    nextStatus: "in_progress",
  },
  in_progress: {
    label: "Ride in Progress",
    color: "#E65100",
    bg: "#FFF3E0",
    action: "End Ride",
    nextStatus: "completed",
  },
  completed: {
    label: "Ride Completed",
    color: "#1B5E20",
    bg: "#E8F5E9",
    action: "Rate Customer",
    nextStatus: null,
  },
};

export default function ActiveRideScreen() {
  const colors = useColors();
  const router = useRouter();
  const { activeJob, updateJobStatus, setActiveJob } = useRider();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [transitProgress, setTransitProgress] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!activeJob || activeJob.status !== "in_progress") return;
    const t = setInterval(() => {
      setTransitProgress((p) => {
        if (p >= 100) { clearInterval(t); return 100; }
        return p + (100 / 30);
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeJob?.status]);

  if (!activeJob) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>No active job</Text>
        <TouchableOpacity onPress={() => router.replace("/(rider)/home")} style={[styles.btn, { backgroundColor: colors.secondary, marginTop: 16 }]}>
          <Text style={styles.btnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cfg = STATUS_CONFIG[activeJob.status];

  const handleAction = () => {
    if (cfg.nextStatus) {
      updateJobStatus(cfg.nextStatus);
      setTransitProgress(0);
    } else {
      router.replace("/rider-booking/rating");
    }
  };

  const customerInitials = activeJob.customer.name
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const mapPickup = activeJob.status === "en_route_pickup"
    ? activeJob.pickup
    : activeJob.pickup;

  const mapDest = activeJob.status === "in_progress" || activeJob.status === "completed"
    ? activeJob.destination
    : activeJob.pickup;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Active Ride</Text>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <MockMap
          pickup={mapPickup}
          destination={mapDest}
          height={undefined}
        />
      </View>

      <View style={[styles.panel, { backgroundColor: colors.card, paddingBottom: bottomPad + 16, borderTopColor: colors.border }]}>
        <View style={[styles.customerRow, { borderBottomColor: colors.border }]}>
          <View style={[styles.customerAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.customerAvatarText}>{customerInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.customerName, { color: colors.foreground }]}>{activeJob.customer.name}</Text>
            <Text style={[styles.customerPhone, { color: colors.mutedForeground }]}>{activeJob.customer.phone}</Text>
          </View>
          <View style={styles.contactBtns}>
            <TouchableOpacity
              style={[styles.contactBtn, { backgroundColor: colors.success + "18" }]}
              onPress={() => Linking.openURL(`tel:${activeJob.customer.phone}`)}
            >
              <Feather name="phone" size={18} color={colors.success} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactBtn, { backgroundColor: colors.primary + "18" }]}
              onPress={() => Linking.openURL(`sms:${activeJob.customer.phone}`)}
            >
              <Feather name="message-square" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Pickup</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={1}>{activeJob.pickup.name}</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoItem}>
            <Feather name="flag" size={14} color={colors.secondary} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Drop-off</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={1}>{activeJob.destination.name}</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoItem}>
            <Feather name="dollar-sign" size={14} color={colors.success} />
