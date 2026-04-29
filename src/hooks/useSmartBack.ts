import { useRouter } from "expo-router";

/**
 * Returns a goBack function that uses router.back() if there's history,
 * or router.replace(fallback) when the stack is empty (e.g. after a page refresh).
 */
export function useSmartBack(fallback: string) {
  const router = useRouter();
  return () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback as any);
  };
}
