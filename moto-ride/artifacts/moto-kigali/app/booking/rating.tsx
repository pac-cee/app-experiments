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
          </View>
          <Text style={[styles.completeTitle, { color: colors.foreground }]}>Ride Completed!</Text>
          <Text style={[styles.completePrice, { color: colors.success }]}>{activeRide.price.toLocaleString()} RWF</Text>
          <Text style={[styles.completeRoute, { color: colors.mutedForeground }]}>
            {activeRide.pickup.name} → {activeRide.destination.name}
          </Text>
        </View>

        <View style={[styles.riderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.riderAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.riderAvatarText}>{riderInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.riderName, { color: colors.foreground }]}>{activeRide.rider.name}</Text>
            <Text style={[styles.riderPlate, { color: colors.mutedForeground }]}>{activeRide.rider.plate}</Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={[styles.ratingPrompt, { color: colors.foreground }]}>How was your experience?</Text>
          <StarRating value={rating} onChange={setRating} size={44} />
          {rating > 0 && (
            <Text style={[styles.ratingLabel, { color: colors.primary }]}>{ratingLabels[rating]}</Text>
          )}
        </View>

        {rating > 0 && (
          <>
            <View style={styles.tagsSection}>
              <Text style={[styles.tagsLabel, { color: colors.mutedForeground }]}>Quick feedback</Text>
              <View style={styles.tagsRow}>
                {QUICK_COMMENTS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => toggleTag(tag)}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.muted,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.tagText, { color: isSelected ? "#fff" : colors.mutedForeground }]}>{tag}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TextInput
              style={[styles.commentInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground, fontFamily: "Inter_400Regular" }]}
              placeholder="Add a comment (optional)..."
              placeholderTextColor={colors.mutedForeground}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />
          </>
        )}

        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: rating > 0 ? colors.primary : colors.muted,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.submitBtnText, { color: rating > 0 ? "#fff" : colors.mutedForeground }]}>
              Submit Rating
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
