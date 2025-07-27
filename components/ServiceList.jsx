// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Modal,
//   Animated,
//   Easing,
//   Dimensions,
// } from 'react-native';

// const { height } = Dimensions.get('window');

// const ServiceCategoryList = () => {
//   const [selectedService, setSelectedService] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const slideAnim = useState(new Animated.Value(height))[0]; // slide from bottom

//   const services = [
//     {
//       id: '1',
//       name: 'Photo Editing',
//       icon: require('../assets/PenNib.png'),
//       color: '#E31818',
//       description: [
//         'Skin Smoothing',
//         'Removal of scars',
//         'Skin blemish removal, blurs',
//         'Wrinkles, Pimples, Stretch marks, body hairs',
//         'Skin tone adjustment, Whitening of teeth and eyes.....',
//       ],
//     },
//     {
//       id: '2',
//       name: 'Hair Fix',
//       icon: require('../assets/Vector (6).png'),
//       color: '#7018E3',
//       description: ['Hair smoothing', 'Frizz control', 'Color balance'],
//     },
//     {
//       id: '3',
//       name: 'Makeup',
//       icon: require('../assets/DropHalf.png'),
//       color: '#E31895',
//       description: ['Lip color enhancement', 'Blush & glow'],
//     },
//     {
//       id: '4',
//       name: 'Eye Color',
//       icon: require('../assets/Eyedropper.png'),
//       color: '#E3AA18',
//       description: ['Eye color enhancement', 'Brightening whites'],
//     },
//   ];

//   const openModal = (service) => {
//     setSelectedService(service);
//     setModalVisible(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 400,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeModal = () => {
//     Animated.timing(slideAnim, {
//       toValue: height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setModalVisible(false);
//       setSelectedService(null);
//     });
//   };

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.modalBox}>
//         <View style={styles.serviceRow}>
//           {services.map((service) => (
//             <TouchableOpacity
//               key={service.id}
//               style={styles.iconCard}
//               onPress={() => openModal(service)}
//             >
//               <View style={[styles.circle, { backgroundColor: service.color }]}>
//                 <Image source={service.icon} style={styles.icon} />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Slide Up Modal */}
//       <Modal visible={modalVisible} transparent animationType="none">
//         <Animated.View
//           style={[
//             styles.modalContainer,
//             { transform: [{ translateY: slideAnim }] },
//           ]}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               We offer the following {selectedService?.name} services:
//             </Text>

//             {selectedService?.description?.map((item, index) => (
//               <View key={index} style={styles.bulletItem}>
//                 <View style={styles.bullet} />
//                 <Text style={styles.bulletText}>{item}</Text>
//               </View>
//             ))}

//             <TouchableOpacity style={styles.proceedBtn} onPress={closeModal}>
//               <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// };

// export default ServiceCategoryList;

// const styles = StyleSheet.create({
//   wrapper: {
//     position: 'absolute',
//     top: 400,
//     left: 20,
//     width: 370,
//   },
//   modalBox: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   serviceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   iconCard: {
//     alignItems: 'center',
//   },
//   circle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   icon: {
//     width: 25,
//     height: 25,
//     resizeMode: 'contain',
//   },

//   // Modal styles
//   modalContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height * 0.55,
//     backgroundColor: 'transparent',
//   },
//   modalContent: {
//     flex: 1,
//     backgroundColor: '#FFE5F1',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 25,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4A0F2C',
//     marginBottom: 20,
//   },
//   bulletItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 10,
//   },
//   bullet: {
//     width: 10,
//     height: 10,
//     backgroundColor: 'red',
//     borderRadius: 5,
//     marginRight: 10,
//     marginTop: 6,
//   },
//   bulletText: {
//     color: '#4A0F2C',
//     fontSize: 14,
//     flexShrink: 1,
//   },
//   proceedBtn: {
//     marginTop: 30,
//     backgroundColor: '#992C55',
//     paddingVertical: 12,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
// });

// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Image,
//     StyleSheet,
//     Modal,
//     Animated,
//     Easing,
//     Dimensions,
//     ScrollView,
// } from 'react-native';
// import { BlurView } from 'expo-blur';

// const { height } = Dimensions.get('window');

