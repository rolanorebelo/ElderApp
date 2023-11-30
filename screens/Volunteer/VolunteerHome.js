import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../Header';
import { collection, getDocs } from 'firebase/firestore';
import { database, auth } from '../../config/firebase';

const VolunteerHome = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const volunteerUid = auth.currentUser.uid;

  function fetchTasks() {
    const tasksCollectionRef = collection(database, 'tasks');

    getDocs(tasksCollectionRef)
      .then((querySnapshot) => {
        const tasksData = [];

        querySnapshot.forEach((doc) => {
          const task = { id: doc.id, ...doc.data() };
          tasksData.push(task);
        });

        const tasksForVolunteer = tasksData.filter((task) => task.selectedVolunteerId.trim() === volunteerUid.trim());

        setTasks(tasksForVolunteer);
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tile}>
      <Image source={{ uri: item.profilePicture }} style={styles.profilePic} />
      <Text style={styles.userName}>{item.task_description.user_name}</Text>
      <Text style={styles.taskName}>{item.serviceType}</Text>
      <Text style={styles.date}>{item.task_description.date}</Text>
      <Text style={styles.time}>{item.task_description.taskTime}</Text>
      <Text style={styles.address}>{item.task_description.userAddress}</Text>
      <TouchableOpacity
        style={styles.viewTaskButton}
        onPress={() => {
          const trimmedUid = volunteerUid.trim();
          navigation.navigate('ViewTask', { task: item, vId: trimmedUid });
          // Handle view task button press
          // You can navigate to the task details screen here
        }}
      >
        <Text style={styles.viewTaskButtonText}>View Task</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView>
        {loading ? (
          <Text>Loading...</Text>
        ) : tasks.length === 0 ? (
          <View style={styles.centeredMessage}>
            <Text style={styles.centeredMessageText}>No tasks currently assigned</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
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
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250
  },
  centeredMessageText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
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
