import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { LocationInput } from "@/components/booking/LocationInput";
import { VehicleSelector } from "@/components/booking/VehicleSelector";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { useAuth } from "@/context/AuthContext";
import { KIGALI_LOCATIONS, Rider, VehicleType } from "@/lib/mockData";
import { getNearbyRiders } from "@/lib/rideService";

type Stage = "idle" | "vehicle_select" | "riders_visible";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    activeRide,
    pendingPickup, setPendingPickup,
    pendingDestination, setPendingDestination,
    pendingVehicle, setPendingVehicle,
    pendingRider, setPendingRider,
  } = useRide();

  const [stage, setStage] = useState<Stage>("idle");
  const [focusField, setFocusField] = useState<"pickup" | "destination" | null>(null);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const defaultPickup = KIGALI_LOCATIONS[0];

  useEffect(() => {
    if (!pendingPickup) setPendingPickup(defaultPickup);
  }, []);

  const onDestinationSet = (loc: typeof KIGALI_LOCATIONS[0]) => {
    setPendingDestination(loc);
    setStage("vehicle_select");
  };

  const onVehicleSelect = async (v: VehicleType) => {
    setPendingVehicle(v);
    setStage("riders_visible");
    setLoadingRiders(true);
    const result = await getNearbyRiders(v);
    setRiders(result);
    setLoadingRiders(false);
  };

  const onRiderPress = (rider: Rider) => {
    setSelectedRiderId(rider.id);
    setPendingRider(rider);
    router.push("/booking/rider-detail");
  };

  const resetBooking = () => {
    setPendingPickup(defaultPickup);
    setPendingDestination(null);
    setPendingVehicle(null);
    setPendingRider(null);
    setStage("idle");
    setRiders([]);
    setSelectedRiderId(null);
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.mapHeader, { paddingTop: topPad }]}>
        <Text style={[styles.greeting, { color: "#fff" }]}>Hi, {firstName} 👋</Text>
        <Text style={[styles.greetingSub, { color: "rgba(255,255,255,0.8)" }]}>Where are you going?</Text>
      </View>

      <View style={{ flex: 1 }}>
        <MockMap
          riders={stage === "riders_visible" ? riders : []}
          selectedVehicle={pendingVehicle}
          pickup={pendingPickup}
          destination={pendingDestination}
          onRiderPress={onRiderPress}
          selectedRiderId={selectedRiderId}
          height={undefined}
        />
      </View>

      {activeRide && (
        <TouchableOpacity
          style={[styles.activeRideBanner, { backgroundColor: colors.success }]}
          onPress={() => router.push("/booking/tracking")}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="motorbike" size={20} color="#fff" />
          <Text style={styles.activeRideText}>Active ride — tap to track</Text>
          <Feather name="chevron-right" size={18} color="#fff" />
        </TouchableOpacity>
      )}

      <View
        style={[
          styles.panel,
          {
            backgroundColor: colors.card,
            paddingBottom: bottomPad + 72,
            borderTopColor: colors.border,
          },
        ]}
      >
        {focusField ? (
          <View style={styles.panelContent}>
            <LocationInput
              pickup={pendingPickup}
              destination={pendingDestination}
              onPickupChange={setPendingPickup}
              onDestinationChange={onDestinationSet}
              focusField={focusField}
              onFocusChange={setFocusField}
            />
          </View>
        ) : (
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.panelContent}>
              <LocationInput
                pickup={pendingPickup}
                destination={pendingDestination}
                onPickupChange={setPendingPickup}
                onDestinationChange={onDestinationSet}
                focusField={focusField}
                onFocusChange={setFocusField}
              />

              {stage !== "idle" && (
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Vehicle type</Text>
                  <VehicleSelector selected={pendingVehicle} onSelect={onVehicleSelect} />
                </View>
              )}

              {stage === "riders_visible" && (
                <View style={styles.riderStatus}>
                  {loadingRiders ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <View style={[styles.riderStatusDot, { backgroundColor: colors.success }]} />
                      <Text style={[styles.riderStatusText, { color: colors.foreground }]}>
                        {riders.length} riders nearby — tap a pin on the map
                      </Text>
                    </>
                  )}
                </View>
              )}

              {stage !== "idle" && (
                <TouchableOpacity onPress={resetBooking} style={styles.resetBtn}>
                  <Feather name="x" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.resetText, { color: colors.mutedForeground }]}>Start over</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  mapHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "rgba(21,101,192,0.92)",
  },
  greeting: { fontSize: 18, fontFamily: "Inter_700Bold" },
  greetingSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  activeRideBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  activeRideText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  panel: {
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    maxHeight: 420,
  },
  panelContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  section: { gap: 10 },
  sectionLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  riderStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(46,125,50,0.08)",
  },
  riderStatusDot: { width: 8, height: 8, borderRadius: 4 },
  riderStatusText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  resetText: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
