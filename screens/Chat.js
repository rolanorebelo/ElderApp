import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, where, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [neighbor, setNeighbor] = useState({}); // State to store neighbor information
  const navigation = useNavigation();
  const route = useRoute();
  const { recipient } = route.params; // Extract recipient from route params

  useLayoutEffect(() => {
    console.log('Neigjbopr',neighbor);
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: neighbor.profilePicture }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <Text style={{ fontSize: 18, color: 'black' }}>{neighbor.displayName}</Text>
        </View>
      ),
    });
  }, [navigation, neighbor]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
  
    if (neighbor.uid && auth.currentUser.uid) {
      const firstParticipantQuery = query(
        collectionRef,
        orderBy('createdAt', 'desc'),
        where('participants', 'array-contains', neighbor.uid)
      );
  
      const unsubscribe = onSnapshot(firstParticipantQuery, (querySnapshot) => {
        const filteredChats = querySnapshot.docs.filter((doc) => {
          const participants = doc.data().participants;
          return participants.includes(auth.currentUser.uid);
        });
  
        const formattedMessages = [];
  
        filteredChats.forEach((doc) => {
          const data = doc.data();
          const messages = data.messages.map((message) => ({
            _id: message._id,
            createdAt: message.createdAt.toDate(),
            text: message.text,
            user: message.user,
          }));
  
          formattedMessages.push(...messages);
        });
  
        setMessages(formattedMessages);
      });
  
      return unsubscribe;
    }
  }, [neighbor]);
  
  useEffect(() => {
    // Set neighbor information when the component mounts
    console.log("Receii",recipient);
    setNeighbor({
      uid: recipient.uid,
      displayName: recipient.displayName,
      profilePicture: recipient.profilePicture,
    });
  }, []);

  const onSend = useCallback(
    (messages = []) => {
      // Generate a unique ID for the new message
      const messageId = `${messages[0]._id}-${new Date().getTime()}`;
  
      // Update the _id of each message in the array
      const newMessages = messages.map((message) => ({
        ...message,
        _id: messageId,
      }));
  
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  
      // Include UIDs of both participants in the "participants" field
      const participants = [auth.currentUser.uid, neighbor.uid];
  
      addDoc(collection(database, 'chats'), {
        createdAt: new Date(),
        messages: newMessages,
        participants: participants,
      });
    },
    [auth.currentUser.uid, neighbor.uid]
  );
  


  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      renderAvatar={null}
      onSend={(messages) => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: neighbor.uid, // Use the neighbor's ID
        avatar: neighbor.profilePicture, // Use the neighbor's profile picture or a default avatar
      }}
    />
  );
}
