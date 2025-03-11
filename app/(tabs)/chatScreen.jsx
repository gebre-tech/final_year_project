import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AuthContext from "../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import WebSocket from 'ws';

//ws.current = new WebSocket(`wss://your-backend-url/ws/chat/${chatId}/`);

const ChatScreen = () => {
  const { chatId } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);

  useEffect(() => {
    fetchMessages();
    connectWebSocket();
    return () => ws.current?.close();
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://your-backend-url/chat/${chatId}/messages/`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.log("Error fetching messages:", error);
      alert("Failed to fetch messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const connectWebSocket = () => {
    ws.current = new WebSocket(`ws://your-backend-url/ws/chat/${chatId}/`);
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        { id: newMessage.message_id, content: newMessage.content, sender: newMessage.sender, seen: newMessage.seen },
      ]);
    };
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      ws.current.send(JSON.stringify({ message, sender: user.id }));
      setMessage("");
    }
  };

  const markAsSeen = (messageId) => {
    ws.current.send(JSON.stringify({ seen: true, message_id: messageId }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => markAsSeen(item.id)}
            style={item.sender === user.id ? styles.sentMessage : styles.receivedMessage}
          >
            <Text>{item.content}</Text>
            <Text style={styles.seenStatus}>{item.seen ? "✅ Seen" : "✔ Sent"}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  sentMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 10, margin: 5, borderRadius: 10 },
  receivedMessage: { alignSelf: "flex-start", backgroundColor: "#ECECEC", padding: 10, margin: 5, borderRadius: 10 },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: "#ddd" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5 },
  seenStatus: { fontSize: 12, color: "gray", marginTop: 5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ChatScreen;