import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import questionnaireData from './questionnaireData';
import EmojiSelector from 'react-native-emoji-selector';
import { RecordingButton } from '../../../components/RecordingButton';
import VoiceRecorderModal from '../../../components/VoiceRecorderModal';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { ActivityIndicator, ImageBackground, Pressable, InteractionManager } from 'react-native';
import ThemedText from '../../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API, { BASE_URL } from '../../../config/api.config';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Mime from 'react-native-mime-types';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import CategoryOneModal from '../../../components/CategoryOneModal';
import CategoryTwoModal from '../../../components/CategoryTwoModal';
import CategoryThreeModal from '../../../components/CategoryThreeModel';
import PaymentModal from '../../../components/PaymentModal';

// ✅ TanStack Query
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';

const EMOJIS = [
    '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😜', '😎', '🤩', '🥳', '🤔', '😴', '🤤', '🤗', '🙃',
    '👍', '👎', '🙏', '👏', '💪', '🔥', '💯', '✨', '🎉', '🥰', '😅', '😇', '😏', '😌', '😢', '😭',
    '😤', '😡', '🤯', '🤒', '🤕', '🤧', '🤮', '🥴', '😷', '🤓', '🧐', '😺', '😸', '😹', '🙈', '🙉',
    '🙊', '💖', '💔', '💗', '💙', '💚', '💛', '💜', '🖤', '🤍', '🤎', '💥', '⚡', '⭐', '🌟', '💫',
    '🍕', '🍔', '🍟', '🌮', '🍣', '🍪', '🍩', '🍰', '☕', '🍵', '🍺', '🍻', '🍷', '🥂', '🍾', '🍎',
    '⚽', '🏀', '🏈', '🎾', '🏐', '🎮', '🎧', '🎬', '🎯', '🎲', '🚗', '🚀', '✈️', '🛸', '🏠', '🏢',
];
const SafeEmojiPicker = ({ onSelect, height = 300, columns = 8, itemSize = 40 }) => {
    const data = useMemo(() => EMOJIS, []);
    const keyExtractor = (e, i) => `${e}-${i}`;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => onSelect?.(item)}
            activeOpacity={0.7}
            style={{
                width: itemSize,
                height: itemSize,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                margin: 4,
            }}
        >
            <Text style={{ fontSize: 26, lineHeight: 30 }}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ height, width: '100%' }}>
            <FlatList
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={columns}
                showsVerticalScrollIndicator={false}
                initialNumToRender={columns * Math.ceil(height / (itemSize + 8))}
                removeClippedSubviews
                windowSize={7}
                contentContainerStyle={{
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                }}
            />
        </View>
    );
};
export { SafeEmojiPicker };

const ChatScreen = () => {
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const [previewImages, setPreviewImages] = useState([]);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const [attachmentModal, setAttachmentModal] = useState(false);
    const [user, setUser] = useState(null);

    const [quickRepliesModalVisible, setQuickRepliesModalVisible] = useState(false);
    const [addReplyModalVisible, setAddReplyModalVisible] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const [recordingInstance, setRecordingInstance] = useState(null);
    const [recordingModalVisible, setRecordingModalVisible] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);

    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [viewNotesVisible, setViewNotesVisible] = useState(false);
    const [addNoteVisible, setAddNoteVisible] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [playingAudioId, setPlayingAudioId] = useState(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(null);

    const [notes, setNotes] = useState([
        {
            id: 1,
            text: 'Customer prefers light edits.',
            user: {
                name: 'Sohaib',
                avatar: require('../../../assets/Ellipse 18.png'),
            },
            timestamp: 'May 24, 2025 - 09:22 AM',
        },
    ]);
    const route = useRoute();
    const { chat_id, scrollToBottom: navWantsBottom } = route.params || {};
    console.log("chatsid ",chat_id)
    const [messageActionModalVisible, setMessageActionModalVisible] = useState(false);
    const [editMessageModalVisible, setEditMessageModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editMessageText, setEditMessageText] = useState('');

    const [forwardedMessage, setForwardedMessage] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);

    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [questionnaireVisible, setQuestionnaireVisible] = useState(false);

    const navigation = useNavigation();
    const { agent, service, messages: initialMessages = [] } = useRoute().params;
    const [userRole, setUserRole] = useState('');

    const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : []);
    const messagesRef = useRef([]);
    const intervalRef = useRef(null);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [chatDetails, setChatDetails] = useState({});
    const [orderDetails, setOrderDetails] = useState({});
    const [showJumpToBottom, setShowJumpToBottom] = useState(false);
    const [highlightId, setHighlightId] = useState(null);
    const highlightTimerRef = useRef(null);
    const [replyTo, setReplyTo] = useState(null);

    const contentHeightRef = useRef(0);
    const layoutHeightRef = useRef(0);

    // NEW: bottom stickiness flags
    const stickToBottomRef = useRef(true);
    const didInitialAutoScrollRef = useRef(false);

    // Download status is now handled via API is_downloaded field
    const Ticks = ({ read, mine }) => {
        if (!mine) return null;
        return (
            <Ionicons
                name="checkmark-done-outline"
                size={16}
                color={read ? '#4f9cf9' : '#9aa0a6'}
                style={{ marginLeft: 6, marginBottom: -1 }}
            />
        );
    };

    const scrollToBottom = (animated = true) => {
        const list = flatListRef.current;
        if (!list) return;
        const kick = () => { try { list.scrollToEnd({ animated }); } catch { } };
        requestAnimationFrame(() => {
            kick(); setTimeout(kick, 0); setTimeout(kick, 80); setTimeout(kick, 200);
        });
    };

    const handleScroll = (e) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const nearBottom = contentOffset.y + layoutMeasurement.height >= (contentSize.height - 24);
        stickToBottomRef.current = nearBottom;
        setShowJumpToBottom(!nearBottom);
    };

    // one-time jump after first load (after interactions/layout settle)
    useEffect(() => {
        if (isMessagesLoading || didInitialAutoScrollRef.current || !messages.length) return;
        InteractionManager.runAfterInteractions(() => {
            scrollToBottom(false);
            didInitialAutoScrollRef.current = true;
        });
    }, [isMessagesLoading, messages.length]);

    // keep pinned to bottom when new messages arrive and we didn't scroll up
    useEffect(() => {
        if (!isMessagesLoading && stickToBottomRef.current && messages.length) {
            scrollToBottom(true);
        }
    }, [messages.length, isMessagesLoading]);

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
    useEffect(() => {
        fetchReplies();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.9,
        });

        if (result.canceled) {
            setAttachmentModal(false);
            return;
        }

        const groupId = Date.now().toString();
        const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        const optimisticItems = result.assets.map((asset) => {
            const isVideo =
                asset.type === 'video' || (asset.mimeType || '').startsWith('video/');

            const localId = `local-${asset.assetId || asset.fileName || asset.uri}-${Math.random()}`;

            return {
                id: localId,
                localId,
                local: true,
                status: 'uploading',
                uploadProgress: 0,
                sender: user?.id,
                type: isVideo ? 'video' : 'image',
                image: isVideo ? null : asset.uri,
                video: isVideo ? asset.uri : null,
                time,
                groupId,
            };
        });

        setMessages((prev) => [...prev, ...optimisticItems]);
        messagesRef.current = [...messagesRef.current, ...optimisticItems];

        await Promise.all(
            result.assets.map(async (asset, idx) => {
                const optimistic = optimisticItems[idx];
                const isVideo =
                    asset.type === 'video' || (asset.mimeType || '').startsWith('video/');

                const fileType = asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg');
                const fileName =
                    asset.fileName ||
                    `${isVideo ? 'video' : 'photo'}_${Date.now()}_${idx}.${isVideo ? 'mp4' : 'jpg'}`;

                const onProgress = (p) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === optimistic.localId ? { ...m, uploadProgress: p } : m
                        )
                    );
                    messagesRef.current = messagesRef.current.map((m) =>
                        m.id === optimistic.localId ? { ...m, uploadProgress: p } : m
                    );
                };

                const res = await sendFileMessage({
                    fileUri: asset.uri,
                    fileName,
                    fileType,
                    messageType: isVideo ? 'video' : 'image',
                    onProgress,
                });

                if (res.ok) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === optimistic.localId
                                ? {
                                    ...m,
                                    id: res.id,
                                    local: false,
                                    status: 'sent',
                                    uploadProgress: 1,
                                    image: isVideo ? null : (res.fileUrl || m.image),
                                    video: isVideo ? (res.fileUrl || m.video) : null,
                                }
                                : m
                        )
                    );

                    messagesRef.current = messagesRef.current.map((m) =>
                        m.id === optimistic.localId
                            ? {
                                ...m,
                                id: res.id,
                                local: false,
                                status: 'sent',
                                uploadProgress: 1,
                                image: isVideo ? null : (res.fileUrl || m.image),
                                video: isVideo ? (res.fileUrl || m.video) : null,
                            }
                            : m
                    );
                } else {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === optimistic.localId ? { ...m, status: 'failed' } : m
                        )
                    );
                    messagesRef.current = messagesRef.current.map((m) =>
                        m.id === optimistic.localId ? { ...m, status: 'failed' } : m
                    );
                }
            })
        );

        setAttachmentModal(false);
    };

    const reconcileMessages = (prev, incoming) => {
        const prevMap = new Map();
        prev.forEach(m => prevMap.set(String(m.id), m));

        incoming.forEach(m => {
            const id = String(m.id);
            const prevMsg = prevMap.get(id) || {};
            prevMap.set(id, { ...prevMsg, ...m, local: false, status: 'sent' });
        });

        const incomingIds = new Set(incoming.map(m => String(m.id)));
        const systemOrTemp = prev.filter(m => m?.type === 'system' || String(m?.id).startsWith('temp-'));
        const canonical = incoming.map(m => prevMap.get(String(m.id)));
        return [...systemOrTemp, ...canonical];
    };

    const pickDocument = async () => {
        try {
            setAttachmentModal(false);

            const result = await DocumentPicker.getDocumentAsync({
                multiple: true,
                copyToCacheDirectory: true,
                type: '*/*',
            });
            if (!result || result.canceled) return;

            const assets = Array.isArray(result.assets) ? result.assets : [result];

            const groupId = Date.now().toString();
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            const optimisticItems = assets.map((asset, idx) => {
                const mime = (asset.mimeType || '').toLowerCase();
                const isImage = mime.startsWith('image/');
                const isVideo = mime.startsWith('video/');

                const localId = `local-doc-${asset.name || asset.uri}-${idx}-${Math.random()}`;

                if (isImage) {
                    return {
                        id: localId,
                        localId,
                        local: true,
                        status: 'uploading',
                        uploadProgress: 0,
                        sender: user?.id,
                        type: 'image',
                        image: asset.uri,
                        video: null,
                        file: null,
                        name: asset.name || `photo_${Date.now()}_${idx}.jpg`,
                        time,
                        groupId,
                    };
                }
                if (isVideo) {
                    return {
                        id: localId,
                        localId,
                        local: true,
                        status: 'uploading',
                        uploadProgress: 0,
                        sender: user?.id,
                        type: 'video',
                        image: null,
                        video: asset.uri,
                        file: null,
                        name: asset.name || `video_${Date.now()}_${idx}.mp4`,
                        time,
                        groupId,
                    };
                }
                return {
                    id: localId,
                    localId,
                    local: true,
                    status: 'uploading',
                    uploadProgress: 0,
                    sender: user?.id,
                    type: 'file',
                    file: asset.uri,
                    image: null,
                    video: null,
                    name: asset.name || `file_${Date.now()}_${idx}`,
                    time,
                    groupId,
                };
            });

            setMessages((prev) => [...prev, ...optimisticItems]);
            messagesRef.current = [...messagesRef.current, ...optimisticItems];

            await Promise.all(
                assets.map(async (asset, idx) => {
                    const optimistic = optimisticItems[idx];

                    const mime = (asset.mimeType || '').toLowerCase();
                    const isImage = mime.startsWith('image/');
                    const isVideo = mime.startsWith('video/');

                    const messageType = isImage ? 'image' : isVideo ? 'video' : 'file';
                    const defaultExt = isImage ? 'jpg' : isVideo ? 'mp4' : 'bin';
                    const fileType = mime || (isImage ? 'image/jpeg' : isVideo ? 'video/mp4' : 'application/octet-stream');

                    const fileName =
                        asset.name ||
                        `${messageType}_${Date.now()}_${idx}.${defaultExt}`;

                    const onProgress = (p) => {
                        setMessages((prev) =>
                            prev.map((m) => (m.id === optimistic.localId ? { ...m, uploadProgress: p } : m))
                        );
                        messagesRef.current = messagesRef.current.map((m) =>
                            m.id === optimistic.localId ? { ...m, uploadProgress: p } : m
                        );
                    };

                    const res = await sendFileMessage({
                        fileUri: asset.uri,
                        fileName,
                        fileType,
                        messageType,
                        onProgress,
                    });

                    if (res.ok) {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === optimistic.localId
                                    ? {
                                        ...m,
                                        id: res.id,
                                        local: false,
                                        status: 'sent',
                                        uploadProgress: 1,
                                        image: messageType === 'image' ? (res.fileUrl || m.image) : null,
                                        video: messageType === 'video' ? (res.fileUrl || m.video) : null,
                                        file: messageType === 'file' ? (res.fileUrl || m.file) : null,
                                    }
                                    : m
                            )
                        );

                        messagesRef.current = messagesRef.current.map((m) =>
                            m.id === optimistic.localId
                                ? {
                                    ...m,
                                    id: res.id,
                                    local: false,
                                    status: 'sent',
                                    uploadProgress: 1,
                                    image: messageType === 'image' ? (res.fileUrl || m.image) : null,
                                    video: messageType === 'video' ? (res.fileUrl || m.video) : null,
                                    file: messageType === 'file' ? (res.fileUrl || m.file) : null,
                                }
                                : m
                        );
                    } else {
                        setMessages((prev) =>
                            prev.map((m) => (m.id === optimistic.localId ? { ...m, status: 'failed' } : m))
                        );
                        messagesRef.current = messagesRef.current.map((m) =>
                            m.id === optimistic.localId ? { ...m, status: 'failed' } : m
                        );
                    }
                })
            );
        } catch (e) {
            console.log('Document pick/send error:', e);
            alert('Failed to send document(s).');
        }
    };

    const isSingleImageMessage = (msg) => {
        if (!msg || msg.type !== 'image') return false;
        if (!msg.groupId) return true;
        const count = messages.filter(m => m.type === 'image' && m.groupId === msg.groupId).length;
        return count <= 1;
    };
    const getFilenameFromUri = (uri, fallback = 'image.jpg') => {
        try {
            const u = decodeURI(uri);
            const name = u.split('?')[0].split('/').pop();
            if (!name) return fallback;
            return /\.[a-z0-9]+$/i.test(name) ? name : `${name}.jpg`;
        } catch {
            return fallback;
        }
    };
    const getExtFromUri = (uri, fallback = 'jpg') => {
        try {
            const clean = uri.split('?')[0];
            const ext = clean.split('.').pop();
            return (ext && ext.length <= 5) ? ext : fallback;
        } catch { return fallback; }
    };
    // helper (top of file or above render return)
