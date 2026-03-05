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
              <View style={[styles.ratingBadge, { backgroundColor: "#FEF3C7" }]}>
                <Feather name="star" size={12} color="#D97706" />
                <Text style={[styles.ratingText, { color: "#92400E" }]}>{pendingRider.rating.toFixed(1)}</Text>
              </View>
            </View>
          )}

          {pendingPickup && pendingDestination && (
            <View style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>Route</Text>
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.routeText, { color: colors.foreground }]}>{pendingPickup.name}</Text>
              </View>
              <View style={[styles.routeConnector, { borderColor: colors.border }]} />
              <View style={styles.routeRow}>
                <Feather name="map-pin" size={12} color={colors.secondary} />
                <Text style={[styles.routeText, { color: colors.foreground }]}>{pendingDestination.name}</Text>
              </View>
            </View>
          )}

          <View>
            <Text style={[styles.priceLabel, { color: colors.foreground }]}>Agreed Price (RWF)</Text>
            <Text style={[styles.priceHint, { color: colors.mutedForeground }]}>Enter the amount you negotiated with the rider</Text>
            <View style={[styles.priceInputWrap, { backgroundColor: colors.input, borderColor: price ? colors.primary : colors.border }]}>
              <Text style={[styles.currency, { color: colors.mutedForeground }]}>RWF</Text>
              <TextInput
                style={[styles.priceInput, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                value={price}
                onChangeText={(t) => setPrice(t.replace(/\D/g, ""))}
                keyboardType="numeric"
                maxLength={7}
                autoFocus
              />
            </View>

            <View style={styles.suggestRow}>
              {[500, 1000, 1500, 2000, 3000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.suggestChip, { backgroundColor: price === String(amt) ? colors.primary : colors.muted, borderColor: price === String(amt) ? colors.primary : colors.border }]}
                  onPress={() => setPrice(String(amt))}
                >
                  <Text style={[styles.suggestText, { color: price === String(amt) ? "#fff" : colors.mutedForeground }]}>
                    {amt >= 1000 ? `${amt / 1000}k` : amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={[{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.destructive, flex: 1 }]}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleConfirm}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="check-circle" size={20} color="#fff" />
                <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  closeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 18 },
  riderSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  riderAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  riderAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  riderName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  riderPlate: { fontSize: 13, fontFamily: "Inter_400Regular" },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  routeCard: { padding: 14, borderRadius: 14, borderWidth: 1, gap: 8 },
  routeLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
