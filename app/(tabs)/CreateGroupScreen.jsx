// app/screens/CreateGroupScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateGroupScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>
      <Text>This is the create group screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CreateGroupScreen;