import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { confirmBooking } from "@/lib/rideService";

export default function PriceConfirmScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pendingPickup, pendingDestination, pendingVehicle, pendingRider, setActiveRide, clearPending } = useRide();

  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleConfirm = async () => {
    const numPrice = parseInt(price.replace(/\D/g, ""), 10);
    if (!numPrice || numPrice < 100) {
      setError("Please enter a valid price (min 100 RWF).");
      return;
