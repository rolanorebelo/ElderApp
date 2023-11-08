import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EventDetails = ({ route }) => {
  // Extract event data from the navigation route
  const { event } = route.params;

  return (
    <View>
      <Image source={event.image} style={styles.eventImage} />
      <Text style={styles.eventDate}>{event.date}</Text>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
      {/* Display the number of people attending */}
      <Text style={styles.attendingCount}>Number of People Attending: {event.attendingCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    eventImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      marginBottom: 20,
      borderRadius: 10,
    },
    eventDate: {
      fontSize: 16,
      color: '#333',
    },
    eventName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
      color: '#333',
    },
    eventDescription: {
      fontSize: 16,
      color: '#666',
      marginTop: 10,
    },
    attendingCount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 20,
      color: 'green',
    },
  });

export default EventDetails;
