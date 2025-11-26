import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsScreen from '../screens/MainScreens/ChatScreens/ChatsScreen';
import Chat from '../screens/MainScreens/ChatScreens/Chats';

const Stack = createNativeStackNavigator();

// Wrapper component to provide navigation context for Chat
const ChatWrapper = ({ chatData }) => {
  return (
    <NavigationIndependentTree>
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="ChatDetail"
            initialParams={chatData}
          >
            {(props) => <Chat {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

const ChatSplitView = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [firstChatLoaded, setFirstChatLoaded] = useState(false);

  // Callback to handle when chats are loaded (for auto-selecting first chat)
  const handleChatsLoaded = (firstChatData) => {
    if (!firstChatLoaded && firstChatData && !selectedChat) {
      setSelectedChat(firstChatData);
      setFirstChatLoaded(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Panel - Chat List */}
      <View style={styles.leftPanel}>
        <ChatsScreen 
          onChatSelect={(chatData) => {
            setSelectedChat(chatData);
            setFirstChatLoaded(true); // Mark as loaded after manual selection
          }}
          onFirstChatReady={handleChatsLoaded}
          isTabletSplitView={true}
        />
      </View>

      {/* Right Panel - Chat Details */}
      <View style={styles.rightPanel}>
        {selectedChat ? (
          <ChatWrapper 
            key={`chat-${selectedChat.chat_id}`} // Force remount when chat changes
            chatData={selectedChat}
          />
        ) : (
          <View style={styles.emptyState}>
            {/* Empty state - no chat selected */}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F7', // Light gray background like Figma
    borderRadius: 20,
    overflow: 'hidden',
  },
  leftPanel: {
    width: 430, // Fixed width as per Figma
    backgroundColor: '#F5F5F7', // Light gray background
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  rightPanel: {
    flex: 1,
    minWidth: 500,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
});

export default ChatSplitView;

