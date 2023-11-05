import React from 'react';
import { ScrollView, View, FlatList, Text, Image, Button, StyleSheet } from 'react-native';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { database } from '../config/firebase';
const MatchedVolunteers = ({ route }) => {
  const { volunteers, taskId } = route.params;
  

  const renderVolunteerTile = ({ item }) => (
    
    <View style={styles.volunteerTile}>
      <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
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
    try {
        // Send a push notification to the selected volunteer using FCM.
        // Implement this part using your preferred FCM library.
    
        // Update the 'selectedVolunteerId' in the 'tasks' collection with the 'volunteerUserId'.
        const taskDocRef = doc(database, 'tasks', taskId); // Replace 'database' and 'taskId' with your values.
        await updateDoc(taskDocRef, {
          selectedVolunteerId: volunteerUserId,
        });
    
        // Handle success, maybe show a confirmation message.
        console.log('Volunteer selected successfully');
      } catch (error) {
        // Handle errors, show an error message, or retry.
        console.error('Error selecting volunteer:', error);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        These volunteers are nearby and can help you out. Select your volunteer.
      </Text>
      
      <FlatList
        data={volunteers}
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
