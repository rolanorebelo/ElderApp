import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { auth, database } from '../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../assets/colors/colors';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import axios from 'axios';

const TaskDetails = ({ route, navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [serviceDesc, setServiceDescription] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [currentLocation, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const { item, serviceType, profilePicture } = route.params;
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [volunteers, setVolunteers] = useState([]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const postTask = async () => {
    const locationPermission = await requestForegroundPermissionsAsync();

    if (locationPermission.status === 'granted') {
      const userLocation = await getCurrentPositionAsync({});

      const tasksRef = collection(database, 'tasks');
      const taskId = doc(tasksRef);
      const user = auth.currentUser;

      if (user) {
        const { uid, displayName } = user;

        let taskDescription = {};

        switch (serviceType) {
          case 'Groceries':
            taskDescription = {
              user_name: displayName,
              user_id: uid,
              serviceDescription: serviceDesc,
              additionalRequests,
              taskTime: getCurrentTime(),
              date: getCurrentDate(),
              userAddress,
            };
            break;
          case 'Repair':
            taskDescription = {
              user_name: displayName,
              user_id: uid,
              serviceDescription: serviceDesc,
              additionalRequests,
              taskTime: getCurrentTime(),
              date: getCurrentDate(),
              userAddress,
            };
            break;
          case 'Transport':
            taskDescription = {
              user_name: displayName,
              user_id: uid,
              serviceDescription: { pickup: currentLocation, destination: destination },
              additionalRequests,
              taskTime: getCurrentTime(),
              date: getCurrentDate(),
              userAddress,
            };
            break;
          case 'Cleaning':
            taskDescription = {
              user_name: displayName,
              user_id: uid,
              serviceDescription: serviceDesc,
              additionalRequests,
              taskTime: getCurrentTime(),
              date: getCurrentDate(),
              userAddress,
            };
            break;
          case 'Cooking':
            taskDescription = {
              user_name: displayName,
              user_id: uid,
              serviceDescription: serviceDesc,
              additionalRequests,
              taskTime: getCurrentTime(),
              date: getCurrentDate(),
              userAddress,
            };
            break;
          default:
            taskDescription = {
              user_name: displayName,
              user_id: uid,
              serviceDescription: serviceDesc,
              additionalRequests,
              taskTime: getCurrentTime(),
              date: getCurrentDate(),
              userAddress,
            };
            break;
        }

        const taskData = {
          taskId: taskId.id,
          serviceType,
          task_description: taskDescription,
          additionalRequests,
          selectedVolunteerId: "",
          profilePicture,
          status: "pending",
          location: {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude
          },
        };

        try {

          await setDoc(taskId, taskData);
          setLoading(true);
          setLoadingText('Looking for Volunteers');

          const response = await axios.post(
            'https://us-central1-elderapp-55680.cloudfunctions.net/api/getAvailableVolunteers',
            {
              userLocation: taskData.location
            }
          );

          const result = response.data;
          setVolunteers(result);
          setLoadingText('Volunteers Found!');

          setTimeout(() => {
            navigation.navigate('MatchedVolunteers', { result, taskId: taskId.id });
          }, 3000);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoadingText('Error fetching volunteers');
        } finally {
          setLoading(false);
        }
      } else {
        alert('User is not logged in. Please log in before posting a task.');
      }
    } else {
      console.log('Location permission denied');
    }
  };
  

  const commonFields = (
    <>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Task Time</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter task time here"
          value={getCurrentTime()} // Set the initial value to the current time
          editable={false} // Disable editing for the current time
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Task Date</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter task date here"
          value={getCurrentDate()} // Set the initial value to the current date
          editable={false} // Disable editing for the current date
        />
      </View>
      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your address here"
          value={userAddress}
          onChangeText={(text) => setUserAddress(text)}
        />
      </View>
    </>
  );


  let renderFields;
  switch (serviceType) {
    case 'Groceries':
      // Fields for Groceries
      renderFields = (
        <>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter items list here"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional requests here"
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
            <TextInput
              style={styles.textInput}
              placeholder="Enter repair description here"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
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
              value={currentLocation}
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
    case 'Cleaning':
      // Fields for Cooking
      renderFields = (
        <>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter cleaning description"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional requests here"
              value={additionalRequests}
              onChangeText={(text) => setAdditionalRequests(text)}
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
            <TextInput
              style={styles.textInput}
              placeholder="Enter dish name here"
              value={serviceDesc}
              onChangeText={(text) => setServiceDescription(text)}
            />
          </View>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional requests here"
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
      <Text style={styles.title}>{serviceType}</Text>
      {renderFields}
      {commonFields}
      <TouchableOpacity onPress={postTask} disabled={loading}>
        <View style={styles.orderWrapper}>
          {loading ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.orderText}>{loadingText}</Text>
            </>
          ) : (
            <>
              <Text style={styles.orderText}>Look for Volunteers</Text>
              <Feather name="chevron-right" size={18} color={colors.black} />
            </>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom:10,
    paddingVertical: 20
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 28,
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
  inputSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  
  // Add styles for taskTime, date, and userAddress
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'black',
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: 'black',
    marginTop: 5,
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
