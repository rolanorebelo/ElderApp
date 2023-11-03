import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login, SignUp, Welcome, Home, Details, Profile, Chat } from './screens';
import { AppLoading } from 'expo'; // Import the AppLoading component
import * as Font from 'expo-font'; // Import the Font module

const Stack = createNativeStackNavigator();

export default function App() {
  // const [fontLoaded, setFontLoaded] = useState(false); // State to track if the font is loaded

  // // Function to load custom fonts
  // const loadFonts = async () => {
  //   await Font.loadAsync({
  //     'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'), // Replace with the actual path to your font file
  //   });
  //   setFontLoaded(true);
  // };

  // if (!fontLoaded) {
  //   // If the font is not loaded, display the AppLoading component
  //   return (
  //     <AppLoading
  //       startAsync={loadFonts} // Load the fonts
  //       onFinish={() => setFontLoaded(true)} // Set the state to indicate fonts are loaded
  //       onError={console.warn} // Handle errors, if any
  //     />
  //   );
  // }

  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false
          }}
        />
          <Stack.Screen
          name="Details"
          component={Details}
          options={{
            headerShown: false,
          }}
        />
          <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
           <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}