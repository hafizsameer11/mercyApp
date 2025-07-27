
import React, { useState, useRef, useEffect } from 'react';
// import questionnaireData from './questionnaireData';
import EmojiSelector from 'react-native-emoji-selector';
import { RecordingButton } from '../../../components/RecordingButton';
import VoiceRecorderModal from '../../../components/VoiceRecorderModal';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { Pressable } from 'react-native';
import ThemedText from '../../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../../config/api.config';

// import EmojiSelector from 'react-native-emoji-selector';

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
import { useNavigation, useRoute } from '@react-navigation/native';
import CategoryOneModal from '../../../components/CategoryOneModal';
import CategoryTwoModal from '../../../components/CategoryTwoModal';
import CategoryThreeModal from '../../../components/CategoryThreeModel';
import PaymentModal from '../../../components/PaymentModal';
import { ScrollView } from 'react-native-web';


const ChatScreen = () => {


    const [previewImages, setPreviewImages] = useState([]);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const [attachmentModal, setAttachmentModal] = useState(false);
    const [user, setUser] = useState(null);


    const [quickRepliesModalVisible, setQuickRepliesModalVisible] = useState(false);
    const [addReplyModalVisible, setAddReplyModalVisible] = useState(false);
    const [quickReplies, setQuickReplies] = useState([
        'Hello , Welcome',
        'How can we help you',
        'Have you answered the questionnaire',
        'Do you have any further questions ?',
    ]);
    const [newReply, setNewReply] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const [recordingInstance, setRecordingInstance] = useState(null);
    const [recordingModalVisible, setRecordingModalVisible] = useState(false);

    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [viewNotesVisible, setViewNotesVisible] = useState(false);
    const [addNoteVisible, setAddNoteVisible] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
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

    const { chat_id } = useRoute().params;
    // console.log("chat id",chat_id)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);

    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [questionnaireVisible, setQuestionnaireVisible] = useState(false);

    const navigation = useNavigation();
    const { userRole, agent, service, messages: initialMessages = [] } = useRoute().params;


    const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);

    // image selection logic
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            const groupId = Date.now().toString();
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            const uploads = result.assets.map(async (asset) => {
                const success = await sendFileMessage({
                    fileUri: asset.uri,
                    fileName: asset.fileName || 'photo.jpg',
                    fileType: asset.type || 'image/jpeg',
                    messageType: 'image',
                });

                if (success) {
                    return {
                        id: `${Date.now()}-${Math.random()}`,
                        sender: userRole,
                        type: 'image',
                        image: asset.uri,
                        time,
                        groupId,
                    };
                }
                return null;
            });

            const sentImages = (await Promise.all(uploads)).filter(Boolean);
            setMessages((prev) => [...prev, ...sentImages]);
        }

        setAttachmentModal(false);
    };

    const getImageGroupStyle = (count) => {
        return {
            flexDirection: count > 1 ? 'row' : 'column',
            flexWrap: 'wrap',
            gap: 1,
            width: count > 1 ? 200 : 200,
        };
    };

    const getImageStyle = (index, count) => {
        const base = {
            width: count === 1 ? 200 : count === 2 ? 95 : 95,
            height: count === 1 ? 200 : count === 2 ? 150 : 95,
            borderRadius: 10,
            borderWidth: 5,
            borderColor: '#992c55',
        };
        return base;
    };
    const groupedImages = {};
    messages.forEach((msg) => {
        if (msg.type === 'image') {
            if (!groupedImages[msg.groupId]) groupedImages[msg.groupId] = [];
            groupedImages[msg.groupId].push(msg);
        }
    });

    const pickDocument = async () => {
        setAttachmentModal(false);
        let result = await DocumentPicker.getDocumentAsync({});
        if (result.type === 'success') {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: userRole,
                type: 'document',
                document: result.uri,
                name: result.name,
                time
            }]);
        }
    };
    // Quick Replies Modal Handling
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



    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        try {
            const token = await AsyncStorage.getItem('token');

            const formData = new FormData();
            formData.append('chat_id', chat_id); // ✅ from useRoute().params
            formData.append('type', 'text');
            formData.append('message', inputMessage);
            formData.append('is_forwarded', '');
            formData.append('duration', '');

            const response = await axios.post(API.SEND_MESSAGE, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Message Sent:', response.data);


            // Show message in UI
            const time = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            const newMsg = {
                id: Date.now().toString(),
                sender: user?.id,
                text: inputMessage,
                time,
            };

            setMessages(prev => [...prev, newMsg]);
            setInputMessage('');
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        } catch (error) {
            console.error('Send message error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to send message');
        }
    };

    const sendQuestionnaire = async (chat_id, user_id) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const assignPayload = {
                chat_id,
                user_id,
            };

            const response = await axios.post(
                API.ASSIGN_QUESTIONNAIRE,
                assignPayload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
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
            console.log('Messages:', response.data);

            if (response.data.status === 'success') {
                const fetchedMessages = response?.data?.data?.messages;
                console.log("feteched messages", fetchMessages)

                const formatted = fetchedMessages?.map((msg) => ({
                    id: msg.id,
                    sender: msg.sender_id,
                    text: msg.message || '',
                    image: msg.type === 'image' ? msg.file : null,
                    file: msg.type === 'file' ? msg.file : null,
                    audio: msg.type === 'voice' ? msg.file : null,
                    type: msg.type, // text, image, file, voice
                    time: new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }),
                }));

                setMessages(formatted); // reverse to show oldest first
            }
        } catch (error) {
            console.error('Fetch messages error:', error.response?.data || error.message);
            alert('Failed to load chat messages');
        }
    };

    useEffect(() => {
        fetchMessages();
        const getUserDetail = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };

        getUserDetail();
    }, []);

    const sendFileMessage = async ({ fileUri, fileName, fileType, messageType = 'file', duration = '' }) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const formData = new FormData();
            formData.append('chat_id', chat_id); // from useRoute().params
            formData.append('type', messageType); // 'image', 'file', 'voice'
            formData.append('message', ''); // optional caption
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
            });

            console.log(`${messageType} sent:`, response.data);

            return true;
        } catch (error) {
            console.error(`Error sending ${messageType}:`, error.response?.data || error.message);
            alert(error.response?.data?.message || `Failed to send ${messageType}`);
            return false;
        }
    };

    // const sendQuestionnaire = () => {
    //     const time = new Date().toLocaleTimeString([], {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true,
    //     });

    //     const newMsg = {
    //         id: Date.now().toString(),
    //         sender: 'agent',
    //         type: 'questionnaire',
    //         text: 'Please fill out this questionnaire form.',
    //         time,
    //         categories: questionnaireData.map(item => item.title),
    //     };

    //     const updatedMessages = [...messages, newMsg];
    //     setMessages(updatedMessages);
    //     setModalVisible(false);

    //     // Simulate sending to customer by navigating with updated messages
    //     navigation.navigate('Chat', {
    //         userRole: 'customer',
    //         user,
    //         agent,
    //         service,
    //         initialMessages: updatedMessages,
    //     });
    // };

    // recording logic
    const startRecording = async () => {
        if (isRecording) return; // guard

        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Microphone permission is required to record audio.');
                return;
            }

            // Stop any previous recording
            if (recordingInstance) {
                await recordingInstance.stopAndUnloadAsync();
                setRecordingInstance(null);
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await recording.startAsync();

            setRecordingInstance(recording);
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };




    const stopRecording = async () => {
        try {
            if (!recordingInstance) {
                console.warn("No recording in progress.");
                return;
            }

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



    const sendAudioMessage = (uri) => {
        const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        const newMsg = {
            id: Date.now().toString(),
            sender: userRole,
            type: 'audio',
            audioUri: uri,
            time,
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
    };
    const playAudio = async (uri) => {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();
        } catch (err) {
            console.error('Failed to play audio', err);
        }
    };


    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === user?.id;
        if (item.type === 'image') {
            const group = groupedImages[item.groupId];
            if (!group || group[0].id !== item.id) return null; // Render group only once
            return (
                <View style={[styles.msgRow, { marginBottom: 20 }, item.sender === userRole ? styles.rightMsg : styles.leftMsg]}>
                    <View style={{ paddingBottom: 20, backgroundColor: isMyMessage ? '#992C55' : '#E7E7E7', borderRadius: 10, }}>
                        <TouchableOpacity onPress={() => { setPreviewImages(group); setImagePreviewVisible(true); }}>
                            <View style={[styles.imageGroupWrapper, getImageGroupStyle(group.length)]}>
                                {group.slice(0, 4).map((img, index) => (
                                    <Image key={index} source={{ uri: img.image }} style={getImageStyle(index, group.length)} resizeMode="cover" />
                                ))}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ThemedText style={[styles.time, { color: "#000", marginBottom: -15 }]}>{item.time}</ThemedText>
                </View>
            );
        }


        if (item.type === 'document') {
            return (
                <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}>
                    <TouchableOpacity onPress={() => Linking.openURL(item.document)}>
                        <View style={{ padding: 10, backgroundColor: '#eee', borderRadius: 10 }}>
                            <Ionicons name="document-text-outline" size={24} color="#555" />
                            <ThemedText>{item.name}</ThemedText>
                        </View>
                    </TouchableOpacity>
                    <ThemedText style={styles.time}>{item.time}</ThemedText>
                </View>
            );
        }
        if (item.type === 'audio') {
            return (
                <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}>
                    <View style={isMyMessage ? styles.myBubble : styles.otherBubble}>
                        <TouchableOpacity onPress={() => playAudio(item.audioUri)}>
                            <Ionicons name="play" size={24} color="#fff" />
                        </TouchableOpacity>
                        <ThemedText style={styles.time}>{item.time}</ThemedText>
                    </View>
                </View>
            );
        }


        if (item.type === 'payment') {
            return (
                <View style={[styles.msgRow, item.sender === userRole ? styles.rightMsg : styles.leftMsg]}>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentHeader}>
                            <Ionicons name="card-outline" size={20} color="#fff" />
                            <ThemedText style={styles.paymentTitle}>Payment Order</ThemedText>
                            <View style={styles.paymentStatus}>
                                <ThemedText style={styles.paymentStatusText}>{item.status}</ThemedText>
                            </View>
                        </View>

                        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 10, elevation: 1, zIndex: 1, marginTop: -20 }}>
                            <View style={[styles.paymentRow, { borderTopRightRadius: 10, borderTopLeftRadius: 10 }]}><Text style={styles.label}>Name</Text><Text>{item.name}</Text></View>
                            <View style={styles.paymentRow}><Text style={styles.label}>No of photos</Text><Text>{item.photos}</Text></View>
                            <View style={styles.paymentRow}><Text style={styles.label}>Category</Text><Text>{item.category}</Text></View>
                            <View style={[styles.paymentRow, { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}><Text style={styles.label}>Amount</Text><Text style={{ fontWeight: 'bold' }}>₦{parseInt(item.amount).toLocaleString()}</Text></View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                            {userRole === 'customer' ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#992C55',
                                        paddingVertical: 14,
                                        paddingHorizontal: 140,
                                        borderRadius: 30,
                                    }}
                                >
                                    <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Make Payment</ThemedText>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity
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
                        </View>


                    </View>

                </View>
            );
        }

        if (item.type === 'questionnaire') {
            return (
                <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}>
                    <View style={styles.questionnaireCard}>
                        <View style={styles.qHeader}>
                            <ThemedText style={styles.qHeaderTitle}>📋 Questionnaire</ThemedText>
                            <View style={styles.statusBadge}>
                                <ThemedText style={styles.statusBadgeText}>Unanswered</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={styles.qHeaderDesc}>
                            It consists of 3 parts, select the options that best suit the service you want
                        </ThemedText>

                        <View style={{ backgroundColor: "#fff", paddingVertical: 30, zIndex: 1, marginTop: -20, borderRadius: 20, elevation: 2 }}>
                            <View style={styles.qCategoryBox}>
                                {item.categories?.map((cat, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            borderBottomWidth: i === item.categories.length - 1 ? 0 : 1,
                                            borderColor: '#992c55',
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                        }}
                                    >
                                        <ThemedText style={{ color: '#333', fontSize: 14 }}>{cat}</ThemedText>
                                        <ThemedText style={{ color: '#000' }}>-</ThemedText>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.qBtnRow}>
                            {userRole === 'customer' && (
                                <TouchableOpacity
                                    style={styles.qStartBtn}
                                    onPress={() => {
                                        setCurrentCategoryIndex(0);
                                        setQuestionnaireVisible(true);
                                    }}
                                >
                                    <ThemedText style={styles.qStartBtnText}>Start</ThemedText>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.qCloseBtn}>
                                <ThemedText style={styles.qCloseBtnText}>Close</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={[styles.msgRow, isMyMessage ? styles.rightMsg : styles.leftMsg]}>
                <View style={isMyMessage ? styles.myBubble : styles.otherBubble}>
                    <ThemedText style={styles.msgText}>{item.text}</ThemedText>
                    <ThemedText style={styles.time}>{item.time}</ThemedText>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}> */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Image source={agent.image} style={styles.agentPic} />
                        <View>
                            <ThemedText style={styles.agentName}>{agent.name}</ThemedText>
                            <ThemedText style={styles.online}>Online</ThemedText>
                        </View>
                        {userRole === 'agent' && (
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 'auto', marginRight: 10 }}>
                                <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

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
                                <ThemedText style={styles.orderValue}>{service}</ThemedText>
                            </View>
                        </View>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                        style={{ flex: 1 }}
                    />
                    {showEmojiPicker && (
                        <View style={{ height: 250 }}>
                            <EmojiSelector
                                onEmojiSelected={emoji => setInputMessage(prev => prev + emoji)}
                                showSearchBar={true}
                                showTabs={true}
                                showSectionTitles={false}
                                columns={8}
                                emojiStyle={{ fontSize: 24 }} // ✅ Enforce a safe font size
                            />

                        </View>
                    )}
                    {/* Input */}
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
                            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                                <Ionicons name="send" size={24} color="#fff" />
                            </TouchableOpacity>
                        ) : (
                            <RecordingButton
                                onStart={startRecording}
                                onStop={stopRecording}
                                onLock={() => setRecordingModalVisible(true)}
                            />
                        )}
                    </View>

                    {/* Modals */}
                    {/* Agent options Modal */}
                    {userRole === 'agent' && (
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
                                        sendQuestionnaire(chat_id, user?.id); // Use correct IDs
                                        // closeModal(); // Optional
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

                                    <TouchableOpacity style={[styles.actionButton, { borderColor: 'green' }]}>
                                        <ThemedText style={[styles.actionText, { color: 'green' }]}>✓ Mark as completed</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, { borderColor: '#FFA500' }]}>
                                        <ThemedText style={[styles.actionText, { color: '#FFA500' }]}>✓ Mark as Pending</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, { borderColor: 'red' }]}>
                                        <ThemedText style={[styles.actionText, { color: 'red' }]}>✗ Mark as Failed</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {/* Fill Questionaire Modal */}
                    {userRole === 'customer' && (
                        <Modal visible={questionnaireVisible} transparent animationType="slide">
                            <View style={[styles.agentOptionsModal, { maxHeight: '80%' }]}>
                                {currentCategoryIndex === 0 && (
                                    <CategoryOneModal questions={questionnaireData[currentCategoryIndex]?.questions}
                                        onClose={() => setQuestionnaireVisible(false)}
                                        onNext={() => setCurrentCategoryIndex(prev => prev + 1)}
                                    />
                                )}
                                {currentCategoryIndex === 1 && (
                                    <CategoryTwoModal
                                        questions={questionnaireData[currentCategoryIndex]?.questions}
                                        onClose={() => setQuestionnaireVisible(false)}
                                        onPrevious={() => setCurrentCategoryIndex(0)}
                                        onNext={() => setCurrentCategoryIndex(2)}
                                    />
                                )}
                                {currentCategoryIndex === 2 && (
                                    <CategoryThreeModal
                                        questions={questionnaireData[currentCategoryIndex]?.questions}
                                        questionIndex={currentQuestionIndex}
                                        setQuestionIndex={setCurrentQuestionIndex}
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

                                            console.log('Completed all questions in Category 3:', finalAnswers);

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
                        onSend={(paymentMessage) => {
                            const updatedMessages = [...messages, paymentMessage];
                            setMessages(updatedMessages);
                            setPaymentModalVisible(false);
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
                                                <ThemedText style={{ fontSize: 11, color: '#888', marginLeft: 'auto' }}>{item.timestamp}</ThemedText>
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
                    {/*  Add notes Modal*/}
                    <Modal visible={addNoteVisible} animationType="slide" transparent>
                        <View style={[styles.modalOverlay, { backgroundColor: '#00000090' }]}>
                            <View style={{
                                backgroundColor: '#f5f5f7',
                                borderRadius: 20,
                                width: '100%',
                                padding: 20,
                                // marginHorizontal: 20,
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
                                        setViewNotesVisible(true); // re-open notes modal
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
                                {quickReplies.map((reply, index) => (
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
                                                sender: userRole,
                                                text: reply,
                                                time,
                                            };

                                            setMessages(prev => [...prev, newMsg]);
                                            setQuickRepliesModalVisible(false); // close the modal after sending
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
                                        <ThemedText style={{ color: '#992C55', fontWeight: '500' }}>{reply}</ThemedText>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    onPress={() => {
                                        setAddReplyModalVisible(true);
                                        setQuickRepliesModalVisible(false);
                                    }}
                                    style={{
                                        backgroundColor: '#992C55',
                                        paddingVertical: 14,
                                        borderRadius: 40,
                                        alignItems: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Add New</ThemedText>
                                </TouchableOpacity>
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
                    {/* image selector modal */}
                    <Modal visible={attachmentModal} transparent animationType="slide">
                        <Pressable style={styles.fullscreenOverlay} onPress={() => setAttachmentModal(false)}>
                            <Pressable style={styles.attachmentModalContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 16 }}>
                                    <TouchableOpacity onPress={pickImage} style={styles.attachmentOption}>
                                        <Ionicons name="images-outline" size={24} color="#fff" />
                                    </TouchableOpacity>
                                    {/* <ThemedText style={styles.attachmentOptionText}>Gallery</ThemedText> */}
                                    <TouchableOpacity onPress={pickDocument} style={[styles.attachmentOption, { marginLeft: 15 }]}>
                                        <Ionicons name="documents-outline" size={24} color="#fff" />
                                        {/* <ThemedText style={styles.attachmentOptionText}>Document</ThemedText> */}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', borderRadius: 12, gap: 40, marginTop: -9 }}>
                                    <ThemedText style={[styles.attachmentOptionText, { marginLeft: 20 }]}>Gallery</ThemedText>
                                    <ThemedText style={styles.attachmentOptionText}>Document</ThemedText>

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
                                renderItem={({ item }) => (
                                    <View style={{ marginBottom: 16 }}>
                                        <Image source={{ uri: item.image }} style={{ width: '100%', height: 450 }} resizeMode="cover" />
                                        <ThemedText style={{ textAlign: 'right', paddingHorizontal: 10 }}>{item.time}</ThemedText>
                                    </View>
                                )}
                            />
                        </View>
                    </Modal>

                </View>
            </TouchableWithoutFeedback>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#992C55', gap: 10,
        paddingTop: 60, paddingBottom: 10, paddingLeft: 20,
    },
    agentPic: { width: 42, height: 42, borderRadius: 21 },
    agentName: { color: '#fff', fontSize: 16, fontWeight: '700' },
    online: { color: 'lightgreen', fontSize: 12 },

    orderCardWrapper: { margin: 16 },
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
    time: { fontSize: 8, color: '#eee', alignSelf: 'flex-end', marginRight: -30 },

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
    }

});


export default ChatScreen;
