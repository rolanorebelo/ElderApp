import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth'; // Import the signOut function
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation from react-navigation
import { auth, database } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import AuthenticatedUserContext from '../AuthenticatedUserContext';
import colors from '../constants/colors';
import { firestore, storage } from '../config/firebase';
import { doc, setDoc , updateDoc} from 'firebase/firestore';

const Profile = () => {
  const { setUser } = useContext(AuthenticatedUserContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    setProfilePicture(route.params.profilePicture);
    
    return () => {
      // This code runs when the component is unmounted
      if (profilePicture !== route.params.profilePicture) {
        // If the profile picture has changed, navigate back to Home with the updated picture
        navigation.navigate('Home', {
          profilePicture: profilePicture, // Pass the updated profile picture
        });
      }
    };
  }, [route.params.profilePicture, profilePicture]);
  
  // const requestPermission = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('Sorry, we need camera roll permissions to make this work!');
  //   }
  // };
  
  // useEffect(() => {
  //   requestPermission();
  // }, []);

  const handleChangePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.cancelled) {
      const selectedImage = result.assets[0].uri;
  
      // Update the profile image state with the selected image URI
      setProfilePicture(selectedImage);
  
      // After handling the image selection, update the profile image URI in Firestore.
      try {
        const userDocRef = doc(database, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          profilePicture: selectedImage, // Update the profile image URI
        });
        console.log('Profile image updated successfully.');
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    }
  };
  
  
  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(database, 'users', user.uid);

        await updateDoc(userDocRef, {
          username,
          email,
          phoneNumber,
          interests,
          profilePicture,
        });

        console.log('Profile information updated successfully.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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
        source={
          profilePicture
            ? { uri: profilePicture }
            : require('../assets/default.png') // Use a default image if no profile picture is available
        }
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
