import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { User } from "@/lib/mockData";
import colors from "@/constants/colors";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

const STORAGE_KEY = "motolink_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          setUserState(JSON.parse(stored));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const setUser = async (u: User | null) => {
    setUserState(u);
    if (u) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
