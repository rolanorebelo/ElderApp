import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const q = query(collection(database, 'tasks'), where('status', '==', 'completed'));
        const querySnapshot = await getDocs(q);

        const tasks = await Promise.all(
          querySnapshot.docs.map(async (docu) => {
            const taskData = docu.data();
            const volunteerId = taskData.selectedVolunteerId;

            // Fetch volunteer information
            const volunteerDocRef = doc(database, 'volunteer', volunteerId);
            const volunteerDocSnapshot = await getDoc(volunteerDocRef);
            const volunteerData = volunteerDocSnapshot.data();

            return {
              id: docu.id,
              volunteerName: `${volunteerData.firstName} ${volunteerData.lastName}`,
              ...taskData,
            };
          })
        );

        setCompletedTasks(tasks);
        console.log('completed', tasks);
      } catch (error) {
        console.error('Error fetching completed tasks: ', error);
      }
    };

    fetchCompletedTasks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.taskId}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.serviceType}</Text>
            <Text>{item.task_description.date}</Text>
            <Text>{item.volunteerName}</Text>
            {/* Add other task details as needed */}
          </View>
        )}
      />
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
  },
});

export default CompletedTasks;
