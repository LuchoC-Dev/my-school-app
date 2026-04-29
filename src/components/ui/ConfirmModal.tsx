import { Modal, View, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const tokens = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={Platform.OS === "android"}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" }}
        activeOpacity={1}
        onPress={onCancel}
      >
        {/* Card — stop propagation */}
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: tokens.surface,
            borderRadius: 14,
            padding: 20,
            width: 300,
            gap: 12,
            borderWidth: 1,
            borderColor: tokens.borderLight,
          }}
        >
          <ThemedText variant="card" style={{ textAlign: "center" }}>
            {title}
          </ThemedText>
          <ThemedText variant="body" style={{ color: tokens.textBody, textAlign: "center" }}>
            {message}
          </ThemedText>

          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: tokens.border,
                alignItems: "center",
              }}
            >
              <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
                {cancelLabel}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: destructive ? tokens.destructive : tokens.textPrimary,
                alignItems: "center",
              }}
            >
              <ThemedText variant="body" style={{ color: tokens.textInverse }}>
                {confirmLabel}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
