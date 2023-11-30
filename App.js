import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import createBottomTabNavigator
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from './config/firebase';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Chat from './screens/Chat';
import Home from './screens/Home';
import Profile from './screens/Profile';
import TaskDetails from './screens/TaskDetails';
import VolunteerHome from './screens/Volunteer/VolunteerHome';
import { LoadingScreen, MatchedVolunteers, Welcome, EventDetails, Header, ViewTask, VolunteerChat, TaskTabs, CurrentTasks, NeighbourList, InvoicePage, InvoicePreview } from './screens';
import Toast from 'react-native-toast-message';
import VolunteerProfile from './screens/Volunteer/VolunteerProfile';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import AuthenticatedUserContext from './AuthenticatedUserContext';
import { LogBox } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';

LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
          const userDocRef = doc(database, 'users', authenticatedUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserType(userData.userType);
          } else {
            const volunteerDocRef = doc(database, 'volunteer', authenticatedUser.uid);
            const volunteerDocSnapshot = await getDoc(volunteerDocRef);
            if (volunteerDocSnapshot.exists()) {
              setUserType('volunteer');
            }
          }
        } else {
          setUser(null);
          setUserType(null);
        }
      }
    );

    return unsubscribeAuth;
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user, userType, setUser }}>
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='EventDetails'
        component={EventDetails}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Event Details',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='NeighbourList'
        component={NeighbourList}
        options={{ title: 'Neighbour List' }}
      />
      <Stack.Screen
        name='Chat'
        component={Chat}
        options={{ title: 'Chat' }}
      />
      <Stack.Screen
        name='TaskTabs'
        component={TaskTabs}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Tasks',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='CurrentTasks'
        component={CurrentTasks}
        options={{
          headerStyle: {
            backgroundColor: 'blue',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Current Tasks',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          headerStyle: {
            backgroundColor: 'blue',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='TaskDetails'
        component={TaskDetails}
        options={{ headerTitle: 'Post a Task', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchedVolunteers"
        component={MatchedVolunteers}
        options={{ title: 'Select a Volunteer' }}
      />
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function VolunteerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='VolunteerHome'
        component={VolunteerHome}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Task Requests',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Header"
        component={Header}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='VolunteerProfile'
        component={VolunteerProfile}
        options={{
          headerStyle: {
            backgroundColor: 'blue',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Volunteer Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='ViewTask'
        component={ViewTask}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Task Details',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='InvoicePage'
        component={InvoicePage}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Invoice Page',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='InvoicePreview'
        component={InvoicePreview}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitle: 'Invoice Preview',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='VolunteerChat'
        component={VolunteerChat}
        options={{ title: 'Chat', headerTitleAlign: 'center' }}
      />
      
    </Stack.Navigator>
  );
}

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
  const { user, userType, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    return unsubscribeAuth;
  }, [user]);

  if (isLoading === null) {
    return null;
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (user) {
    console.log('Useerrrr',user);
    console.log('Useerr Typee',userType);
    if (userType === 'volunteer') {
      return (
        <NavigationContainer>
          <VolunteerStack />
        </NavigationContainer>
      );
    } else {
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
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </AuthenticatedUserProvider>
  );
}
export { AuthenticatedUserContext };
