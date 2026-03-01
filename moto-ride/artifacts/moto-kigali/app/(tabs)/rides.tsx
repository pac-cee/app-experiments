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
  const colors = useColors();
  const isCompleted = ride.status === "completed";
  const date = new Date(ride.date);
  const dateStr = date.toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-RW", { hour: "2-digit", minute: "2-digit" });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.vehicleIcon, { backgroundColor: colors.primary + "15" }]}>
          <MaterialCommunityIcons name="motorbike" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={[styles.riderName, { color: colors.foreground }]}>{ride.rider.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: isCompleted ? "#DCFCE7" : "#FEF2F2" }]}>
              <Text style={[styles.statusText, { color: isCompleted ? "#166534" : "#991B1B" }]}>
                {isCompleted ? "Completed" : "Cancelled"}
              </Text>
            </View>
          </View>
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>{dateStr} · {timeStr}</Text>
        </View>
      </View>

      <View style={[styles.routeSection, { borderTopColor: colors.border }]}>
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={[styles.routeText, { color: colors.foreground }]} numberOfLines={1}>{ride.pickup.name}</Text>
        </View>
        <View style={[styles.routeLine, { borderColor: colors.border }]} />
        <View style={styles.routeRow}>
          <Feather name="map-pin" size={12} color={colors.secondary} />
          <Text style={[styles.routeText, { color: colors.foreground }]} numberOfLines={1}>{ride.destination.name}</Text>
        </View>
      </View>

      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <View style={styles.priceRow}>
          <Feather name="dollar-sign" size={14} color={colors.mutedForeground} />
          <Text style={[styles.price, { color: colors.foreground }]}>{ride.price.toLocaleString()} RWF</Text>
        </View>
        {ride.rating !== undefined && (
          <StarRating value={ride.rating} size={14} readonly />
        )}
      </View>
    </View>
  );
}

export default function RidesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [rides, setRides] = useState<RideRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (user) {
      getRideHistory(user.id).then((data) => {
        setRides(data);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>My Rides</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{rides.length} trips</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.center}>
          <Feather name="clock" size={48} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No rides yet</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Your completed trips will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RideCard ride={item} />}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  list: { paddingHorizontal: 16, paddingTop: 16 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", padding: 14, gap: 12 },
  vehicleIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  riderName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
