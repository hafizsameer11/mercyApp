import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    Image,
    Modal,
    TouchableWithoutFeedback,
    Linking,
    Pressable,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import ThemedText from '../../../components/ThemedText';
import { Audio } from 'expo-av';
import VoiceRecorderModal from '../../../components/VoiceRecorderModal';
import { RecordingButton } from '../../../components/RecordingButton';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AgentToAgentChatScreen = () => {
    const navigation = useNavigation();
    const { agent } = useRoute().params;
    console.log("agent details we are getting", agent)
    const userRole = 'agent';

    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            sender: 'agent',
            text: `Hey ${agent.name}, how can I help you?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        },
    ]);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const [audioUri, setAudioUri] = useState(null);
    const [recording, setRecording] = useState(null);
    const [recordingModalVisible, setRecordingModalVisible] = useState(false);
    const [attachmentModal, setAttachmentModal] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const flatListRef = useRef();

    const sendMessage = () => {
        if (!inputMessage.trim()) return;

        const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        const newMsg = {
            id: Date.now().toString(),
            sender: userDetail.id,
            text: inputMessage,
            time,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputMessage('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const startRecording = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to use microphone is required.');
            return;
        }

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
    };

    const stopRecording = async () => {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
        setRecordingModalVisible(true);
    };

    const sendAudioMessage = (uri) => {
        const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), sender: userRole, type: 'audio', audioUri: uri, time },
        ]);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!result.canceled) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const newImages = result.assets.map((asset) => ({
                id: `${Date.now()}-${Math.random()}`,
                sender: userRole,
                type: 'image',
                image: asset.uri,
                time,
                groupId: Date.now().toString(),
            }));
            setMessages((prev) => [...prev, ...newImages]);
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

    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                setUserDetail(JSON.parse(user));
            }
        }
        getUser(); 
    },[]);
    const renderMessage = ({ item }) => {
        console.log("message item", item,"yser details",userDetail);
        const isMyMessage = item.sender ==userDetail.id;

        if (item.type === 'image') {
            const group = groupedImages[item.groupId];
            if (!group || group[0].id !== item.id) return null; 
            return (
                <View style={[styles.messageRow, { marginBottom: 20 }, item.sender === userRole ? styles.rightAlign : styles.leftAlign]}>
                    <View style={{ paddingBottom: 10, backgroundColor: isMyMessage ? '#992C55' : '#E7E7E7', borderRadius: 10, }}>
                        <TouchableOpacity onPress={() => { setPreviewImages(group); setImagePreviewVisible(true); }}>
                            <View style={[styles.imageGroupWrapper, getImageGroupStyle(group.length)]}>
                                {group.slice(0, 4).map((img, index) => (
                                    <Image key={index} source={{ uri: img.image }} style={getImageStyle(index, group.length)} resizeMode="cover" />
                                ))}
                                <ThemedText style={{ fontSize: 9, color: "#fff", alignSelf: 'flex-end', marginRight: 5 }}>{item.time}</ThemedText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        if (item.type === 'document') {
            return (
                <View style={[styles.msgRow, isMyMessage ? styles.rightAlign : styles.leftAlign]}>
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

        return (
            <View style={[styles.messageRow, isMyMessage ? styles.rightAlign : styles.leftAlign]}>
                <View style={[styles.messageBubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
                    <Text style={{ color: isMyMessage ? '#fff' : '#000' }}>{item.text}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
            </View>
        );
    };
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Or however you store the token
                const response = await axios.get(`https://editbymercy.hmstech.xyz/api/open-agent-chat/${agent.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const chatData = response.data.data[0]; // Assuming only one chat per agent-agent pair
                const formattedMessages = chatData.messages.map((msg) => ({
                    id: msg.id.toString(),
                    sender: msg.sender_id,
                    type: msg.type,
                    text: msg.message,
                    senderId: msg.user_id,
                    image: msg.file,
                    audioUri: msg.type === 'voice' ? msg.file : null,
                    time: new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }),
                }));

                setMessages(formattedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, []);
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar style='light' />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Image source={agent.image} style={styles.avatar} />
                        <View>
                            <ThemedText style={styles.name}>{agent.name}</ThemedText>
                            <ThemedText style={styles.online}>Online</ThemedText>
                        </View>
                    </View>

                    {/* Chat List */}
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <View style={{ height: 250 }}>
                            <EmojiSelector
                                onEmojiSelected={(emoji) => setInputMessage((prev) => prev + emoji)}
                                showSearchBar
                                showTabs
                            />
                        </View>
                    )}

                    {/* Input Row */}
                    <View style={styles.inputRow}>
                        <TouchableOpacity onPress={() => setShowEmojiPicker((prev) => !prev)}>
                            <Ionicons name="happy-outline" size={26} color="#555" />
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Message"
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            onFocus={() => setShowEmojiPicker(false)}
                            style={styles.input}
                        />

                        <TouchableOpacity onPress={() => setAttachmentModal(true)}>
                            <Ionicons name="attach" size={26} color="#555" />
                        </TouchableOpacity>

                        {inputMessage.trim() ? (
                            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                                <Ionicons name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        ) : (
                            <RecordingButton onStart={startRecording} onStop={stopRecording} onLock={() => { }} />
                        )}
                    </View>

                    {/* Audio Preview Modal */}
                    <VoiceRecorderModal
                        visible={recordingModalVisible}
                        audioUri={audioUri}
                        onCancel={() => {
                            setRecordingModalVisible(false);
                            setAudioUri(null);
                        }}
                        onSend={(uri) => {
                            sendAudioMessage(uri);
                            setRecordingModalVisible(false);
                            setAudioUri(null);
                        }}
                    />

                    {/* Attachment Modal */}
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
                                </View>
                                <View style={{ flexDirection: 'row', gap: 40 }}>
                                    <Text style={styles.attachmentOptionText}>Gallery</Text>
                                    <Text style={styles.attachmentOptionText}>Document</Text>
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#992C55',
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 16,
        gap: 10,
    },
    avatar: { width: 42, height: 42, borderRadius: 21 },
    name: { color: '#fff', fontSize: 16, fontWeight: '700' },
    online: { color: 'lightgreen', fontSize: 12 },

    messageRow: { marginVertical: 6 },
    leftAlign: { alignSelf: 'flex-start' },
    rightAlign: { alignSelf: 'flex-end' },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 16,
    },
    myBubble: { backgroundColor: '#992C55' },
    otherBubble: { backgroundColor: '#E7E7E7' },
    timeText: {
        fontSize: 9,
        color: '#999',
        alignSelf: 'flex-end',
        marginTop: 5,
    },

    inputRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    sendBtn: {
        backgroundColor: '#992C55',
        padding: 10,
        borderRadius: 25,
    },

    fullscreenOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
    attachmentModalContainer: {
        backgroundColor: '#992C55',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 20,
        marginBottom: 40,
        elevation: 5,
    },
    attachmentOption: {
        backgroundColor: '#C84671',
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
        // marginRight: -40,
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

export default AgentToAgentChatScreen;
