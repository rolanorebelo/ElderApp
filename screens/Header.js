import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../assets/colors/colors';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';

const Header = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [profilePicture, setUserProfilePicture] = useState(require('../assets/default.png'));

  const handleProfileImageClick = () => {
    const displayName = auth.currentUser.displayName;
    //console.log('display',displayName);
    //console.log('user',userName);
    const displayNameParts = userName.split(' ');
    const firstName = displayNameParts[0];
    const lastName = displayNameParts[1];
    navigation.navigate('VolunteerProfile', {
      profilePicture: profilePicture,
      firstName: firstName,
      lastName: lastName,
    });
  };

  const handleChatPress = () => {
    navigation.navigate('Chat');
  };

  const fetchUserProfile = () => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
      getUserProfilePicture(user.uid);
    }
  };

  const getUserProfilePicture = (uid) => {
    const userRef = doc(getFirestore(), 'volunteer', uid);

    getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.profilePicture) {
            setUserProfilePicture(userData.profilePicture);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error);
      });
  };

  useEffect(() => {
    fetchUserProfile();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
        getUserProfilePicture(user.uid);
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const getGreeting = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };
  console.log('Profile Picture:', profilePicture);
  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => {} /* Add your notification logic here */}
      >
        <Feather name="bell" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <View style={styles.centerSection}>
        <TouchableOpacity onPress={handleProfileImageClick}>
        <Image
            source={
              profilePicture !== require('../assets/default.png')
                ? { uri: profilePicture }
                : require('../assets/default.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        style={styles.chatButton}
        onPress={handleChatPress}
      >
        <Feather name="message-square" size={24} color={colors.lightGray} />
      </TouchableOpacity> */}

      <View style={styles.greetingWrapper}>
        <Text style={styles.subtitle}>
          {`${getGreeting()}, ${userName}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 28,
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  Subtitle: {
    color: '#000',
    fontFamily: 'Bentham',
    fontSize: 20,
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20, // Adjust the margin as needed
  },
});

export default Header;
