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
import { useRide } from "@/context/RideContext";
import { StarRating } from "@/components/ui/StarRating";
import { rateRide } from "@/lib/rideService";

const QUICK_COMMENTS = ["Great rider!", "Very punctual", "Safe driving", "Friendly", "Knew the route"];

export default function RatingScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeRide, setActiveRide } = useRide();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    const fullComment = [selectedTags.join(", "), comment].filter(Boolean).join(" · ");
    await rateRide(activeRide?.bookingId ?? "", rating, fullComment);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setActiveRide(null);
      router.replace("/(tabs)/");
    }, 1800);
  };

  const handleSkip = () => {
    setActiveRide(null);
    router.replace("/(tabs)/");
  };

  React.useEffect(() => {
    if (!activeRide) router.replace("/(tabs)/");
  }, [activeRide]);

  if (!activeRide) return null;

  if (submitted) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center", paddingTop: topPad }]}>
        <View style={[styles.successCircle, { backgroundColor: colors.success + "18" }]}>
          <Feather name="check-circle" size={56} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Thank you!</Text>
        <Text style={[styles.successText, { color: colors.mutedForeground }]}>Your feedback helps the community</Text>
      </View>
    );
  }

  const riderInitials = activeRide.rider.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ width: 36 }} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Rate Your Ride</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { paddingBottom: bottomPad + 20 }]}>
        <View style={styles.rideComplete}>
          <View style={[styles.checkCircle, { backgroundColor: colors.success + "15" }]}>
            <Feather name="check" size={28} color={colors.success} />
