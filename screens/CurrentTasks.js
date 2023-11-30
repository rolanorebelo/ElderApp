// CurrentTasks.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

const CurrentTasks = () => {
  const [currentTasks, setCurrentTasks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCurrentTasks = async () => {
      try {
        const q = query(collection(database, 'tasks'), where('status', '==', 'confirmed'));
        const querySnapshot = await getDocs(q);

        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCurrentTasks(tasks);
      } catch (error) {
        console.error('Error fetching current tasks: ', error);
      }
    };

    fetchCurrentTasks();
  }, []);

  const handleChatPress = (userId, volunteerId) => {
    // Navigate to the chat window with user and volunteer information
    navigation.navigate('Chat', { userId, volunteerId });
  };

  return (
    <View style={styles.container}>
      {currentTasks.length === 0 ? (
        <Text style={styles.noTasksMessage}>No current tasks</Text>
      ) : (
        <FlatList
          data={currentTasks}
          keyExtractor={(item) => item.taskId}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text>{item.serviceType}</Text>
              <Text>{item.task_description.date}</Text>
              {/* Add other task details as needed */}
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => handleChatPress(item.user_id, item.selectedVolunteerId)}>
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  chatButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: '#0077FF',
    borderRadius: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
  },
  noTasksMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CurrentTasks;
