import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { calcDistanceKm } from "@/lib/rideService";
import { RideStatus } from "@/lib/mockData";
