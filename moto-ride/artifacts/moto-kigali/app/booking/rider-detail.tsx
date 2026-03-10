import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { useAuth } from "@/context/AuthContext";
import { useBroker } from "@/context/BrokerContext";
import { StarRating } from "@/components/ui/StarRating";
import { VehicleType, MOCK_RIDERS, KIGALI_LOCATIONS } from "@/lib/mockData";

function VehicleIcon({ vehicle, color }: { vehicle: VehicleType; color: string }) {
  if (vehicle === "moto") return <MaterialCommunityIcons name="motorbike" size={22} color={color} />;
  if (vehicle === "cab") return <MaterialCommunityIcons name="car" size={22} color={color} />;
  return <Feather name="truck" size={20} color={color} />;
}

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const colors = useColors();
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }]}>
      <Text style={{ fontSize: size * 0.36, fontFamily: "Inter_700Bold", color: "#fff" }}>{initials}</Text>
    </View>
  );
}

export default function RiderDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { pendingRider, pendingPickup, pendingDestination, pendingVehicle, setPendingRider, setPendingPickup, setPendingDestination } = useRide();
  const { addRequest } = useBroker();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;

  // Seed mock data if context was lost (e.g. on reload)
  React.useEffect(() => {
    if (!pendingRider) {
      setPendingRider(MOCK_RIDERS[0]);
      if (!pendingPickup) setPendingPickup(KIGALI_LOCATIONS[0]);
      if (!pendingDestination) setPendingDestination(KIGALI_LOCATIONS[3]);
    }
  }, []);

