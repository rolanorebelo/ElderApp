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
  TouchableWithoutFeedback,
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
import { getFirestore, collection, doc, addDoc, getDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
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
      attendingCount: 100
    },
    {
      id: 2,
      image: require('../assets/images/pizza1.png'),
      date: 'Nov 20, 2023',
      name: 'Food Drive',
      description: 'Help us collect food for those in need. Let\'s make a difference together.',
      attendingCount: 194
    },
    // Add more event data as needed
  ];
  const fetchUserProfile = () => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
      getUserProfilePicture(user.uid);
    }
  };
  
  const renderEventTile = (event) => {
    return (
      <View key={event.id} style={styles.eventCardWrapper}>
        <View style={styles.eventContent}>
          <View style={styles.eventTopWrapper}>
            <Text style={styles.eventTopText}>{event.date}</Text>
          </View>
          <View style={styles.eventTitlesWrapper}>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventTitlesWeight}>{event.description}</Text>
          </View>
          <View style={styles.eventCardBottom}>
            <View style={styles.actionButtonsWrapper}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#2D264B' }]}
                onPress={() => handleJoinEvent(event)}>
                <Text style={styles.actionButtonText}>Join Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#2D264B' }]}
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
      profilePicture: profilePicture
    });
  };

  const getUserProfilePicture = (uid) => {
    const userRef = doc(getFirestore(), 'users', uid);

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

  //const userName = auth.currentUser.displayName;
  const handleJoinEvent = (event) => {
    // Ensure that the user is authenticated (you can add more validation)
    const user = auth.currentUser;
    if (!user) {
      // Handle the case when the user is not authenticated, show a login prompt, etc.
      return;
    }

    // Define the event data to store in Firestore
    const eventData = {
      eventId: event.id,       // Event ID
      userId: user.uid,       // User ID
      joinDateTime: new Date().toISOString(),  // Current date and time in ISO format
    };

    // Reference to the Firestore collection "event_joins" (you can change the collection name)
    const eventJoinsRef = collection(getFirestore(), "event_joins");

    // Add a new document to the "event_joins" collection
    addDoc(eventJoinsRef, eventData)
      .then(() => {
        //console.log("User joined the event successfully!");
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'User joined the event successfully!',
          visibilityTime: 3000, // Adjust as needed
        });
      })
      .catch((error) => {
        console.error("Error joining the event: ", error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error joining the event',
          visibilityTime: 3000, // Adjust as needed
        });
      });
  };

  const handleViewEvent = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const handleProfileImageClick = () => {
    const displayName = auth.currentUser.displayName;
  
    // Ensure that userName is not null before splitting
    if (userName) {
      const displayNameParts = userName.split(' ');
      const firstName = displayNameParts[0];
      const lastName = displayNameParts[1];
  
      navigation.navigate('Profile', {
        profilePicture: profilePicture,
        firstName: firstName,
        lastName: lastName,
      });
    } else {
      // Handle the case where userName is null (provide default values or show an error)
      console.error('User name is null.');
      // You might want to set default values or show an error message to the user
    }
  };
  
  

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
<View style={styles.buttonsContainer}>

<TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('NeighbourList'); // Navigate to the NeighbourList screen
          }}
          style={{ marginRight: 10, backgroundColor: '#0077FF', borderRadius: 10, overflow: 'hidden', elevation: 2 }}
        >
          <View style={styles.neighbourChatTextWrapper}>
            <Feather name="message-square" size={20} color="black" />
            <Text style={styles.neighbourChatButtonText}>Neighbour Chat</Text>
          </View>
        </TouchableWithoutFeedback>
<TouchableWithoutFeedback
  onPress={() => navigation.navigate('TaskTabs')}
  style={{ marginLeft: 10, backgroundColor: '#0078FF', borderRadius: 10, overflow: 'hidden', elevation: 2 }}>
  <View style={styles.viewTaskTextWrapper}>
    <MaterialCommunityIcons name="clipboard-check" size={20} color="black" />
    <Text style={styles.viewTaskButtonText}>View Task</Text>
  </View>
</TouchableWithoutFeedback>

</View>
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
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
  // Updated styles for "Neighbour Chat" and "View Task" buttons
neighbourChatGradient: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10, // Add margin to separate the buttons
},

viewTaskGradient: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10, // Add margin to separate the buttons
},

neighbourChatTextWrapper: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
},

viewTaskTextWrapper: {
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

viewTaskButtonText: {
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
  eventCardWrapper: {
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
  eventContent: {
    flex: 1 // Take up the available space vertically
  },
  
  eventTopWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTopText: {
    marginRight: 70,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
  },
  eventTitlesWrapper: {
    marginTop: 20,
  },
  eventTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    marginRight: -60,
    color: colors.textDark,
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  eventTitlesWeight: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: colors.textLight,
    marginTop: 5,
  },
  eventCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -20,
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
  marginLeft:10
},


actionButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
});
