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
