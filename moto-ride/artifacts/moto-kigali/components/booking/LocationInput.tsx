import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KIGALI_LOCATIONS, Location } from "@/lib/mockData";
import { useColors } from "@/hooks/useColors";

interface Props {
  pickup: Location | null;
  destination: Location | null;
  onPickupChange: (loc: Location) => void;
  onDestinationChange: (loc: Location) => void;
  focusField?: "pickup" | "destination" | null;
  onFocusChange?: (field: "pickup" | "destination" | null) => void;
}

export function LocationInput({ pickup, destination, onPickupChange, onDestinationChange, focusField, onFocusChange }: Props) {
  const colors = useColors();
  const [pickupText, setPickupText] = useState(pickup?.name ?? "");
  const [destText, setDestText] = useState(destination?.name ?? "");
