import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../../../config/api.config';
import { Alert, ToastAndroid } from 'react-native'; // NEW


const QuickRepliesScreen = () => {
  const navigation = useNavigation();

  const [quickReplies, setQuickReplies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchReplies = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(API.GET_ALL_QUICK_REPLIES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuickReplies(res.data.data);
    } catch (error) {
      console.log('❌ Error fetching replies:', error?.response?.data || error.message);
    }
  };

  const saveReply = async () => {
  if (!newReply.trim()) return;

  const token = await AsyncStorage.getItem('token');
  try {
    if (editIndex !== null) {
      // Update
      const res = await axios.put(API.UPDATE_QUICK_REPLY(editId), { text: newReply }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const updated = [...quickReplies];
      updated[editIndex] = res.data.data;
      setQuickReplies(updated);
      ToastAndroid.show('Updated successfully', ToastAndroid.SHORT);
    } else {
      // Create
      const res = await axios.post(API.ADDQUCK_REPLY, { text: newReply }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setQuickReplies([...quickReplies, res.data.data]);
      ToastAndroid.show('Added successfully', ToastAndroid.SHORT);
    }

    setNewReply('');
    setEditIndex(null);
    setEditId(null);
    setModalVisible(false);
  } catch (error) {
    console.log('❌ Error saving reply:', error?.response?.data || error.message);
  }
};

const deleteReply = (index, id) => {
  Alert.alert(
    'Delete Confirmation',
    'Are you sure you want to delete this quick reply?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          try {
            await axios.delete(API.DELETE_QUICK_REPLY(id), {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const updated = [...quickReplies];
            updated.splice(index, 1);
            setQuickReplies(updated);
            ToastAndroid.show('Deleted successfully', ToastAndroid.SHORT); // Android toast
          } catch (error) {
            console.log('❌ Error deleting reply:', error?.response?.data || error.message);
          }
        },
        style: 'destructive',
      },
    ]
  );
};

  const editReply = (index, item) => {
    setNewReply(item.text);
    setEditIndex(index);
    setEditId(item.id);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <ThemedText style={styles.header}>Quick Replies</ThemedText>
        <Ionicons name="chevron-back" size={28} color="#000" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 50 }} />
      </View>

      <FlatList
        data={quickReplies}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <ThemedText style={styles.replyText}>{item.text}</ThemedText>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => editReply(index, item)}>
                <Ionicons name="pencil-outline" size={24} color="#C62B50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteReply(index, item.id)} style={{ marginLeft: 16 }}>
                <MaterialIcons name="delete-outline" size={24} color="#C62B50" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => {
        setEditIndex(null);
        setNewReply('');
        setEditId(null);
        setModalVisible(true);
      }}>
        <ThemedText style={styles.addButtonText}>Add New</ThemedText>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add quick reply</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter reply"
              value={newReply}
              onChangeText={setNewReply}
              multiline
            />
            <ThemedText style={styles.wordCount}>{newReply.length} Words</ThemedText>
            <TouchableOpacity style={styles.saveButton} onPress={saveReply}>
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default QuickRepliesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
   
  },
  replyText: {
    color: '#992C55',
   borderColor: '#992C55',
   borderWidth: 1,
   padding: 15,
    borderRadius: 25,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#992C55',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  wordCount: {
    textAlign: 'right',
    color: '#888',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#992C55',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
