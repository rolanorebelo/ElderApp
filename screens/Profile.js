import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth'; // Import the signOut function
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from react-navigation
import { auth } from '../config/firebase';
import AuthenticatedUserContext from '../AuthenticatedUserContext';
const Profile = () => {
  const { setUser } = useContext(AuthenticatedUserContext);
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');

  const handleChange = (name, value) => {
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'interests':
        setInterests(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    // Update the user's profile information
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Clear the user context
      navigation.navigate('Welcome'); // Navigate to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <LinearGradient colors={['blue', 'white']} style={styles.container}>
      <Image
        source={require('../assets/images/profile.png')}
        style={styles.profileImage}
      />
      <Text>Change Picture</Text>
      <TextInput
        name="username"
        placeholder="Username"
        value={username}
        onChangeText={(value) => handleChange('username', value)}
        style={styles.input}
      />
      <TextInput
        name="email"
        placeholder="Email Id"
        value={email}
        onChangeText={(value) => handleChange('email', value)}
        style={styles.input}
      />
      <TextInput
        name="phoneNumber"
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(value) => handleChange('phoneNumber', value)}
        style={styles.input}
      />
      <TextInput
        name="password"
        placeholder="Password"
        value={password}
        onChangeText={(value) => handleChange('password', value)}
        style={styles.input}
      />
      <TextInput
        name="interests"
        placeholder="Interests"
        value={interests}
        onChangeText={(value) => handleChange('interests', value)}
        style={styles.input}
      />
       <View style={styles.updateButtonContainer}>
        <Button color="black" title="Update" onPress={handleSubmit} />
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: 'white'
  },
  signOutButton: {
    backgroundColor: 'red', // You can change the color to your preference
    padding: 10,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Profile;
