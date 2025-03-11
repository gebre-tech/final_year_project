
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import ProfileScreen from "../components/ProfileScreen"; 
import CreateGroupScreen from "../(tabs)/CreateGroupScreen"; 
import AddContacts from "../(tabs)/AddContacts"; 

import ChatList from '../(tabs)/chat';
import ChatScreen from '../(tabs)/chatScreen';
import Contacts from '../(tabs)/contacts';
import Groups from '../(tabs)/groups';

const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const Stack = createStackNavigator();


const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChatList" component={ChatList} options={{ headerShown: false }} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
  </Stack.Navigator>
)
 function TopTabs() {
 
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#b0bec5',
          tabBarStyle: { backgroundColor: '#1a73e8' },
          tabBarLabelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen
          name="Contacts"
          component={Contacts}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name="account" size={20} color="#ffffff" />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStack}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name="message-text" size={20} color="#ffffff" />,
          }}
        />
        <Tab.Screen
          name="Group"
          component={Groups}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name="account-group" size={20} color="#ffffff" />,
          }}
        />
      </Tab.Navigator>
    );
}

function CustomDrawerContent(props) {
  const [name, setName] = useState("Your Name");
  const [email, setEmail] = useState("yourname@example.com");
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1541257710737-06d667133a53?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedImage = await AsyncStorage.getItem('profileImage');

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedImage) setProfileImage(storedImage);
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setProfileImage(manipulatedImage.uri);
    } else {
      Alert.alert("No image selected!");
    }
  };

  const updateProfile = async () => {
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

setLoading(true);
    // Simulating a network request
    setTimeout(async () => {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('profileImage', profileImage);
      Alert.alert("Profile Updated", `Name: ${name}\nEmail: ${email}`);
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.profileName}>{isEditing ? "Editing Profile" : "View Profile"}</Text>
        
        {isEditing ? (
          <>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder="Enter your name" 
            />
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholder="Enter your email" 
              keyboardType="email-address" 
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.updateButton} onPress={updateProfile} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateButtonText}>Save Changes</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.profileText}>Name: {name}</Text>
            <Text style={styles.profileText}>Email: {email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

 function Home() {
  return (
  
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: '#1a73e8',
          drawerLabelStyle: { fontSize: 18 },
          drawerStyle: { width: 250 },
          headerStyle: { backgroundColor: '#1a73e8' },
          headerTintColor: '#fff',
        }}
      >
        <Drawer.Screen
          name="Home"
          component={TopTabs}
          options={{
            drawerIcon: () => <MaterialCommunityIcons name="home" size={24} color="#333" />,
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: () => <MaterialCommunityIcons name="account" size={24} color="#333" />,
          }}
        />
        <Drawer.Screen
          name="Add Contacts"
          component={AddContacts}
          options={{
            drawerIcon: () => <MaterialCommunityIcons name="account-group" size={24} color="#333" />,
          }}
        />
         <Drawer.Screen
          name="create new Group"
          component={CreateGroupScreen}
          options={{
            drawerIcon: () => <MaterialCommunityIcons name="account-group" size={24} color="#333" />,
          }}
        />
      </Drawer.Navigator>
 
  );
}
export default Home;

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingLeft: 10,
  },
  updateButton: {
    marginTop: 15,
    backgroundColor: '#1a73e8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileInfo: {
    marginTop: 10,
    alignItems: 'flex-start',
    width: '100%',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  editButton: {
    marginTop: 15,
    backgroundColor: '#1a73e8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  screenText: {
    fontSize: 18,
    color: '#333',
  },
});