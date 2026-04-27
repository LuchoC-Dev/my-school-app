import { Platform } from "react-native";
import { StateStorage } from "zustand/middleware";

const getMMKVStorage = (): StateStorage => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MMKV } = require("react-native-mmkv");
  const storage = new MMKV();
  return {
    setItem: (name, value) => storage.set(name, value),
    getItem: (name) => storage.getString(name) ?? null,
    removeItem: (name) => storage.delete(name),
  };
};

const getWebStorage = (): StateStorage => ({
  setItem: (name, value) => localStorage.setItem(name, value),
  getItem: (name) => localStorage.getItem(name),
  removeItem: (name) => localStorage.removeItem(name),
});

export const zustandStorage: StateStorage =
  Platform.OS === "web" ? getWebStorage() : getMMKVStorage();
