import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: 'Recognition Result',
            presentation: 'card'
          }}
        />
        <Stack.Screen
          name="database"
          options={{
            title: 'Database',
            presentation: 'card'
          }}
        />
      </Stack>
    </>
  );
}
