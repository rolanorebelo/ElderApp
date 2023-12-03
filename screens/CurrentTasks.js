// CurrentTasks.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

const CurrentTasks = () => {
  const [currentTasks, setCurrentTasks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCurrentTasks = async () => {
      try {
        const user = auth.currentUser;
        const userId = user.uid;
    
        // Add where clause to filter tasks by user ID
        const q = query(collection(database, 'tasks'), where('status', '==', 'confirmed'), where('task_description.user_id', '==', userId));
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

  const handleChatPress = (item) => {
    // Navigate to the chat window with user and volunteer information
    navigation.navigate('TaskChat', {task: item});
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
                onPress={() => handleChatPress(item)}>
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
  flatList: {
    backgroundColor: '#F0F0F0', // Light background color
    borderRadius: 10, // Rounded corners
  },
  taskItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ddddec', // Tile background color
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
