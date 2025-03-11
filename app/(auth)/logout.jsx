// app/screens/LogoutScreen.jsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AuthContext from '../../context/AuthContext'; // Ensure correct path

const LogoutScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Call the logout function from your AuthContext
    navigation.navigate('Login'); // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Text>Are you sure you want to log out?</Text>
      <Button title="Logout" onPress={handleLogout} />
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

export default LogoutScreen;