import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VehicleType } from "@/lib/mockData";
import { useColors } from "@/hooks/useColors";

const VEHICLES: { type: VehicleType; label: string; desc: string; icon: React.ReactNode }[] = [
  { type: "moto", label: "Moto", desc: "Fast & affordable", icon: null },
  { type: "cab", label: "Cab", desc: "Comfortable car", icon: null },
  { type: "truck", label: "Pickup", desc: "Cargo & goods", icon: null },
];

function VehicleIcon({ type, color }: { type: VehicleType; color: string }) {
  if (type === "moto") return <MaterialCommunityIcons name="motorbike" size={26} color={color} />;
  if (type === "cab") return <MaterialCommunityIcons name="car" size={26} color={color} />;
  return <Feather name="truck" size={24} color={color} />;
}

interface Props {
  selected: VehicleType | null;
  onSelect: (v: VehicleType) => void;
}

export function VehicleSelector({ selected, onSelect }: Props) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {VEHICLES.map(({ type, label, desc }) => {
        const isSelected = selected === type;
        return (
          <TouchableOpacity
            key={type}
            onPress={() => onSelect(type)}
            activeOpacity={0.8}
            style={[
              styles.card,
