import React from 'react';
import { ScrollView, Text, View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const VolunteerHome = ({ navigation }) => {
  // Dummy data for tiles
  const data = [
    {
      id: '1',
      profilePic: 'https://example.com/user1.jpg',
      userName: 'John Doe',
      taskName: 'Volunteer Task 1',
      date: '2023-11-10',
      time: '10:00 AM',
      address: '123 Main St',
    },
    {
      id: '2',
      profilePic: 'https://example.com/user2.jpg',
      userName: 'Jane Smith',
      taskName: 'Volunteer Task 2',
      date: '2023-11-12',
      time: '2:30 PM',
      address: '456 Elm St',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.tile}>
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.taskName}>{item.taskName}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <TouchableOpacity
        style={styles.viewTaskButton}
        onPress={() => {
          // Handle view task button press
          // You can navigate to the task details screen here
        }}
      >
        <Text style={styles.viewTaskButtonText}>View Task</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <ScrollView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  taskName: {
    fontSize: 14,
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    marginTop: 5,
  },
  address: {
    fontSize: 12,
    marginTop: 5,
  },
  viewTaskButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  viewTaskButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VolunteerHome;
