

import React, { useState, useEffect } from 'react';
import ThemedText from './ThemedText';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Modal,
    TextInput,
    Animated,
    Easing,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API from '../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const { height } = Dimensions.get('window');

const ServiceCategoryList = () => {
    const navigation = useNavigation();
    

    const [selectedService, setSelectedService] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(height))[0];
    const [customServiceInput, setCustomServiceInput] = useState('');
    const [userDetails, setUserDetails] = useState({});

    const services = [
        {
            id: '1',
            name: 'Photo Editing',
            icon: require('../assets/PenNib.png'),
            headerImage: require('../assets/image 5.png'),
            imageContainerStyle: {
                top: height * 0.6 - 210,
                alignItems: 'center',
                left: 0,
                right: 0,
                // position: 'absolute',
            },
            button: {
                top: 130,
                paddingHorizontal: 123,
            },
            color: '#E31818',
            description: [
                'Skin Smoothing',
                'Removal of scars',
                'Skin blemish removal, blurs',
                'Wrinkles, Pimples, Stretch marks, body hairs',
                'Skin tone adjustment, Whitening of teeth and eyes.....',
            ],
        },
        {
            id: '2',
            name: 'Photo Manipulation',
            icon: require('../assets/Vector (6).png'),
            headerImage: require('../assets/image 5 (1).png'),
            imageContainerStyle: {
                top: height * 0.6 - 170,
                alignItems: 'center',
                left: 0,
                right: 0,
                // position: 'absolute',
            },
            button: {
                top: 160,
                paddingHorizontal: 95,
            },
            headerStyle: {
                marginBottom: -30,
                height: 260,
            },
            color: '#7018E3',
            description: ['Hair smoothing', 'Frizz control', 'Color balance'],
        },
        {
            id: '3',
            name: 'Body Retouching',
            icon: require('../assets/DropHalf.png'),
            headerImage: require('../assets/image 8.png'),
            color: '#E31895',
            button: {
                top: 175,
                paddingHorizontal: 110,
            },
            imageContainerStyle: {
                top: height * 0.7 - 240,
                alignItems: 'center',
                left: 0,
                right: 0,
                // position: 'absolute',
            },
            headerStyle: {
                height: 500,
            },
            description: ['Lip color enhancement', 'Blush & glow'],
        },
        {
            id: '4',
            name: 'Other Services',
            icon: require('../assets/Eyedropper.png'),
            headerImage: require('../assets/image 9.png'),
            color: '#E3AA18',
            imageContainerStyle: {
                top: height * 0.7 - 240,
                alignItems: 'center',
                left: 0,
                right: 0,
                // position: 'absolute',
            },
            button: {
                top: 160,
                paddingHorizontal: 118,
            },
            headerStyle: {
                height: 270,
            },
            description: ['Eye color enhancement', 'Brightening whites'],
        },
    ];
    



    const openModal = (service) => {
        setSelectedService(service);
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    
    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setSelectedService(null);
        });
    };
    React.useEffect(() => {
        const getUserDetails = async () => {
            const userdata = await AsyncStorage.getItem('user');
            setUserDetails(JSON.parse(userdata))
            console.log(JSON.parse(userdata))
        }
        getUserDetails()
    }, []);
    // Ask user to confirm; resolves true/false
