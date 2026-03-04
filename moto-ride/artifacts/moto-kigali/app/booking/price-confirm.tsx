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
    }
    if (!pendingPickup || !pendingDestination || !pendingRider) {
      setError("Missing booking details. Please start over.");
      return;
    }
    setError("");
    setLoading(true);
    const result = await confirmBooking({
      riderId: pendingRider.id,
      pickup: pendingPickup,
      destination: pendingDestination,
      price: numPrice,
    });
    setLoading(false);
    if (result.success) {
      setActiveRide({
        bookingId: result.bookingId,
        pickup: pendingPickup,
        destination: pendingDestination,
        rider: pendingRider,
        price: numPrice,
        status: "rider_en_route",
        agreedAt: new Date().toISOString(),
      });
      clearPending();
      router.replace("/booking/tracking");
    } else {
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Confirm Booking</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.content}>
          {pendingRider && (
            <View style={[styles.riderSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.riderAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.riderAvatarText}>
                  {pendingRider.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.riderName, { color: colors.foreground }]}>{pendingRider.name}</Text>
                <Text style={[styles.riderPlate, { color: colors.mutedForeground }]}>{pendingRider.plate}</Text>
              </View>
