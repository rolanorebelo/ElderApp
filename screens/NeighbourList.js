import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getFirestore, collection, getDocs,updateDoc, doc } from 'firebase/firestore';
import { auth } from '../config/firebase';

const NeighbourList = ({ navigation }) => {
  const [neighbors, setNeighbors] = useState([]);
  
  useEffect(() => {
    fetchNeighbors();
  }, []);

  const fetchNeighbors = async () => {
    try {
      const user = auth.currentUser;
      console.log('Current User:', user);
  
      const neighborsRef = collection(getFirestore(), 'users');
      const neighborsSnapshot = await getDocs(neighborsRef);
  
      const neighborsData = [];
      neighborsSnapshot.forEach((doc) => {
        const neighborData = doc.data();
        console.log('Neiggggg---------', neighborData);
      
        if (neighborData.uid !== user.uid) {
          neighborsData.push({
            uid: doc.id, // Use the id property of the document as uid
            displayName: `${neighborData.firstName} ${neighborData.lastName}`,
            profilePicture: neighborData.profilePicture || null,
            isFriend: !!(neighborData.friends && neighborData.friends[user.uid]),
          });
        }
      });
      

console.log('Neighbours Data-------',neighborsData);
      setNeighbors(neighborsData);
    } catch (error) {
      console.error('Error fetching neighbors: ', error);
    }
  };
  

  const handleAddRemoveFriend = async (neighbor) => {
    try {
      const user = auth.currentUser;
      console.log('Current User:', user);
      
      if (!user) {
        console.error('User is not authenticated or currentUser is null.');
        return;
      }
      
      const userRef = doc(getFirestore(), 'users', user.uid);
      console.log('User Reference:', userRef);
      
      // Rest of your code...
      

  
      // Check if they are already friends
      if (neighbor.isFriend) {
        // Remove friend relationship
        await updateDoc(doc(getFirestore(), 'users', user.uid), {
            [`friends.${neighbor.uid}`]: null,
          });
          
          await updateDoc(doc(getFirestore(), 'users', neighbor.uid), {
            [`friends.${user.uid}`]: null,
          });
      } else {
        // Add friend relationship
        await updateDoc(doc(getFirestore(), 'users', user.uid), {
            [`friends.${neighbor.uid}`]: true,
          });
          
          await updateDoc(doc(getFirestore(), 'users', neighbor.uid), {
            [`friends.${user.uid}`]: true,
          });
      }
  
      // Refresh the neighbor list
      fetchNeighbors();
    } catch (error) {
      console.error('Error adding/removing friend: ', error);
    }
  };
  
  
  
  
  

  const handleChatPress = (neighbor) => {
    // Navigate to the chat screen with the selected neighbor
    navigation.navigate('Chat', { recipient: neighbor });
  };

  const renderNeighborItem = ({ item }) => (
    <TouchableOpacity
      style={styles.neighborItem}
      onPress={() => item.isFriend && handleChatPress(item)}>

      <Image
        source={
            typeof item.profilePicture === 'string'
            ? { uri: item.profilePicture }
            : typeof item.profilePicture === 'number'
            ? item.profilePicture
            : require('../assets/default.png')
        }
        style={styles.neighborImage}
      />
      <View style={styles.neighborInfo}>
        <Text style={styles.neighborName}>{item.displayName}</Text>
        <Text style={styles.neighborStatus}>
          {item.isFriend ? 'Friend' : 'Not Friends'}
        </Text>
      </View>
      {item.isFriend && (
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => handleChatPress(item)}>
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    )}
      <TouchableOpacity
        style={styles.addRemoveButton}
        onPress={() => handleAddRemoveFriend(item)}>
        <Text style={styles.addRemoveButtonText}>
          {item.isFriend ? 'Remove' : 'Add'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={neighbors}
        renderItem={renderNeighborItem}
        keyExtractor={(item) => item.uid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  neighborItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  chatButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50', // You can change the color as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Adjust the margin as needed
  },
  chatButtonText: {
    color: 'white',
  },
  neighborImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  neighborInfo: {
    flex: 1,
  },
  neighborName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  neighborStatus: {
    fontSize: 14,
    color: '#777',
  },
  addRemoveButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#0077FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRemoveButtonText: {
    color: 'white',
  },
});

export default NeighbourList;
