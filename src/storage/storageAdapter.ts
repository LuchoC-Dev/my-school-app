import { Platform } from "react-native";
import { StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

const getSecureStorage = (): StateStorage => ({
  setItem: (name, value) => SecureStore.setItem(name, value),
  getItem: (name) => SecureStore.getItem(name) ?? null,
  removeItem: (name) => SecureStore.deleteItem(name),
});

const getWebStorage = (): StateStorage => ({
  setItem: (name, value) => localStorage.setItem(name, value),
  getItem: (name) => localStorage.getItem(name),
  removeItem: (name) => localStorage.removeItem(name),
});

export const zustandStorage: StateStorage =
  Platform.OS === "web" ? getWebStorage() : getSecureStorage();
