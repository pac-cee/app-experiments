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
  onRiderPress,
  selectedRiderId,
  height = 300,
}: MockMapProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { height, backgroundColor: colors.mapBg }]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 390 300">
        <Rect x="0" y="0" width="390" height="300" fill={colors.mapBg} />
        <Rect x="60" y="20" width="120" height="80" rx="8" fill="#C8DEC4" opacity="0.6" />
        <Rect x="220" y="60" width="100" height="60" rx="8" fill="#C8DEC4" opacity="0.5" />
        <Rect x="80" y="180" width="140" height="90" rx="8" fill="#C8DEC4" opacity="0.6" />
        <Rect x="290" y="170" width="80" height="100" rx="8" fill="#C8DEC4" opacity="0.4" />
        <Rect x="155" y="100" width="40" height="30" rx="4" fill={colors.mapWater} opacity="0.7" />
        <Line x1="0" y1="140" x2="390" y2="140" stroke={colors.mapRoad} strokeWidth="6" opacity="0.9" />
        <Line x1="195" y1="0" x2="195" y2="300" stroke={colors.mapRoad} strokeWidth="5" opacity="0.9" />
        <Line x1="0" y1="200" x2="390" y2="180" stroke={colors.mapRoad} strokeWidth="4" opacity="0.7" />
        <Line x1="80" y1="0" x2="120" y2="300" stroke={colors.mapRoad} strokeWidth="3" opacity="0.6" />
        <Line x1="300" y1="0" x2="280" y2="300" stroke={colors.mapRoad} strokeWidth="3" opacity="0.6" />
        <Line x1="0" y1="80" x2="390" y2="60" stroke={colors.mapRoad} strokeWidth="3" opacity="0.5" />
        <Line x1="0" y1="260" x2="390" y2="240" stroke={colors.mapRoad} strokeWidth="2.5" opacity="0.5" />
        <SvgText x="90" y="60" fill="#5A7A56" fontSize="9" fontWeight="bold" opacity="0.7">Gisozi</SvgText>
        <SvgText x="220" y="50" fill="#5A7A56" fontSize="9" fontWeight="bold" opacity="0.7">Kimironko</SvgText>
        <SvgText x="55" y="215" fill="#5A7A56" fontSize="9" fontWeight="bold" opacity="0.7">Nyamirambo</SvgText>
        <SvgText x="295" y="210" fill="#5A7A56" fontSize="9" fontWeight="bold" opacity="0.7">Kicukiro</SvgText>
        <SvgText x="145" y="130" fill="#4A8CB4" fontSize="8" opacity="0.8">Nyabarongo</SvgText>
      </Svg>

      {riders.map((rider) => {
        const pos = projectToPercent(rider.lat, rider.lng);
        const isSelected = rider.id === selectedRiderId;
        return (
          <TouchableOpacity
            key={rider.id}
            onPress={() => onRiderPress?.(rider)}
            style={[
              styles.riderPin,
              {
                left: `${pos.x}%` as any,
                top: `${pos.y}%` as any,
                backgroundColor: isSelected ? colors.secondary : colors.primary,
                transform: [{ translateX: -18 }, { translateY: -18 }, { scale: isSelected ? 1.2 : 1 }],
                borderColor: isSelected ? "#FF6F00" : "#fff",
              },
            ]}
            activeOpacity={0.8}
          >
            <VehicleIcon vehicle={rider.vehicle} color="#fff" size={14} />
          </TouchableOpacity>
        );
      })}

      {pickup && (() => {
        const pos = projectToPercent(pickup.lat, pickup.lng);
        return (
          <View style={[styles.locationPin, { left: `${pos.x}%` as any, top: `${pos.y}%` as any, transform: [{ translateX: -10 }, { translateY: -22 }] }]}>
            <PulsingDot color={colors.success} />
          </View>
        );
      })()}

      {destination && (() => {
        const pos = projectToPercent(destination.lat, destination.lng);
        return (
          <View style={[styles.locationPin, { left: `${pos.x}%` as any, top: `${pos.y}%` as any, transform: [{ translateX: -10 }, { translateY: -22 }] }]}>
            <View style={{ alignItems: "center" }}>
              <Feather name="map-pin" size={22} color={colors.secondary} />
            </View>
          </View>
        );
      })()}

      {trackedRider && (() => {
        const pos = projectToPercent(trackedRider.lat, trackedRider.lng);
        return (
