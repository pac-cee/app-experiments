import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useRider, ActiveJob } from "@/context/RiderContext";
import { acceptJob } from "@/lib/riderService";

const QUICK_PRICES = [1000, 1500, 2000, 2500, 3000, 4000, 5000];

export default function PriceAcceptScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();
  const { pendingCustomer, setActiveJob, setPendingCustomer } = useRider();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [priceText, setPriceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pendingCustomer) router.back();
  }, [pendingCustomer]);

  if (!pendingCustomer) return null;

  const req = pendingCustomer;
  const price = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;

  const handleConfirm = async () => {
    if (price < 100) { setError("Enter the agreed price (min 100 RWF)"); return; }
    setError("");
    setLoading(true);
    const result = await acceptJob({
      requestId: req.id,
      customerId: req.customer.id,
      pickup: req.pickup,
      destination: req.destination,
      price,
    });
    setLoading(false);
    if (result.success) {
      const job: ActiveJob = {
        jobId: result.jobId,
        customer: req.customer,
        pickup: req.pickup,
        destination: req.destination,
        price,
        status: "en_route_pickup",
        acceptedAt: new Date().toISOString(),
      };
      setActiveJob(job);
      setPendingCustomer(null);
      router.replace("/rider-booking/active-ride");
    } else {
      setError("Failed to accept job. Please try again.");
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Confirm Agreed Price</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.content, { paddingBottom: bottomPad + 20 }]}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
            <Feather name="user" size={16} color={colors.mutedForeground} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Customer</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{req.customer.name}</Text>
            </View>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>From</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{req.pickup.name}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Feather name="flag" size={16} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>To</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{req.destination.name}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.pricePrompt, { color: colors.foreground }]}>Enter the price you agreed on</Text>

        <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: price > 0 ? colors.secondary : colors.border }]}>
          <Text style={[styles.currency, { color: colors.mutedForeground }]}>RWF</Text>
          <TextInput
            style={[styles.priceInput, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}
            value={priceText}
            onChangeText={(v) => { setPriceText(v.replace(/[^0-9]/g, "")); setError(""); }}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        <View style={styles.quickRow}>
          {QUICK_PRICES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.quickChip, {
                backgroundColor: price === p ? colors.secondary : colors.card,
                borderColor: price === p ? colors.secondary : colors.border,
              }]}
              onPress={() => { setPriceText(String(p)); setError(""); }}
            >
              <Text style={[styles.quickChipText, { color: price === p ? "#fff" : colors.foreground }]}>
                {p >= 1000 ? `${p / 1000}k` : p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.destructive, flex: 1 }}>{error}</Text>
          </View>
        ) : null}

        {price > 0 && (
          <View style={[styles.earningsBox, { backgroundColor: colors.success + "12", borderColor: colors.success + "30" }]}>
            <Feather name="trending-up" size={16} color={colors.success} />
            <Text style={[styles.earningsText, { color: colors.success }]}>
              You'll earn <Text style={{ fontFamily: "Inter_700Bold" }}>{price.toLocaleString()} RWF</Text> for this ride
            </Text>
          </View>
