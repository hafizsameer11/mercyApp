import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowBox from '../../../components/TagIcon';
import TagIcon from '../../../components/TagIcon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ThemedText from '../../../components/ThemedText'; // adjust path accordingly
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../../../config/api.config';


const { height } = Dimensions.get('window');

const categories = ['All', 'Photo Editing', 'Photo Manipulation', 'Photo Retouching', 'Others'];
const ChatScreen = () => {
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLabel, setSelectedLabel] = useState('All');
  const [showLabelOptions, setShowLabelOptions] = useState(false);

  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [labelModalVisible, setLabelModalVisible] = useState(false);
  const [selectedLabelView, setSelectedLabelView] = useState(null);
  const [slideAnim] = useState(new Animated.Value(height));
  const [labelSlideAnim] = useState(new Animated.Value(height));
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateSort, setDateSort] = useState('Newest First');
  const [selectedChat, setSelectedChat] = useState(null);
  const [userDetail, setUserDetail] = useState({});
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState('');
  const labelList = [
    { label: 'New Customer', color: '#0000FF', icon: require('../../../assets/Vector (8).png') },
    { label: 'Paid Customer', color: '#00AA00', icon: require('../../../assets/Vector (11).png') },
    { label: 'Not responding', color: '#FF0000', icon: require('../../../assets/Vector (9).png') },
    { label: 'Active Chats', color: '#000000', icon: require('../../../assets/Vector (10).png') },
  ];


  const [chats, setChats] = useState([]);

  useEffect(() => {
    let interval;

    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(API.GET_ALL_CHATS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {

          const chatData = response.data.data.map(chat => {
            const otherUser = chat.participant_b;
            // console.log("chat data", chat);
            return {
              id: chat.id.toString(),
              name: otherUser.name,
              lastMessage: (() => {
                const lastMsg = chat.messages?.slice(-1)[0];
                if (!lastMsg) return 'No messages yet';

                if (lastMsg.message) return lastMsg.message;

                switch (lastMsg.type) {
                  case 'image':
                    return 'Sent an image';
                  case 'video':
                    return 'Sent a video';
                  case 'voice':
                    return 'Sent a voice note';
                  case 'file':
                    return 'Sent a file';
                  case 'payment':
                    return 'Sent a payment';
                  case 'questionnaire':
                  case 'form':
                    return 'Sent a form';
                  default:
                    return `Sent a ${lastMsg.type}`;
                }
              })(),
              time: chat.updated_at,
              unreadCount: chat.unreadCount ?? 0,
              category: chat.category || 'Others',
              label: null,
              type: chat?.type,
              image: otherUser.profile_picture
                ? { uri: otherUser.profile_picture }
                : require('../../../assets/Ellipse 18.png'),
              agentDetails: otherUser,
              status:chat?.status
            };
          });


          setChats(chatData);
        }
      } catch (error) {
        console.error('Failed to load chats:', error.response?.data || error.message);
      }
    };

    fetchChats();
    interval = setInterval(fetchChats, 1000); // every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const selectChatFromLabelModal = (chat) => {
    const updatedChats = chats.map(c =>
      c.id === chat.id ? { ...c, showBadge: true } : c
    );
    setChats(updatedChats);
    closeLabelView();
  };
  const openModal = (chat) => {
    setSelectedChat(chat);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    const getUserDetails = async () => {
      const userdata = await AsyncStorage.getItem('user');
      const user = JSON.parse(userdata);
      setUserDetail(user);
      setUserRole(user.role);
    }
    getUserDetails();
  }, []);
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const openLabelView = (labelName) => {
    setSelectedLabelView(labelName);
    Animated.timing(labelSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeLabelView = () => {
    Animated.timing(labelSlideAnim, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedLabelView(null));
  };

  const assignLabel = (label) => {
    const updatedChats = chats.map(chat =>
      // chat.id === selectedChat.id ? { ...chat, label } : chat
      chat.id === selectedChat.id
        ? { ...chat, label: { ...label, icon: label.icon } }
        : chat
    );
    setChats(updatedChats);
    setLabelModalVisible(false);
    closeModal();
  };

  const deleteChat = () => {
    const updatedChats = chats.filter(chat => chat.id !== selectedChat.id);
    setChats(updatedChats);
    closeModal();
  };

  const viewLabelChats = (labelName) => {
    setLabelModalVisible(false);
    setTimeout(() => openLabelView(labelName), 300);
  };
  const filteredChats = useMemo(() => {
    let filtered = [...chats];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(chat =>
        chat.agentDetails?.category === selectedCategory || chat.category === selectedCategory
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(chat => chat.status === selectedStatus);
    }

    if (selectedLabel !== 'All') {
      filtered = filtered.filter(chat => chat.label?.label === selectedLabel);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateSort === 'Newest First' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [chats, selectedCategory, selectedStatus, selectedLabel, dateSort]);

  const assignAgentAndNavigate = async (serviceName, navigation, closeModal) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('You must be logged in.');
        return;
      }

      const response = await axios.post(
        API.ASSIGN_AGENT,
        { service_type: serviceName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const { chat_id, agent } = response.data.data;

      if (agent) {
        closeModal();
        navigation.navigate('Chat', {
          service: serviceName,
          userRole: 'agent',
          user: 'LoggedInUser',
          agent: {
            name: agent.name,
            image: { uri: agent.image_url },
          },
          chat_id: chat_id,
        });
      } else {
        alert('No agent assigned.');
      }
    } catch (error) {
      console.error('Error assigning agent:', error?.response?.data || error.message);
      alert('Failed to assign agent.');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <ThemedText fontFamily='monaque' weight='bold' style={styles.headerTitle}>Chat</ThemedText>
          <TouchableOpacity>
            {/* <Ionicons name="ellipsis-vertical" size={22} color="#fff" /> */}
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryButton, selectedCategory === cat && styles.activeCategoryButton]}
            >
              <ThemedText style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>{cat}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.chatWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#aaa" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Search Chats"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 15, gap: 30, marginTop: -10, }}>
          {/* Status Dropdown */}
          <View>
            <TouchableOpacity onPress={() => setShowStatusOptions(!showStatusOptions)} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
              <Ionicons name="filter" size={17} color="#555" style={{ marginRight: 4 }} />
              <ThemedText style={{ fontSize: 14 }}>Status</ThemedText>
              <Ionicons name="caret-down" size={18} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
            {showStatusOptions && (
              <View style={styles.dropdownBox}>
                {['All', 'Pending', 'Completed'].map(option => (
                  <TouchableOpacity key={option} onPress={() => { setSelectedStatus(option); setShowStatusOptions(false); }}>
                    <ThemedText style={styles.dropdownText}>{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date Dropdown */}
          <View>
            <TouchableOpacity onPress={() => setShowDateOptions(!showDateOptions)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 14 }}>Date</ThemedText>
              <Ionicons name="caret-down" size={18} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
            {showDateOptions && (
              <View style={[styles.dropdownBox, { left: -20 }]}>
                {['Newest First', 'Oldest First'].map(option => (
                  <TouchableOpacity key={option} onPress={() => { setDateSort(option); setShowDateOptions(false); }}>
                    <ThemedText style={styles.dropdownText}>{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Label Dropdown */}
          {userRole === 'agent' && (
            <View>
              <TouchableOpacity onPress={() => setShowLabelOptions(!showLabelOptions)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 14 }}>Labels</ThemedText>
                <Ionicons name="caret-down" size={18} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
              {showLabelOptions && (
                <View style={[styles.dropdownBox, { width: 150 }]}>
                  <TouchableOpacity onPress={() => { setSelectedLabel('All'); setShowLabelOptions(false); }}>
                    <ThemedText style={styles.dropdownText}>All</ThemedText>
                  </TouchableOpacity>

                  {labelList.map((labelObj) => (
                    <TouchableOpacity
                      key={labelObj.label}
                      onPress={() => { setSelectedLabel(labelObj.label); setShowLabelOptions(false); }}
                      style={styles.dropdownItemRow}
                    >
                      <Image source={labelObj.icon} style={styles.labelIconImage} />
                      <ThemedText style={styles.dropdownText}>{labelObj.label}</ThemedText>
                    </TouchableOpacity>
                  ))}

                </View>
              )}
            </View>
          )}

        </View>


        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatCard}
              onLongPress={() => userRole === 'agent' && openModal(chat)}
              onPress={() => {
                navigation.navigate('Chat', {
                  chat_id: chat.id,
                  userRole: 'agent',
                  user: chat.name,
                  agent: {
                    name: 'Agent', // or extract from current user or API
                    image: chat.image, // fallback if needed
                  },
                  service: chat.service || 'General', // or chat.type if you return it
                });
              }}

            >
              <Image source={chat.image} style={styles.chatAvatar} />
              <View style={styles.chatInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ThemedText style={styles.chatName}>{chat.name}</ThemedText>
                  {
                    userDetail && userDetail?.role == 'user' ? <ThemedText style={styles.chatName}></ThemedText>
                      : <ThemedText style={styles.chatName2}>({chat.type == 'user-agent' ? 'Customer' : 'Team'})</ThemedText>

                  }
                  {/* <ThemedText style={styles.chatName}>{chat.name}</ThemedText> */}
                  {chat.label && chat.showBadge && chat.label.icon && (
                    <Image source={chat.label.icon} style={styles.chatLabelImager} />
                  )}
                </View>

                <ThemedText style={styles.chatMessage}>{chat.lastMessage}</ThemedText>
              </View>
              <View style={styles.chatMeta}>
                <ThemedText style={styles.chatTime}>{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <ThemedText style={styles.unreadText}>{chat.unreadCount}</ThemedText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Options Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.optionsModalOverlay}>
          <View style={styles.optionsModalBox}>
            <View style={styles.optionsHeader}>
              <ThemedText style={styles.optionsTitle}>Options</ThemedText>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.optionsItem} onPress={() => setLabelModalVisible(true)}>
              <Ionicons name="pricetags-outline" size={18} color="#000" style={{ marginRight: 10 }} />
              <ThemedText style={styles.optionsItemText}>Labels</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsItem} onPress={deleteChat}>
              <Ionicons name="trash" size={18} color="red" style={{ marginRight: 10 }} />
              <ThemedText style={[styles.optionsItemText, { color: 'red' }]}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Label Modal */}
      <Modal visible={labelModalVisible} transparent animationType="slide">
        <View style={styles.labelModalOverlay}>
          <View style={styles.labelModalBox}>
            <View style={styles.labelHeader}>
              <ThemedText style={styles.labelTitle}>Labels</ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.newLabelButton}>New Label</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLabelModalVisible(false)}>
                <Ionicons name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            {labelList.map((item) => {
              const count = chats.filter(chat => chat.label?.label === item.label).length;
              return (
                <TouchableOpacity key={item.label} style={styles.labelRow} onPress={() => viewLabelChats(item.label)}>
                  {/* <View style={[styles.colorDot, { backgroundColor: item.color }]} /> */}
                  <Image source={item.icon} style={styles.labelIconImage} />

                  <View>
                    <ThemedText style={styles.labelText}>{item.label}</ThemedText>
                    <ThemedText style={styles.labelCount}>{count} item{count !== 1 ? 's' : ''}</ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Label View Modal */}
      <Modal visible={!!selectedLabelView} transparent animationType="slide">
        <View style={styles.optionsModalOverlay}>
          <Animated.View style={[styles.labelModalBox, { transform: [{ translateY: labelSlideAnim }] }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={closeLabelView}>
                  <Ionicons name="chevron-back" size={24} color="#000" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>{selectedLabelView}</ThemedText>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            {chats.filter(chat => chat.label?.label === selectedLabelView).map(chat => (
              <TouchableOpacity
                key={chat.id}
                style={[styles.chatCard, { backgroundColor: '#F5F5F7' }]}
                onPress={() => selectChatFromLabelModal(chat)}
              >
                <Image source={chat.image} style={styles.chatAvatar} />
                <View style={styles.chatInfo}>
                  <ThemedText style={styles.chatName}>{chat.name}</ThemedText>
                  <ThemedText style={styles.chatMessage}>{chat.lastMessage}</ThemedText>
                </View>
                <ThemedText style={styles.chatTime}>
                  {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
              </TouchableOpacity>
            ))}

          </Animated.View>
        </View>
      </Modal>

      {/* user new chat modal
       */}
      <Modal
        visible={serviceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setServiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Choose a service</ThemedText>
              <TouchableOpacity style={{ backgroundColor:"#fff", borderRadius:20, padding:4, elevation:1 }} onPress={() => setServiceModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.serviceGrid}>
              {[
                {
                  label: 'Photo Editing',
                  color: '#E6273C',
                  icon: require('../../../assets/PenNib.png'),
                },
                {
                  label: 'Photo Manipulation',
                  color: '#7B2CBF',
                  icon: require('../../../assets/Vector (6).png'),
                },
                {
                  label: 'Body Retouching',
                  color: '#D63384',
                  icon: require('../../../assets/DropHalf.png'),
                },
                {
                  label: 'Others',
                  color: '#F59F00',
                  icon: require('../../../assets/Eyedropper.png'),
                },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.serviceBox}
                  onPress={() => {
                    assignAgentAndNavigate(item.label, navigation, () => setServiceModalVisible(false));
                  }}
                >
                  <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                    <Image source={item.icon} style={styles.iconImage} />
                  </View>
                  <ThemedText style={styles.serviceText}>{item.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>


      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => {
          if (userRole === 'user') {
            setServiceModalVisible(true); 
          } else {
            navigation.navigate('NewChat'); 
          }
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: { backgroundColor: '#992C55', paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '600', color: '#fff', marginBottom: 16 },
  categoryContainer: { flexDirection: 'row', alignItems: 'center' },
  categoryButton: { backgroundColor: '#BA3B6B', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, marginRight: 10 },
  activeCategoryButton: { backgroundColor: '#fff' },
  categoryText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  activeCategoryText: { color: '#000' },
  chatWrapper: { flex: 1, position: 'absolute', top: 190, left: 0, right: 0, bottom: 0, backgroundColor: '#F5F5F7', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 16, paddingTop: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 5, elevation: 2, marginBottom: 30 },
  searchInput: { flex: 1, marginLeft: 10, color: '#000', fontSize: 14 },
  chatCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatAvatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  chatName2: { fontSize: 11, fontWeight: 'light', color: '#000' },
  chatMessage: { fontSize: 13, color: '#555' },
  chatMeta: { alignItems: 'flex-end' },
  chatTime: { fontSize: 11, color: '#999' },
  unreadBadge: { backgroundColor: '#992C55', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 5 },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  chatLabelDot: { width: 14, height: 14, borderRadius: 7, alignSelf: 'flex-end', marginBottom: 4 },
  optionsModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  optionsModalBox: { backgroundColor: '#F5F5F7', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  optionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  optionsTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  optionsItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: "#fff", marginTop: 10, borderRadius: 10 },
  optionsItemText: { fontSize: 16, color: '#000' },
  labelModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  labelModalBox: { backgroundColor: '#F5F5F7', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  labelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  newLabelButton: { color: '#fff', fontWeight: '600', fontSize: 12, backgroundColor: '#992C55', paddingHorizontal: 10, paddingVertical: 9, borderRadius: 8, marginLeft: 200 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: "#fff", padding: 10, borderRadius: 10 },
  colorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  labelText: { fontSize: 15, color: '#000' },
  labelCount: { fontSize: 11, color: '#888' },
  dropdownBox: {
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 8,
    marginTop: 20,
    padding: 10,
    width: 100,
    position: 'absolute',
    zIndex: 1,
  },
  dropdownText: {
    fontSize: 13,
    paddingVertical: 8,
    color: '#000',
    paddingVertical: 5,
  },
  fabButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#992C55',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  labelIconImage: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },

  labelIconImage: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8,
  },
  chatLabelImage: {
    // width: 20,
    // height: 20,
    // marginBottom: 6,

  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#F5F5F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  serviceGrid: {
    marginLeft:5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap:12,
    columnGap:12
  },
  serviceBox: {

    width: 150,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    height:190,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  serviceText: {
    fontSize: 13,
    marginTop:10,
    fontWeight: '500',
    color: '#000',
  },



});

export default ChatScreen;
