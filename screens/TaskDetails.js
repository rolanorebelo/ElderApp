import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { auth, database } from '../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors/colors';

const TaskDetails = ({ route, navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [serviceDesc, setServiceDescription] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [location,setPickup] = useState('')
  const [destination,setDestination] = useState('')
  const { item, serviceType } = route.params;

  // Function to post a task to Firebase Firestore
  const postTask = async () => {
    // Create a reference to the tasks collection in your Firestore
    const tasksRef = collection(database, 'tasks');

    // Generate a unique task ID
    const taskId = doc(tasksRef);

    // Get the currently logged-in user
    const user = auth.currentUser;

    if (user) {
      // User is logged in, you can access their UID and display name
      const { uid, displayName } = user;

      // Initialize an empty task description object
      let taskDescription = {};

      // Based on the serviceType, set the appropriate fields in taskDescription
      switch (serviceType) {
        case 'Groceries':
          taskDescription = {                                             
            user_name: displayName,
            user_id: uid,
            serviceDesc,
          };
          break;
        case 'Repair':
          taskDescription = {
            user_name: displayName,
            user_id: uid,
            repair_description: serviceDesc,
          };
          break;
        case 'Transport':
          taskDescription = {
            user_name: displayName,
            user_id: uid,
            pickup_location: location,
            destination: destination,
          };
          break;
        case 'Cooking':
          taskDescription = {
            user_name: displayName,
            user_id: uid,
            dish_name: serviceDesc,
          };
          break;
        default:
          // Handle unknown service types or set a default task description
          taskDescription = {
            user_name: displayName,
            user_id: uid,
            custom_description: serviceDesc,
          };
          break;
      }

      // Construct the task data
      const taskData = {
        taskId: taskId.id,
        serviceType,
        task_description: taskDescription,
        selectedVolunteerId: ""
      };

      try {
        // Add the task data to Firestore
        await setDoc(taskId, taskData);

        // Notify the user that the task has been posted
        navigation.navigate('LoadingScreen', { taskId: taskId.id });
        //alert('Task posted successfully!');
      } catch (error) {
        console.error('Error posting task: ', error);
        // Handle the error as needed
      }
    } else {
      // User is not logged in, handle this case as needed
      alert('User is not logged in. Please log in before posting a task.');
    }
  };

  let renderFields;
  switch (serviceType) {
    case 'Groceries':
      // Fields for Groceries
      renderFields = (
        <>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Items List</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter items list here"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Additional Requests</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional repair requests here"
              value={additionalRequests}
              onChangeText={(text) => setAdditionalRequests(text)}
            />
          </View>
        </>
      );
      break;
    case 'Repair':
      // Fields for Repair
      renderFields = (
        <>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Repair Description</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter repair description here"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Additional Requests</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional repair requests here"
              value={additionalRequests}
              onChangeText={(text) => setAdditionalRequests(text)}
            />
          </View>
        </>
      );
      break;
    case 'Transport':
      // Fields for Transport
      renderFields = (
        <>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Pickup Location</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter pickup location here"
              value={location}
              onChangeText={(text) => setPickup(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter destination here"
              value={destination}
              onChangeText={(text) => setDestination(text)}
            />
          </View>
        </>
      );
      break;
    case 'Cooking':
      // Fields for Cooking
      renderFields = (
        <>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Dish Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter dish name here"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Additional Requests</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional repair requests here"
              value={additionalRequests}
              onChangeText={(text) => setAdditionalRequests(text)}
            />
          </View>
        </>
      );
      break;
    default:
      // Default fields
      renderFields = (
        <Text>Fields for the selected service will be displayed here.</Text>
      );
      break;
  }

  return (
    <View style={styles.container}>
      {renderFields}
      <TouchableOpacity onPress={postTask}>
        <View style={styles.orderWrapper}>
          <Text style={styles.orderText}>Look for Volunteers</Text>
          <Feather name="chevron-right" size={18} color={colors.black} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  postTaskSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  horizontalLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'black',
  },
  postTaskText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: 'black',
    marginHorizontal: 10,
  },
  categoryCartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'black',
  },
  cartIcon: {
    marginLeft: 10,
  },
  titlesWrapper: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
    color: colors.textDark,
    width: '50%',
    height: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  search: {
    flex: 1,
    marginLeft: 10,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 2,
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'black',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  orderWrapper: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: '#2D264B',
    borderRadius: 50,
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    marginRight: 10,
    color: 'white',
  },
});
