import React, { ReactNode } from "react";
import { Modal, View, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const tokens = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        activeOpacity={1}
        onPress={onClose}
      />
      {/* Sheet */}
      <View
        style={{
          backgroundColor: tokens.surface,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
      >
        {/* Handle */}
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: tokens.border,
            alignSelf: "center",
            marginBottom: 12,
          }}
        />
        {children}
      </View>
    </Modal>
  );
}
