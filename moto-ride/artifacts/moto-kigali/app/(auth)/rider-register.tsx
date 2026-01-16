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
            value={nationalId}
            onChangeText={setNationalId}
            keyboardType="default"
            autoCapitalize="none"
          />
          {errors.nationalId && <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.nationalId}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Home Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: errors.homeAddress ? colors.destructive : colors.border, color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="e.g. Kimironko, Gasabo District"
            placeholderTextColor={colors.mutedForeground}
            value={homeAddress}
            onChangeText={setHomeAddress}
          />
          {errors.homeAddress && <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.homeAddress}</Text>}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>VEHICLE INFO</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Vehicle Type</Text>
          <View style={styles.vehicleRow}>
            {VEHICLE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.type}
                style={[
                  styles.vehicleOption,
                  {
                    backgroundColor: vehicleType === opt.type ? colors.primary : colors.card,
                    borderColor: vehicleType === opt.type ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setVehicleType(opt.type)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={opt.icon as any}
                  size={22}
                  color={vehicleType === opt.type ? "#fff" : colors.mutedForeground}
                />
                <Text style={[styles.vehicleLabel, { color: vehicleType === opt.type ? "#fff" : colors.foreground }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>License Plate</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: errors.plate ? colors.destructive : colors.border, color: colors.foreground, fontFamily: "Inter_700Bold", letterSpacing: 2 }]}
            placeholder="e.g. RAD 234B"
            placeholderTextColor={colors.mutedForeground}
            value={plate}
            onChangeText={setPlate}
            autoCapitalize="characters"
          />
          {errors.plate && <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.plate}</Text>}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DOCUMENTS</Text>

        {DOC_ITEMS.map((doc) => {
          const uploaded = uploadedDocs[doc.key];
          return (
            <TouchableOpacity
              key={doc.key}
              style={[
                styles.docItem,
                {
                  backgroundColor: colors.card,
                  borderColor: uploaded ? colors.success : colors.border,
                },
              ]}
              onPress={() => simulateDocUpload(doc.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.docIcon, { backgroundColor: uploaded ? colors.success + "18" : colors.muted }]}>
                <Feather name={doc.icon} size={18} color={uploaded ? colors.success : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.docLabel, { color: colors.foreground }]}>{doc.label}</Text>
                <Text style={[styles.docStatus, { color: uploaded ? colors.success : colors.mutedForeground }]}>
                  {uploaded ? "Uploaded" : "Tap to upload photo"}
                </Text>
              </View>
              {uploaded ? (
                <Feather name="check-circle" size={20} color={colors.success} />
              ) : (
                <Feather name="upload" size={18} color={colors.mutedForeground} />
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="send" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Submit Application</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, fontFamily: "Inter_500Medium" },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  errorText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  vehicleRow: { flexDirection: "row", gap: 10 },
  vehicleOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  vehicleLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  docIcon: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  docLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  docStatus: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 16,
    marginTop: 8,
    elevation: 3,
    shadowColor: "#1565C0",
