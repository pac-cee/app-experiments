import { Feather } from "@expo/vector-icons";
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
import { getJobHistory } from "@/lib/riderService";
import { JobRecord } from "@/lib/mockData";

function StarRow({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Feather key={s} name="star" size={11} color={s <= rating ? "#F59E0B" : "#D1D5DB"} />
      ))}
    </View>
  );
}

function JobCard({ job }: { job: JobRecord }) {
  const colors = useColors();
  const date = new Date(job.date);
  const dateStr = date.toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-RW", { hour: "2-digit", minute: "2-digit" });
  const initials = job.customer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: job.status === "completed" ? colors.success : colors.muted }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.customerName, { color: colors.foreground }]}>{job.customer.name}</Text>
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>{dateStr} at {timeStr}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text style={[styles.price, { color: job.status === "completed" ? colors.success : colors.mutedForeground }]}>
            {job.status === "completed" ? `+${job.price.toLocaleString()} RWF` : "Cancelled"}
          </Text>
          {job.rating && <StarRow rating={job.rating} />}
        </View>
      </View>

      <View style={[styles.routeRow, { borderTopColor: colors.border }]}>
        <View style={styles.routePin}>
          <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.pinLine, { backgroundColor: colors.border }]} />
          <View style={[styles.pinDot, { backgroundColor: colors.secondary }]} />
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={[styles.locText, { color: colors.mutedForeground }]} numberOfLines={1}>{job.pickup.name}</Text>
          <Text style={[styles.locText, { color: colors.mutedForeground }]} numberOfLines={1}>{job.destination.name}</Text>
        </View>
        <View style={[styles.statusBadge, {
          backgroundColor: job.status === "completed" ? colors.success + "15" : colors.muted,
        }]}>
          <Text style={[styles.statusText, { color: job.status === "completed" ? colors.success : colors.mutedForeground }]}>
            {job.status === "completed" ? "Completed" : "Cancelled"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function JobsScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 84 : insets.bottom + 64;

  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getJobHistory(user.id).then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, [user]);

  const completed = jobs.filter((j) => j.status === "completed");
  const totalEarnings = completed.reduce((sum, j) => sum + j.price, 0);
  const avgRating = completed.filter((j) => j.rating).reduce((sum, j, _, arr) => sum + (j.rating ?? 0) / arr.length, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Job History</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j.id}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.statsRow, { marginBottom: 16 }]}>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="trending-up" size={20} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {totalEarnings.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total RWF</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="briefcase" size={20} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.foreground }]}>{completed.length}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completed</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="star" size={20} color="#F59E0B" />
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Avg Rating</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="briefcase" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No jobs yet</Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                Complete your first ride to see your history here.
              </Text>
            </View>
          }
          renderItem={({ item }) => <JobCard job={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  list: { padding: 16, gap: 12 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
  customerName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  dateText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  price: { fontSize: 14, fontFamily: "Inter_700Bold" },
  starRow: { flexDirection: "row", gap: 2 },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderTopWidth: 1 },
  routePin: { alignItems: "center" },
