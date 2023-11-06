import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../assets/colors/colors';

const Header = ({ navigation }) => {
  const handleProfileImageClick = () => {
    navigation.navigate('Profile');
  };

  const handleChatPress = () => {
    navigation.navigate('Chat');
  };

  return (
    <View style={styles.headerWrapper}>
      <Feather name="bell" size={24} color={colors.textDark} />
      <TouchableOpacity onPress={handleProfileImageClick}>
        <Image
          source={require('../assets/images/profile.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={handleChatPress}
      >
        <Feather name="message-square" size={24} color={colors.lightGray} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20, // Adjust the margin as needed
  },
});

export default Header;
