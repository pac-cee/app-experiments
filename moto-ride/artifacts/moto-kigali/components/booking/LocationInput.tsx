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

  const activeText = focusField === "pickup" ? pickupText : destText;
  const suggestions = activeText.length > 0
    ? KIGALI_LOCATIONS.filter((l) => l.name.toLowerCase().includes(activeText.toLowerCase())).slice(0, 6)
    : KIGALI_LOCATIONS.slice(0, 6);

  const selectLocation = (loc: Location) => {
    if (focusField === "pickup") {
      setPickupText(loc.name);
      onPickupChange(loc);
    } else {
      setDestText(loc.name);
      onDestinationChange(loc);
    }
    onFocusChange?.(null);
  };

  return (
    <View>
      <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.inputRow}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <TextInput
            style={[styles.input, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="Pickup location"
            placeholderTextColor={colors.mutedForeground}
            value={pickupText}
            onChangeText={(t) => { setPickupText(t); onFocusChange?.("pickup"); }}
            onFocus={() => onFocusChange?.("pickup")}
            returnKeyType="next"
          />
          {pickup && focusField !== "pickup" && (
            <Feather name="check-circle" size={16} color={colors.success} />
          )}
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.inputRow}>
          <Feather name="map-pin" size={14} color={colors.secondary} />
          <TextInput
            style={[styles.input, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="Where to?"
            placeholderTextColor={colors.mutedForeground}
            value={destText}
            onChangeText={(t) => { setDestText(t); onFocusChange?.("destination"); }}
            onFocus={() => onFocusChange?.("destination")}
            returnKeyType="done"
            onSubmitEditing={() => onFocusChange?.(null)}
          />
        </View>
      </View>

      {focusField && (
        <View style={[styles.suggestions, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {suggestions.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              onPress={() => selectLocation(loc)}
              style={[styles.suggestion, { borderBottomColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Feather name="map-pin" size={14} color={colors.mutedForeground} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground }}>{loc.name}</Text>
                <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{loc.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    borderRadius: 14,
