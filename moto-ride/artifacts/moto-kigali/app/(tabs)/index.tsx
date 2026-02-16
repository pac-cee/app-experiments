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

