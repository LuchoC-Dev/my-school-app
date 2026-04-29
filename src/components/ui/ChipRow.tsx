import { useRef, useState, ReactNode } from "react";
import { View, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";

interface ChipRowProps {
  children: ReactNode;
  paddingHorizontal?: number;
}

export function ChipRow({ children, paddingHorizontal = 14 }: ChipRowProps) {
  const tokens = useTheme();
  const [showArrow, setShowArrow] = useState(false);
  const contentWidthRef = useRef(0);
  const containerWidthRef = useRef(0);

  function updateArrow(scrollX: number) {
    const hasOverflow = contentWidthRef.current > containerWidthRef.current;
    const atEnd = scrollX + containerWidthRef.current >= contentWidthRef.current - 8;
    setShowArrow(hasOverflow && !atEnd);
  }

  function onLayout(e: { nativeEvent: { layout: { width: number } } }) {
    containerWidthRef.current = e.nativeEvent.layout.width;
    updateArrow(0);
  }

  function onContentSizeChange(w: number) {
    contentWidthRef.current = w;
    updateArrow(0);
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    updateArrow(e.nativeEvent.contentOffset.x);
  }

  return (
    <View style={{ position: "relative" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal, gap: 6 }}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>

      {showArrow && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 8,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: tokens.surfaceAlt,
              borderWidth: 1,
              borderColor: tokens.borderLight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText style={{ color: tokens.textSecondary, fontSize: 14 }}>›</ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}
