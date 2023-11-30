import React, {
    useState,
    useLayoutEffect,
    useCallback,
  } from 'react';
  import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
  import { GiftedChat } from 'react-native-gifted-chat';
  import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
  } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';
  import { auth, database } from '../../config/firebase';
  import { useNavigation, useRoute } from '@react-navigation/native';
  import { AntDesign } from '@expo/vector-icons';
  import colors from '../../colors';
  
  export default function Chat() {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const { task, vId, userProfilePicture, userName } = route.params;
  
    const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };
  
    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={onSignOut}
            >
              <AntDesign name="logout" size={24} color={colors.gray} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <View style={styles.userProfileContainer}>
              <Image
                source={{ uri: userProfilePicture }}
                style={styles.userProfileImage}
              />
              <Text style={styles.userName}>{userName}</Text>
            </View>
          ),
        });
      }, [navigation, userProfilePicture, userName]);
      
  
    useLayoutEffect(() => {
      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));
  
      const unsubscribe = onSnapshot(q, querySnapshot => {
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        );
      });
  
      return unsubscribe;
    }, []);
  
    const onSend = useCallback(messages => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );
  
      const { _id, createdAt, text, user } = messages[0];
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        user,
      });
    }, []);
  
    return (
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff',
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
        user={{
          _id: task.task_description.user_id,
          avatar: 'https://i.pravatar.cc/300', // Replace with the user's avatar URL
        }}
        renderUsernameOnMessage
        renderAvatarOnTop
        renderAvatar={({ user }) =>
          user._id === vId ? (
            <Image source={{ uri: task.profilePicture }} style={styles.avatar} />
          ) : null
        }
        parsePatterns={linkStyle => [
          {
            pattern: /#(\w+)/,
            style: { ...linkStyle, color: 'lightblue' },
            onPress: props => alert(`press on ${props}`),
          },
        ]}
       
      />
    );
  }
  
  const styles = StyleSheet.create({
    userProfileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    userProfileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userName: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textDark,
    },
  });
  