const formatNaira = (v) => {
  const num = Number(v ?? 0);
  try {
    return num.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  } catch {
    // Fallback if Intl not available on some Androids
    return `₦${Math.round(num).toLocaleString()}`;
  }
};

    const downloadImageToGallery = async (uri, filenameHint = 'media', messageId = null) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission required to save to your gallery.');
                return;
            }
            let localUri = uri;
            if (!uri.startsWith('file://')) {
                const filename = getFilenameFromUri(uri, `image_${Date.now()}.jpg`);
                const ext = getExtFromUri(uri, 'jpg');
                const target = FileSystem.documentDirectory + `${filenameHint}.${ext}`;
                const res = await FileSystem.downloadAsync(uri, target);
                localUri = res.uri;
            }
            await MediaLibrary.saveToLibraryAsync(localUri);
            
            // Call API to track download
            if (messageId) {
                try {
                    const token = await AsyncStorage.getItem('token');
                    await axios.post(API.DOWNLOADED(messageId), {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                    });
                    
                    // Update local state to show checkmark immediately
                    setMessages(prev => prev.map(msg => 
                        msg.id === messageId 
                            ? { ...msg, is_downloaded: true }
                            : msg
                    ));
                } catch (apiError) {
                    console.log('Download tracking API error:', apiError);
                    // Don't show error to user, just log it
                }
            }
        } catch (e) {
            console.log('Download error:', e);
            alert('Failed to save.');
        }
    };

    const messagesQuery = useQuery({
        queryKey: ['chat-messages', chat_id],
        queryFn: async ({ signal }) => {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(API.GET_CHAT_MESSAGES(chat_id), {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                signal,
                timeout: 12000,
            });
            return res.data;
        },
        refetchInterval: 1200,
        refetchIntervalInBackground: true,
        staleTime: 500,
        gcTime: 5 * 60 * 1000,
        select: (data) => {
            // console.log('Fetched messages:', data?.d);
            if (data?.status !== 'success') return { order: null, messages: [] };
            const fetchedMessages = data?.data?.messages ?? [];
            console.log('Fetched messages count:', fetchedMessages);
            const order = data?.data?.order ?? null;
            const formatted = fetchedMessages.map((msg) => ({
                id: String(msg.id),
                sender: msg.sender_id,
                text: msg.message || '',
                image: msg.type === 'image' ? msg.file : null,
                file: msg.type === 'file' ? msg.file : null,
                audio: msg.type === 'voice' ? msg.file : null,
                video: msg.type === 'video' ? msg.file : null,
                type: msg.type || 'text',
                is_deleted: msg.is_deleted || false,
                is_edited: msg.is_edited || false,
                is_downloaded: msg.is_downloaded || false,
                time: new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit', hour12: true,
                }),
                delivered: true,
                read: Boolean(msg.is_read || msg.read_at),
                reply_to_id: msg.reply_to_id || null,
                reply_preview: msg.reply_preview || msg.reply_to_text || null,
                payment_order:msg.payment_order || null,
                isForward: msg.is_forwarded,
            }));

            return { order, messages: formatted };
        },
        onError: (err) => {
            console.log('❌ Fetch messages failed:', err?.message || err);
        },
    });

    useEffect(() => {
        const data = messagesQuery.data;
        if (!data) return;

        setOrderDetails(data.order);

        setMessages((prev) => {
            const next = reconcileMessages(prev, data.messages);
            messagesRef.current = next;
            return next;
        });

        if (isMessagesLoading) setIsMessagesLoading(false);
    }, [messagesQuery.data]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const token = await AsyncStorage.getItem('token');
        setSendingMessage(true);

        const tempId = `temp-${Date.now()}`;
        const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        const optimisticMsg = {
            id: tempId,
            sender: user?.id,
            text: inputMessage,
            type: 'text',
            time,
            pending: true,
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setInputMessage('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

        try {
            const formData = new FormData();
            formData.append('chat_id', chat_id);
            formData.append('type', 'text');
            formData.append('message', optimisticMsg.text);
            formData.append('is_forwarded', '');
            formData.append('duration', '');
            formData.append('reply_to_id', replyTo?.id ?? '');

            await axios.post(API.SEND_MESSAGE, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 15000,
            });

            setMessages(prev => prev.filter(m => m.id !== tempId));
            setReplyTo(null);
            messagesQuery.refetch();

        } catch (error) {
            console.error('Send message error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to send message');
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSendingMessage(false);
        }
    };

    const sendQuestionnaire = async (chat_id, user_id) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const assignPayload = { chat_id, user_id };

            const response = await axios.post(
                API.ASSIGN_QUESTIONNAIRE,
                assignPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Questionnaire assigned:", response.data);
            alert("✅ Questionnaire sent successfully.");
        } catch (error) {
            console.error("❌ Failed to assign questionnaire:", error.response?.data || error.message);
            alert("❌ Failed to send questionnaire.");
        }
    };

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(API.GET_CHAT_MESSAGES(chat_id), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.data.status === 'success') {
                const fetchedMessages = response?.data?.data?.messages;
                const order = response.data.data.order;
                setOrderDetails(order);

                const formatted = fetchedMessages.map((msg) => ({
                    id: msg.id,
                    sender: msg.sender_id,
                    text: msg.message || '',
                    image: msg.type === 'image' ? msg.file : null,
                    file: msg.type === 'file' ? msg.file : null,
                    audio: msg.type === 'voice' ? msg.file : null,
                    type: msg.type,
                    video: msg.type === 'video' ? msg.file : null,
                    is_deleted: msg.is_deleted || false,
                    is_edited: msg.is_edited || false,
                    is_downloaded: msg.is_downloaded || false,
                    delivered: true,
                    read: Boolean(msg.is_read || msg.read_at),
                    reply_to_id: msg.reply_to_id || null,
                    reply_preview: msg.reply_preview || msg.reply_to_text || null,
                    time: new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }),
                }));

                const oldIds = messagesRef.current.map((m) => m.id).join(',');
                const newIds = formatted.map((m) => m.id).join(',');

                if (oldIds !== newIds) {
                    messagesRef.current = formatted;
                    setMessages((prev) => {
                        const sysOrTemp = prev.filter((m) => m?.type === 'system' || String(m?.id).startsWith('temp-'));
                        return [...sysOrTemp, ...formatted];
                    });
                }
                if (!hasLoadedOnce) {
                    setHasLoadedOnce(true);
                    setIsMessagesLoading(false);
                }
            }
        } catch (error) {
            console.error('Fetching failed', error);
            if (!hasLoadedOnce) setIsMessagesLoading(false);
        }
    };
    useEffect(() => {
        const init = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                setUserRole(parsed.role);
            }
        };
        init();

        if (!hasLoadedOnce) {
            const joinMsg = {
                id: `agent-join-${Date.now()}`,
                type: 'system',
                text: `Agent ${agent?.name} has joined the chat`,
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }),
            };
            setMessages((prev) => [joinMsg, ...prev]);
            setHasLoadedOnce(true);
        }
    }, []);

    const itemOffsetsRef = useRef({});
    const pendingScrollRef = useRef(null);
    const scrollToMessage = useCallback((id) => {
        const key = String(id);
        const doHighlight = () => {
            setHighlightId(key);
            if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
            highlightTimerRef.current = setTimeout(() => setHighlightId(null), 2500);
        };

        // First try to find the message index
        const idx = messages.findIndex(m => String(m.id) === key);
        if (idx >= 0) {
            // Use scrollToIndex for more reliable scrolling
            try {
                flatListRef.current?.scrollToIndex({ 
                    index: idx, 
                    animated: true, 
                    viewPosition: 0.2 // Position message in upper portion of screen
                });
                // Highlight after scroll animation completes
                setTimeout(doHighlight, 500);
            } catch (error) {
                console.log('scrollToIndex failed, trying scrollToOffset:', error);
                // Fallback to scrollToOffset if scrollToIndex fails
                const y = itemOffsetsRef.current[key];
                if (typeof y === 'number') {
                    flatListRef.current?.scrollToOffset({ 
                        offset: Math.max(y - 120, 0), 
                        animated: true 
                    });
                    setTimeout(doHighlight, 500);
                } else {
                    // Last resort: scroll to approximate position
                    const approximateOffset = idx * 100; // Rough estimate
                    flatListRef.current?.scrollToOffset({ 
                        offset: approximateOffset, 
                        animated: true 
                    });
                    setTimeout(doHighlight, 500);
                }
            }
        } else {
            console.log('Message not found for ID:', key);
        }
    }, [messages]);

   const TimeWithTicks = ({ item, mine }) => {
  const delivered = !!item.delivered;
  const read = !!item.read;

  let icon = 'checkmark';
  if (delivered) icon = 'checkmark-done-outline';
  if (read) icon = 'checkmark-done';

  // decide color
  const iconColor = read
    ? '#1DA1F2' // blue for read
    : mine
    ? '#fff'    // white if it's mine
    : '#666';   // grey if it's not mine

  return (
    <View style={[styles.metaRow, mine ? styles.metaRight : styles.metaLeft]}>
      <Text style={[styles.metaTime, mine ? styles.timeRight : styles.timeLeft]}>
        {item.time}
      </Text>
      <Ionicons
        name={icon}
        size={14}
        color={iconColor}
        style={{ marginLeft: 6 }}
      />
    </View>
  );
};


    const sendFileMessage = async ({
        fileUri,
        fileName,
        fileType,
        messageType = 'image',
        duration = '',
        onProgress,
    }) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const formData = new FormData();
            formData.append('chat_id', chat_id);
            formData.append('type', messageType);
            formData.append('message', '');
            formData.append('is_forwarded', '');
            formData.append('duration', duration);

            formData.append('file', {
                uri: fileUri,
                name: fileName,
                type: fileType,
            });

            const response = await axios.post(API.SEND_MESSAGE, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const fraction = progressEvent.loaded / progressEvent.total;
                        onProgress(fraction);
                    }
                }
            });
            const serverMsg = response?.data?.data || {};
            return {
                ok: true,
                id: serverMsg?.id,
                fileUrl: serverMsg?.file,
                raw: serverMsg,
            };
        } catch (error) {
            console.error('❌ Error sending file message:', error?.response?.data || error.message);
            return { ok: false, error };
        }
    };

    const openLocalFile = async (localUri, ext) => {
        if (Platform.OS === 'ios') {
            return Sharing.shareAsync(localUri);
        }
        const mime =
            (Mime?.lookup && Mime.lookup(ext)) ||
            ({
                pdf: 'application/pdf',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ppt: 'application/vnd.ms-powerpoint',
                pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                txt: 'text/plain',
                csv: 'text/csv',
                zip: 'application/zip',
                rar: 'application/vnd.rar',
            }[ext.toLowerCase()] || 'application/octet-stream');

        const contentUri = await FileSystem.getContentUriAsync(localUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            flags: 1,
            type: mime,
        });
    };

    const openDocument = async (uri, name = 'document') => {
        try {
            if (!uri) return;
            const ext = getExtFromUri(uri, 'pdf');
            const safeName = (name || `file_${Date.now()}`).replace(/[^\w.\-]+/g, '_');
            const target = FileSystem.documentDirectory + `${safeName}.${ext}`;

            let localUri = uri;
            if (!uri.startsWith('file://')) {
                const dl = await FileSystem.downloadAsync(uri, target);
                localUri = dl.uri;
            }
            await openLocalFile(localUri, ext);
        } catch (e) {
            console.log('openDocument error:', e);
            alert('Could not open document.');
        }
    };

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Microphone permission is required to record audio.');
                return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                staysActiveInBackground: false,
            });
            if (recordingInstance) {
                try {
                    const existingStatus = await recordingInstance.getStatusAsync();
                    if (existingStatus.isRecording || !existingStatus.isDoneRecording) {
                        await recordingInstance.stopAndUnloadAsync();
                    }
                    await recordingInstance.unloadAsync();
                } catch (cleanupErr) {
                    console.warn("Cleanup of old recording failed:", cleanupErr.message);
                }
                setRecordingInstance(null);
            }
            await new Promise((resolve) => setTimeout(resolve, 50));

            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await newRecording.startAsync();

            setRecordingInstance(newRecording);
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error.message || error);
            alert('Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recordingInstance) return;

        try {
            const status = await recordingInstance.getStatusAsync();
            if (status.isDoneRecording || !status.isRecording) return;

            await recordingInstance.stopAndUnloadAsync();
            const uri = recordingInstance.getURI();

            setAudioUri(uri);
            setRecordingInstance(null);
            setIsRecording(false);
            setRecordingModalVisible(true);
        } catch (error) {
            console.error('Failed to stop recording:', error);
            setRecordingInstance(null);
            setIsRecording(false);
        }
    };

    const sendAudioMessage = async (uri) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const fileName = `voice_${Date.now()}.m4a`;
            const formData = new FormData();
            formData.append('chat_id', chat_id);
            formData.append('type', 'voice');
            formData.append('message', '');
            formData.append('is_forwarded', '');
            formData.append('duration', '');

            formData.append('file', {
                uri,
                name: fileName,
                type: 'audio/m4a',
            });

            const response = await axios.post(API.SEND_MESSAGE, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            const time = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            const newMsg = {
                id: Date.now().toString(),
                sender: user?.id,
                type: 'voice',
                audio: response.data?.data?.file || uri,
                time,
            };

            setMessages(prev => [...prev, newMsg]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

            messagesQuery.refetch();
        } catch (error) {
            console.error('Error sending voice message:', error.response?.data || error.message);
            alert('Failed to send voice message');
        }
    };

    const saveQuickReply = () => {
        if (!newReply.trim()) return;
        const updatedReplies = [...quickReplies];
        if (editIndex !== null) {
            updatedReplies[editIndex] = newReply;
        } else {
            updatedReplies.push(newReply);
        }
        setQuickReplies(updatedReplies);
        setNewReply('');
        setEditIndex(null);
        setAddReplyModalVisible(false);
    };

    const playAudio = async (uri, id) => {
        try {
            if (playingAudioId === id && isAudioPlaying && audioPlayer) {
                await audioPlayer.pauseAsync();
                setIsAudioPlaying(false);
                return;
            }
            if (playingAudioId === id && !isAudioPlaying && audioPlayer) {
                await audioPlayer.playAsync();
                setIsAudioPlaying(true);
                return;
            }
            if (audioPlayer) {
                await audioPlayer.stopAsync();
                await audioPlayer.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setPlayingAudioId(null);
                    setIsAudioPlaying(false);
                }
            });

            setAudioPlayer(sound);
            setPlayingAudioId(id);
            setIsAudioPlaying(true);
        } catch (err) {
            console.error('Failed to play audio', err);
            alert('Could not play audio');
            setPlayingAudioId(null);
            setIsAudioPlaying(false);
        }
    };
    const [progressData, setProgressData] = useState({ progress: 0, completed_sections: 0 });
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await axios.get(`${BASE_URL}/questionnaire/progress/${chat_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res?.data?.status === 'success') {
                    setProgressData(res.data);
                }
            } catch (err) {
                console.error(`Error fetching progress for chat ${chat_id}`, err);
            }
        };

        fetchProgress();
    }, []);

    const launchPayment = () => {
        navigation.navigate('FlutterwaveWebView', {
            amount: parseFloat(orderDetails?.total_amount),
            order_id: orderDetails?.id,
            chat_id: chat_id,
        });
    };
    const handleLongPress = (item) => {
        setSelectedMessage(item);
        setMessageActionModalVisible(true);
    };

    const openChatDetails = () => {
        navigation.navigate('ChatDetails', {
            chat_id,
            myRole: userRole || user?.role || 'user',
        });
    };
    const [videoPreview, setVideoPreview] = useState({ visible: false, uri: null });

    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === user?.id;
        if (item.type === 'image') {
            const isMyMsgImage = item.sender === user?.id;

            return (
                <View
                    style={[styles.msgRow, isMyMsgImage ? styles.rightMsg : styles.leftMsg]}
                    onLayout={(e) => {
                        const y = e.nativeEvent.layout.y;
                        itemOffsetsRef.current[String(item.id)] = y;
                    }}
                >
                    <View
                        style={[
                            {
                                paddingBottom: 20,
                                backgroundColor: isMyMsgImage ? '#992C55' : '#E7E7E7',
                                borderRadius: 10,
                                position: 'relative'
                            },
                            highlightId === String(item.id) && styles.highlightedMessage
                        ]}
                    >
                        {item.reply_to_id && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => scrollToMessage(item.reply_to_id)}
                                style={{
                                    backgroundColor: isMyMsgImage ? 'rgba(255,255,255,0.12)' : '#eee',
                                    padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                    borderRadius: 8, marginBottom: 6
                                }}
                            >
                                <ThemedText numberOfLines={1} style={{ fontSize: 12, color: isMyMsgImage ? '#fff' : '#444' }}>
                                    {item.reply_preview || 'Replied message'}
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        <Pressable
                            onPress={() => { setPreviewImages([item]); setImagePreviewVisible(true); }}
                            onLongPress={() => { setSelectedMessage(item); setMessageActionModalVisible(true); }}
                            delayLongPress={300}
                            hitSlop={8}
                            android_ripple={{ foreground: true }}
                            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
                        >
                            <View>
                                <Image
                                    source={{ uri: item.image }}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 10,
                                        borderWidth: 5,
                                        borderColor: '#992c55',
                                    }}
                                    resizeMode="cover"
                                />

                                <TouchableOpacity
                                    onPress={() => downloadImageToGallery(item.image, `image_${Date.now()}`, item.id)}
                                    style={styles.mediaDownloadBtn}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons
                                        name={item.is_downloaded ? 'checkmark-outline' : 'download-outline'}
                                        size={18}
                                        color="#fff"
                                    />
                                </TouchableOpacity>

                                {item.status === 'uploading' && (
                                    <View style={styles.uploadOverlay}>
                                        <Text style={styles.uploadText}>
                                            {Math.round((item.uploadProgress || 0) * 100)}%
                                        </Text>
                                    </View>
                                )}

                                <View style={{ position: 'absolute', right: 8, bottom: 6 }}>
                                    <TimeWithTicks item={item} mine={isMyMsgImage} />
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>
            );
        }

        if (item.type === 'document' || item.type === 'file') {
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setForwardedMessage(item);
                        navigation.navigate('ForwardChat', { forwardMessage: item });
                    }}
                >
                    <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}
                        onLayout={(e) => {
                            const y = e.nativeEvent.layout.y;
                            itemOffsetsRef.current[String(item.id)] = y;
                        }}>
                        {item.reply_to_id && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => scrollToMessage(item.reply_to_id)}
                                style={{
                                    backgroundColor: (item.sender === user?.id) ? 'rgba(255,255,255,0.12)' : '#eee',
                                    padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                    borderRadius: 8, marginBottom: 6
                                }}
                            >
                                <ThemedText numberOfLines={1} style={{ fontSize: 12, color: (item.sender === user?.id) ? '#fff' : '#444' }}>
                                    {item.reply_preview || 'Replied message'}
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={() => openDocument(item.file || item.document, item.name || `file_${item.id}`)}>
                            <View style={[
                                { padding: 10, backgroundColor: '#eee', borderRadius: 10 },
                                highlightId === String(item.id) && styles.highlightedMessage
                            ]}>
                                <Ionicons name="document-text-outline" size={24} color="#555" />
                                <ThemedText>{item.name}</ThemedText>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <TimeWithTicks item={item} mine={isMyMessage} />
                </TouchableOpacity>
            );
        }

        if (item.type === 'voice') {
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setForwardedMessage(item);
                        navigation.navigate('ForwardChat', { forwardMessage: item });
                    }}
                >
                    <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}
                        onLayout={(e) => {
                            const y = e.nativeEvent.layout.y;
                            itemOffsetsRef.current[String(item.id)] = y;
                        }}>
                        {item.reply_to_id && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => scrollToMessage(item.reply_to_id)}
                                style={{
                                    backgroundColor: (item.sender === user?.id) ? 'rgba(255,255,255,0.12)' : '#eee',
                                    padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                    borderRadius: 8, marginBottom: 6
                                }}
                            >
                                <ThemedText numberOfLines={1} style={{ fontSize: 12, color: (item.sender === user?.id) ? '#fff' : '#444' }}>
                                    {item.reply_preview || 'Replied message'}
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        <View style={[
                            isMyMessage ? styles.myBubble : styles.otherBubble,
                            highlightId === String(item.id) && styles.highlightedMessage
                        ]}>
                            <TouchableOpacity onPress={() => playAudio(item.audio, item.id)}>
                                <Ionicons
                                    name={playingAudioId === item.id && isAudioPlaying ? 'pause' : 'play'}
                                    size={24}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TimeWithTicks item={item} mine={isMyMessage} />
                </TouchableOpacity>
            );
        }

   if (item.type === 'payment') {
  const po = (item.isForward && item.payment_order) ? item.payment_order : orderDetails;
  const isPaid = po?.payment_status === 'success';

  return (
    <TouchableOpacity
      onLongPress={() => {
        setForwardedMessage(item);
        navigation.navigate('ForwardChat', { forwardMessage: item });
      }}
    >
      <View style={[styles.msgRow, item.sender === user?.id ? styles.rightMsg : styles.leftMsg]}
        onLayout={(e) => {
          const y = e.nativeEvent.layout.y;
          itemOffsetsRef.current[String(item.id)] = y;
        }}
      >
        {item.reply_to_id && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => scrollToMessage(item.reply_to_id)}
            style={{
              backgroundColor: (item.sender === user?.id) ? 'rgba(255,255,255,0.12)' : '#eee',
              padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
              borderRadius: 8, marginBottom: 6
            }}
          >
            <ThemedText numberOfLines={1} style={{ fontSize: 12, color: (item.sender === user?.id) ? '#fff' : '#444' }}>
              {item.reply_preview || 'Replied message'}
            </ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Ionicons name="card-outline" size={20} color="#fff" />
            <ThemedText style={styles.paymentTitle}>Payment Order</ThemedText>

            <View style={styles.paymentStatus}>
              <ThemedText
                style={[
                  styles.paymentStatusText,
                  isPaid && { color: 'green' },
                ]}
              >
                {po?.payment_status ?? '—'}
              </ThemedText>
            </View>
          </View>

          <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 10, elevation: 1, zIndex: 1, marginTop: -20 }}>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>No of photos</Text>
              <Text>{po?.no_of_photos ?? '—'}</Text>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.label}>Category</Text>
              <Text>{po?.service_type ?? '—'}</Text>
            </View>

            <View style={[styles.paymentRow, { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
              <Text style={styles.label}>Amount</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {formatNaira(po?.total_amount)}
              </Text>
            </View>
          </View>

    {!item.isForward &&       <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
            {/* Customer actions */}
            {userRole === 'user' && !isPaid && (
              <TouchableOpacity
                onPress={launchPayment}
                style={{
                  backgroundColor: '#992C55',
                  paddingVertical: 14,
                  paddingHorizontal: 100,
                  borderRadius: 30,
                }}
              >
                <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Make Payment</ThemedText>
              </TouchableOpacity>
            )}

            {/* Support actions */}
            {userRole === 'support' && !isPaid && (
              <>
                <TouchableOpacity
                //   onPress={refreshOrderStatus /* wire this */}
                  style={{
                    backgroundColor: '#992C55',
                    paddingVertical: 15,
                    paddingHorizontal: 60,
                    borderRadius: 30,
                  }}
                >
                  <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Refresh</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                //   onPress={cancelOrder /* wire this */}
                  style={{
                    backgroundColor: '#ccc',
                    paddingVertical: 15,
                    paddingHorizontal: 60,
                    borderRadius: 30,
                  }}
                >
                  <ThemedText style={{ color: '#000', fontWeight: '600' }}>Cancel</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>}
        </View>
      </View>
    </TouchableOpacity>
  );
}


        if (item.type === 'system') {
            const isJoin = item.subtype === 'agent-join';
            return (
                <View style={{ alignItems: 'center', marginVertical: 6 }} onLayout={(e) => {
                    const y = e.nativeEvent.layout.y;
                    itemOffsetsRef.current[String(item.id)] = y;
                }}>
                    {item.reply_to_id && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => scrollToMessage(item.reply_to_id)}
                            style={{
                                backgroundColor: (item.sender === user?.id) ? 'rgba(255,255,255,0.12)' : '#eee',
                                padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                borderRadius: 8, marginBottom: 6
                            }}
                        >
                            <ThemedText numberOfLines={1} style={{ fontSize: 12, color: (item.sender === user?.id) ? '#fff' : '#444' }}>
                                {item.reply_preview || 'Replied message'}
                            </ThemedText>
                        </TouchableOpacity>
                    )}

                    <View style={{
                        backgroundColor: isJoin ? '#F1E6EB' : '#F1E6EB',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: isJoin ? 1 : 0,
                        borderColor: isJoin ? '#992C55' : '#992C55',
                    }}>
                        <Text style={{
                            color: isJoin ? '#992C55' : '#992C55',
                            fontSize: 12,
                            fontWeight: '600',
                        }}>
                            {item.text}
                        </Text>
                    </View>
                </View>
            );
        }

        if (item.type === 'questionnaire') {
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setForwardedMessage(item);
                        navigation.navigate('ForwardChat', { forwardMessage: item });
                    }}
                >
                    <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]} onLayout={(e) => {
                        const y = e.nativeEvent.layout.y;
                        itemOffsetsRef.current[String(item.id)] = y;
                    }}>
                        {item.reply_to_id && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => scrollToMessage(item.reply_to_id)}
                                style={{
                                    backgroundColor: (item.sender === user?.id) ? 'rgba(255,255,255,0.12)' : '#eee',
                                    padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                    borderRadius: 8, marginBottom: 6
                                }}
                            >
                                <ThemedText numberOfLines={1} style={{ fontSize: 12, color: (item.sender === user?.id) ? '#fff' : '#444' }}>
                                    {item.reply_preview || 'Replied message'}
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        <View style={styles.questionnaireCard}>
                            <View style={styles.qHeader}>
                                <ThemedText style={styles.qHeaderTitle}>📋 Questionnaire</ThemedText>
                                <View style={styles.statusBadge}>
                                    <ThemedText style={styles.statusBadgeText}>
                                        {progressData.progress === 100 ? 'Completed' : `${progressData.progress}%`}
                                    </ThemedText>
                                </View>
                            </View>

                            <ThemedText style={styles.qHeaderDesc}>
                                It consists of 3 parts, select the options that best suit the service you want
                            </ThemedText>

                            <View style={styles.qListOuter}>
                                <View style={styles.qList}>
                                    {(item.categories?.length ? item.categories : ['Face', 'Skin', 'Change in body size']).map(
                                        (label, i, arr) => {
                                            const done =
                                                (i === 0 && progressData.completed_sections >= 1) ||
                                                (i === 1 && progressData.completed_sections >= 4) ||
                                                (i === 2 && progressData.completed_sections >= 14);

                                            const isLast = i === arr.length - 1;

                                            return (
                                                <View key={i} style={[styles.qRow, !isLast && styles.qRowDivider]}>
                                                    <ThemedText style={styles.qRowLabel}>{label}</ThemedText>
                                                    <ThemedText style={styles.qRowStatus}>{done ? '✅' : '-'}</ThemedText>
                                                </View>
                                            );
                                        }
                                    )}
                                </View>
                            </View>

                            <View style={styles.qBtnRow}>
                                {user?.role === 'user' && progressData.progress < 100 && (
                                    <TouchableOpacity
                                        style={styles.qStartBtn}
                                        onPress={() => {
                                            if (progressData.completed_sections < 1) {
                                                setCurrentCategoryIndex(0);
                                            } else if (progressData.completed_sections < 4) {
                                                setCurrentCategoryIndex(1);
                                            } else {
                                                setCurrentCategoryIndex(2);
                                            }
                                            setQuestionnaireVisible(true);
                                        }}
                                    >
                                        <ThemedText style={styles.qStartBtnText}>Start</ThemedText>
                                    </TouchableOpacity>
                                )}
                                {user?.role == 'support' && (
                                    <TouchableOpacity style={styles.qCloseBtn}>
                                        <ThemedText style={styles.qCloseBtnText}>Close</ThemedText>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        if (item.type === 'video') {
            const mine = item.sender === user?.id;

            return (
                <View
                    style={[styles.msgRow, mine ? styles.rightMsg : styles.leftMsg]}
                    onLayout={(e) => {
                        const y = e.nativeEvent.layout.y;
                        itemOffsetsRef.current[String(item.id)] = y;
                    }}
                >
                    {item.reply_to_id && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => scrollToMessage(item.reply_to_id)}
                            style={{
                                backgroundColor: mine ? 'rgba(255,255,255,0.12)' : '#eee',
                                padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                borderRadius: 8, marginBottom: 6
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <ThemedText numberOfLines={1} style={{ fontSize: 12, color: mine ? '#fff' : '#444', flex: 1 }}>
                                {item.reply_preview || 'Replied message'}
                              </ThemedText>
                              <Ionicons name="arrow-up" size={12} color={mine ? '#fff' : '#666'} style={{ marginLeft: 4 }} />
                            </View>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onLongPress={() => { setSelectedMessage(item); setMessageActionModalVisible(true); }}
                        delayLongPress={300}
                        style={{ position: 'relative' }}
                    >
                        <Video
                            source={{ uri: item.video }}
                            style={{ width: 220, height: 220, borderRadius: 10, backgroundColor: '#000' }}
                            resizeMode="cover"
                            shouldPlay={false}
                            useNativeControls={false}
                            isLooping={false}
                        />

                        <TouchableOpacity
                            onPress={() => item?.video && setVideoPreview({ visible: true, uri: item.video })}
                            style={styles.videoPlayBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="play" size={22} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => downloadImageToGallery(item.video, `video_${Date.now()}`, item.id)}
                            style={styles.mediaDownloadBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons
                                name={item.is_downloaded ? 'checkmark-outline' : 'download-outline'}
                                size={18}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        {item.status === 'uploading' && (
                            <View style={styles.uploadOverlay}>
                                <Text style={styles.uploadText}>
                                    {Math.round((item.uploadProgress || 0) * 100)}%
                                </Text>
                            </View>
                        )}

                        <View style={{ position: 'absolute', right: 8, bottom: 6 }}>
                            <TimeWithTicks item={item} mine={mine} />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <TouchableOpacity
                onLongPress={() => {
                    if (item.is_deleted) return; // Don't show actions for deleted messages
                    setSelectedMessage(item);
                    setMessageActionModalVisible(true);
                }}
            >
                <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}
                    onLayout={(e) => {
                        const y = e.nativeEvent.layout.y;
                        itemOffsetsRef.current[String(item.id)] = y;
                    }}>
                    {item.reply_to_id && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => scrollToMessage(item.reply_to_id)}
                                style={{
                                    backgroundColor: isMyMessage ? 'rgba(153,44,85,0.12)' : '#eee',
                                    padding: 8, borderLeftWidth: 3, borderLeftColor: '#992C55',
                                    borderRadius: 8, marginBottom: 6
                                }}
                            >
                                <ThemedText numberOfLines={1} style={{ fontSize: 12, color: isMyMessage ? '#444' : '#444', flex: 1 }}>
                                    {item.reply_preview || 'Replied message'}
                                </ThemedText>
                                <Ionicons name="arrow-up" size={12} color={isMyMessage ? '#666' : '#666'} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                    )}
                    <View style={[
                        isMyMessage ? styles.myBubble : styles.otherBubble,
                        highlightId === String(item.id) && styles.highlightedMessage
                    ]}>
                        <ThemedText style={[
                            isMyMessage ? styles.msgText : styles.msgTextleft,
                            item.is_deleted && { fontStyle: 'italic', opacity: 0.7 }
                        ]}>
                            {item.is_deleted ? 'This message was deleted' : item.text}
                        </ThemedText>
                        {item.is_edited && !item.is_deleted && (
                            <ThemedText style={{
                                fontSize: 10,
                                color: isMyMessage ? 'rgba(255,255,255,0.7)' : '#666',
                                fontStyle: 'italic',
                                marginTop: 2
                            }}>
                                Edited
                            </ThemedText>
                        )}
                        <TimeWithTicks item={item} mine={isMyMessage} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const updateOrderStatus = async (statusValue) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}/update-order-status`, {
                chat_id,
                status: statusValue,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.data.status === 'success') {
                alert(`✅ Order marked as ${statusValue}`);
                messagesQuery.refetch();
            } else {
                alert('❌ Failed to update status');
            }
        } catch (error) {
            console.error('Update status error:', error.response?.data || error.message);
            alert('❌ Error updating status');
        }
    };

    // Delete message function
    const deleteMessage = async (messageId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(API.DELETE_MESSAGE(messageId), {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.data.status === 'success') {
                // Update local state to mark message as deleted
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, is_deleted: true, text: 'This message was deleted' }
                        : msg
                ));
                messagesQuery.refetch();
            } else {
                alert('Failed to delete message');
            }
        } catch (error) {
            console.error('Delete message error:', error.response?.data || error.message);
            alert('Failed to delete message');
        }
    };

    // Edit message function
    const editMessage = async (messageId, newText) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(API.EDIT_MESSAGE(messageId), {
                message: newText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.data.status === 'success') {
                // Update local state to mark message as edited
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, text: newText, is_edited: true }
                        : msg
                ));
                messagesQuery.refetch();
            } else {
                alert('Failed to edit message');
            }
        } catch (error) {
            console.error('Edit message error:', error.response?.data || error.message);
            alert('Failed to edit message');
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={require('../../../assets/bg.png')}
                    style={styles.background}
                >
                    <View style={styles.container}>
                        {/* Top Bar */}
                        <View style={styles.topBar}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="chevron-back" size={28} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={openChatDetails}
                                activeOpacity={0.85}
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}
                            >
                                <Image source={agent.image} style={styles.agentPic} />
                                <View>
                                    <ThemedText style={styles.agentName}>{agent.name}</ThemedText>
                                    <ThemedText style={styles.online}>Online</ThemedText>
                                </View>
                            </TouchableOpacity>

                            {userRole === 'support' && (
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 'auto', marginRight: 10 }}>
                                    <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {isMessagesLoading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#992C55" />
                            </View>
                        ) : (
                            <FlatList
                                ref={flatListRef}
                                data={messages}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={renderMessage}
                                contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={true}
                                keyboardShouldPersistTaps="handled"
                                style={{ flex: 1 }}
                                initialNumToRender={15}
                                maxToRenderPerBatch={20}
                                windowSize={10}
                                // ⛔ removed getItemLayout (variable-height rows)
                                onScrollToIndexFailed={({ index }) => {
                                    flatListRef.current?.scrollToEnd({ animated: false });
                                    setTimeout(() => {
                                        try {
                                            flatListRef.current?.scrollToIndex?.({ index, animated: true, viewPosition: 0.5 });
                                        } catch { }
                                    }, 60);
                                }}
                                onLayout={(e) => {
                                    layoutHeightRef.current = e.nativeEvent.layout.height;
                                }}
                                onContentSizeChange={(w, h) => {
                                    contentHeightRef.current = h;
                                    if (stickToBottomRef.current) {
                                        scrollToBottom(false);
                                    }
                                }}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                                ListHeaderComponent={
                                    <>
                                        {/* Order Card */}
                                        <View style={styles.orderCardWrapper}>
                                            <View style={styles.orderCardHeader}>
                                                <Ionicons name="bookmarks-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                                                <ThemedText style={styles.orderCardHeaderText}>New Order</ThemedText>
                                            </View>
                                            <View style={styles.orderCardBody}>
                                                <View style={styles.orderInfoRow1}>
                                                    <ThemedText style={styles.orderLabel}>Name</ThemedText>
                                                    <ThemedText style={styles.orderValue}>{user?.name}</ThemedText>
                                                </View>
                                                <View style={styles.orderInfoRow2}>
                                                    <ThemedText style={styles.orderLabel}>Order type</ThemedText>
                                                    <ThemedText style={styles.orderValue}>{orderDetails?.service_type}</ThemedText>
                                                </View>
                                                <View style={styles.orderInfoRow3}>
                                                    <ThemedText style={styles.orderLabel}>Order Status</ThemedText>
                                                    <ThemedText style={styles.orderValue}>{orderDetails?.status}</ThemedText>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                }
                            />
                        )}
                        {/* Jump-to-bottom FAB */}
                        {showJumpToBottom && (
                            <TouchableOpacity
                                onPress={() => { stickToBottomRef.current = true; scrollToBottom(true); }}
                                activeOpacity={0.9}
                                style={{
                                    position: 'absolute',
                                    right: 14,
                                    bottom: 98,
                                    width: 42, height: 42, borderRadius: 21,
                                    alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: '#992C55', elevation: 4
                                }}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons name="chevron-down" size={22} color="#fff" />
                            </TouchableOpacity>
                        )}

                        {showEmojiPicker && (
                            <SafeEmojiPicker
                                onSelect={(emoji) => setInputMessage((prev) => prev + emoji)}
                                height={300}
                                columns={8}
                                itemSize={44}
                            />
                        )}
                        {replyTo && (
                            <View style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f2f2f2', borderTopWidth: 1, borderColor: '#e5e5e5' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="return-up-forward-outline" size={18} color="#992C55" />
                                    <ThemedText style={{ marginLeft: 8, fontWeight: '600', color: '#555' }}>
                                        Replying to
                                    </ThemedText>
                                    <TouchableOpacity onPress={() => setReplyTo(null)} style={{ marginLeft: 'auto' }}>
                                        <Ionicons name="close" size={20} color="#555" />
                                    </TouchableOpacity>
                                </View>
                                <ThemedText numberOfLines={1} style={{ marginTop: 4, color: '#777' }}>
                                    {replyTo.preview}
                                </ThemedText>
                            </View>
                        )}

                        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
                            <View style={styles.inputRow}>
                                <TouchableOpacity style={{ marginTop: 15 }} onPress={() => {
                                    Keyboard.dismiss();
                                    setShowEmojiPicker(prev => !prev);
                                }}>
                                    <Ionicons name="happy-outline" size={26} color="#555" />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Message"
                                    value={inputMessage}
                                    onChangeText={setInputMessage}
                                    onSubmitEditing={sendMessage}
                                    onFocus={() => setShowEmojiPicker(false)}
                                />
                                <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setAttachmentModal(true)}>
                                    <Ionicons name="attach" size={28} color="#555" />
                                </TouchableOpacity>
                                {inputMessage.trim() ? (
                                    <TouchableOpacity
                                        onPress={sendMessage}
                                        style={[styles.sendBtn, sendingMessage && { opacity: 0.5 }]}
                                        disabled={sendingMessage}
                                    >
                                        {sendingMessage ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Ionicons name="send" size={24} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                ) : (
                                    <RecordingButton
                                        isRecording={isRecording}
                                        onStart={startRecording}
                                        onStop={stopRecording}
                                        onLock={() => setRecordingModalVisible(true)}
                                    />
                                )}
                            </View>
                        </SafeAreaView>

                        {userRole === 'support' && (
                            <Modal visible={modalVisible} animationType="slide" transparent>
                                <View style={[styles.modalOverlay, { backgroundColor: '#00000090', }]}>
                                    <View style={[styles.agentOptionsModal, { backgroundColor: "#F5F5F7" }]}>
                                        <View style={styles.modalHeader}>
                                            <ThemedText style={styles.modalTitle}>Options</ThemedText>
                                            <TouchableOpacity style={{ backgroundColor: "#fff", borderRadius: 20, padding: 4 }} onPress={() => setModalVisible(false)}>
                                                <Ionicons name="close" size={24} color="#000" />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.modalItemRow}
                                            onPress={() => {
                                                setModalVisible(false);
                                                setQuickRepliesModalVisible(true);
                                            }}
                                        >
                                            <Ionicons name="sparkles-outline" size={20} color="#000" style={styles.modalIcon} />
                                            <ThemedText style={styles.modalItemText}>Quick Replies</ThemedText>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => navigation.navigate('AgentQuestionnaire', {
                                            chat_id,
                                            user_id: user?.id,
                                        })} style={styles.modalItemRow}>
                                            <Ionicons name="eye-outline" size={20} color="#000" style={styles.modalIcon} />
                                            <ThemedText style={styles.modalItemText}>View Questionnaire</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            sendQuestionnaire(chat_id, user?.id);
                                        }} style={styles.modalItemRow}>
                                            <Ionicons name="paper-plane-outline" size={20} color="#000" style={styles.modalIcon} />
                                            <ThemedText style={styles.modalItemText}>Send Questionnaire</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setModalVisible(false);
                                            setPaymentModalVisible(true);
                                        }} style={styles.modalItemRow}>
                                            <Ionicons name="calendar-outline" size={20} color="#000" style={styles.modalIcon} />
                                            <ThemedText style={styles.modalItemText}>Create Payment Order</ThemedText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalVisible(false);
                                                setViewNotesVisible(true);
                                            }}
                                            style={styles.modalItemRow}
                                        >
                                            <Ionicons name="document-text-outline" size={20} color="#000" style={styles.modalIcon} />
                                            <ThemedText style={styles.modalItemText}>
                                                View Notes <ThemedText style={{ color: 'red' }}>●</ThemedText>
                                            </ThemedText>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.modalItemRow}>
                                            <Ionicons name="warning-outline" size={20} color="red" style={styles.modalIcon} />
                                            <ThemedText style={[styles.modalItemText, { color: 'red' }]}>Report User</ThemedText>
                                        </TouchableOpacity>

                                        <View style={styles.divider} />
                                        <TouchableOpacity
                                            style={[styles.actionButton, { borderColor: 'green' }]}
                                            onPress={() => updateOrderStatus('completed')}
                                        >
                                            <ThemedText style={[styles.actionText, { color: 'green' }]}>
                                                ✓ Mark as completed
                                            </ThemedText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.actionButton, { borderColor: '#FFA500' }]}
                                            onPress={() => updateOrderStatus('pending')}
                                        >
                                            <ThemedText style={[styles.actionText, { color: '#FFA500' }]}>
                                                ✓ Mark as Pending
                                            </ThemedText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.actionButton, { borderColor: 'red' }]}
                                            onPress={() => updateOrderStatus('failed')}
                                        >
                                            <ThemedText style={[styles.actionText, { color: 'red' }]}>
                                                ✗ Mark as Failed
                                            </ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        )}

                        {/* Fill Questionnaire Modal */}
                        {userRole == 'user' && (
                            <Modal visible={questionnaireVisible} transparent animationType="slide">
                                <View style={[styles.agentOptionsModal, { maxHeight: '100%' }]}>
                                    {currentCategoryIndex === 0 && (
                                        <CategoryOneModal questions={questionnaireData[currentCategoryIndex]?.questions}
                                            onClose={() => setQuestionnaireVisible(false)}
                                            onNext={() => {
                                                setCurrentCategoryIndex(prev => prev + 1)
                                            }}
                                            chat_id={chat_id}
                                            user_id={orderDetails?.user_id}
                                        />
                                    )}
                                    {currentCategoryIndex === 1 && (
                                        <CategoryTwoModal
                                            questions={questionnaireData[currentCategoryIndex]?.questions}
                                            onClose={() => setQuestionnaireVisible(false)}
                                            onPrevious={() => setCurrentCategoryIndex(0)}
                                            onNext={() => setCurrentCategoryIndex(2)}
                                            chat_id={chat_id}
                                            user_id={orderDetails?.user_id}
                                        />
                                    )}
                                    {currentCategoryIndex === 2 && (
                                        <CategoryThreeModal
                                            questions={questionnaireData[currentCategoryIndex]?.questions}
                                            questionIndex={currentQuestionIndex}
                                            setQuestionIndex={setCurrentQuestionIndex}
                                            chat_id={chat_id}
                                            user_id={orderDetails?.user_id}
                                            onPrevious={() => {
                                                setCurrentCategoryIndex(1);
                                                setCurrentQuestionIndex(0);
                                            }}
                                            onClose={() => {
                                                setQuestionnaireVisible(false);
                                                setCurrentCategoryIndex(0);
                                                setCurrentQuestionIndex(0);
                                            }}
                                            onDone={(finalAnswers) => {
                                                setQuestionnaireVisible(false);
                                                setCurrentCategoryIndex(0);
                                                setCurrentQuestionIndex(0);
                                            }}
                                        />
                                    )}
                                </View>
                            </Modal>
                        )}

                        <PaymentModal
                            visible={paymentModalVisible}
                            onClose={() => setPaymentModalVisible(false)}
                            chatId={chat_id}
                            userId={user?.id}
                            onSend={(paymentMessage) => {
                                const updatedMessages = [...messages, paymentMessage];
                                setMessages(updatedMessages);
                                setPaymentModalVisible(false);
                                messagesQuery.refetch();
                            }}
                        />

                        <Modal visible={viewNotesVisible} animationType="slide" transparent>
                            <View style={[styles.modalOverlay, { backgroundColor: '#00000090' }]}>
                                <View style={[styles.agentOptionsModal, { backgroundColor: '#F5F5F7', maxHeight: '80%' }]}>
                                    <View style={styles.modalHeader}>
                                        <ThemedText style={styles.modalTitle}>View Notes</ThemedText>
                                        <TouchableOpacity
                                            style={{ backgroundColor: "#fff", borderRadius: 20, padding: 4 }}
                                            onPress={() => setViewNotesVisible(false)}
                                        >
                                            <Ionicons name="close" size={24} color="#000" />
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={notes}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 }}>
                                                <ThemedText style={{ fontSize: 14, color: '#333' }}>{item.text}</ThemedText>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                    <Image source={item.user.avatar} style={{ width: 24, height: 24, borderRadius: 12, marginRight: 6 }} />
                                                    <ThemedText style={{ fontSize: 13, color: '#555' }}>{item.user.name}</ThemedText>
                                                    {/* mine is not meaningful for notes; avoid undefined var */}
                                                    <TimeWithTicks item={item} mine={false} />
                                                </View>
                                            </View>
                                        )}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                    />

                                    <TouchableOpacity
                                        onPress={() => {
                                            setAddNoteVisible(true);
                                            setViewNotesVisible(false);
                                        }}
                                        style={[styles.actionButton, { backgroundColor: '#992C55', borderColor: "transparent", marginTop: 10, borderRadius: 40 }]}
                                    >
                                        <ThemedText style={{ color: '#fff', fontWeight: '600' }}> Add New Note</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* video preview modal */}
                        <Modal visible={videoPreview.visible} animationType="slide">
                            <View style={{ flex: 1, backgroundColor: '#000' }}>
                                <View style={{ paddingTop: 50, paddingBottom: 8, paddingHorizontal: 20, backgroundColor: '#000' }}>
                                    <TouchableOpacity onPress={() => setVideoPreview({ visible: false, uri: null })} style={{ marginRight: 12 }}>
                                        <Ionicons name="chevron-back" size={28} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <Video
                                    source={{ uri: videoPreview.uri }}
                                    style={{ flex: 1 }}
                                    resizeMode="contain"
                                    useNativeControls
                                    shouldPlay
                                />
                            </View>
                        </Modal>

                        {/*  Add notes Modal*/}
                        <Modal visible={addNoteVisible} animationType="slide" transparent>
                            <View style={[styles.modalOverlay, { backgroundColor: '#00000090' }]}>
                                <View style={{
                                    backgroundColor: '#f5f5f7',
                                    borderRadius: 20,
                                    width: '100%',
                                    padding: 20,
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>Add a note</ThemedText>
                                        <TouchableOpacity style={{ backgroundColor: "#fff", borderRadius: 20, padding: 4 }} onPress={() => setAddNoteVisible(false)}>
                                            <Ionicons name="close" size={24} color="#000" />
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        multiline
                                        placeholder="Enter note"
                                        value={newNoteText}
                                        onChangeText={setNewNoteText}
                                        style={{
                                            backgroundColor: '#FFF',
                                            borderRadius: 12,
                                            padding: 12,
                                            marginTop: 20,
                                            minHeight: 100,
                                            textAlignVertical: 'top',
                                        }}
                                    />

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                                        <Image source={agent.image} style={{ width: 24, height: 24, borderRadius: 12, marginRight: 6 }} />
                                        <ThemedText style={{ fontSize: 13 }}>{agent.name}</ThemedText>
                                        <ThemedText style={{ fontSize: 11, marginLeft: 'auto' }}>
                                            {new Date().toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} - {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </ThemedText>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            const timestamp = `${new Date().toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;

                                            const newNote = {
                                                id: Date.now(),
                                                text: newNoteText,
                                                user: {
                                                    name: agent.name,
                                                    avatar: agent.image,
                                                },
                                                timestamp,
                                            };

                                            setNotes([...notes, newNote]);
                                            setNewNoteText('');
                                            setAddNoteVisible(false);
                                            setViewNotesVisible(true);
                                        }}
                                        style={{ backgroundColor: '#992C55', borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginTop: 20 }}
                                    >
                                        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Save</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <VoiceRecorderModal
                            visible={recordingModalVisible}
                            audioUri={audioUri}
                            onCancel={() => {
                                setAudioUri(null);
                                setRecordingModalVisible(false);
                            }}
                            onSend={(uri) => {
                                sendAudioMessage(uri);
                                setAudioUri(null);
                                setRecordingModalVisible(false);
                            }}
                        />

                        {/* quick reply modal */}
                        <Modal visible={quickRepliesModalVisible} animationType="slide" transparent>
                            <View style={[styles.modalOverlay, { backgroundColor: '#00000090' }]}>
                                <View style={[styles.agentOptionsModal, { backgroundColor: '#F5F5F7', maxHeight: '80%' }]}>
                                    <View style={styles.modalHeader}>
                                        <ThemedText style={styles.modalTitle}>Saved Quick Replies</ThemedText>
                                        <TouchableOpacity
                                            onPress={() => setQuickRepliesModalVisible(false)}
                                            style={{ backgroundColor: '#fff', borderRadius: 20, padding: 4 }}
                                        >
                                            <Ionicons name="close" size={24} color="#000" />
                                        </TouchableOpacity>
                                    </View>
                                    {quickReplies?.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                const time = new Date().toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                });

                                                const newMsg = {
                                                    id: Date.now().toString(),
                                                    sender: user?.id,
                                                    text: item.text,
                                                    time,
                                                };
                                                setInputMessage(item.text)
                                                setMessages(prev => [...prev, newMsg]);
                                                setQuickRepliesModalVisible(false);
                                                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
                                            }}
                                            style={{
                                                borderColor: '#992C55',
                                                borderWidth: 1,
                                                borderRadius: 20,
                                                padding: 14,
                                                marginBottom: 12,
                                            }}
                                        >
                                            <ThemedText style={{ color: '#992C55', fontWeight: '500' }}>{item.text}</ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Modal>

                        {/* add new quick reply modal */}
                        <Modal visible={addReplyModalVisible} animationType="slide" transparent>
                            <KeyboardAvoidingView behavior="padding" style={[styles.modalOverlay, { backgroundColor: '#00000090' }]}>
                                <View style={[styles.agentOptionsModal, { backgroundColor: '#F5F5F7' }]}>
                                    <View style={styles.modalHeader}>
                                        <ThemedText style={styles.modalTitle}>Add quick reply</ThemedText>
                                        <TouchableOpacity
                                            onPress={() => setAddReplyModalVisible(false)}
                                            style={{ backgroundColor: '#fff', borderRadius: 20, padding: 4 }}
                                        >
                                            <Ionicons name="close" size={24} color="#000" />
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 12,
                                            padding: 14,
                                            minHeight: 80,
                                            textAlignVertical: 'top',
                                        }}
                                        placeholder="Enter reply"
                                        multiline
                                        value={newReply}
                                        onChangeText={setNewReply}
                                    />
                                    <ThemedText style={{ textAlign: 'right', color: '#999', marginTop: 8 }}>{newReply.length} Words</ThemedText>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#992C55',
                                            borderRadius: 30,
                                            paddingVertical: 14,
                                            alignItems: 'center',
                                            marginTop: 20,
                                        }}
                                        onPress={saveQuickReply}
                                    >
                                        <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Save</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </Modal>

                        <Modal
                            visible={messageActionModalVisible}
                            animationType="slide"
                            transparent
                            onRequestClose={() => setMessageActionModalVisible(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setMessageActionModalVisible(false)}
                            >
                                <View style={styles.messageActionModal}>
                                    <TouchableOpacity
                                        onPress={async () => {
                                            if (selectedMessage?.text || selectedMessage?.type === 'text') {
                                                await Clipboard.setStringAsync(selectedMessage.text);
                                                alert('Copied to clipboard');
                                            } else {
                                                alert('Nothing to copy');
                                            }
                                            setMessageActionModalVisible(false);
                                        }}
                                        style={styles.modalItemRow}
                                    >
                                        <Ionicons name="copy-outline" size={20} color="#000" style={styles.modalIcon} />
                                        <Text style={styles.modalItemText}>Copy</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setMessageActionModalVisible(false);
                                            navigation.navigate('ForwardChat', { forwardMessage: selectedMessage });
                                        }}
                                        style={styles.modalItemRow}
                                    >
                                        {selectedMessage?.type === 'image' && isSingleImageMessage(selectedMessage) && (
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await downloadImageToGallery(selectedMessage.image);
                                                    setMessageActionModalVisible(false);
                                                }}
                                                style={styles.modalItemRow}
                                            >
                                                <Ionicons name="download-outline" size={20} color="#000" style={styles.modalIcon} />
                                                <Text style={styles.modalItemText}>Download</Text>
                                            </TouchableOpacity>
                                        )}
                                        <Ionicons name="arrow-redo-outline" size={20} color="#000" style={styles.modalIcon} />
                                        <Text style={styles.modalItemText}>Forward</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setReplyTo({
                                                id: selectedMessage.id,
                                                preview:
                                                    selectedMessage.text ||
                                                    (selectedMessage.type === 'image' ? '📷 Photo' :
                                                        selectedMessage.type === 'video' ? '🎥 Video' :
                                                            selectedMessage.type === 'voice' ? '🎤 Voice message' :
                                                                selectedMessage.type === 'file' ? (selectedMessage.name || '📄 Document') :
                                                                    'Message'),
                                            });
                                            setMessageActionModalVisible(false);
                                        }}
                                        style={styles.modalItemRow}
                                    >
                                        <Ionicons name="return-up-forward-outline" size={20} color="#000" style={styles.modalIcon} />
                                        <Text style={styles.modalItemText}>Reply</Text>
                                    </TouchableOpacity>

                                    {/* Only show edit and delete for text messages and if user is the sender */}
                                    {selectedMessage?.type === 'text' && selectedMessage?.sender === user?.id && (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setEditMessageText(selectedMessage.text);
                                                    setEditMessageModalVisible(true);
                                                    setMessageActionModalVisible(false);
                                                }}
                                                style={styles.modalItemRow}
                                            >
                                                <Ionicons name="create-outline" size={20} color="#000" style={styles.modalIcon} />
                                                <Text style={styles.modalItemText}>Edit</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    deleteMessage(selectedMessage.id);
                                                    setMessageActionModalVisible(false);
                                                }}
                                                style={styles.modalItemRow}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#ff4444" style={styles.modalIcon} />
                                                <Text style={[styles.modalItemText, { color: '#ff4444' }]}>Delete</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                </View>
                            </TouchableOpacity>
                        </Modal>

                        {/* Edit Message Modal */}
                        <Modal
                            visible={editMessageModalVisible}
                            animationType="slide"
                            transparent
                            onRequestClose={() => setEditMessageModalVisible(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setEditMessageModalVisible(false)}
                            >
                                <View style={styles.editMessageModal}>
                                    <View style={styles.editMessageHeader}>
                                        <ThemedText style={styles.editMessageTitle}>Edit Message</ThemedText>
                                        <TouchableOpacity
                                            onPress={() => setEditMessageModalVisible(false)}
                                            style={styles.closeButton}
                                        >
                                            <Ionicons name="close" size={24} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <TextInput
                                        style={styles.editMessageInput}
                                        value={editMessageText}
                                        onChangeText={setEditMessageText}
                                        placeholder="Edit your message..."
                                        multiline
                                        autoFocus
                                    />
                                    
                                    <View style={styles.editMessageActions}>
                                        <TouchableOpacity
                                            onPress={() => setEditMessageModalVisible(false)}
                                            style={[styles.editMessageButton, styles.cancelButton]}
                                        >
                                            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (editMessageText.trim() && selectedMessage) {
                                                    editMessage(selectedMessage.id, editMessageText.trim());
                                                    setEditMessageModalVisible(false);
                                                    setEditMessageText('');
                                                }
                                            }}
                                            style={[styles.editMessageButton, styles.saveButton]}
                                        >
                                            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        {/* image selector modal */}
                        <Modal visible={attachmentModal} transparent animationType="slide">
                            <Pressable style={styles.fullscreenOverlay} onPress={() => setAttachmentModal(false)}>
                                <Pressable style={styles.attachmentModalContainer}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 16 }}>
                                        <TouchableOpacity onPress={pickImage} style={styles.attachmentOption}>
                                            <Ionicons name="images-outline" size={24} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={pickDocument} style={[styles.attachmentOption, { marginLeft: 15 }]}>
                                            <Ionicons name="documents-outline" size={24} color="#fff" />
                                        </TouchableOpacity>
                                        {userRole === 'support' && (
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    setAttachmentModal(false);
                                                    setModalVisible(true);
                                                }} 
                                                style={[styles.attachmentOption, { marginLeft: 15 }]}
                                            >
                                                <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{ flexDirection: 'row', borderRadius: 12, gap: 40, marginTop: -9 }}>
                                        <ThemedText style={[styles.attachmentOptionText, { marginLeft: 20 }]}>Gallery</ThemedText>
                                        <ThemedText style={styles.attachmentOptionText}>Document</ThemedText>
                                        {userRole === 'support' && (
                                            <ThemedText style={styles.attachmentOptionText}>Options</ThemedText>
                                        )}
                                    </View>
                                </Pressable>
                            </Pressable>
                        </Modal>

                        <Modal visible={imagePreviewVisible} animationType="slide">
                            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                <View style={{ backgroundColor: '#992C55', paddingTop: 50, paddingBottom: 8, paddingHorizontal: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => setImagePreviewVisible(false)} style={{ marginRight: 12 }}>
                                            <Ionicons name="chevron-back" size={28} color="#fff" />
                                        </TouchableOpacity>
                                        <View>
                                            <ThemedText style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                                                {previewImages[0]?.sender === userRole ? 'You' : agent?.name || 'Sender'}
                                            </ThemedText>
                                            <ThemedText style={{ color: '#eee', fontSize: 12 }}>
                                                {previewImages.length} photos - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                                <FlatList
                                    data={previewImages}
                                    keyExtractor={(img) => img.id}
                                    renderItem={({ item }) => {
                                        const mine = item?.sender === user?.id;
                                        return (
                                            <View style={{ marginBottom: 16 }}>
                                                <Image source={{ uri: item.image }} style={{ width: '100%', height: 450 }} resizeMode="cover" />
                                                <TimeWithTicks item={item} mine={mine} />
                                                <TouchableOpacity
                                                    onPress={() => downloadImageToGallery(item.image)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: 16,
                                                        top: 16,
                                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                                        padding: 10,
                                                        borderRadius: 24,
                                                    }}
                                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                >
                                                    <Ionicons name="download-outline" size={22} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        </Modal>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    metaRight: { justifyContent: 'flex-end', paddingRight: 6 },
    metaLeft: { justifyContent: 'flex-start', paddingLeft: 6 },
    metaTime: { fontSize: 10, marginRight: 6 },

    background: {
        flex: 1,
        backgroundColor: '#fff', // white base behind the image
    },
    container: { flex: 1, backgroundColor: 'transparent' },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#992C55', gap: 10,
        paddingTop: 60, paddingBottom: 10, paddingLeft: 20,
    },
    agentPic: { width: 42, height: 42, borderRadius: 21 },
    agentName: { color: '#fff', fontSize: 16, fontWeight: '700' },
    online: { color: 'lightgreen', fontSize: 12 },

    orderCardWrapper: { margin: 8 },
    orderCardHeader: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#992C55',
        padding: 14,
        borderTopLeftRadius: 12, borderTopRightRadius: 12,
    },
    orderCardHeaderText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    orderCardBody: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
        padding: 16, borderWidth: 1, borderColor: '#eee',
    },
    orderInfoRow1: {
        flexDirection: 'row', justifyContent: 'space-between',
        padding: 12, backgroundColor: "#F5EAEE",
        borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 1, borderColor: '#f3c9d8',
    },
    orderInfoRow2: {
        flexDirection: 'row', justifyContent: 'space-between',
        padding: 12, backgroundColor: "#F5EAEE",
        // borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
        borderWidth: 1, borderColor: '#f3c9d8',
    },
    orderInfoRow3: {
        flexDirection: 'row', justifyContent: 'space-between',
        padding: 12, backgroundColor: "#F5EAEE",
        borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
        borderWidth: 1, borderColor: '#f3c9d8',
    },
    orderLabel: { fontSize: 13, color: '#666' },
    orderValue: { fontSize: 13, fontWeight: '600', color: '#333' },

    msgRow: { flexDirection: 'row', marginVertical: 6 },
    leftMsg: { justifyContent: 'flex-start' },
    rightMsg: { justifyContent: 'flex-end' },
    myBubble: {
        backgroundColor: '#992C55',
        padding: 8,
        borderRadius: 16,
        paddingLeft: 15,
        paddingRight: 40,
        paddingBottom: 3,
        maxWidth: '80%',
    },
    otherBubble: {
        backgroundColor: '#E7E7E7',
        padding: 8,
        paddingLeft: 15,
        paddingRight: 40,
        borderRadius: 16,
        maxWidth: '80%',
    },
    msgText: { color: '#fff' },
    msgTextleft: { color: 'black' },
    time: { fontSize: 8, alignSelf: 'flex-end', marginRight: -30 },
    timeLeft: { color: '#000' },
    timeRight: { color: '#fff' },

    inputRow: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 15,
    },
    sendBtn: {
        backgroundColor: '#992C55',
        marginLeft: 8,
        padding: 12,
        borderRadius: 25,
    },
    agentOptionsModal: {
        backgroundColor: '#00000066',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 30,
        // marginBottom:60,
        zIndex: 1

    },
    modalOverlay: {
        flex: 1,

        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',


    },
    videoPlayBtn: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: 8,
        borderRadius: 20,
    },

    modalItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        elevation: 1,
        shadowColor: '#000',
    },

    modalIcon: {
        width: 22,
    },
    messageActionModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },

    modalItemText: {
        fontSize: 16,
        color: '#000',
    },

    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 16,
    },

    actionButton: {
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 10,
    },

    actionText: {
        fontSize: 15,
        fontWeight: '600',
    },

    questionnaireCard: {
        borderRadius: 12,
        padding: 14,
        // marginBottom:90,
        maxWidth: '100%',

    },
    viewBtn: {
        marginTop: 10,
        backgroundColor: '#992C55',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    viewBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    qHeader: {
        backgroundColor: '#992C55',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 12,
        paddingBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    qHeaderTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    statusBadge: {
        backgroundColor: '#fff',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#992C55',
        fontSize: 12,
        fontWeight: '600',
    },
    qHeaderDesc: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: "#992c55",

        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 35,
        zIndex: 1,
    },
    qCategoryBox: {
        backgroundColor: '#F5EAEE',
        borderRadius: 8,
        marginHorizontal: 12,
        borderWidth: 1,
        marginTop: -10,
        borderColor: '#992c55',
        overflow: 'hidden',
        zIndex: 0,


    },
    qBtnRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,

    },
    qStartBtn: {
        backgroundColor: '#992C55', paddingVertical: 13, paddingHorizontal: 60, borderRadius: 30,
    },
    qStartBtnText: {
        color: '#fff', fontWeight: '600',
    },
    qCloseBtn: {
        backgroundColor: '#ccc',
        paddingVertical: 13, paddingHorizontal: 60, borderRadius: 30,
    },
    qCloseBtnText: {
        color: '#000', fontWeight: '600',
    },

    paymentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        // elevation: 3,
    },
    paymentHeader: {
        backgroundColor: '#992c55',
        padding: 10,
        paddingBottom: 30,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paymentTitle: {
        color: '#fff',
        // fontWeight: 'bold',
        fontSize: 15,
        marginLeft: -120
    },
    paymentStatus: {
        backgroundColor: '#fff',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 7,
    },
    paymentStatusText: {
        color: '#ffc107',
        fontSize: 12,
        fontWeight: 'bold',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 13,
        borderWidth: 0.5,
        backgroundColor: '#F5EAEE',
        borderColor: '#992c55',
    },
    label: {
        fontWeight: '600',
        color: '#555',
    },
    fullscreenOverlay: {
        flex: 1,

        justifyContent: 'flex-end',
        padding: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    attachmentModalContainer: {
        backgroundColor: '#992C55',
        borderTopLeftRadius: 24,
        // flexDirection: 'row',
        borderTopRightRadius: 24,
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 20,
        marginBottom: 40,
        elevation: 5,
    },
    attachmentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft:30,
        backgroundColor: '#C84671',
        borderColor: '#992C55',
        borderWidth: 1,

        borderRadius: 16,
        paddingVertical: 25,
        paddingHorizontal: 30,
    },
    attachmentOptionText: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 14,
    },
    imageGroupWrapper: {
        borderRadius: 12,
        marginRight: -40,
        overflow: 'hidden',
        // borderWidth: 3,
        borderColor: '#992c55',

    },
    imageGrid: {
        borderRadius: 12,
        marginBottom: 5,
        borderWidth: 5,

        borderColor: '#992C55',
        borderBottomWidth: 8,
    },
    qGridOuter: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 20,
        elevation: 2,
        zIndex: 1,
        marginTop: -20,
    },
    qListOuter: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 20,
        elevation: 2,
        zIndex: 1,
        marginTop: -20,
    },

    /* The pink rounded container that gives radius ONLY to the top/bottom rows */
    qList: {
        backgroundColor: '#F5EAEE',
        borderRadius: 12,
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E7B8C6', // subtle pink stroke
        overflow: 'hidden',      // ensures middle row has no visible radius
    },

    /* Every row same size */
    qRow: {
        minHeight: 48,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },

    /* Thin separator between Face/Skin and Skin/Change */
    qRowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#E7B8C6',
    },

    qRowLabel: { color: '#333', fontSize: 14, fontWeight: '600' },
    qRowStatus: { color: '#000', fontSize: 16 },

    mediaDownloadBtn: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: 6,
        borderRadius: 16,
    },
    uploadOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    uploadText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },

    // Edit Message Modal Styles
    editMessageModal: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    editMessageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    editMessageTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    editMessageInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    editMessageActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    editMessageButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    saveButton: {
        backgroundColor: '#992C55',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },

    // Message highlighting for reply navigation
    highlightedMessage: {
        backgroundColor: '#FFE4B5', // Light orange highlight
        borderWidth: 2,
        borderColor: '#FFA500', // Orange border
        transform: [{ scale: 1.02 }], // Slight scale up
    },


});


export default ChatScreen;
