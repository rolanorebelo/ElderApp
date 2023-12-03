import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import colors from '../../assets/colors/colors';
import axios from 'axios';
import KeyValueList from '../KeyValueList';
const ViewTask = ({ route, navigation }) => {
  const { task, vId } = route.params;
  const [volunteerProfilePicture, setVolunteerProfilePicture] = useState(null);
  const [taskCompletedDisabled, setTaskCompletedDisabled] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('pending');

  useEffect(() => {
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

    fetchVolunteerProfile();
  }, [route.params]);

  const handleChatPress = () => {
    navigation.navigate('VolunteerChat', { task, vId, userProfilePicture: task.profilePicture, userName: task.task_description.user_name });
  };

  const updateTaskCompletedButton = () => {
    setTaskCompletedDisabled(true);
  };

  const handleCreateInvoice = () => {
    if (updatedStatus === 'completed') {
      navigation.navigate('InvoicePage', { taskId: task.taskId, vId });
    }
  };

  const updateTaskStatus = async (newStatus) => {
    try {
      setConfirming(true); // Set the loader when confirming

      await axios.post('https://us-central1-elderapp-55680.cloudfunctions.net/api/notify-task-status-update', {
        userId: task.task_description.user_id,
        taskId: task.taskId,
        status: newStatus,
      });

      const taskRef = doc(getFirestore(), 'tasks', task.taskId);
      await updateDoc(taskRef, { status: newStatus });

      if (newStatus === 'confirmed') {
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        await updateDoc(volunteerRef, { available: 'busy' });
        // Delay the update of buttonsVisible by 1 second (adjust as needed)

        setConfirming(false);
        // Trigger the effect manually after updating the task status
        fetchTaskStatus();
      } else if (newStatus === 'completed') {
        updateTaskCompletedButton();
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        await updateDoc(volunteerRef, { available: 'free' });
        // Trigger the effect manually after updating the task status
        fetchTaskStatus();
      } else if (newStatus === 'declined') {
        const volunteerRef = doc(getFirestore(), 'volunteer', vId);
        await updateDoc(volunteerRef, { available: 'free' });
        navigation.navigate('VolunteerHome');
      }
      console.log("button vis", updatedStatus);
    } catch (error) {
      console.error('Error updating task status: ', error);
    } finally {
      setConfirming(false); // Stop the loader when done
    }
  };

  const fetchTaskStatus = async () => {
    try {
      const taskRef = doc(getFirestore(), 'tasks', task.taskId);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const updatedTask = taskDoc.data();
        // console.log('updated',updatedTask);
        // Update the local state or trigger any other necessary actions based on the updated task status
        // For example, you can update the 'task' state with the updated task data
        // setTask(updatedTask);
        console.log("Updated task status:", updatedTask.status);
        setUpdatedStatus(updatedTask.status);
      }
    } catch (error) {
      console.error('Error fetching updated task status:', error);
    }
  };

  useEffect(() => {
    // Call the fetchTaskStatus function
    console.log('taskkk', updatedStatus);
    fetchTaskStatus();
  }, [updatedStatus]); // Run this effect when the task status changes

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {updatedStatus === 'confirmed' && updatedStatus !== 'completed' && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Feather name="message-square" size={24} color={colors.lightGray} />
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
        {typeof task.task_description.serviceDescription === 'object' ? (
          <KeyValueList data={task.task_description.serviceDescription} />
        ) : (
          <Text style={styles.value}>{task.task_description.serviceDescription}</Text>
        )}
      </View>

        <View style={styles.row}>
          <Text style={styles.label}>Additional Requests:</Text>
          <Text style={styles.value}>{task.task_description.additionalRequests}</Text>
        </View>
      </View>

      {/* Confirm and Forfeit buttons */}
      {updatedStatus !== 'confirmed' && updatedStatus !== 'completed' && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              updateTaskStatus('confirmed');
            }}
          >
            {confirming ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Confirm Task</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forfeitButton}
            onPress={() => {
              updateTaskStatus('declined');
            }}
          >
            <Text style={styles.buttonText}>Forfeit Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task Completed button */}
      {(updatedStatus === 'confirmed' || updatedStatus === 'completed') && (
        <TouchableOpacity
          style={styles.completedButton}
          onPress={() => {
            updateTaskStatus('completed');
          }}
          disabled={updatedStatus === 'completed' || taskCompletedDisabled}
        >
          {confirming ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              {updatedStatus === 'completed' ? 'Task Completed' : 'Complete Task'}
            </Text>
          )}
        </TouchableOpacity>
      )}
      {/* Create Invoice button */}
      {updatedStatus === 'completed' && (
        <TouchableOpacity style={styles.createInvoiceButton} onPress={handleCreateInvoice}>
          <Text style={styles.createInvoiceButtonText}>Create Invoice</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
    backgroundColor: '#13114c', // Choose your desired color
    padding: 15,
    width: '100%', // Occupy the entire width
    alignItems: 'center',
    position: 'absolute', // Position the button absolutely
    bottom: 0, // Align the button to the bottom
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
