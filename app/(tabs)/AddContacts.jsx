import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AddContacts = () => {
  const { user } = useContext(AuthContext);
  const [friendId, setFriendId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    if (!friendId.trim()) {
      Alert.alert('Error', 'Please enter a valid user ID');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://your-backend-url/contacts/add/${friendId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 201) {
        Alert.alert('Success', 'Friend added successfully');
        setFriendId('');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Could not add friend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Friend's User ID"
        value={friendId}
        onChangeText={setFriendId}
        keyboardType="numeric"
      />
      <Button
        title={loading ? 'Adding...' : 'Add Friend'}
        onPress={handleAddFriend}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default AddContacts;
