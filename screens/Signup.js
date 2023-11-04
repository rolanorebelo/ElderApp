import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, Pressable, SafeAreaView, TouchableOpacity, StatusBar, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
// const backImage = require("../assets/backImage.png");
import { auth, database } from '../config/firebase';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';

export default function SignUp({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const onHandleSignup = async () => {
    if (email !== '' && password !== '' && firstName !== '' && lastName !== '') {
      try {
        // Create a new user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user information in Firestore
        const usersCollection = collection(database, 'users'); // 'users' is the name of your Firestore collection
        await addDoc(usersCollection, {
          firstName: firstName, // Use the firstName state variable
          lastName: lastName, // Use the lastName state variable
          mobileNumber: mobileNumber, // Use the mobileNumber state variable
          email: email, // Store email as well if needed
          uid: user.uid, // You can store the user's unique identifier for reference
        });

        console.log('Signup success');
      } catch (err) {
        Alert.alert('Signup error', err.message);
      }
    } else {
      Alert.alert('Signup error', 'Please fill in all required fields.');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image source={backImage} style={styles.backImage} /> */}
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
            {/* <View style={{ marginBottom: 12 }}>
              <TextInput
                  placeholder='Confirm Password'
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={isPasswordShown}
                  style={{
                      height: 48,
                      borderColor: COLORS.black,
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingLeft: 22
                  }}
              />
          </View> */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12
            }}>
              {/* <Picker
                  style={{ flex: 1 }}
                  selectedValue={selectedCountryCode}
                  onValueChange={(itemValue, itemIndex) => setSelectedCountryCode(itemValue)}
              >
                  {countryCodes.map((country, index) => (
                      <Picker.Item key={index} label={country.label} value={country.value} />
                  ))}
              </Picker> */}
              <TextInput
                placeholder='Mobile Number'
                placeholderTextColor={COLORS.black}
                keyboardType='numeric'
                style={{ backgroundColor: "#F6F7FB",
                height: 58,
                marginBottom: 20,
                fontSize: 16,
                borderRadius: 10,
                padding: 12,
                width: 300}}
                autoCorrect={false}
                value={mobileNumber}
                onChangeText={(text) => setMobileNumber(text)}
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
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
