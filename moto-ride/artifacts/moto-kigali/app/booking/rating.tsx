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
import { useRide } from "@/context/RideContext";
import { StarRating } from "@/components/ui/StarRating";
import { rateRide } from "@/lib/rideService";

const QUICK_COMMENTS = ["Great rider!", "Very punctual", "Safe driving", "Friendly", "Knew the route"];
