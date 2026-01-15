import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { riderRegister } from "@/lib/authService";
import { VehicleType } from "@/lib/mockData";

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: string }[] = [
  { type: "moto", label: "Moto-Taxi", icon: "motorbike" },
  { type: "cab", label: "Car / Cab", icon: "car" },
  { type: "truck", label: "Truck", icon: "truck" },
];

const DOC_ITEMS = [
  { key: "id", label: "National ID Photo", icon: "credit-card" as const },
  { key: "license", label: "Driver's License", icon: "award" as const },
  { key: "vehicle", label: "Vehicle Registration", icon: "file-text" as const },
];

export default function RiderRegisterScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [nationalId, setNationalId] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("moto");
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nationalId.trim()) e.nationalId = "National ID is required";
    if (!homeAddress.trim()) e.homeAddress = "Home address is required";
    if (!plate.trim()) e.plate = "License plate is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const simulateDocUpload = (key: string) => {
    setUploadedDocs((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    setLoading(true);
    await riderRegister({
      userId: user.id,
      nationalId: nationalId.trim(),
      homeAddress: homeAddress.trim(),
      vehicleType,
      plate: plate.trim().toUpperCase(),
    });
    await setUser({
      ...user,
      role: "rider",
      status: "pending",
      nationalId: nationalId.trim(),
      homeAddress: homeAddress.trim(),
      vehicleType,
      plate: plate.trim().toUpperCase(),
    });
    setLoading(false);
    router.replace("/(auth)/rider-pending");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Rider Registration</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.infoBox, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Your application will be reviewed within 24 hours. You'll need to provide a few documents to get verified.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PERSONAL INFO</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>National ID Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: errors.nationalId ? colors.destructive : colors.border, color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="e.g. 1 1990 7 0012345 1 23"
            placeholderTextColor={colors.mutedForeground}
