import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import Home from "./screens/Home";
import Splash from "./screens/Splash";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppContext } from "./store/AppContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const data = await AsyncStorage.getItem("firstname");
      if (data != null) {
        setIsOnboardingCompleted(true);
      }
      setIsLoading(false);
    }
    getData();
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <AppContext.Provider
      value={{
        isOnboardingCompleted: isOnboardingCompleted,
        setIsOnboardingCompleted: setIsOnboardingCompleted,
      }}
    >
      <NavigationContainer>
          <Stack.Navigator>
    
             {isOnboardingCompleted ? (
                // Onboarding completed, user is signed in
                <>
                <Stack.Screen name="Home" component={Home} options={{  headerShown: false }}/>
                <Stack.Screen name="Profile" component={Profile} />
                </>
                ) : (
                // User is NOT signed in
                <Stack.Screen name="Onboarding" component={Onboarding} />
                )}
          </Stack.Navigator>
          </NavigationContainer>
  </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