// const ServiceCategoryList = () => {
//     const [selectedService, setSelectedService] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const slideAnim = useState(new Animated.Value(height))[0];

//     const services = [
//         {
//             id: '1',
//             name: 'Photo Editing',
//             icon: require('../assets/PenNib.png'),
//             color: '#E31818',
//             description: [
//                 'Skin Smoothing',
//                 'Removal of scars',
//                 'Skin blemish removal, blurs',
//                 'Wrinkles, Pimples, Stretch marks, body hairs',
//                 'Skin tone adjustment, Whitening of teeth and eyes.....',
//             ],
//         },
//         {
//             id: '2',
//             name: 'Hair Fix',
//             icon: require('../assets/Vector (6).png'),
//             color: '#7018E3',
//             description: ['Hair smoothing', 'Frizz control', 'Color balance'],
//         },
//         {
//             id: '3',
//             name: 'Makeup',
//             icon: require('../assets/DropHalf.png'),
//             color: '#E31895',
//             description: ['Lip color enhancement', 'Blush & glow'],
//         },
//         {
//             id: '4',
//             name: 'Eye Color',
//             icon: require('../assets/Eyedropper.png'),
//             color: '#E3AA18',
//             description: ['Eye color enhancement', 'Brightening whites'],
//         },
//     ];

//     const openModal = (service) => {
//         setSelectedService(service);
//         setModalVisible(true);
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 400,
//             easing: Easing.out(Easing.ease),
//             useNativeDriver: true,
//         }).start();
//     };

//     const closeModal = () => {
//         Animated.timing(slideAnim, {
//             toValue: height,
//             duration: 300,
//             useNativeDriver: true,
//         }).start(() => {
//             setModalVisible(false);
//             setSelectedService(null);
//         });
//     };

//     return (
//         <View style={styles.wrapper}>
//             {/* Service Cards */}
//             <View style={styles.modalBox}>
//                 <View style={styles.serviceRow}>
//                     {services.map((service) => (
//                         <TouchableOpacity
//                             key={service.id}
//                             style={styles.iconCard}
//                             onPress={() => openModal(service)}
//                         >
//                             <View style={[styles.circle, { backgroundColor: service.color }]}>
//                                 <Image source={service.icon} style={styles.icon} />
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </View>

//             {/* Modal with Blur Background */}
//             <Modal visible={modalVisible} transparent animationType="none">
//                 {/* Blurred Background */}
//                 <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
//                     <TouchableOpacity
//                         style={{ flex: 1 }}
//                         activeOpacity={1}
//                         onPress={closeModal}
//                     />
//                 </BlurView>

//                 {/* Slide-up Animated Modal */}
//                 <Animated.View
//                     style={[
//                         styles.modalContainer,
//                         { transform: [{ translateY: slideAnim }] },
//                     ]}
//                 >
//                     <View style={styles.modalContent}>
//                         {/* Title Button */}
//                         <BlurView
//                             intensity={70} // Adjust blur intensity (0-100)
//                             tint="light" // or "light", "default", "extraDark"
//                             style={styles.titleBar}
//                         >
//                             <Text style={styles.titleText}>{selectedService?.name}</Text>
//                         </BlurView>

//                         {/* Scrollable dynamic content */}
//                         <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
//                             <Text style={styles.modalTitle}>
//                                 We offer the following {selectedService?.name} services:
//                             </Text>

//                             {selectedService?.description?.map((item, index) => (
//                                 <View key={index} style={styles.bulletItem}>
//                                     <View style={styles.bullet} />
//                                     <Text style={styles.bulletText}>{item}</Text>
//                                 </View>
//                             ))}
//                         </ScrollView>

//                         <TouchableOpacity style={styles.proceedBtn} onPress={closeModal}>
//                             <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </Animated.View>
//             </Modal>
//         </View>
//     );
// };

// export default ServiceCategoryList;

// const styles = StyleSheet.create({
//     wrapper: {
//         position: 'absolute',
//         top: 400,
//         left: 20,
//         width: 370,
//     },
//     modalBox: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         elevation: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 6,
//     },
//     serviceRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     iconCard: {
//         alignItems: 'center',
//     },
//     circle: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     icon: {
//         width: 25,
//         height: 25,
//         resizeMode: 'contain',
//     },

