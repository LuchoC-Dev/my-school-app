import { useState } from "react";
import { View, TouchableOpacity, TextInput, Linking, Alert, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useTheme, useFontTokens } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";
import { SectionLabel } from "./SectionLabel";
import { MaterialLink } from "@/types/entities";
import { FontSize } from "@/theme/typography";

interface MaterialSectionProps {
  links: MaterialLink[];
  onAdd?: (item: MaterialLink) => void;
  onRemove?: (index: number) => void;
  readonlyLabel?: string;
}

function getFileIcon(mimeType?: string): string {
  if (!mimeType) return "📄";
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("video")) return "🎬";
  if (mimeType.includes("audio")) return "🎵";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📊";
  return "📄";
}

export function MaterialSection({ links, onAdd, onRemove, readonlyLabel }: MaterialSectionProps) {
  const tokens = useTheme();
  const fonts = useFontTokens();
  const readonly = !onAdd;
  const [addingLink, setAddingLink] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const inputStyle = {
    borderWidth: 1.5,
    borderColor: tokens.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: tokens.surface,
    color: tokens.textPrimary,
    fontFamily: fonts.body,
    fontSize: FontSize.body,
  };

  async function handlePickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      let finalUri = asset.uri;

      // On native, copy to persistent app storage
      if (Platform.OS !== "web" && FileSystem.documentDirectory) {
        const dest = FileSystem.documentDirectory + asset.name;
        await FileSystem.copyAsync({ from: asset.uri, to: dest });
        finalUri = dest;
      }

      onAdd?.({
        label: asset.name,
        url: finalUri,
        type: "file",
        mimeType: asset.mimeType ?? undefined,
      });
    } catch {
      Alert.alert("Error", "No se pudo adjuntar el archivo.");
    }
  }

  function handleConfirmLink() {
    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();
    if (!trimmedLabel && !trimmedUrl) return;
    const href = trimmedUrl && !trimmedUrl.startsWith("http") ? `https://${trimmedUrl}` : trimmedUrl;
    onAdd?.({ label: trimmedLabel || trimmedUrl, url: href, type: "link" });
    setLabel("");
    setUrl("");
    setAddingLink(false);
  }

  function handleOpen(item: MaterialLink) {
    if (!item.url) return;
    Linking.openURL(item.url).catch(() => Alert.alert("No se pudo abrir el elemento."));
  }

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>{readonlyLabel ? `Material · ${readonlyLabel}` : "Material"}</SectionLabel>
        {!readonly && !addingLink && (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity onPress={handlePickFile}>
              <ThemedText variant="metadata" style={{ color: tokens.accent }}>
                + Archivo
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAddingLink(true)}>
              <ThemedText variant="metadata" style={{ color: tokens.accent }}>
                + Enlace
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {links.length === 0 && !addingLink && (
        <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
          {readonly ? "Sin material" : "Sin elementos todavía"}
        </ThemedText>
      )}

      {links.map((item, i) => {
        const isFile = item.type === "file";
        const icon = isFile ? getFileIcon(item.mimeType) : "🔗";
        const hasUrl = item.url.trim().length > 0;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => hasUrl && handleOpen(item)}
            activeOpacity={hasUrl ? 0.7 : 1}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: tokens.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: tokens.borderLight,
              paddingHorizontal: 12,
              paddingVertical: 8,
              gap: 8,
            }}
          >
            <ThemedText style={{ fontSize: 16 }}>{icon}</ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText
                variant="body"
                style={{ color: hasUrl ? tokens.textBody : tokens.textBody }}
                numberOfLines={1}
              >
                {item.label}
              </ThemedText>
              {!isFile && item.url && item.label !== item.url && (
                <ThemedText variant="metadata" style={{ color: tokens.textSecondary }} numberOfLines={1}>
                  {item.url}
                </ThemedText>
              )}
            </View>
            {!readonly && onRemove && (
              <TouchableOpacity onPress={() => onRemove(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <ThemedText variant="metadata" style={{ color: tokens.destructive }}>
                  ✕
                </ThemedText>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}

      {addingLink && (
        <View style={{ gap: 6, backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 10 }}>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Nombre del enlace (opcional)"
            placeholderTextColor={tokens.textSecondary}
            style={inputStyle}
            autoFocus
          />
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="URL (ej: https://...)"
            placeholderTextColor={tokens.textSecondary}
            style={inputStyle}
            autoCapitalize="none"
            keyboardType="url"
          />
          <View style={{ flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={() => {
                setAddingLink(false);
                setLabel("");
                setUrl("");
              }}
            >
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                Cancelar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirmLink} disabled={!label.trim() && !url.trim()}>
              <ThemedText
                variant="metadata"
                style={{ color: label.trim() || url.trim() ? tokens.accent : tokens.border }}
              >
                Agregar
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
