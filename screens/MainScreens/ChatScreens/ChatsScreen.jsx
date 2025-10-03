// ChatScreen.js (pure JS, TanStack Query) — PERSISTENT LABELS FIXED
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
  AppState,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ThemedText from '../../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../../../config/api.config';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const { height } = Dimensions.get('window');

const categories = ['All', 'Photo Editing', 'Photo Manipulation', 'Photo Retouching', 'Others'];
const POLL_MS = 10000;   // 10s
const STALE_MS = 60000;  // 60s

// === Label storage keys ===
const LABELS_KEY = 'labels_catalog_v1';      // [{id, name, color}]
const CHAT_LABELS_KEY = 'chat_labels_v1';    // { [chatId]: [labelId, ...] }

// Deterministic default labels (stable IDs!)
const DEFAULT_LABELS = [
  { id: 'lbl:new_customer',   name: 'New Customer',    color: '#2563EB' },
  { id: 'lbl:paid_customer',  name: 'Paid Customer',   color: '#16A34A' },
  { id: 'lbl:not_responding', name: 'Not responding',  color: '#DC2626' },
  { id: 'lbl:active',         name: 'Active',          color: '#0F172A' },
];

// Tiny id helper (for user-created labels only)
const newId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

// AsyncStorage wrappers
const loadJSON = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to parse ${key}`, e);
    return fallback;
  }
};
const saveJSON = async (key, val) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Failed to save ${key}`, e);
  }
};

// ---------- small UI helpers ----------
const presetColors = ['#2563EB', '#16A34A', '#DC2626', '#0F172A', '#7B2CBF', '#E6273C', '#F59F00', '#D63384', '#10B981'];

