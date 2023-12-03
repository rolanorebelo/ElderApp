import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, View, Text, Image} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, where, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../../colors';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [chatParticipants, setChatParticipants] = useState([]); // Array to store participants of the current chat
  const navigation = useNavigation();
  const route = useRoute();
  const { task, vId, userProfilePicture, userName } = route.params;

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <Image source={{ uri: userProfilePicture }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>{userName}</Text>
        </View>
      ),
    });
  }, [navigation, userProfilePicture, userName]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
  
    if (task.task_description.user_id && auth.currentUser.uid) {
      const firstParticipantQuery = query(
        collectionRef,
        orderBy('createdAt', 'desc'),
        where('participants', 'array-contains', task.task_description.user_id)
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
  }, [task]);

  useEffect(() => {
    setChatParticipants([vId, task.task_description.user_id]);
  }, [task]);

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
      const participants = [vId, task.task_description.user_id];
  
      addDoc(collection(database, 'chats'), {
        createdAt: new Date(),
        messages: newMessages,
        participants: participants,
      });
    },
    [auth.currentUser.uid, task.task_description.user_id]
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
        _id: auth.currentUser.uid,
        avatar: auth.currentUser.photoURL,
      }}
    />
  );
}
