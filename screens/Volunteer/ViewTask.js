// ViewTask.js

import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import colors from '../../assets/colors/colors';

const ViewTask = ({ route, navigation }) => {
  const { task, vId } = route.params;
  const [buttonsVisible, setButtonsVisible] = useState(task.status !== 'confirmed' && task.status !== 'completed');
  const [volunteerProfilePicture, setVolunteerProfilePicture] = useState(null);
  const [taskCompletedDisabled, setTaskCompletedDisabled] = useState(false);
  console.log('statyss', task.status);
  console.log('Buttton',buttonsVisible);
  useEffect(() => {
    // Check if the task is confirmed and set chat icon visibility

    // Fetch volunteer profile picture
    const fetchVolunteerProfile = async () => {
      try {
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        const volunteerDoc = await getDoc(volunteerRef);

        if (volunteerDoc.exists()) {
          const volunteerData = volunteerDoc.data();
          setVolunteerProfilePicture(volunteerData.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching volunteer profile:', error);
      }
    };
    setButtonsVisible(task.status !== 'confirmed' && task.status !== 'completed');
    fetchVolunteerProfile();
  }, [route.params]);

  const handleChatPress = () => {
    navigation.navigate('VolunteerChat', { task, vId, userProfilePicture: task.profilePicture, userName: task.task_description.user_name });
  };

  const updateTaskCompletedButton = () => {
    // Disable the "Task Completed" button
    setTaskCompletedDisabled(true);
  };

  const handleCreateInvoice = () => {
    // Navigate to InvoicePage when the task is completed
    if (task.status === 'completed') {
      navigation.navigate('InvoicePage', { taskId: task.taskId, vId });
    }
  };


  // Function to update the task status in Firestore
  const updateTaskStatus = async (newStatus) => {
    try {
      const taskRef = doc(getFirestore(), 'tasks', task.taskId);
      await updateDoc(taskRef, { status: newStatus });

      console.log('New Status:', newStatus); // Log the newStatus

      if (newStatus === 'confirmed') {
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        await updateDoc(volunteerRef, { available: 'busy' });

        console.log('Setting buttonsVisible to false');
        setButtonsVisible(false);// Set buttonsVisible to false
      } else if (newStatus === 'completed') {
        setButtonsVisible(newStatus !== 'completed');
        updateTaskCompletedButton();
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        await updateDoc(volunteerRef, { available: 'free' });
        // Additional logic for completing the task
      } else if (newStatus === 'declined') {
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        await updateDoc(volunteerRef, { available: 'free' });
        navigation.navigate('VolunteerHome');
      }

      console.log('Buttton',buttonsVisible);

      // // Add this line to show the chat icon and task completed button after confirming
      //  setButtonsVisible(newStatus !== 'confirmed');
    } catch (error) {
      console.error('Error updating task status: ', error);
      // Handle the error as needed
    }
  };

  return (
    <View style={styles.container}>
      {task.status === 'confirmed' && !buttonsVisible && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Feather name="message-square" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      )}
        {task.status === 'completed' && (
        <TouchableOpacity style={styles.createInvoiceButton} onPress={handleCreateInvoice}>
          <Text style={styles.createInvoiceButtonText}>Create Invoice</Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoContainer}>
        {/* User's name, service type, and profile picture */}
        <View style={styles.row}>
          <Image source={{ uri: task.profilePicture }} style={styles.profilePic} />
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{task.task_description.user_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service Type:</Text>
          <Text style={styles.value}>{task.serviceType}</Text>
        </View>

        {/* Task date and time */}
        <View style={styles.row}>
          <Text style={styles.label}>Task Date:</Text>
          <Text style={styles.value}>{task.task_description.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Task Time:</Text>
          <Text style={styles.value}>{task.task_description.taskTime}</Text>
        </View>

        {/* Task description and additional requests */}
        <View style={styles.row}>
          <Text style={styles.label}>Task Description:</Text>
          <Text style={styles.value}>{task.task_description.serviceDescription}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Additional Requests:</Text>
          <Text style={styles.value}>{task.task_description.additonalRequests}</Text>
        </View>
      </View>

      {/* Confirm and Forfeit buttons */}
      {task.status !== 'confirmed' && buttonsVisible && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              // Handle confirm button press
              setButtonsVisible(false);
              updateTaskStatus('confirmed');
              
              // You can add logic for confirming the task
            }}
          >
            <Text style={styles.buttonText}>Confirm Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forfeitButton}
            onPress={() => {
              // Handle forfeit button press
              updateTaskStatus('declined');
              // You can add logic for forfeiting the task
            }}
          >
            <Text style={styles.buttonText}>Forfeit Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task Completed button */}
      {(task.status === 'confirmed' || task.status === 'completed' ) && !buttonsVisible && (
        <TouchableOpacity
          style={styles.completedButton}
          onPress={() => {
            // Handle Task Completed button press
            updateTaskStatus('completed');
            // You can add logic for completing the task
          }}
          disabled={task.status === 'completed' || taskCompletedDisabled}
        >
          <Text style={styles.buttonText}>
            {task.status === 'completed' ? 'Task Completed' : 'Complete Task'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  createInvoiceButton: {
    backgroundColor: 'green', // Choose your desired color
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  createInvoiceButtonText: {
    color: 'white', // Choose your desired text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  forfeitButton: {
    backgroundColor: 'dimgray',
    padding: 10,
    borderRadius: 8,
  },
  completedButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
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
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20, // Adjust the margin as needed
  },
});

export default ViewTask;
