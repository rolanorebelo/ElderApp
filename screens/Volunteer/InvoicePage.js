import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';
import InvoicePreview from './InvoicePreview';
import axios from 'axios';
const InvoicePage = ({ route }) => {
  const { taskId, vId } = route.params;
  const [hoursWorked, setHoursWorked] = useState('');
  const [ratePerHour, setRatePerHour] = useState(0);
  const [expenses, setExpenses] = useState('');
  const [taskDetails, setTaskDetails] = useState({});
  const [volunteerDetails, setVolunteerDetails] = useState({});
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [loadingTaskDetails, setLoadingTaskDetails] = useState(true);
  const [loadingVolunteerDetails, setLoadingVolunteerDetails] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // New state for loading during submission

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskDocRef = doc(database, 'tasks', taskId);
        const taskDocSnapshot = await getDoc(taskDocRef);

        if (taskDocSnapshot.exists()) {
          const taskData = taskDocSnapshot.data();
          setTaskDetails(taskData);
        }
      } catch (error) {
        console.error('Error fetching task details: ', error);
      } finally {
        setLoadingTaskDetails(false);
      }
    };

    const fetchVolunteerDetails = async () => {
      try {
        const volunteerDocRef = doc(database, 'volunteer', vId);
        const volunteerDocSnapshot = await getDoc(volunteerDocRef);

        if (volunteerDocSnapshot.exists()) {
          const volunteerData = volunteerDocSnapshot.data();
          setVolunteerDetails(volunteerData);
          setRatePerHour(parseFloat(volunteerData.ratePerHour) || 0);
        }
      } catch (error) {
        console.error('Error fetching volunteer details: ', error);
      } finally {
        setLoadingVolunteerDetails(false);
      }
    };

    fetchTaskDetails();
    fetchVolunteerDetails();
  }, [taskId, vId]);

  const handlePreview = () => {
    setPreviewModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true); // Start loading, show spinner

      // Logic to submit the invoice
      // ...

      await axios.post('https://us-central1-elderapp-55680.cloudfunctions.net/api/notify-new-invoice', {
        userId: taskDetails.task_description.user_id,
        invoiceId: taskId,
      });


      const userDocRef = doc(database, 'users', taskDetails.task_description.user_id);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const invoicesArray = userData.invoices || [];

        const updatedInvoices = [
          ...invoicesArray,
          {
            taskId: taskId,
            volunteerName: `${volunteerDetails.firstName} ${volunteerDetails.lastName}`,
            serviceType: taskDetails.serviceType,
            ratePerHour,
            hoursWorked,
            expenses,
            // Add other invoice details as needed
          },
        ];

        await updateDoc(userDocRef, { invoices: updatedInvoices });
      }
      console.log('Submitted successfully');
    } catch (error) {
      console.error('Error submitting invoice: ', error);
    } finally {
      setLoadingSubmit(false); // Stop loading, hide spinner
      navigation.goBack(); // Navigate back after submission
    }
  };

  useEffect(() => {
    const calculatedExpenses = parseFloat(hoursWorked) * ratePerHour;
    setExpenses(isNaN(calculatedExpenses) ? '' : calculatedExpenses.toFixed(2));
  }, [hoursWorked, ratePerHour]);

  if (loadingTaskDetails || loadingVolunteerDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Details</Text>
      <Text>{`Service Type: ${taskDetails.serviceType}`}</Text>
      <Text>{`Date: ${taskDetails.task_description.date}`}</Text>
      <Text>{`Client Name: ${taskDetails.task_description.user_name}`}</Text>

      <Text style={styles.label}>Volunteer Details</Text>
      <Text>{`Name: ${volunteerDetails.firstName} ${volunteerDetails.lastName}`}</Text>
      <Text>{`Rate Per Hour: $${ratePerHour.toFixed(2)}`}</Text>

      <Text style={styles.label}>Hours Worked:</Text>
      <TextInput
        style={styles.input}
        value={hoursWorked}
        onChangeText={(text) => setHoursWorked(text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Expenses:</Text>
      <Text style={styles.expenses}>{`$${expenses}`}</Text>

      <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
        <Text style={styles.buttonText}>Preview</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {loadingSubmit ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={previewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <InvoicePreview
          invoiceDetails={{
            clientName: taskDetails.task_description.user_name,
            taskName: taskDetails.serviceType,
            hoursWorked,
            ratePerHour,
            expenses,
          }}
          onClose={() => setPreviewModalVisible(false)}
          onSubmit={handleSubmit}
          onEdit={() => setPreviewModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  expenses: {
    fontSize: 16,
    marginTop: 5,
  },
  previewButton: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'darkslategrey',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvoicePage;
