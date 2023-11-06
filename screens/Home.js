import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Font } from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import categoriesData from '../assets/data/categoriesData';
import popularData from '../assets/data/popularData';
import colors from '../assets/colors/colors';
import { LinearGradient } from "expo-linear-gradient";
import Header from './Header';
import { auth, database, firestore} from '../config/firebase';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
Feather.loadFont();
MaterialCommunityIcons.loadFont();

export default Home = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [userName, setUserName] = useState(null);
  const [profilePicture, setUserProfilePicture] = useState(require('../assets/default.png'));
  const eventData = [
    {
      id: 1,
      image: require('../assets/images/Food.png'),
      date: 'Nov 15, 2023',
      name: 'Community Cleanup',
      description: 'Join us for a community cleanup event to make our neighborhood cleaner and greener.',
    },
    {
      id: 2,
      image: require('../assets/images/pizza1.png'),
      date: 'Nov 20, 2023',
      name: 'Food Drive',
      description: 'Help us collect food for those in need. Let\'s make a difference together.',
    },
    // Add more event data as needed
  ];
  const fetchUserProfile = () => {
    // Check if the user is authenticated
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
  
      // Query Firestore to get the user's profile picture URL
      const userRef = doc(getFirestore(), 'users', user.uid);
  
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
    }
  };
  
  const renderEventTile = (event) => {
    return (
      <View key={event.id} style={styles.popularCardWrapper}>
        <View style={styles.popularContent}>
          <View style={styles.popularTopWrapper}>
            <Text style={styles.popularTopText}>{event.date}</Text>
          </View>
          <View style={styles.popularTitlesWrapper}>
            <Text style={styles.popularTitlesTitle}>{event.name}</Text>
            <Text style={styles.popularTitlesWeight}>{event.description}</Text>
          </View>
          <View style={styles.popularCardBottom}>
            <View style={styles.actionButtonsWrapper}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => handleJoinEvent(event)}>
                <Text style={styles.actionButtonText}>Join Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                onPress={() => handleViewEvent(event)}>
                <Text style={styles.actionButtonText}>View Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Image source={event.image} style={styles.popularCardImage} />
      </View>
    );
  };

  const handleCategoryPress = (item) => {
    navigation.navigate('TaskDetails', {
      item: item.title,
      serviceType: item.title, // Pass the selected service type
    });
  };
  useEffect(() => {
    fetchUserProfile();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      
        // Query Firestore to get the user's profile picture URL
        const userRef = doc(getFirestore(), 'users', user.uid); // Use doc to reference a document
      
        getDoc(userRef) // Use getDoc to get the document data
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

  //const userName = auth.currentUser.displayName;
  const handleJoinEvent = (item) => {
    // Implement your join event logic here
  };

  const handleViewEvent = (item) => {
    // Implement your view event logic here
  };

  const handleProfileImageClick = () => {
    navigation.navigate('Profile', {
      profilePicture: profilePicture,
    });
  };

  const handleChatPress = () => {
    navigation.navigate('Chat');
  }

  const renderCategoryItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleCategoryPress(item)}>
        <View
          style={[
            styles.categoryItemWrapper,
            {
              backgroundColor: item.selected ? colors.primary : colors.white,
              marginLeft: item.id === 1 ? 20 : 0,
            },
          ]}>
          <Image source={item.image} style={styles.categoryItemImage} />
          <Text style={styles.categoryItemTitle}>{item.title}</Text>
          <View
            style={[
              styles.categorySelectWrapper,
              {
                backgroundColor: item.selected ? colors.white : colors.secondary,
              },
            ]}>
            <Feather
              name="chevron-right"
              size={8}
              style={styles.categorySelectIcon}
              color={item.selected ? colors.black : colors.white}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
       {/* <Header navigation={navigation} /> */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <SafeAreaView>
          <View style={styles.headerWrapper}>
            <Feather name="bell" size={24} color={colors.textDark} />
            <TouchableOpacity onPress={handleProfileImageClick}>
            <Image
              source={
                typeof profilePicture === 'string'
                  ? { uri: profilePicture }
                  : typeof profilePicture === 'number'
                  ? profilePicture
                  : require('../assets/default.png')
              }
              style={styles.profileImage}
            />
             </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Titles */}
        <View style={styles.titlesWrapper}>
        <Text style={styles.Subtitle}>
            {`${getGreeting()}, ${userName}`}
          </Text>
          <Text style={styles.Title}>What are you looking for today?</Text>
        </View>
        <TouchableOpacity onPress={handleCategoryPress}>
        <View style={styles.categoriesWrapper}>
          <Text style={styles.servicesTitle}>Services</Text>
          <View style={styles.categoriesListWrapper}>
            <FlatList
              data={categoriesData}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
            />
          </View>
        </View>
        </TouchableOpacity>

        {/* Neighbour Chat Button */}
        <TouchableOpacity
          style={styles.neighbourChatButton}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Chat')
            // Handle Neighbour Chat button press
          }}>
          <LinearGradient
            colors={['#0077FF', '#FFFFFF']} // Define your gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.neighbourChatGradient}>
            <View style={styles.neighbourChatTextWrapper}>
              <Feather name="message-square" size={20} color="#0077FF" />
              <Text style={styles.neighbourChatButtonText}>Neighbour Chat</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.popularTitle}>Events Happening Near You</Text>

        {/* Render event tiles */}
        {eventData.map((event) => renderEventTile(event))}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowOpacity: .9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
},
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 28,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  titlesWrapper: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  joinEventButton: {
    backgroundColor: 'darkblue',
  },
  viewEventButton: {
    backgroundColor: 'darkgrey',
  },
  Subtitle: {
    color: '#000',
    fontFamily: 'Bentham',
    fontSize: 20,
  },
  Title: {
    color: '#000',
    fontFamily: 'Ramabhadra',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 25,
    letterSpacing: 0.25,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  search: {
    flex: 1,
    marginLeft: 10,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 2,
  },
  searchText: {
    fontFamily: 'Montserrat-Semibold',
    fontSize: 14,
    marginBottom: 5,
    color: colors.textLight,
  },
  categoriesWrapper: {
    marginTop: 30,
  },
  servicesTitle: {
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  categoriesListWrapper: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  categoryItemWrapper: {
    backgroundColor: '#F5CA48',
    marginRight: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryItemImage: {
    width: 60,
    height: 60,
    marginTop: 25,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  categoryItemTitle: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: 10,
  },
  categorySelectWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 26,
    height: 26,
    borderRadius: 26,
    marginBottom: 20,
  },
  categorySelectIcon: {
    alignSelf: 'center',
  },
  neighbourChatButton: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  neighbourChatGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  neighbourChatTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  neighbourChatButtonText: {
    color: '#0077FF',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginLeft: 5,
  },
  popularWrapper: {
    paddingHorizontal: 20,
  },
  popularTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 29,
  },
  popularCardWrapper: {
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingTop: 20,
    // paddingBottom:30,
    paddingLeft: 20, // Add left padding to create space for the buttons
    // flexbox: 2,
    flexDirection: 'row', // Use a column layout
  justifyContent: 'space-between', // Align items at the beginning and end
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  popularContent: {
    flex: 1 // Take up the available space vertically
  },
  
  popularTopWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularTopText: {
    marginRight: 70,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
  },
  popularTitlesWrapper: {
    marginTop: 20,
  },
  popularTitlesTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    marginRight: -60,
    color: colors.textDark,
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  popularTitlesWeight: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: colors.textLight,
    marginTop: 5,
  },
  popularCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -20,
  },
  addPizzaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  rating: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 5,
  },
  actionButtonContainer: {
    overflow: 'visible',
  },
  popularCardImage: {
    width: 160,
    resizeMode: 'contain',
  },
 // Adjusted actionButtonsWrapper
actionButtonsWrapper: {
  flexDirection: 'row',
  // Adjust the margin left to push the buttons to the right
  marginLeft: 'auto', // Push to the right edge
},

// Updated styles for "Join event" and "View Event" buttons
actionButton: {
  paddingVertical: 10,
  paddingHorizontal: 20, // Increase horizontal padding for more space
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},


actionButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
});
