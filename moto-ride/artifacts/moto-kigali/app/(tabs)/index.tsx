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
