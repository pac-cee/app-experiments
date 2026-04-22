import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Location, Rider, VehicleType } from "@/lib/mockData";
import { useColors } from "@/hooks/useColors";

const MAP_BOUNDS = { minLat: -2.02, maxLat: -1.88, minLng: 30.03, maxLng: 30.17 };

function projectToPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x, y };
}

function PulsingDot({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.6, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 20, height: 20, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: color, opacity: 0.3, transform: [{ scale: anim }] }} />
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color, borderWidth: 2, borderColor: "#fff" }} />
    </View>
  );
}

function VehicleIcon({ vehicle, color, size = 16 }: { vehicle: VehicleType; color: string; size?: number }) {
  if (vehicle === "moto") return <MaterialCommunityIcons name="motorbike" size={size} color={color} />;
  if (vehicle === "cab") return <MaterialCommunityIcons name="car" size={size} color={color} />;
  return <Feather name="truck" size={size} color={color} />;
}

interface MockMapProps {
  riders?: Rider[];
  selectedVehicle?: VehicleType | null;
  pickup?: Location | null;
  destination?: Location | null;
  trackedRider?: { lat: number; lng: number } | null;
  onRiderPress?: (rider: Rider) => void;
  selectedRiderId?: string | null;
  height?: number;
}

export function MockMap({
  riders = [],
  selectedVehicle,
  pickup,
  destination,
  trackedRider,
