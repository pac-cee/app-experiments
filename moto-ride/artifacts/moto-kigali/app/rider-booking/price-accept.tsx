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
