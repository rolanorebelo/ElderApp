import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth'; // Import the signOut function
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from react-navigation
import { auth } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import AuthenticatedUserContext from '../AuthenticatedUserContext';
import colors from '../constants/colors';
import { firestore, storage } from '../config/firebase';

const Profile = () => {
  const { setUser } = useContext(AuthenticatedUserContext);
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  };
  
  useEffect(() => {
    requestPermission();
  }, []);
  
  const handleImageUpload = async (imageUri) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
  
        // Create a storage reference using the user's UID as part of the path
        const storageRef = storage.ref().child(`profileImages/${user.uid}`);
  
        await storageRef.put(blob);
        const downloadURL = await storageRef.getDownloadURL();
  
        setProfileImage(downloadURL);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Update the user's profile information in Firestore.
      await firestore.collection('users').doc(auth.currentUser.uid).update({
        username,
        email,
        phoneNumber,
        interests,
        profileImage,
      });
  
      console.log('Profile information updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleChangePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
     
      const selectedImage = result.assets[0];
    
    // Upload the selected image to Firebase Storage.
    handleImageUpload(selectedImage.uri);
    }
  };
  
  
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
      <TouchableOpacity onPress={handleChangePicture}>
        <Text>Change Picture</Text>
      </TouchableOpacity>

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
  updateButtonContainer:{
    width: 150,
    borderRadius: 8,
  },
  signOutButton: {
    backgroundColor: colors.primary, // You can change the color to your preference
    padding: 10,
    borderRadius: 8,
    width: 250,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Profile;
