import { PersonProvider } from "@/contexts/PersonContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PersonProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      </Stack>
    </PersonProvider>
  );
}