const CreateLabelModal = ({ visible, onClose, onCreate }) => {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState(presetColors[0]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return Alert.alert('Missing name', 'Please enter a label name.');
    onCreate({ name: trimmed, color });
    setName('');
    setColor(presetColors[0]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>New Label</ThemedText>

          <View style={{ marginBottom: 12 }}>
            <ThemedText style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Name</ThemedText>
            <TextInput
              placeholder="e.g., VIP, Lead, Priority"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, color: '#000' }}
            />
          </View>

          <ThemedText style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Color</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {presetColors.map(c => (
              <TouchableOpacity key={c} onPress={() => setColor(c)}>
                <View style={{
                  width: 28, height: 28, borderRadius: 14, backgroundColor: c,
                  borderWidth: c === color ? 3 : 1, borderColor: c === color ? '#111' : '#ccc'
                }} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={{ color: '#555' }}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit}>
              <ThemedText style={{ color: '#992C55', fontWeight: '700' }}>Create</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LabelDot = ({ color }) => (
  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginLeft: 6 }} />
);
const LabelPill = ({ label }) => (
  <View style={{ backgroundColor: '#fff', borderColor: label.color, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginLeft: 6 }}>
    <ThemedText style={{ fontSize: 10, color: '#000' }}>{label.name}</ThemedText>
  </View>
);

const ChatScreen = () => {
  const [peerTab, setPeerTab] = useState('Customer');
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
  const [dateSort, setDateSort] = useState('Newest First');
  const [selectedChat, setSelectedChat] = useState(null);
  const [userDetail, setUserDetail] = useState({});
  const [userRole, setUserRole] = useState('');
  const [createLabelVisible, setCreateLabelVisible] = useState(false);

  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const norm = (s) => (s || '').toString().toLowerCase().trim();

  // === Local label state ===
  const [labels, setLabels] = useState([]);              // catalog: [{id, name, color}]
  const [chatLabelsMap, setChatLabelsMap] = useState({}); // map: { [chatId]: [labelId,...] }

  // Load labels + assignments once (with first-run save + migration cleanup)
  useEffect(() => {
    (async () => {
      // 1) Try to load stored catalog
      const storedLabels = await loadJSON(LABELS_KEY, null);

      if (Array.isArray(storedLabels) && storedLabels.length > 0) {
        setLabels(storedLabels);
      } else {
        // First run → persist deterministic defaults
        await saveJSON(LABELS_KEY, DEFAULT_LABELS);
        setLabels(DEFAULT_LABELS);
      }

      // 2) Load assignments map
      const rawMap = await loadJSON(CHAT_LABELS_KEY, {});
      let map = rawMap;

      // 3) Migration: strip unknown label IDs (from old random-id builds)
      const known = new Set((storedLabels?.length ? storedLabels : DEFAULT_LABELS).map(l => l.id));
      let mutated = false;
      const cleaned = Object.fromEntries(
        Object.entries(map).map(([chatId, ids]) => {
          const next = (ids || []).filter(id => known.has(id));
          if (next.length !== (ids || []).length) mutated = true;
          return [chatId, next];
        })
      );
      if (mutated) {
        map = cleaned;
        await saveJSON(CHAT_LABELS_KEY, cleaned);
      }

      setChatLabelsMap(map);
    })();
  }, []);

  // Catalog CRUD
  const createLabel = async ({ name, color }) => {
    const item = { id: newId(), name: name.trim(), color };
    const next = [...labels, item];
    setLabels(next);
    await saveJSON(LABELS_KEY, next);
  };
  const updateLabel = async (id, patch) => {
    const next = labels.map(l => (l.id === id ? { ...l, ...patch } : l));
    setLabels(next);
    await saveJSON(LABELS_KEY, next);
  };
  const deleteLabel = async (id) => {
    const nextLabels = labels.filter(l => l.id !== id);
    const nextMap = Object.fromEntries(
      Object.entries(chatLabelsMap).map(([chatId, arr]) => [chatId, (arr || []).filter(lid => lid !== id)])
    );
    setLabels(nextLabels);
    setChatLabelsMap(nextMap);
    await saveJSON(LABELS_KEY, nextLabels);
    await saveJSON(CHAT_LABELS_KEY, nextMap);

    // If deleted label is currently selected as filter, reset to "All"
    if (selectedLabel === id) setSelectedLabel('All');
  };

  // Assign / Unassign a label to a chat (guard unknown ids)
  const toggleChatLabel = async (chatId, labelId) => {
    if (!labels.some(l => l.id === labelId)) return; // defensive

    const key = String(chatId);
    const prev = chatLabelsMap[key] || [];
    const exists = prev.includes(labelId);
    const nextArr = exists ? prev.filter(id => id !== labelId) : [...prev, labelId];
    const nextMap = { ...chatLabelsMap, [key]: nextArr };

    // Optimistic UI + persist
    setChatLabelsMap(nextMap);
    await saveJSON(CHAT_LABELS_KEY, nextMap);

    // also reflect on cached rows for instant badge update (not strictly necessary now)
    queryClient.setQueryData(['chats'], (old = []) =>
      old.map(c => (String(c.id) === key ? { ...c, _localLabelIds: nextArr } : c))
    );
  };

  const confirmAction = (title, message) =>
    new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Proceed', onPress: () => resolve(true) },
        ],
        { cancelable: true }
      );
    });

  // ---------- normalize from API (pure server row) ----------
  const normalizeChat = (chat) => {
    const otherUser = chat.participant_b;

    // normalize messages (guard against null)
    const messages = Array.isArray(chat.messages)
      ? chat.messages.map(m => ({
          id: String(m.id ?? ''),
          sender_id: m.sender_id ?? null,
          type: m.type ?? 'text',
          message: (m.message ?? '').toString(),
          created_at: m.created_at ?? null,
        }))
      : [];

    const lastMsg = messages[messages.length - 1];

    let lastMessage = 'No messages yet';
    if (lastMsg) {
      if (lastMsg.message) lastMessage = lastMsg.message;
      else {
        const map = {
          image: 'Sent an image',
          video: 'Sent a video',
          voice: 'Sent a voice note',
          file: 'Sent a file',
          payment: 'Sent a payment',
          questionnaire: 'Sent a form',
          form: 'Sent a form',
        };
        lastMessage = map[lastMsg.type] || `Sent a ${lastMsg.type}`;
      }
    }

    return {
      id: String(chat.id),
      name: otherUser?.name || 'Unknown',
      lastMessage,
      time: chat.updated_at,
      unreadCount: chat.unread_count ?? 0,
      category: chat.category || 'Others',
      type: chat?.type,
      image: otherUser?.profile_picture
        ? { uri: otherUser.profile_picture }
        : require('../../../assets/Ellipse 18.png'),
      agentDetails: otherUser,
      status: chat?.status,
      service: chat?.service,
      messages, // keep normalized messages for search
    };
  };

  // ---------- load user (role/name) ----------
  useEffect(() => {
    (async () => {
      const userdata = await AsyncStorage.getItem('user');
      if (userdata) {
        const user = JSON.parse(userdata);
        setUserDetail(user);
        setUserRole(user?.role || '');
      }
    })();
  }, []);

  // ---------- query: chats (server) ----------
  const {
    data: serverChats = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['chats'],
    queryFn: async ({ signal }) => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return [];
      const res = await axios.get(API.GET_ALL_CHATS, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      return rows.map(normalizeChat);
    },
    staleTime: STALE_MS,
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev ?? [],
    gcTime: 5 * 60 * 1000,
  });

  const previewForType = (m) => {
    const map = {
      image: 'Sent an image',
      video: 'Sent a video',
      voice: 'Sent a voice note',
      file: 'Sent a file',
      payment: 'Sent a payment',
      questionnaire: 'Sent a form',
      form: 'Sent a form',
      text: (m?.message ?? '').toString(),
    };
    const t = (m?.type || 'text').toLowerCase();
    return map[t] || (m?.message ?? '').toString() || `Sent a ${t}`;
  };

  // latest message in a chat that matches q
  const latestMatchingMessage = (chat, q, normFn) => {
    const arr = Array.isArray(chat.messages) ? chat.messages : [];
    for (let i = arr.length - 1; i >= 0; i--) {
      const m = arr[i];
      const text = normFn((m?.message ?? '') + (m?.caption ?? '') + (m?.file_name ?? ''));
      if (text.includes(q)) return m;
    }
    return null;
  };

  // derive chats by merging local labels every render
  const chats = useMemo(
    () => serverChats.map(c => ({ ...c, _localLabelIds: chatLabelsMap[String(c.id)] || [] })),
    [serverChats, chatLabelsMap]
  );

  // Refetch when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Refetch when app comes back to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refetch();
    });
    return () => sub.remove();
  }, [refetch]);

  // ---------- label / modal actions ----------
  const openModal = (chat) => {
    setSelectedChat(chat);
    setModalVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const closeModal = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 200, useNativeDriver: true }).start(() =>
      setModalVisible(false)
    );
  };
  const openLabelView = (labelName) => {
    setSelectedLabelView(labelName);
    Animated.timing(labelSlideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const closeLabelView = () => {
    Animated.timing(labelSlideAnim, { toValue: height, duration: 200, useNativeDriver: true }).start(() =>
      setSelectedLabelView(null)
    );
  };

  // ---------- filters + sort + search ----------
  const filteredChats = useMemo(() => {
    let filtered = chats.map(c => ({ ...c }));

    // Category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        chat => chat.agentDetails?.category === selectedCategory || chat.category === selectedCategory
      );
    }

    // Status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(chat => String(chat.status).toLowerCase() === selectedStatus.toLowerCase());
    }

    // Label (local)
    if (selectedLabel !== 'All') {
      filtered = filtered.filter(chat => chat._localLabelIds?.includes(selectedLabel));
    }

    // Agent-only: Customer vs Team tab
    if (userRole === 'support') {
      filtered =
        peerTab === 'Customer'
          ? filtered.filter(c => c.type === 'user-agent')
          : filtered.filter(c => c.type !== 'user-agent');
    }

    // Search
    if (search.trim()) {
      const q = norm(search);

      filtered = filtered
        .map((c) => {
          const inName = norm(c.name).includes(q);
          const inLast = norm(c.lastMessage).includes(q);
          const inService = norm(c.service).includes(q);

          const labelNames = (c._localLabelIds || [])
            .map((lid) => labels.find((l) => l.id === lid)?.name || '')
            .join(' ');
          const inLabel = norm(labelNames).includes(q);

          const m = latestMatchingMessage(c, q, norm);

          if (m) {
            c._displayMessage = previewForType(m);
            c._displayTime = m.created_at || c.time;
          }

          c._matched = inName || inLast || inService || inLabel || !!m;
          return c;
        })
        .filter(c => c._matched);

      filtered.sort((a, b) => {
        const ta = new Date(a._displayTime ?? a.time).getTime();
        const tb = new Date(b._displayTime ?? b.time).getTime();
        return tb - ta;
      });

      return filtered;
    }

    // No search → normal sort by chat time
    filtered.sort((a, b) => {
      const dateA = new Date(a.time).getTime();
      const dateB = new Date(b.time).getTime();
      return dateSort === 'Newest First' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [chats, selectedCategory, selectedStatus, selectedLabel, dateSort, search, peerTab, userRole, labels]);

  const assignAgentAndNavigate = async (serviceName, navigation, closeFn) => {
    const ok = await confirmAction('Confirm Service', `Do you want to proceed with "${serviceName}"?`);
    if (!ok) return;
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

      const { chat_id, agent } = response.data.data || {};
      if (agent) {
        closeFn();
        navigation.navigate('Chat', {
          service: serviceName,
          userRole: 'agent',
          user: 'LoggedInUser',
          agent: { name: agent.name, image: { uri: agent.image_url } },
          chat_id,
        });
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      } else {
        alert('No agent assigned.');
      }
    } catch (error) {
      console.error('Error assigning agent:', error?.response?.data || error.message);
      alert('Failed to assign agent.');
    }
  };

  // Delete chat function
  const deleteChat = async (chatId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('You must be logged in.');
        return;
      }

      const response = await axios.post(
        API.DELETE_CHAT(chatId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        // Refresh the chat list
        queryClient.invalidateQueries({ queryKey: ['chats'] });
        alert('Chat deleted successfully.');
      } else {
        alert('Failed to delete chat.');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (chat) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat? This action cannot be undone and will delete all messages in this chat.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChat(chat.id),
        },
      ]
    );
  };

  // ---------- render ----------
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <ThemedText fontFamily='monaque' weight='bold' style={styles.headerTitle}>Chat</ThemedText>
          <TouchableOpacity>{/* menu */}</TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryButton, selectedCategory === cat && styles.activeCategoryButton]}
            >
              <ThemedText style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>
                {cat}
              </ThemedText>
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

        {userRole === 'support' && (
          <View style={styles.tabSwitch}>
            <TouchableOpacity
              style={[styles.tabBtn, peerTab === 'Customer' && styles.tabBtnActive]}
              onPress={() => setPeerTab('Customer')}
            >
              <ThemedText style={[styles.tabText, peerTab === 'Customer' && styles.tabTextActive]}>
                Customer
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, peerTab === 'Team' && styles.tabBtnActive]}
              onPress={() => setPeerTab('Team')}
            >
              <ThemedText style={[styles.tabText, peerTab === 'Team' && styles.tabTextActive]}>
                Team
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flexDirection: 'row', marginBottom: 15, gap: 30, marginTop: -10 }}>
          {/* Status */}
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

          {/* Date */}
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

          {/* Labels filter (agents/support) */}
          {userRole === 'support' && (
            <View>
              <TouchableOpacity onPress={() => setShowLabelOptions(!showLabelOptions)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 14 }}>Labels</ThemedText>
                <Ionicons name="caret-down" size={18} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
              {showLabelOptions && (
                <View style={[styles.dropdownBox, { width: 170 }]}>
                  <TouchableOpacity onPress={() => { setSelectedLabel('All'); setShowLabelOptions(false); }}>
                    <ThemedText style={styles.dropdownText}>All</ThemedText>
                  </TouchableOpacity>
                  {labels.map((lab) => (
                    <TouchableOpacity
                      key={lab.id}
                      onPress={() => { setSelectedLabel(lab.id); setShowLabelOptions(false); }}
                      style={styles.dropdownItemRow}
                    >
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: lab.color, marginRight: 8 }} />
                      <ThemedText style={styles.dropdownText}>{lab.name}</ThemedText>
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
              onLongPress={() => openModal(chat)}
              onPress={() => {
                navigation.navigate('Chat', {
                  chat_id: chat.id,
                  userRole: 'agent',
                  user: chat.name,
                  agent: { name: chat.name, image: chat.image },
                  service: chat.service || 'General',
                });
              }}
            >
              <Image source={chat.image} style={styles.chatAvatar} />
              <View style={styles.chatInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ThemedText style={styles.chatName}>{chat.name}</ThemedText>
                  {userDetail?.role !== 'user' && (
                    <ThemedText style={styles.chatName2}>({chat.type === 'user-agent' ? 'Customer' : 'Team'})</ThemedText>
                  )}
                  {/* Local label pills */}
                  {((chat._localLabelIds || []).slice(0, 2)).map((lid) => {
                    const lab = labels.find(l => l.id === lid);
                    if (!lab) return null;
                    return <LabelPill key={lid} label={lab} />;
                  })}
                  {(chat._localLabelIds?.length || 0) > 2 && <LabelDot color="#888" />}
                </View>
                <ThemedText style={styles.chatMessage}>{chat._displayMessage ?? chat.lastMessage}</ThemedText>
              </View>
              <View style={styles.chatMeta}>
                <ThemedText style={styles.chatTime}>
                  {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
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

      {/* Options Modal (per chat) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.optionsModalOverlay}>
          <View style={styles.optionsModalBox}>
            <View style={styles.optionsHeader}>
              <ThemedText style={styles.optionsTitle}>Options</ThemedText>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Quick label row (top 3) - Only for support users */}
            {userDetail?.role === 'support' && (
              <View style={{ marginTop: 6, marginBottom: 8 }}>
                <ThemedText style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Quick label</ThemedText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {labels.slice(0, 3).map(lab => (
                    <TouchableOpacity
                      key={lab.id}
                      onPress={() => selectedChat && toggleChatLabel(selectedChat.id, lab.id)}
                      style={{ borderWidth: 1, borderColor: lab.color, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}
                    >
                      <ThemedText style={{ fontSize: 11, color: '#000' }}>{lab.name}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Labels option - Only for support users */}
            {userDetail?.role === 'support' && (
              <TouchableOpacity style={styles.optionsItem} onPress={() => setLabelModalVisible(true)}>
                <Ionicons name="pricetags-outline" size={18} color="#000" style={{ marginRight: 10 }} />
                <ThemedText style={styles.optionsItemText}>Labels</ThemedText>
              </TouchableOpacity>
            )}

            {/* Delete Chat Option - Only for regular users */}
            {userDetail?.role === 'user' && (
              <TouchableOpacity 
                style={[styles.optionsItem, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8, paddingTop: 12 }]} 
                onPress={() => {
                  closeModal();
                  showDeleteConfirmation(selectedChat);
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#ff4444" style={{ marginRight: 10 }} />
                <ThemedText style={[styles.optionsItemText, { color: '#ff4444' }]}>Delete Chat</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Label Modal (list + toggle + delete) */}
      <Modal visible={labelModalVisible} transparent animationType="slide">
        <View style={styles.labelModalOverlay}>
          <View style={styles.labelModalBox}>
            <View style={styles.labelHeader}>
              <ThemedText style={styles.labelTitle}>Labels</ThemedText>
              <TouchableOpacity onPress={() => setCreateLabelVisible(true)}>
                <ThemedText style={styles.newLabelButton}>New Label</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLabelModalVisible(false)}>
                <Ionicons name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {labels.map((lab) => {
              const assigned = selectedChat && (chatLabelsMap[String(selectedChat.id)] || []).includes(lab.id);
              const count = Object.values(chatLabelsMap).filter(arr => (arr || []).includes(lab.id)).length;
              return (
                <View key={lab.id} style={[styles.labelRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flexDirection: 'row,', alignItems: 'center' }}>
                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: lab.color, marginRight: 8 }} />
                    <View>
                      <ThemedText style={styles.labelText}>{lab.name}</ThemedText>
                      <ThemedText style={styles.labelCount}>{count} chat{count !== 1 ? 's' : ''}</ThemedText>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => selectedChat && toggleChatLabel(selectedChat.id, lab.id)}>
                      <ThemedText style={{ color: assigned ? '#16A34A' : '#555' }}>
                        {assigned ? 'Remove' : 'Add'}
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteLabel(lab.id)}>
                      <Ionicons name="trash" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Label View Modal (optional browsing by label name) */}
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
            {/* You can adapt this to show chats by label if needed */}
          </Animated.View>
        </View>
      </Modal>

      {/* Create Label Modal */}
      <CreateLabelModal
        visible={createLabelVisible}
        onClose={() => setCreateLabelVisible(false)}
        onCreate={createLabel}
      />

      {/* New Chat (FAB) */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => {
          if (userRole === 'user') setServiceModalVisible(true);
          else navigation.navigate('NewChat');
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Service Modal */}
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
              <TouchableOpacity style={{ backgroundColor: "#fff", borderRadius: 20, padding: 4, elevation: 1 }} onPress={() => setServiceModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.serviceGrid}>
              {[
                { label: 'Photo Editing', color: '#E6273C', icon: require('../../../assets/PenNib.png') },
                { label: 'Photo Manipulation', color: '#7B2CBF', icon: require('../../../assets/Vector (6).png') },
                { label: 'Body Retouching', color: '#D63384', icon: require('../../../assets/DropHalf.png') },
                { label: 'Others', color: '#F59F00', icon: require('../../../assets/Eyedropper.png') },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.serviceBox}
                  onPress={() => assignAgentAndNavigate(item.label, navigation, () => setServiceModalVisible(false))}
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 5, elevation: 2, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, color: '#000', fontSize: 14 },
  chatCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatAvatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  chatName2: { fontSize: 11, color: '#000' },
  chatMessage: { fontSize: 13, color: '#555' },
  chatMeta: { alignItems: 'flex-end' },
  chatTime: { fontSize: 11, color: '#999' },
  unreadBadge: { backgroundColor: '#992C55', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 5 },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  optionsModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  optionsModalBox: { backgroundColor: '#F5F5F7', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  optionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  optionsTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  optionsItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: "#fff", marginTop: 10, borderRadius: 10 },

  labelModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  labelModalBox: { backgroundColor: '#F5F5F7', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  labelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  newLabelButton: { color: '#fff', fontWeight: '600', fontSize: 12, backgroundColor: '#992C55', paddingHorizontal: 10, paddingVertical: 9, borderRadius: 8, marginLeft: 200 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: "#fff", padding: 10, borderRadius: 10 },
  labelText: { fontSize: 15, color: '#000' },
  labelCount: { fontSize: 11, color: '#888' },

  dropdownBox: { backgroundColor: '#fff', elevation: 2, borderRadius: 8, marginTop: 20, padding: 10, width: 100, position: 'absolute', zIndex: 1 },
  dropdownText: { fontSize: 13, color: '#000', paddingVertical: 5 },
  dropdownItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },

  fabButton: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#992C55', justifyContent: 'center', alignItems: 'center', elevation: 6 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#F5F5F7', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  serviceGrid: { marginLeft: 5, flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, columnGap: 12 },
  serviceBox: { width: 150, aspectRatio: 1, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, height: 190, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  iconCircle: { width: 70, height: 70, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  iconImage: { width: 26, height: 26, resizeMode: 'contain' },
  serviceText: { fontSize: 13, marginTop: 10, fontWeight: '500', color: '#000' },

  tabSwitch: { flexDirection: 'row', backgroundColor: '#EEE', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#992C55' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#333' },
  tabTextActive: { color: '#fff' },
});

export default ChatScreen;