//     modalContainer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         maxHeight: height * 0.9,
//         borderTopLeftRadius:12,
//     },
//     modalContent: {
//         backgroundColor: '#FFE5F1',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 25,
//     },
//     //   titleBar: {
//     //     alignSelf: 'center',
//     //     backgroundColor: '#4A0F2C',
//     //     borderRadius: 20,
//     //     position:'absolute',
//     //     paddingHorizontal: 30,
//     //     top:-50,
//     //     paddingVertical: 6,
//     //     marginBottom: 10,
//     //   },
//     //   titleText: {
//     //     color: 'white',
//     //     fontWeight: '600',
//     //     fontSize: 16,
//     //   },
//     titleBar: {
//         alignSelf: 'center',
//         borderRadius: 10,
//         position: 'absolute',
//         paddingHorizontal: 120,
//         top: -55,
//         paddingVertical: 10,
//         marginBottom: 10,
//         overflow: 'hidden', // Important for BlurView
//     },
//     titleText: {
//         color: 'white',
//         fontWeight: '600',
//         fontSize: 17,
//         textAlign: 'center',
//     },
//     modalTitle: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         color: '#4A0F2C',
//         marginBottom: 15,
//     },
//     bulletItem: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         marginBottom: 10,
//     },
//     bullet: {
//         width: 10,
//         height: 10,
//         backgroundColor: 'red',
//         borderRadius: 5,
//         marginRight: 10,
//         marginTop: 6,
//     },
//     bulletText: {
//         color: '#4A0F2C',
//         fontSize: 14,
//         flexShrink: 1,
//     },
//     proceedBtn: {
//         marginTop: 20,
//         backgroundColor: '#992C55',
//         paddingVertical: 12,
//         borderRadius: 30,
//         alignItems: 'center',
//     },
// });

// image wala

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Modal,
//   Animated,
//   Easing,
//   Dimensions,
//   ScrollView,
// } from 'react-native';
// import { BlurView } from 'expo-blur';

// const { height } = Dimensions.get('window');

// const ServiceCategoryList = () => {
//   const [selectedService, setSelectedService] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const slideAnim = useState(new Animated.Value(height))[0];

//   const services = [
//     {
//       id: '1',
//       name: 'Photo Editing',
//       icon: require('../assets/PenNib.png'),
//       headerImage: require('../assets/image 5.png'), // ⬅️ Add header image
//       color: '#E31818',
//       description: [
//         'Skin Smoothing',
//         'Removal of scars',
//         'Skin blemish removal, blurs',
//         'Wrinkles, Pimples, Stretch marks, body hairs',
//         'Skin tone adjustment, Whitening of teeth and eyes.....',
//       ],
//     },
//     {
//       id: '2',
//       name: 'Hair Fix',
//       icon: require('../assets/Vector (6).png'),
//     //   headerImage: require('../assets/photo-header.png'),
//       color: '#7018E3',
//       description: ['Hair smoothing', 'Frizz control', 'Color balance'],
//     },
//     {
//       id: '3',
//       name: 'Makeup',
//       icon: require('../assets/DropHalf.png'),
//     //   headerImage: require('../assets/photo-header.png'),
//       color: '#E31895',
//       description: ['Lip color enhancement', 'Blush & glow'],
//     },
//     {
//       id: '4',
//       name: 'Eye Color',
//       icon: require('../assets/Eyedropper.png'),
//     //   headerImage: require('../assets/photo-header.png'),
//       color: '#E3AA18',
//       description: ['Eye color enhancement', 'Brightening whites'],
//     },
//   ];

//   const openModal = (service) => {
//     setSelectedService(service);
//     setModalVisible(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 400,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeModal = () => {
//     Animated.timing(slideAnim, {
//       toValue: height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setModalVisible(false);
//       setSelectedService(null);
//     });
//   };

//   return (
//     <View style={styles.wrapper}>
//       {/* Service Buttons */}
//       <View style={styles.modalBox}>
//         <View style={styles.serviceRow}>
//           {services.map((service) => (
//             <TouchableOpacity
//               key={service.id}
//               style={styles.iconCard}
//               onPress={() => openModal(service)}
//             >
//               <View style={[styles.circle, { backgroundColor: service.color }]}>
//                 <Image source={service.icon} style={styles.icon} />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Modal */}
//       <Modal visible={modalVisible} transparent animationType="none">
//         <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={closeModal}
//           />
//         </BlurView>

