import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import { auth, database } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import * as ImagePicker from 'expo-image-picker';
import Axios from 'axios';
import Toast from 'react-native-toast-message';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
const functions = getFunctions();

async function getLocation() {
  const locationPermission = await requestForegroundPermissionsAsync();
  if (locationPermission.status === 'granted') {
    const userLocation = await getCurrentPositionAsync({});
    return {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    };
  } else {
    console.error('Location permission not granted');
    return null;
  }
}

async function storeVolunteerData(userId, userData, ratePerHour) {
  const volunteerDocRef = doc(database, 'volunteer', userId);
  userData.available = 'free';
  userData.ratePerHour = ratePerHour;
  userData.location = await getLocation();
  await setDoc(volunteerDocRef, userData);
}




export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [location, setLocation] = useState('');
  const [userType, setUserType] = useState('normal');
  const [profilePicture, setProfilePicture] = useState();
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [ratePerHour, setRatePerHour] = useState('');
  const [error, setError] = useState("");

  const handleChooseProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };


  const validateInput = () => {
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !location
    ) {
      setError('Please fill in all the required fields.');
      setPasswordMismatch(false); // Reset password mismatch state
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
  
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return false;
    }
  
    setError(""); // Clear any previous error message
    setPasswordMismatch(false); // Reset password mismatch state
    return true;
  };
  

  const onHandleSignup = async () => {
    if (!validateInput()) {
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
  
      const userDocRef = doc(database, 'users', user.uid);
      const userData = {
        firstName,
        lastName,
        mobileNumber,
        email,
        userType,
        location,
        profilePicture: profilePicture ? profilePicture : require('../assets/default.png'),
      };

      console.log('Userype---------',userType);
      if (userType === 'volunteer') {
        // Get the location first before setting volunteer data
        await storeVolunteerData(user.uid, userData, ratePerHour);
      } else {
        await setDoc(userDocRef, userData);
      }
      
  
      Axios.post(
        'https://us-central1-elderapp-55680.cloudfunctions.net/setCustomClaims/setCustomClaims',
        {
          uid: user.uid,
          customClaims: {
            userType: userType,
          },
        }
      );
  
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'User registered successfully!',
        visibilityTime: 3000,
      });
  
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('The email address is already in use.');
      } else {
        console.error('Error creating user:', error);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ marginVertical: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: '#0A93DF',
                    textShadowColor: 'rgba(0, 0, 0, 0.25)',
                    textShadowOffset: { width: 0, height: 4 },
                    textShadowRadius: 4,
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                  }}
                >
                  Elder App
                </Text>
                <Image
                  source={require('../assets/signUp.png')}
                  style={{
                    height: 150,
                    width: 350,
                    borderRadius: 4,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <TouchableOpacity onPress={handleChooseProfilePicture}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={{ width: 150, height: 150, borderRadius: 75 }}
                />
              ) : (
                <View
                  style={{
                    width: 150,
                    height: 150,
                    backgroundColor: '#E0E0E0',
                    borderRadius: 75,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {profilePicture ? (
                    <Image
                      source={
                        profilePicture
                          ? { uri: profilePicture }
                          : require('../assets/default.png')
                      }
                      style={{ width: 150, height: 150, borderRadius: 75 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 150,
                        height: 150,
                        backgroundColor: '#E0E0E0',
                        borderRadius: 75,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, color: COLORS.black }}>
                        Add Profile Picture
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>

            <View style={{ marginBottom: 12, marginTop: 5 }}>
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Normal User" value="normal" />
                <Picker.Item label="Volunteer" value="volunteer" />
              </Picker>
            </View>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholder="First Name"
                placeholderTextColor={COLORS.black}
                style={styles.input}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholder="Last Name"
                placeholderTextColor={COLORS.black}
                style={styles.input}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            <View style={{ marginBottom: 12 }}>
            {userType === 'volunteer' && (
              <TextInput
                placeholder="Rate Per Hour"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                style={styles.input}
                value={ratePerHour}
                onChangeText={(text) => setRatePerHour(text)}
              />
            )}
          </View>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!isPasswordShown}
                textContentType="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 16,
                }}
              >
                {isPasswordShown == true ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!isPasswordShown}
                textContentType="password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
            </View>
            {passwordMismatch && (
              <Text style={{ color: 'red', marginBottom: 12 }}>
                Passwords do not match.
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                style={{
                  backgroundColor: '#F6F7FB',
                  height: 58,
                  marginBottom: 20,
                  fontSize: 16,
                  borderRadius: 10,
                  padding: 12,
                  width: 300,
                }}
                autoCorrect={false}
                value={mobileNumber}
                onChangeText={(text) => setMobileNumber(text)}
              />
            </View>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholder="Location"
                placeholderTextColor={COLORS.black}
                style={styles.input}
                value={location}
                onChangeText={(text) => setLocation(text)}
              />
            </View>
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#fff',
                  fontSize: 18,
                  alignSelf: 'center',
                  marginTop: 9,
                }}
              >
                {' '}
                Sign Up
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingBottom: 10,
                paddingTop: 4,
              }}
            >
              <Text style={{ fontSize: 16, color: COLORS.black }}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.primary,
                    fontWeight: 'bold',
                    marginLeft: 6,
                  }}
                >
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#F6F7FB',
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 10,
    backgroundColor: '#2D264B',
    width: 220,
    height: 55,
    flexShrink: 0,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});
