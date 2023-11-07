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
import TaskDetails from './screens/TaskDetails';
import VolunteerHome from './screens/Volunteer/VolunteerHome';
import { LoadingScreen, MatchedVolunteers, Welcome } from './screens';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import AuthenticatedUserContext from './AuthenticatedUserContext';
// import firebaseAuth from './firebaseConfig';
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
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }} // Hide the header for Home screen
      />
      <Stack.Screen
        name='Chat'
        component={Chat}
        options={{ title: 'Chat' }} // Show the header for Chat screen
      />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{ headerShown: false }} // Hide the header for Profile screen
      />
      <Stack.Screen
        name='TaskDetails'
        component={TaskDetails}
        options={{ title: 'Post a Task' }} // Hide the header for TaskDetails screen
      />
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{ headerShown: false }} // Hide the header for LoadingScreen
      />
       <Stack.Screen
        name="MatchedVolunteers"
        component={MatchedVolunteers}
        options={{ title: 'Select a Volunteer' }}  // Hide the header for LoadingScreen
      />
      <Stack.Screen name='Login' component={Login}  options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function VolunteerStack(){
  return(
    <Stack.Navigator  defaultScreenOptions={VolunteerHome}>
      <Stack.Screen options={{
    title: 'Task Requests', // Change the header name to whatever you want
  }} name='VolunteerHome' component={VolunteerHome}/>
  <Stack.Screen name='Login' component={Login} />
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
      <Toast ref={(ref) => Toast.setRef(ref)} /> 
    </AuthenticatedUserProvider>
  );
}
export { AuthenticatedUserContext };