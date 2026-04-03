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
import { useRider } from "@/context/RiderContext";
import { StarRating } from "@/components/ui/StarRating";
import { rateCustomer } from "@/lib/riderService";

const QUICK_TAGS = ["Great passenger", "Polite & friendly", "Ready on time", "Clear directions", "Good communication"];
