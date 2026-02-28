import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { getRideHistory } from "@/lib/rideService";
import { RideRecord } from "@/lib/mockData";
import { StarRating } from "@/components/ui/StarRating";

function RideCard({ ride }: { ride: RideRecord }) {
