import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { riderRegister } from "@/lib/authService";
import { VehicleType } from "@/lib/mockData";

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: string }[] = [
  { type: "moto", label: "Moto-Taxi", icon: "motorbike" },
  { type: "cab", label: "Car / Cab", icon: "car" },
  { type: "truck", label: "Truck", icon: "truck" },
];

const DOC_ITEMS = [
  { key: "id", label: "National ID Photo", icon: "credit-card" as const },
  { key: "license", label: "Driver's License", icon: "award" as const },
  { key: "vehicle", label: "Vehicle Registration", icon: "file-text" as const },
];

export default function RiderRegisterScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
