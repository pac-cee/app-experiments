import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { RideRequestSheet } from "@/components/notifications/RideRequestSheet";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useRider } from "@/context/RiderContext";
import { useBroker, BrokerRequest } from "@/context/BrokerContext";
import { getCustomerRequests, formatRequestTime } from "@/lib/riderService";
import { CustomerRequest, KIGALI_LOCATIONS } from "@/lib/mockData";

function RequestCard({ req, onPress }: { req: CustomerRequest; onPress: () => void }) {
  const colors = useColors();
  const initials = req.customer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
