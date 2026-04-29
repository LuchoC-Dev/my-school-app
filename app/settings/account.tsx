import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, Separator } from "@/components/ui";
import { useSettingsStore } from "@/stores/settingsStore";
import { FontFamily, FontSize } from "@/theme/typography";

const AVATARS = ["🧑", "👩", "👨", "🧑‍💻", "👩‍💻", "👨‍💻", "🎓", "📚", "🦊", "🐼", "🐸", "⭐"];

export default function AccountScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/settings");
  const insets = useSafeAreaInsets();
  const { userName, userAvatar, setUserName, setUserAvatar } = useSettingsStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) setUserName(trimmed);
    else setNameInput(userName);
    setEditingName(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 8,
        paddingBottom: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: tokens.borderLight,
      }}>
        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="body" style={{ color: tokens.accent }}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card" style={{ flex: 1 }}>👤 Cuenta</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Avatar */}
        <View style={{ alignItems: "center", paddingVertical: 20, gap: 8 }}>
          <TouchableOpacity onPress={() => setShowAvatarPicker(true)} style={{ position: "relative" }}>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              borderWidth: 2,
              borderColor: tokens.textPrimary,
              backgroundColor: tokens.surfaceAlt,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{ fontSize: 36 }}>{userAvatar}</Text>
            </View>
            <View style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: tokens.textPrimary,
              borderWidth: 2,
              borderColor: tokens.background,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{ fontSize: 10 }}>✏️</Text>
            </View>
          </TouchableOpacity>
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>Tocar para cambiar avatar</ThemedText>
        </View>

        <Separator />

        {/* Nombre */}
        <View style={{ padding: 14 }}>
          <ThemedText
            variant="metadata"
            style={{ color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}
          >
            Nombre
          </ThemedText>
          <View style={{
            backgroundColor: tokens.surface,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: editingName ? tokens.textPrimary : tokens.border,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            gap: 8,
          }}>
            {editingName ? (
              <>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  onSubmitEditing={saveName}
                  onBlur={saveName}
                  style={{
                    flex: 1,
                    color: tokens.textPrimary,
                    fontFamily: FontFamily.caveatRegular,
                    fontSize: FontSize.body,
                    padding: 0,
                  }}
                />
                <TouchableOpacity onPress={saveName}>
                  <ThemedText variant="metadata" style={{ color: tokens.accent }}>Guardar</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ThemedText variant="body" style={{ flex: 1 }}>{userName}</ThemedText>
                <TouchableOpacity onPress={() => { setNameInput(userName); setEditingName(true); }}>
                  <ThemedText variant="metadata" style={{ color: tokens.accent }}>Editar</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Separator />

        {/* Próximamente */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Próximamente
        </ThemedText>
        <View style={{
          margin: 14,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: tokens.borderLight,
          borderRadius: 10,
          padding: 16,
          alignItems: "center",
          gap: 8,
        }}>
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary, textAlign: "center", lineHeight: 20 }}>
            Sincronización en la nube,{"\n"}múltiples perfiles y más
          </ThemedText>
          <View style={{
            borderWidth: 1.5,
            borderColor: tokens.borderLight,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>en desarrollo</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Avatar picker modal */}
      <Modal visible={showAvatarPicker} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
          activeOpacity={1}
          onPress={() => setShowAvatarPicker(false)}
        >
          <View style={{
            backgroundColor: tokens.surface,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
            paddingBottom: insets.bottom + 20,
          }}>
            <ThemedText variant="card" style={{ marginBottom: 16, textAlign: "center" }}>Elegí tu avatar</ThemedText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {AVATARS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => { setUserAvatar(emoji); setShowAvatarPicker(false); }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    borderWidth: 2,
                    borderColor: emoji === userAvatar ? tokens.textPrimary : tokens.borderLight,
                    backgroundColor: tokens.surfaceAlt,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 26 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
