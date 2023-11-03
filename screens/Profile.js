import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from expo-linear-gradient

const Profile = () => {
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

  return (
    <LinearGradient // Use LinearGradient for the background gradient
    colors={['blue', 'white']}
    style={styles.container}
  >
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
  updateButtonContainer: {
    backgroundColor: 'black',
    padding: 10, // Add padding to style the button container
    borderRadius: 8, // Adjust this value as needed
    width: 300
  },
  
});

export default Profile;
