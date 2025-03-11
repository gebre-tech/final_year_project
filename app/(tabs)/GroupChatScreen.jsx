import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import AuthContext from "../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const GroupChatScreen = () => {
  const { chatId } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    fetchMessages();
    connectWebSocket();
    return () => ws.current?.close();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://your-backend-url/chat/${chatId}/messages/`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  const connectWebSocket = () => {
    ws.current = new WebSocket(`ws://your-backend-url/ws/chat/${chatId}/`);
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      ws.current.send(JSON.stringify({ message, sender: user.id }));
      setMessage("");
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === user.id ? styles.sentMessage : styles.receivedMessage}>
      <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.sender}&background=random` }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.text}>{item.content}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={messages} keyExtractor={(item) => item.id.toString()} renderItem={renderMessage} />
     <View style={styles.inputContainer}>
      <TouchableOpacity onPress={pickImage}>
        <Ionicons name="image" size={24} color="#007AFF" />
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} />
      <TouchableOpacity onPress={sendMessage}>
        <Ionicons name="send" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
    </View>
  );
};


const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    sendAttachment(result.uri);
  }
};

const sendAttachment = async (uri) => {
  let formData = new FormData();
  formData.append("attachment", {
    uri,
    name: "attachment.jpg",
    type: "image/jpeg",
  });

  await fetch(`http://your-backend-url/chat/${chatId}/send/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${user.token}` },
    body: formData,
  });

  fetchMessages();
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  sentMessage: { flexDirection: "row", alignSelf: "flex-end", alignItems: "center", margin: 5 },
  receivedMessage: { flexDirection: "row", alignSelf: "flex-start", alignItems: "center", margin: 5 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  messageContent: { backgroundColor: "#DCF8C6", padding: 10, borderRadius: 10 },
  sender: { fontWeight: "bold", marginBottom: 2 },
  text: { fontSize: 16 },
  timestamp: { fontSize: 12, color: "#666", marginTop: 5, alignSelf: "flex-end" },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: "#ddd", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginRight: 10 },
});



export default GroupChatScreen;
