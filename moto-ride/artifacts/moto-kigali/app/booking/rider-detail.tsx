import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useRide } from "@/context/RideContext";
import { useAuth } from "@/context/AuthContext";
import { useBroker } from "@/context/BrokerContext";
import { StarRating } from "@/components/ui/StarRating";
