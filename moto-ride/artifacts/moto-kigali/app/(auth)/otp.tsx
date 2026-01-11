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
