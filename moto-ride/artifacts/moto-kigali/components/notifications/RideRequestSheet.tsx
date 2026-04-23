import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { BrokerRequest } from "@/context/BrokerContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = 340;

interface Props {
