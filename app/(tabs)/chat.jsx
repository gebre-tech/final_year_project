import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const ChatList = () => {
  const { user, loading } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setFetching(false);
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user || !user.token) return;

    try {
      const res = await axios.get("http://your-backend-url/chat/", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      alert("Failed to fetch chats. Please try again.");
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  if (loading || fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <Text style={styles.emptyText}>No chats available</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate("ChatScreen", { chatId: item.id })}
            >
              <Text style={styles.username}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.last_message}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  chatItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  username: { fontSize: 18, fontWeight: "bold" },
  lastMessage: { color: "gray" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ChatList;