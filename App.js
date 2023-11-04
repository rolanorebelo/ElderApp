import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Chat from './screens/Chat';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Details from './screens/Details';
import VolunteerHome from './screens/Volunteer/VolunteerHome';
import { Welcome } from './screens';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import AuthenticatedUserContext from './AuthenticatedUserContext';

const Stack = createNativeStackNavigator();
// const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log('AuthenticatedUserProvider rendered');
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <Stack.Navigator  defaultScreenOptions={Home}>
      <Stack.Screen name='Home' component={Home}/>
      <Stack.Screen name='Chat' component={Chat} />
      <Stack.Screen name='Profile' component={Profile}/>
      <Stack.Screen name='Details' component={Details}/>
    </Stack.Navigator>
  );
}

function VolunteerStack(){
  return(
    <Stack.Navigator  defaultScreenOptions={VolunteerHome}>
      <Stack.Screen options={{
    title: 'Task Requests', // Change the header name to whatever you want
  }} name='VolunteerHome' component={VolunteerHome}/>
    </Stack.Navigator>
  );
}

// function WelcomeStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name='Welcome' component={Welcome} />
//     </Stack.Navigator>
//   );
// }

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Welcome' component={Welcome} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='SignUp' component={SignUp} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // Unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (user) {
    // Check the user's userType (assuming it's a property of the user object)
    const userType = user.userType; // Adjust this based on your data structure
    console.log('Userrr',user);
    if (userType === 'volunteer') {
      console.log('VOluneer');
      return (
        <NavigationContainer>
          <VolunteerStack />
        </NavigationContainer>
      );
    } else {
      console.log('Chattt');
      return (
        <NavigationContainer>
          <ChatStack />
        </NavigationContainer>
      );
    }
  } else {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }
}


export default function App() {
  // let [fontsLoaded] = useFonts({
  //   // Define your fonts here
  //   // Example:
  //   // 'YourFontName': require('./path-to-your-font.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size='large' />
  //     </View>
  //   );
  // }

  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
export { AuthenticatedUserContext };