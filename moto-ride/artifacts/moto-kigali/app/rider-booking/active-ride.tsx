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
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Earn</Text>
            <Text style={[styles.infoValue, { color: colors.success }]}>{activeJob.price.toLocaleString()} RWF</Text>
          </View>
        </View>

        {activeJob.status === "in_progress" && (
          <View style={styles.progressSection}>
            <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
              <View style={[styles.progressFill, { width: `${Math.min(transitProgress, 100)}%` as any, backgroundColor: colors.secondary }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.mutedForeground }]}>Ride in progress...</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, {
            backgroundColor: activeJob.status === "completed" ? colors.primary : cfg.nextStatus === "at_pickup" ? colors.primary : cfg.nextStatus === "in_progress" ? colors.success : colors.secondary,
          }]}
          onPress={handleAction}
          activeOpacity={0.85}
        >
          <Feather name={activeJob.status === "completed" ? "star" : activeJob.status === "at_pickup" ? "play" : activeJob.status === "in_progress" ? "check-circle" : "navigation"} size={20} color="#fff" />
          <Text style={styles.actionBtnText}>{cfg.action}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  panel: {
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  customerAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  customerAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  customerName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  customerPhone: { fontSize: 13, fontFamily: "Inter_400Regular" },
  contactBtns: { flexDirection: "row", gap: 8 },
  contactBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoItem: { flex: 1, alignItems: "center", gap: 3 },
  infoDivider: { width: 1, height: 40 },
  infoLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 12, fontFamily: "Inter_700Bold", textAlign: "center" },
  progressSection: { gap: 8 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionBtnText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
