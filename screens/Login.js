import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import COLORS from '../constants/colors';

// Import Firestore methods for fetching user data
import { doc, getDoc } from 'firebase/firestore';
import { collection, database } from '../config/firebase'; // Update with your Firestore config

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = async () => {
    if (email !== "" && password !== "") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Fetch the user's custom claims
        const idTokenResult = await user.getIdTokenResult();
        const customClaims = idTokenResult.claims;
        const role = customClaims.role; // Assuming 'role' is the custom claim set by the Cloud Function
  console.log('claims',customClaims);

        // Check the user's role and navigate accordingly
        if (role === 'volunteer') {
          navigation.navigate('VolunteerHome');
        } else {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert("Login error", error.message);
      }
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
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}> Log In</Text>
      </TouchableOpacity>
      <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: 'bold',
                            marginLeft: 6
                        }}> Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#2D264B',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});