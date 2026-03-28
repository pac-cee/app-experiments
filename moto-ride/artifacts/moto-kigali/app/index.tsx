import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/(auth)/welcome" />;
  if (!user.role) return <Redirect href="/(auth)/role-select" />;
  if (user.role === "rider") {
    if (user.status === "pending") return <Redirect href="/(auth)/rider-pending" />;
    return <Redirect href="/(rider)/home" />;
  }
  return <Redirect href="/(tabs)/" />;
}
