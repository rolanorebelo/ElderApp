import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, Pressable, SafeAreaView, TouchableOpacity, StatusBar, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import { auth, database } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

async function storeVolunteerData(userId, userData) {
  const volunteerDocRef = doc(database, 'volunteer', userId);
  await setDoc(volunteerDocRef, userData);
}

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [location,setLocation] = useState('')
  const [userType, setUserType] = useState('normal'); // 'normal' is the default value

  const onHandleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        })
          .then(async () => {
            const userDocRef = doc(database, 'users', user.uid);
            const userData = {
              firstName,
              lastName,
              mobileNumber,
              email,
              userType,
              location
              // Add other fields as needed
            };

            if (userType === 'volunteer') {
              await storeVolunteerData(user.uid, userData);
            } else {
              await setDoc(userDocRef, userData);
            }

            const setCustomClaimsFunction = httpsCallable(functions, 'setCustomClaims');
            await setCustomClaimsFunction({ userId: user.uid, role: userType });

            console.log('User data stored successfully');
            console.log('Role: ', userType);
            console.log('User display name: ', user.displayName);
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ marginVertical: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: '#0A93DF',
                  textShadowColor: 'rgba(0, 0, 0, 0.25)',
                  textShadowOffset: { width: 0, height: 4 },
                  textShadowRadius: 4,
                  fontFamily: 'Roboto',
                  fontStyle: 'normal'
                }}>
                  Elder App
                </Text>
                <Image
                  source={require('../assets/signUp.png')}
                  style={{
                    height: 150,
                    width: 350,
                    borderRadius: 4
                  }}
                  resizeMode='contain'
                />
              </View>
            </View>
            <View style={{ marginBottom: 12 }}>
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
                placeholder='First Name'
                placeholderTextColor={COLORS.black}
                style={styles.input}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholder='Last Name'
                placeholderTextColor={COLORS.black}
                style={styles.input}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
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
                secureTextEntry={true}
                textContentType="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 16
                }}
              >
                {isPasswordShown == true ? (
                  <Ionicons name='eye-off' size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name='eye' size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <TextInput
                placeholder='Mobile Number'
                placeholderTextColor={COLORS.black}
                keyboardType='numeric'
                style={{
                  backgroundColor: "#F6F7FB",
                  height: 58,
                  marginBottom: 20,
                  fontSize: 16,
                  borderRadius: 10,
                  padding: 12,
                  width: 300
                }}
                autoCorrect={false}
                value={mobileNumber}
                onChangeText={(text) => setMobileNumber(text)}
              />
            </View>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholder='Location'
                placeholderTextColor={COLORS.black}
                style={styles.input}
                value={location}
                onChangeText={(text) => setLocation(text)}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
              <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18, alignSelf: 'center', marginTop: 9 }}> Sign Up</Text>
            </TouchableOpacity>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: 10,
              paddingTop: 4
            }}>
              <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account? </Text>
              <Pressable
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={{
                  fontSize: 16,
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  marginLeft: 6,
                }}>Login</Text>
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
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
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
    alignSelf: 'center'
  },
});
