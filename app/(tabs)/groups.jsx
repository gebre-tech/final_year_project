import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Dummy data for groups (replace with real data or API call)
const groupsData = [
  { id: '1', name: 'Family Group' },
  { id: '2', name: 'Work Group' },
  { id: '3', name: 'Friends Group' },
  { id: '4', name: 'Project Group' },
];

const Groups = () => {
  const [groups, setGroups] = useState(groupsData);

  useEffect(() => {
    // Fetch groups from your backend or state here
    // Example: setGroups(fetchedData);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItem}>
      <Text style={styles.groupName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  groupItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  groupName: {
    fontSize: 16,
  },
});

export default Groups;
