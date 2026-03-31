import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useRider, ActiveJob } from "@/context/RiderContext";
import { acceptJob } from "@/lib/riderService";

const QUICK_PRICES = [1000, 1500, 2000, 2500, 3000, 4000, 5000];
