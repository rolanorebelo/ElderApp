import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../config/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        const userId = user.uid;
console.log('userss',user);
        // Define the query
        const notificationsQuery = query(
          collection(database, 'notifications'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );

        // Execute the query
        const notificationsSnapshot = await getDocs(notificationsQuery);

        const notificationsData = [];
        notificationsSnapshot.forEach((doc) => {
          const notificationData = doc.data();
          notificationsData.push({
            entityId: doc.id,
            message: notificationData.message,
            // Add other properties as needed
          });
        });

        setNotifications(notificationsData);
        console.log("notfica",notifications);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Fetch notifications initially
    fetchNotifications();
    console.log("notfica",notifications);

    // Set up a timer to periodically check for new notifications
    const interval = setInterval(fetchNotifications, 6000); // Every minute

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No new notifications</Text>
      ) : (
        notifications.map((notification) => (
          <View key={notification.entityId} style={styles.notificationContainer}>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Set your background color
  },
  noNotificationsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold'
  },
  notificationContainer: {
    backgroundColor: '#e0e0e0', // Set your notification background color
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
  },
});

export default Notifications;
