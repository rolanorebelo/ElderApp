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
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors/colors';

export default Details = ({ route, navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [itemsList, setItemsList] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  const { item, category } = route.params;
  const cat = route.params.item;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView>
        <View style={styles.headerWrapper}>
          <Feather name="bell" size={24} color={colors.textDark} />
          <Image
            source={require('../assets/images/profile.png')}
            style={styles.profileImage}
          />
        </View>
      </SafeAreaView>

   
      <View style={styles.postTaskSection}>
        <View style={styles.horizontalLine}></View>
        <Text style={styles.postTaskText}>Post a Task</Text>
        <View style={styles.horizontalLine}></View>
      </View>

      <View style={styles.categoryCartWrapper}>
        <Text style={styles.categoryText}>{cat}</Text>
        <MaterialCommunityIcons
          name="cart"
          size={24}
          color={colors.primary}
          style={styles.cartIcon}
        />
      </View>

      <View style={styles.titlesWrapper}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Feather name="search" size={16} color={colors.textDark} />
        <TextInput
          style={styles.search}
          placeholder="Search"
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
        />
      </View>

    
      <View style={styles.inputSection}>
        <Text style={styles.label}>Items List</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter items list here"
          value={itemsList}
          onChangeText={(text) => setItemsList(text)}
        />
      </View>

    
      <View style={styles.inputSection}>
        <Text style={styles.label}>Additional Requests</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter additional requests here"
          value={additionalRequests}
          onChangeText={(text) => setAdditionalRequests(text)}
        />
      </View>

      <TouchableOpacity onPress={() => alert('Your order has been placed!')}>
        <View style={styles.orderWrapper}>
          <Text style={styles.orderText}>Look for Volunteers</Text>
          <Feather name="chevron-right" size={18} color={colors.black} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