//         <Animated.View
//           style={[
//             styles.modalContainer,
//             { transform: [{ translateY: slideAnim }] },
//           ]}
//         >
//           <View style={styles.modalContent}>
//             {/* Header Image */}
//             <View>
//             <Image
//               source={selectedService?.headerImage}
//               style={styles.headerImage}
//               resizeMode="cover"
//             />
//             </View>

//             {/* Floating Title */}
//             <BlurView intensity={60} tint="dark" style={styles.titleBar}>
//               <Text style={styles.titleText}>{selectedService?.name}</Text>
//             </BlurView>

//             {/* Content */}
//             <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
//               <Text style={styles.modalTitle}>
//                 We offer the following {selectedService?.name} services:
//               </Text>

//               {selectedService?.description?.map((item, index) => (
//                 <View key={index} style={styles.bulletItem}>
//                   <View style={styles.bullet} />
//                   <Text style={styles.bulletText}>{item}</Text>
//                 </View>
//               ))}
//             </ScrollView>

//             {/* Proceed Button */}
//             <TouchableOpacity style={styles.proceedBtn} onPress={closeModal}>
//               <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// };

// export default ServiceCategoryList;

// const styles = StyleSheet.create({
//   wrapper: {
//     position: 'absolute',
//     top: 400,
//     left: 20,
//     width: 370,
//   },
//   modalBox: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     elevation: 10,
//   },
//   serviceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   iconCard: {
//     alignItems: 'center',
//   },
//   circle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   icon: {
//     width: 25,
//     height: 25,
//     resizeMode: 'contain',
//   },

//   modalContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     maxHeight: height * 0.9,
//   },
//   modalContent: {
//     backgroundColor: '#FFE5F1',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 25,
//     paddingBottom: 20,
//   },
//   headerImage: {
//     width: '120%',
//     height: 200,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   titleBar: {
//     position: 'absolute',
//     alignSelf: 'center',
//     top: 170,
//     paddingHorizontal: 30,
//     paddingVertical: 8,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   titleText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   modalTitle: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#4A0F2C',
//     marginTop: 60,
//     marginBottom: 15,
//   },
//   bulletItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 10,
//   },
//   bullet: {
//     width: 10,
//     height: 10,
//     backgroundColor: 'red',
//     borderRadius: 5,
//     marginRight: 10,
//     marginTop: 6,
//   },
//   bulletText: {
//     color: '#4A0F2C',
//     fontSize: 14,
//     flexShrink: 1,
//   },
//   proceedBtn: {
//     marginTop: 20,
//     backgroundColor: '#992C55',
//     paddingVertical: 12,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
// });

// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Image,
//     StyleSheet,
//     Modal,
//     Animated,
//     Easing,
//     Dimensions,
//     ScrollView,
// } from 'react-native';
// import { BlurView } from 'expo-blur';

// const { height } = Dimensions.get('window');

// const ServiceCategoryList = () => {
//     const [selectedService, setSelectedService] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const slideAnim = useState(new Animated.Value(height))[0];

//     const services = [
//         {
//             id: '1',
//             name: 'Photo Editing',
//             icon: require('../assets/PenNib.png'),
//             headerImage: require('../assets/image 5.png'),
//             // Update this to your actual image
//             // Update this to your actual image
//             imageContainerStyle: {
//                 top: height * 0.6 - 210,
//                 alignItems: 'center',
//                 left: 0,
//                 right: 0,
//                 position: 'absolute',

//             },
//              button : {
//                 top:120,
//                 paddingHorizontal: 140,
//             },


//             color: '#E31818',
//             description: [
//                 'Skin Smoothing',
//                 'Removal of scars',
//                 'Skin blemish removal, blurs',
//                 'Wrinkles, Pimples, Stretch marks, body hairs',
//                 'Skin tone adjustment, Whitening of teeth and eyes.....',
//             ],
//         },
//         {
//             id: '2',
//             name: 'Photo Manipulaion',
//             icon: require('../assets/Vector (6).png'),
//             headerImage: require('../assets/image 5 (1).png'),
//             imageContainerStyle: {
//                 top: height * 0.6 - 170,
//                 alignItems: 'center',
//                 left: 0,
//                 right: 0,
//                 position: 'absolute',

