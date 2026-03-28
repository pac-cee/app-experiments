import { Feather } from "@expo/vector-icons";
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
import { useRider } from "@/context/RiderContext";
import { JobStatus } from "@/lib/mockData";

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; action: string; nextStatus: JobStatus | null }> = {
  en_route_pickup: {
    label: "En Route to Pickup",
    color: "#1565C0",
    bg: "#E3F2FD",
    action: "I've Arrived at Pickup",
    nextStatus: "at_pickup",
  },
  at_pickup: {
    label: "At Pickup Location",
    color: "#2E7D32",
    bg: "#E8F5E9",
    action: "Start Ride",
    nextStatus: "in_progress",
  },
  in_progress: {
    label: "Ride in Progress",
    color: "#E65100",
    bg: "#FFF3E0",
    action: "End Ride",
