import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { signup, verifyOtp } from "@/lib/authService";
import { useColors } from "@/hooks/useColors";

export default function OtpScreen() {
  const colors = useColors();
  const router = useRouter();
  const { setUser } = useAuth();
  const params = useLocalSearchParams<{ phone: string; name: string; email: string; password: string }>();
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (val: string, idx: number) => {
    if (val.length > 1) {
      const chars = val.slice(0, 4).split("");
      const next = [...code];
      chars.forEach((c, i) => { if (idx + i < 4) next[idx + i] = c; });
      setCode(next);
      const nextIdx = Math.min(idx + chars.length, 3);
      inputRefs.current[nextIdx]?.focus();
      return;
    }
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 4) { setError("Enter the 4-digit code."); return; }
    setError("");
    setLoading(true);
    const verifyResult = await verifyOtp(params.phone, fullCode);
    if (!verifyResult.success) {
      setLoading(false);
      setError(verifyResult.message ?? "Invalid code.");
      return;
    }
    const signupResult = await signup({
      name: params.name,
      phone: params.phone,
      email: params.email,
      password: params.password,
    });
    setLoading(false);
    if (signupResult.success && signupResult.user) {
      await setUser(signupResult.user);
      router.replace("/(auth)/role-select");
    } else {
      setError("Account creation failed. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 20 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </TouchableOpacity>

      <View style={styles.iconWrap}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "18" }]}>
          <Feather name="message-circle" size={32} color={colors.primary} />
        </View>
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>Enter code</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        We sent a 4-digit code to{"\n"}
        <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>{params.phone}</Text>
      </Text>
      <Text style={[styles.hint, { color: colors.secondary }]}>Hint: use 1234 for testing</Text>

      <View style={styles.codeRow}>
        {code.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={(r) => { inputRefs.current[idx] = r; }}
            style={[
              styles.codeInput,
              {
                backgroundColor: colors.input,
                borderColor: digit ? colors.primary : colors.border,
                color: colors.foreground,
                fontFamily: "Inter_700Bold",
              },
            ]}
            value={digit}
            onChangeText={(v) => handleChange(v, idx)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
            keyboardType="number-pad"
            maxLength={4}
            selectTextOnFocus
          />
        ))}
      </View>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
          <Feather name="alert-circle" size={14} color={colors.destructive} />
