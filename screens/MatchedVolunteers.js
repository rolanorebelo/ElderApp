import React, { useState, useEffect, useLayoutEffect } from "react";
import { ScrollView, View, FlatList, Text, Image, Button, StyleSheet } from 'react-native';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { database } from '../config/firebase';
import Toast from 'react-native-toast-message';
const MatchedVolunteers = ({ route, navigation  }) => {
  const { result, taskId } = route.params;
  console.log('Matched volunteerssss',result);

  const renderVolunteerTile = ({ item }) => (
    
    <View style={styles.volunteerTile}>
      <Image
        source={
          typeof item.profilePic === 'string'
            ? { uri: item.profilePic } // Use remote URL
            : item.profilePic // Use local image path or numeric reference
        }
        style={styles.profilePicture}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.rate}>{`Rate/hr:  ${item.ratePerHour}`}</Text>
      <Button
        title="Select Volunteer"
        onPress={() => handleSelectVolunteer(item.uid, taskId)}
      />
    </View>
  );

  const handleSelectVolunteer = async (volunteerUserId, taskId) => {
    // Handle volunteer selection here
    // Send a push notification to the selected volunteer
    // Update the 'selectedVolunteerId' in the 'tasks' collection with the 'volunteerUserId'
    console.log('volunteerID',volunteerUserId);
    console.log('Task ID',taskId);
    try {
        // Send a push notification to the selected volunteer using FCM.
        // Implement this part using your preferred FCM library.
    
        // Update the 'selectedVolunteerId' in the 'tasks' collection with the 'volunteerUserId'.
        const taskDocRef = doc(database, 'tasks', taskId); // Replace 'database' and 'taskId' with your values.
        await updateDoc(taskDocRef, {
          selectedVolunteerId: volunteerUserId,
        });
    
        // Handle success, maybe show a confirmation message.
        //console.log('Volunteer selected successfully');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Volunteer selected successfully',
          visibilityTime: 3000, // Adjust as needed
        });
        navigation.replace('Home');
      } catch (error) {
        // Handle errors, show an error message, or retry.
        console.error('Error selecting volunteer:', error);
      }
  };

   // Handle back button press
  //  const handleBackButtonPress = () => {
  //   // Replace the current screen with Home.js in the navigation stack.
  //   navigation.replace('Home'); // Replace 'Home' with the correct screen name if needed.
  //   return true; // Return true to prevent the default behavior (going back).
  // };

  // useEffect(() => {
  //   // Add event listener for hardware back button press
  //   const backHandler = navigation.addListener('beforeRemove', (e) => {
  //     if (e.data.action.type === 'GO_BACK') {
  //       // The event was triggered by the back button
  //       handleBackButtonPress();
  //     }
  //   });

  //   // Clean up the event listener when the component unmounts
  //   return () => backHandler();
  // }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        These volunteers are nearby and can help you out. Select your volunteer.
      </Text>
      
      <FlatList
        data={result}
        renderItem={renderVolunteerTile}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.volunteersContainer}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  volunteerTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rate: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default MatchedVolunteers;