const confirmAction = (title, message) =>
  new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Proceed', style: 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true }
    );
  });

    return (
        <View style={styles.wrapper}>
            {/* Service Buttons */}
            <View style={styles.modalBox}>
                <View style={styles.serviceRow}>
                    {services.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={styles.iconCard}
                            onPress={userDetails?.role === 'user' ? () => openModal(service) : ()=>{
                                Alert.alert("You are an agent!","This options are for customer")
                            }}
                        >
                            <View style={[styles.circle, { backgroundColor: service.color }]}>
                                <Image source={service.icon} style={styles.icon} />
                            </View>
                        </TouchableOpacity>

                    ))}
                </View>
                <View style={{ flex: '1', flexDirection: 'row', gap: 45, marginTop: 10 }}>
                    <ThemedText style={{ fontSize: 10, marginLeft:10
                     }}> Editing</ThemedText>
                    <ThemedText style={{ fontSize: 10,marginLeft:-7 }}> Manipulation</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginLeft: -15, }}> Retouching</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginLeft: -10 }}>Others</ThemedText>
                </View>
            </View>

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="none">
                <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeModal} />
                </BlurView>

                {/* Header Image & Title Sliding Together */}
                {selectedService?.headerImage && (
                    <Animated.View
                        style={[
                            styles.floatingImageContainer,
                            selectedService.imageContainerStyle,
                            {
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, height],
                                            outputRange: [0, height],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Image
                            source={selectedService.headerImage}
                            style={[styles.headerImage, selectedService.headerStyle]}
                            resizeMode="cover"
                        />
                        <BlurView intensity={60} tint="dark" style={[styles.titleBar, selectedService.button]}>
                            <ThemedText fontFamily='monaque' style={styles.titleText}>{selectedService?.name}</ThemedText>
                        </BlurView>
                    </Animated.View>
                )}

                {/* Slide-up Modal Content */}
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            {selectedService?.name === 'Other Services' ? (
                                <>
                                    <ThemedText style={styles.modalTitle}>
                                        Can’t find what you need, there are several other
                                        services we offer , kindly type it in the box below :
                                    </ThemedText>
                                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 12 }}>
                                        <TextInput
                                            style={{ height: 40, fontSize: 16 }}
                                            placeholder="Input service"
                                            placeholderTextColor="#888"
                                            value={customServiceInput}
                                            onChangeText={setCustomServiceInput}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <ThemedText style={styles.modalTitle}>
                                        We offer the following {selectedService?.name} services:
                                    </ThemedText>
                                    {selectedService?.description?.map((item, index) => (
                                        <View key={index} style={styles.bulletItem}>
                                            <View style={styles.bullet} />
                                            <ThemedText style={styles.bulletText}>{item}</ThemedText>
                                        </View>
                                    ))}
                                </>
                            )}
                        </ScrollView>

                        {/* <TouchableOpacity style={styles.proceedBtn} onPress={closeModal}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed</Text>
                        </TouchableOpacity> */}
                     <TouchableOpacity
  style={styles.proceedBtn}
  onPress={async () => {
    const finalServiceName =
      selectedService?.name === 'Other Services'
        ? (customServiceInput || '').trim() || 'Other Services'
        : selectedService?.name;

    // 1) Ask for confirmation first
    const ok = await confirmAction(
      'Confirm Service',
      `Do you want to proceed with "${finalServiceName}"?`
    );
    if (!ok) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('You must be logged in.');
        return;
      }

      // 2) Proceed after confirmation
      const response = await axios.post(
        API.ASSIGN_AGENT,
        { service_type: finalServiceName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const chatId = response?.data?.data?.chat_id;
      const agentData = response?.data?.data?.agent;

      if (agentData && chatId) {
        closeModal();
        setCustomServiceInput('');

        navigation.navigate('Chat', {
          service: finalServiceName,
          userRole: 'agent',
          user: 'LoggedInUser',
          agent: {
            name: agentData.name,
            image: { uri: agentData.image_url },
          },
          chat_id: chatId,
        });
      } else {
        alert('No agent assigned.');
      }
    } catch (error) {
      console.error('Error assigning agent:', error?.response?.data || error.message);
      alert('Failed to assign agent.');
    }
  }}
>
  <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Proceed</ThemedText>
</TouchableOpacity>

                    </View>
                </Animated.View>
            </Modal>
        </View>
    );
};

export default ServiceCategoryList;

const styles = StyleSheet.create({
 wrapper: {
    zIndex: 0,
    width: width - 40, // 20 margin on left + 20 on right
    marginHorizontal: 20,
    marginTop: -58,
},
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        elevation: 10,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconCard: {
        alignItems: 'center',
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },

    // Floating Image Container (individual styles overridden per service)
    floatingImageContainer: {
        position: 'absolute',
    },
    headerImage: {
        width: 409,
        height: 220,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

    },
    titleBar: {
        position: 'absolute',
        left: 1,
        borderColor: '#992C55',
        borderWidth: 1,
        top: 20,
        paddingVertical: 14,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        overflow: 'hidden',
    },
    titleText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 19,
        textAlign: 'center',
    },

    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: height * 0.8,

    },
    modalContent: {
        backgroundColor: '#FFE5F1',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 25,
        paddingTop: 20,
        // paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 15,
        // fontWeight: 'bold',
        // color: '#4A0F2C',
        marginBottom: 15,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    bullet: {
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        marginRight: 10,
        marginTop: 6,
    },
    bulletText: {
        color: '#4A0F2C',
        fontSize: 14,
        flexShrink: 1,
    },
    proceedBtn: {
        // marginTop: 20,
        backgroundColor: '#992C55',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
});