//             },
//              button : {
//                 top:140,
//                 paddingHorizontal: 120,
//             },
//             headerStyle: {
//                 height: 220,
//             },
//             color: '#7018E3',
//             description: ['Hair smoothing', 'Frizz control', 'Color balance'],

//         },
//         {
//             id: '3',
//             name: 'Body Retouching',
//             icon: require('../assets/DropHalf.png'),
//             headerImage: require('../assets/image 8.png'),
//             color: '#E31895',
//             button : {
//                 top:155,
//                 paddingHorizontal: 125,
//             },
//             imageContainerStyle: {
//                 top: height * 0.7 - 240,
//                 alignItems: 'center',
//                 left: 0,
//                 right: 0,
//                 position: 'absolute',

//             },
//             headerStyle: {
//                 height: 500,
//             },
//             description: ['Lip color enhancement', 'Blush & glow'],
//         },
//         {
//             id: '4',
//             name: 'Other Services',
//             icon: require('../assets/Eyedropper.png'),
//               headerImage: require('../assets/image 9.png'),
//             color: '#E3AA18',
//              imageContainerStyle: {
//                 top: height * 0.7 - 240,
//                 alignItems: 'center',
//                 left: 0,
//                 right: 0,
//                 position: 'absolute',

//             },
//              button : {
//                 top:150,
//                 paddingHorizontal: 136,
//             },
//               headerStyle: {
//                 height: 220,
//             },
//             description: ['Eye color enhancement', 'Brightening whites'],
//         },
//     ];

//     const openModal = (service) => {
//         setSelectedService(service);
//         setModalVisible(true);
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 400,
//             easing: Easing.out(Easing.ease),
//             useNativeDriver: true,
//         }).start();
//     };

//     const closeModal = () => {
//         Animated.timing(slideAnim, {
//             toValue: height,
//             duration: 300,
//             useNativeDriver: true,
//         }).start(() => {
//             setModalVisible(false);
//             setSelectedService(null);
//         });
//     };

//     return (
//         <View style={styles.wrapper}>
//             {/* Service Buttons */}
//             <View style={styles.modalBox}>
//                 <View style={styles.serviceRow}>
//                     {services.map((service) => (
//                         <TouchableOpacity
//                             key={service.id}
//                             style={styles.iconCard}
//                             onPress={() => openModal(service)}
//                         >
//                             <View style={[styles.circle, { backgroundColor: service.color }]}>
//                                 <Image source={service.icon} style={styles.icon} />
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </View>

//             {/* Modal */}
//             <Modal visible={modalVisible} transparent animationType="none">
//                 <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
//                     <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeModal} />
//                 </BlurView>

//                 {/* Header Image */}
//                 {selectedService?.headerImage && (
//                     <View style={[styles.floatingImageContainer, selectedService.imageContainerStyle]}>
//                         <Image source={selectedService.headerImage} style={[styles.headerImage, selectedService.headerStyle]} resizeMode="cover" />

//                 <BlurView intensity={60} tint="dark" style={[styles.titleBar, selectedService.button]}>
//                     <Text style={styles.titleText }>{selectedService?.name}</Text>
//                 </BlurView>
//                     </View>
//                 )}

//                 {/* Slide-up Modal */}
//                 <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
//                     <View style={styles.modalContent}>
//                         <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
//                             <Text style={styles.modalTitle}>
//                                 We offer the following {selectedService?.name} services:
//                             </Text>

//                             {selectedService?.description?.map((item, index) => (
//                                 <View key={index} style={styles.bulletItem}>
//                                     <View style={styles.bullet} />
//                                     <Text style={styles.bulletText}>{item}</Text>
//                                 </View>
//                             ))}
//                         </ScrollView>

//                         <TouchableOpacity style={styles.proceedBtn} onPress={closeModal}>
//                             <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </Animated.View>
//             </Modal>
//         </View>
//     );
// };

// export default ServiceCategoryList;

