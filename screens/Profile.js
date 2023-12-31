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
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import Toast from 'react-native-toast-message';

const Profile = () => {
  const { setUser } = useContext(AuthenticatedUserContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setFirstName(route.params.firstName);
    setLastName(route.params.lastName);
    console.log('userrr',user);
    if (user) {
  
      // Fetch the mobileNumber from Firestore based on the user's UID
      const userDocRef = doc(database, 'users', user.uid);
      console.log("user doc red",userDocRef);
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const userMobileNumber = userData.mobileNumber;
            const location = userData.location;
            console.log('Mobileee',userMobileNumber);
            if (userMobileNumber) {
              setMobileNumber(userMobileNumber);
            }
            if (location) {
              setLocation(location);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching mobileNumber and location:', error);
        });
    }
  
    // Update the profile picture with the one from the route params
    setProfilePicture(route.params.profilePicture);
  }, [route.params.profilePicture, route.params.firstName, route.params.lastName]);
  console.log('Mobileee 2',mobileNumber);

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
        //console.log('Profile image updated successfully.');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Profile Picture Updated',
          visibilityTime: 3000, // Adjust as needed
        });
      } catch (error) {
        console.error('Error updating profile image:', error);
       alert('Error updating profile image:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error updating profile image',
          visibilityTime: 3000, // Adjust as needed
        });
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        if (firstName.trim() === '' || lastName.trim() === '') {
          // Check if first name or last name is empty and show an error message
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'First Name and Last Name cannot be empty.',
            visibilityTime: 3000, // Adjust as needed
          });
        } else {
          const userDocRef = doc(database, 'users', user.uid);
    
          // Prepare the data to update
          const updatedData = {};
    
          // Check if firstName is not empty and update it
          if (firstName.trim() !== '') {
            updatedData.firstName = firstName;
          }
    
          // Check if lastName is not empty and update it
          if (lastName.trim() !== '') {
            updatedData.lastName = lastName;
          }
    
          // Check if mobileNumber is not empty and update it
          if (mobileNumber.trim() !== '') {
            updatedData.mobileNumber = mobileNumber;
          }

          if (location.trim() !== '') {
            updatedData.location = location;
          }
    
          // Check if profilePicture is not empty and update it
          if (profilePicture) {
            updatedData.profilePicture = profilePicture;
          }
    
          // Update the user's document in Firestore
          await updateDoc(userDocRef, updatedData);
    
          // Update the user's display name in Firebase Authentication
          const updatedDisplayName = `${firstName.trim()} ${lastName.trim()}`;
          if (updatedDisplayName !== '') {
            await updateProfile(user, {
              displayName: updatedDisplayName,
            });
          }
    
          //console.log('Profile information updated successfully.');
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Profile information updated successfully.',
            visibilityTime: 3000, // Adjust as needed
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error updating profile image',
        visibilityTime: 3000, // Adjust as needed
      });
      console.error('Error updating profile:', error);
    }
  };
  
  
  
  const handleChange = (name, value) => {
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'mobileNumber':
        setMobileNumber(value);
        break;
      case 'location':
        setLocation(value);
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
      <TouchableOpacity style={styles.changePictureButton} onPress={handleChangePicture}>
        <Text style={styles.changePictureButtonText}>Change Picture</Text>
      </TouchableOpacity>

      <TextInput
        name="firstName"
        placeholder="First Name"
        value={firstName}
        onChangeText={(value) => handleChange('firstName', value)}
        style={styles.input}
      />
      <TextInput
        name="lastName"
        placeholder="Last Name"
        value={lastName}
        onChangeText={(value) => handleChange('lastName', value)}
        style={styles.input}
      />
      <TextInput
        name="mobileNumber"
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={(value) => handleChange('mobileNumber', value)}
        style={styles.input}
      />
       <TextInput
        name="location"
        placeholder="Location"
        value={location}
        onChangeText={(value) => handleChange('location', value)}
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
  changePictureButton: {
    backgroundColor: 'darkblue', // Set the background color to a darker shade of blue
    padding: 10, // Increase the padding to make it bigger
    borderRadius: 8,
    marginTop: 10, // Add some top margin for spacing
    marginBottom: 10
  },
  changePictureButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10
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
