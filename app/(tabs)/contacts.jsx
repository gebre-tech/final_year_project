import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Contacts = ({navigation}) => {
  const { user } = useContext(AuthContext);  // Accessing the logged-in user's data
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://your-backend-url/contacts/list/', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem}
    onPress={() => navigation.navigate('Chat', { chatId: item.friend.id })}
    >
      <Text style={styles.contactName}>{item.friend.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : contacts.length === 0 ? (
        <Text style={styles.noContactsText}>No contacts available</Text>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.friend.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  contactItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  contactName: {
    fontSize: 16,
  },
  noContactsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default Contacts;
