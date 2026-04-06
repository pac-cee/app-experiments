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
import { useRider } from "@/context/RiderContext";
import { StarRating } from "@/components/ui/StarRating";
import { rateCustomer } from "@/lib/riderService";

const QUICK_TAGS = ["Great passenger", "Polite & friendly", "Ready on time", "Clear directions", "Good communication"];

export default function RiderRatingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { activeJob, setActiveJob } = useRider();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (rating === 0 || !activeJob) return;
    setLoading(true);
    const fullComment = [selectedTags.join(", "), comment].filter(Boolean).join(" · ");
    await rateCustomer(activeJob.jobId, rating, fullComment);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setActiveJob(null);
      router.replace("/(rider)/home");
    }, 1800);
  };

  const handleSkip = () => {
    setActiveJob(null);
    router.replace("/(rider)/home");
  };

  useEffect(() => {
    if (!activeJob) router.replace("/(rider)/home");
  }, [activeJob]);

  if (!activeJob) return null;

  if (submitted) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center", paddingTop: topPad }]}>
        <View style={[styles.successCircle, { backgroundColor: colors.success + "18" }]}>
          <Feather name="check-circle" size={56} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Thanks!</Text>
        <Text style={[styles.successSub, { color: colors.mutedForeground }]}>Feedback submitted</Text>
      </View>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const customerInitials = activeJob.customer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ width: 36 }} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Rate Customer</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { paddingBottom: bottomPad + 20 }]}>
        <View style={styles.rideComplete}>
          <View style={[styles.checkCircle, { backgroundColor: colors.success + "15" }]}>
            <Feather name="check" size={28} color={colors.success} />
          </View>
          <Text style={[styles.completeTitle, { color: colors.foreground }]}>Ride Done!</Text>
          <Text style={[styles.earnings, { color: colors.success }]}>+{activeJob.price.toLocaleString()} RWF earned</Text>
          <Text style={[styles.route, { color: colors.mutedForeground }]}>
