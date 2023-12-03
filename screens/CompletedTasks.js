import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import ViewInvoice from './ViewInvoice';
import Toast from 'react-native-toast-message';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewInvoiceModalVisible, setViewInvoiceModalVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const user = auth.currentUser;
        const userId = user.uid;
    
        // Add where clause to filter tasks by user ID
        const q = query(collection(database, 'tasks'), where('status', '==', 'completed'), where('task_description.user_id', '==', userId));
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

  const handleViewInvoice = async (task) => {
    try {
      // Fetch user details to get the invoices array
      const userDocRef = doc(database, 'users', task.task_description.user_id);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const invoicesArray = userData.invoices || [];

        // Find the invoice for the selected task
        const selectedInvoice = invoicesArray.find((invoice) => invoice.taskId === task.taskId);
        console.log("Invoiceeeee", selectedInvoice);
        // Open the ViewInvoiceModal with the selected invoice details
        if(selectedInvoice){
          setSelectedTask(selectedInvoice);
          setViewInvoiceModalVisible(true);
        }
        else{
          // alert("Invoice doesn't exist");
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: `Invoice doesn't exis`,
            visibilityTime: 3000, // Adjust as needed
          });
        }
      }
    } catch (error) {
      console.error('Error fetching invoice details: ', error);
    }
  };

  const handleCloseViewInvoiceModal = () => {
    setViewInvoiceModalVisible(false);
    setSelectedTask(null);
  };

  const handlePay = async () => {
    // Implement your payment logic here
    try {
      setLoadingSubmit(true);
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Payment successful');
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: `Payment successful`,
        visibilityTime: 3000, // Adjust as needed
      });
    } catch (error) {
      console.error('Error during payment: ', error);
    } finally {
      setLoadingSubmit(false);
      handleCloseViewInvoiceModal();
    }
  };

  return (
    <View style={styles.container}>
         {completedTasks.length === 0 ? (
        <Text style={styles.noTasksMessage}>No completed tasks</Text>
      ) : (
      <FlatList
        style={styles.flatList}
        data={completedTasks}
        keyExtractor={(item) => item.taskId}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.serviceType}</Text>
            <Text>{item.task_description.date}</Text>
            <Text>{item.volunteerName}</Text>
            <TouchableOpacity
              style={styles.viewInvoiceButton}
              onPress={() => handleViewInvoice(item)}
            >
              <Text style={styles.viewInvoiceButtonText}>View Invoice</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      )}

      {/* Display ViewInvoiceModal when selectedTask is not null */}
      {selectedTask && (
        <ViewInvoice
          isVisible={viewInvoiceModalVisible}
          onClose={handleCloseViewInvoiceModal}
          onSubmit={handlePay}
          invoiceDetails={selectedTask}
          loadingSubmit={loadingSubmit}
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
  viewInvoiceButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  noTasksMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  viewInvoiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CompletedTasks;
