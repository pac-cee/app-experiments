import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MockMap } from "@/components/map/MockMap";
import { LocationInput } from "@/components/booking/LocationInput";
import { VehicleSelector } from "@/components/booking/VehicleSelector";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