// const styles = StyleSheet.create({
//     wrapper: {
//         position: 'absolute',
//         top: 400,
//         left: 20,
//         width: 370,
//     },
//     modalBox: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         elevation: 10,
//     },
//     serviceRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     iconCard: {
//         alignItems: 'center',
//     },
//     circle: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     icon: {
//         width: 25,
//         height: 25,
//         resizeMode: 'contain',
//     },

//     // Header Image + Title Bar
//     floatingImageContainer: {

//         // top: height * 0.6 - 210, // Adjust this as per design
//         // left: 0,
//         // right: 0,
//         // alignItems: 'center',
//     },
//     headerImage: {
//         width: 409,
//         height: 200,
//         // borderRadius: 20,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//     },
//     titleBar: {
//         position: 'absolute',
//         // top: 120,
//         left:14,

//         borderColor:'#992C55',
//         borderWidth: 1,
//         paddingVertical: 14,
//         backgroundColor: 'rgba(0,0,0,0.2)',
//         borderRadius: 10,
//         overflow: 'hidden',
//     },
//     titleText: {
//         color: 'white',
//         fontWeight: '600',
//         fontSize: 17,
//         textAlign: 'center',
//     },

//     modalContainer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         maxHeight: height * 0.8,
//     },
//     modalContent: {
//         backgroundColor: '#FFE5F1',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingHorizontal: 25,
//         paddingTop: 80, // Add spacing to account for floating image
//         paddingBottom: 20,
//     },
//     modalTitle: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         color: '#4A0F2C',
//         marginBottom: 15,
//     },
//     bulletItem: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         marginBottom: 10,
//     },
//     bullet: {
//         width: 10,
//         height: 10,
//         backgroundColor: 'red',
//         borderRadius: 5,
//         marginRight: 10,
//         marginTop: 6,
//     },
//     bulletText: {
//         color: '#4A0F2C',
//         fontSize: 14,
//         flexShrink: 1,
//     },
//     proceedBtn: {
//         marginTop: 20,
//         backgroundColor: '#992C55',
//         paddingVertical: 12,
//         borderRadius: 30,
//         alignItems: 'center',
//     },
// });

import React, { useState } from 'react';
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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API from '../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { height } = Dimensions.get('window');

const ServiceCategoryList = () => {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(height))[0];
    const [customServiceInput, setCustomServiceInput] = useState('');


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

    return (
        <View style={styles.wrapper}>
            {/* Service Buttons */}
            <View style={styles.modalBox}>
                <View style={styles.serviceRow}>
                    {services.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={styles.iconCard}
                            onPress={() => openModal(service)}
                        >
                            <View style={[styles.circle, { backgroundColor: service.color }]}>
                                <Image source={service.icon} style={styles.icon} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ flex: '1', flexDirection: 'row', gap: 20, marginTop: 10 }}>
                    <ThemedText style={{ fontSize: 10, }}>Photo Editing</ThemedText>
                    <ThemedText style={{ fontSize: 10, }}>Photo Manipulation</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginLeft: -10, }}>Body Retouching</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginLeft: 10 }}>Others</ThemedText>
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
                                        ? customServiceInput.trim() || 'Other Services'
                                        : selectedService.name;

                                try {
                                    const token = await AsyncStorage.getItem('token');
                                    

                                    console.log('Using token:', token); // debug

                                    if (!token) {
                                        alert('You must be logged in.');
                                        return;
                                    }

                                    const response = await axios.post(API.ASSIGN_AGENT, {
                                        service_type: finalServiceName,
                                    }, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    console.log('Response:', response.data);

                                    const agentData = response.data.data.agent;

                                    if (agentData) {
                                        closeModal();
                                        setCustomServiceInput('');

                                        navigation.navigate('Chat', {
                                            service: finalServiceName,
                                            userRole: 'agent',
                                            user: 'LoggedInUser', // Replace this if you want to fetch from AsyncStorage
                                            agent: {
                                                name: agentData.name,
                                                image: { uri: agentData.image_url },
                                            },
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
        // position: 'absolute',
        zIndex: 0,
        width: 370,
        marginTop: -58,
        marginLeft: 20
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
        left: 14,
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
        paddingTop: 50,
        paddingBottom: 20,
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
        marginTop: 20,
        backgroundColor: '#992C55',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
});

