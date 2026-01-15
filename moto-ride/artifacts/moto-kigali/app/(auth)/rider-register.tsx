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
