import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import COLORS from '../constants/colors';

// Import Firestore methods for fetching user data
import { doc, getDoc } from 'firebase/firestore';
import { collection, database } from '../config/firebase'; // Update with your Firestore config

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState(""); // New state for reset password email input
  const [resetError, setResetError] = useState(""); // New state for reset password error
  const [showResetInput, setShowResetInput] = useState(false);

  const validateInput = () => {
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return false;
    }
    setError(""); // Clear any previous error message
    return true;
  };

  const onHandleLogin = async () => {
    if (validateInput()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch the user's data from both "volunteer" and "users" collections
        const volunteerDocRef = doc(database, 'volunteer', user.uid);
        const userDocRef = doc(database, 'users', user.uid);

        const [volunteerSnapshot, userSnapshot] = await Promise.all([
          getDoc(volunteerDocRef),
          getDoc(userDocRef)
        ]);

        if (volunteerSnapshot.exists()) {
          // The user is a volunteer
          navigation.navigate('VolunteerHome');
        } else if (userSnapshot.exists()) {
          // The user is a normal user
          navigation.navigate('Home');
        } else {
          setError("User data not found");
        }
      } catch (error) {
        // Handle specific error cases
        if (error.code === 'auth/invalid-email') {
          setError('Invalid Email Address');
        } else if (error.code === 'auth/user-not-found') {
          setError('User not found. Please check your email.');
        } else if (error.code === 'auth/wrong-password') {
          setError('Incorrect Email or Password');
        } else if (error.code === 'auth/too-many-requests') {
          setError('Account temporarily disabled due to many failed login attempts. Reset your password or try again later.');
        } else {
          console.error('Error signing in:', error);
          setError('Incorrect Email or Password');
        }
      }
    }
  };

  const onHandleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetError("");
      Alert.alert("Password Reset Email Sent", "Please check your email to reset your password.");
      setShowResetInput(false); // Hide the reset email input field after sending the reset email
    } catch (error) {
      setResetError("Error sending password reset email. Please check your email address.");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 22 }}>
            <Text style={{
              fontSize: 30,
              fontWeight: 'bold',
              marginVertical: 12,
              color: '#0A93DF',
              textShadowColor: 'rgba(0, 0, 0, 0.25)',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 4,
              fontFamily: 'Roboto',
              fontStyle: 'normal'
            }}>
              Elder App
            </Text>

            <Text style={{
              fontSize: 12,
              fontWeight: '400',
              color: '#120000',
              fontStyle: 'normal',
              lineHeight: 20,
              letterSpacing: 0.25
            }}>
              Connecting Generations, Building Communities: Your Helping Hand App
            </Text>

            <Image
              source={require('../assets/loginPage.png')}
              style={{
                height: 150,
                width: 350,
                borderRadius: 4
              }}
              resizeMode='contain'
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
          {error !== "" && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}> Log In</Text>
          </TouchableOpacity>

          {/* Forgot Password Section */}
          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Forgot your password? </Text>
            <TouchableOpacity onPress={() => setShowResetInput(true)}>
              <Text style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: 'bold',
                marginLeft: 6
              }}>Reset Password</Text>
            </TouchableOpacity>
          </View>

          {/* Reset Password Section */}
          {showResetInput && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={resetEmail}
                onChangeText={(text) => setResetEmail(text)}
              />
              <TouchableOpacity style={styles.resetButton} onPress={onHandleResetPassword}>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}> Reset Password</Text>
              </TouchableOpacity>
              {resetError !== "" && <Text style={styles.errorText}>{resetError}</Text>}
            </View>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
  <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: 'bold', marginTop: 20 }}>
    Need an account? Sign Up
  </Text>
</TouchableOpacity>

        </View>
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
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: '#2D264B',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: '#2D264B',
    height: 28,
    width: 180,
    fontSize:10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center'
  },
});
