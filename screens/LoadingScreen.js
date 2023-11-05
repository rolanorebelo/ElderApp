import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
const LoadingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskId } = route.params;
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState('');
  const sampleData = [
    { uid: "123", name: 'Volunteer 1', ratePerHour: '$15/hr', profilePic: require('../assets/boy.jpg')},
    { uid: "723", name: 'Volunteer 2', ratePerHour: '$20/hr' },
    { uid: "193", name: 'Volunteer 3', ratePerHour: '$20/hr' },
    { uid: "103", name: 'Volunteer 4', ratePerHour: '$20/hr' },
    // Add more volunteer objects as needed
  ];
  
  useEffect(() => {
    // Function to animate the dots
    const animateDots = () => {
      setDots((prevDots) => (prevDots === '...' ? '' : prevDots + '.'));
    };

    // Start the dot animation
    const dotInterval = setInterval(animateDots, 500);

    return () => {
      // Clean up the interval when the component unmounts
      clearInterval(dotInterval);
    };
  }, []);

  // Replace this with your actual data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      // Simulate loading for 3 seconds (replace with your actual data fetching)
      setTimeout(() => {
        setLoading(false);

        // Navigate to a different page after loading
        navigation.navigate('MatchedVolunteers', { volunteers: sampleData, taskId: taskId });
      }, 3000);
    };

    fetchData();
  }, [taskId, navigation]);

  return (
    <LinearGradient
    colors={['#ADD8E6', '#FFFF99']} // Add your preferred gradient colors
    style={styles.container}
  >
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Looking for Volunteers{dots}</Text>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Add your preferred background color
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default LoadingScreen;
