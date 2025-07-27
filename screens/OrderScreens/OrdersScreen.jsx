// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other'];

// const allOrders = [
//   {
//     id: '1',
//     type: 'Editing',
//     price: '₦25,000',
//     date: '21 May, 25 - 05:22AM',
//     status: 'Completed',
//        iconcircle:{
//       backgroundColor:"#E31818"
//     }
//   },
//   {
//     id: '2',
//     type: 'Manipulation',
//     price: '₦25,000',
//     date: '21 May, 25 - 05:22AM',
//     status: 'Completed',
//           iconcircle:{
//       backgroundColor:"#7018E3"
//     }
//   },
//   {
//     id: '3',
//     type: 'Retouching',
//     price: '₦25,000',
//     date: '21 May, 25 - 05:22AM',
//     status: 'Completed',
//           iconcircle:{
//       backgroundColor:"#E31895"
//     }
//   },
//   {
//     id: '4',
//     type: 'Other',
//     price: '₦25,000',
//     date: '21 May, 25 - 05:22AM',
//     status: 'In Progress',
//     iconcircle:{
//       backgroundColor:"#E3AA18"
//     }
//   },
// ];

// const icons = {
//   Editing: require('../../assets/PenNib.png'),
//   Manipulation: require('../../assets/Vector (6).png'),
//   Retouching: require('../../assets/DropHalf.png'),
//   Other: require('../../assets/Eyedropper.png'),
// };

// const OrderScreen = () => {
//   const navigation = useNavigation();
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   const filteredOrders =
//     selectedCategory === 'All'
//       ? allOrders
//       : allOrders.filter((order) => order.type === selectedCategory);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'Completed':
//         return styles.completed;
//       case 'In Progress':
//         return styles.inProgress;
//       default:
//         return {};
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Bar */}
//       <View style={styles.topSection}>
//         <View style={styles.topBarRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back" size={28} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Orders</Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryContainer}
//         >
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               onPress={() => setSelectedCategory(cat)}
//               style={[
//                 styles.categoryButton,
//                 selectedCategory === cat && styles.activeCategoryButton,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   selectedCategory === cat && styles.activeCategoryText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Order Cards Section */}
//       <View style={styles.cardSection}>
//         <FlatList
//           data={filteredOrders}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.card}
//               onPress={() => navigation.navigate('OrderDetails', { order: item })}
//             >
//               <View style={styles.cardLeft}>
//                 <View style={[styles.iconCircle, item.iconcircle]}>
//                   <Image
//                     source={icons[item.type] || icons.Other}
//                     style={{ width: 24, height: 24 }}
//                     resizeMode="contain"
//                   />
//                 </View>
//                 <View>
//                   <Text style={styles.orderType}>{`Photo ${item.type}`}</Text>
//                   <Text style={styles.price}>{item.price}</Text>
//                 </View>
//               </View>
//               <View style={styles.cardRight}>
//                 <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
//                 <Text style={styles.date}>{item.date}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const screenWidth = Dimensions.get('window').width;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   topSection: {
//     backgroundColor: '#992C55',
//     paddingTop: 70,
//     paddingBottom: 40,
//     paddingHorizontal: 16,
//     zIndex: 0,
//   },
//   topBarRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 10,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   categoryButton: {
//     backgroundColor: '#BA3B6B',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   activeCategoryButton: {
//     backgroundColor: '#fff',
//   },
//   categoryText: {
//     fontSize: 13,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   activeCategoryText: {
//     color: '#000',
//   },
//   cardSection: {
//     flex: 1,
//     backgroundColor: '#F5F5F7',
//     paddingHorizontal: 16,
//     marginTop: -20,
//     paddingTop:20,
//     borderTopLeftRadius:25,
//     borderTopRightRadius:25,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 4,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     // backgroundColor: '#992C55',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   orderType: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222',
//   },
//   price: {
//     fontSize: 13,
//     color: '#999',
//   },
//   cardRight: {
//     alignItems: 'flex-end',
//   },
//   status: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   completed: {
//     color: 'green',
//   },
//   inProgress: {
//     color: '#e58b00',
//   },
//   date: {
//     fontSize: 11,
//     color: '#aaa',
//   },
// });

// export default OrderScreen;
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other'];
// const sortOptions = ['Status', 'Date'];

// const allOrders = [
//   {
//     id: '1',
//     type: 'Editing',
//     price: '₦25,000',
//     date: '2025-05-21T05:22:00',
//     status: 'Completed',
//     iconcircle: {
//       backgroundColor: '#E31818',
//     },
//   },
//   {
//     id: '2',
//     type: 'Manipulation',
//     price: '₦25,000',
//     date: '2025-05-21T05:22:00',
//     status: 'Completed',
//     iconcircle: {
//       backgroundColor: '#7018E3',
//     },
//   },
//   {
//     id: '3',
//     type: 'Retouching',
//     price: '₦25,000',
//     date: '2025-05-21T05:22:00',
//     status: 'Completed',
//     iconcircle: {
//       backgroundColor: '#E31895',
//     },
//   },
//   {
//     id: '4',
//     type: 'Other',
//     price: '₦25,000',
//     date: '2025-05-21T05:22:00',
//     status: 'In Progress',
//     iconcircle: {
//       backgroundColor: '#E3AA18',
//     },
//   },
// ];

// const icons = {
//   Editing: require('../../assets/PenNib.png'),
//   Manipulation: require('../../assets/Vector (6).png'),
//   Retouching: require('../../assets/DropHalf.png'),
//   Other: require('../../assets/Eyedropper.png'),
// };

// const OrderScreen = () => {
//   const navigation = useNavigation();
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortBy, setSortBy] = useState('Date');

//   let filteredOrders = selectedCategory === 'All'
//     ? [...allOrders]
//     : allOrders.filter((order) => order.type === selectedCategory);

//   if (sortBy === 'Status') {
//     filteredOrders.sort((a, b) => a.status.localeCompare(b.status));
//   } else if (sortBy === 'Date') {
//     filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
//   }

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'Completed':
//         return styles.completed;
//       case 'In Progress':
//         return styles.inProgress;
//       default:
//         return {};
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Bar */}
//       <View style={styles.topSection}>
//         <View style={styles.topBarRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back" size={28} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Orders</Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryContainer}
//         >
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               onPress={() => setSelectedCategory(cat)}
//               style={[
//                 styles.categoryButton,
//                 selectedCategory === cat && styles.activeCategoryButton,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   selectedCategory === cat && styles.activeCategoryText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Sort Buttons */}
//         <View style={styles.sortRow}>
//           {sortOptions.map((option) => (
//             <TouchableOpacity
//               key={option}
//               onPress={() => setSortBy(option)}
//               style={[
//                 styles.sortButton,
//                 sortBy === option && styles.activeSortButton,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.sortText,
//                   sortBy === option && styles.activeSortText,
//                 ]}
//               >
//                 {option}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Order Cards Section */}
//       <View style={styles.cardSection}>
//         <FlatList
//           data={filteredOrders}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.card}
//               onPress={() => navigation.navigate('OrderDetails', { order: item })}
//             >
//               <View style={styles.cardLeft}>
//                 <View style={[styles.iconCircle, item.iconcircle]}>
//                   <Image
//                     source={icons[item.type] || icons.Other}
//                     style={{ width: 24, height: 24 }}
//                     resizeMode="contain"
//                   />
//                 </View>
//                 <View>
//                   <Text style={styles.orderType}>{`Photo ${item.type}`}</Text>
//                   <Text style={styles.price}>{item.price}</Text>
//                 </View>
//               </View>
//               <View style={styles.cardRight}>
//                 <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
//                 <Text style={styles.date}>{formatDateTime(item.date)}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const screenWidth = Dimensions.get('window').width;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   topSection: {
//     backgroundColor: '#992C55',
//     paddingTop: 70,
//     paddingBottom: 20,
//     paddingHorizontal: 16,
//     zIndex: 0,
//   },
//   topBarRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 10,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   categoryButton: {
//     backgroundColor: '#BA3B6B',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   activeCategoryButton: {
//     backgroundColor: '#fff',
//   },
//   categoryText: {
//     fontSize: 13,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   activeCategoryText: {
//     color: '#000',
//   },
//   sortRow: {
//     flexDirection: 'row',
//     marginTop: 12,
//     gap: 10,
//   },
//   sortButton: {
//     backgroundColor: '#BA3B6B',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 16,
//   },
//   activeSortButton: {
//     backgroundColor: '#fff',
//   },
//   sortText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   activeSortText: {
//     color: '#000',
//   },
//   cardSection: {
//     flex: 1,
//     backgroundColor: '#F5F5F7',
//     paddingHorizontal: 16,
//     marginTop: -20,
//     paddingTop: 20,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 4,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   orderType: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222',
//   },
//   price: {
//     fontSize: 13,
//     color: '#999',
//   },
//   cardRight: {
//     alignItems: 'flex-end',
//   },
//   status: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   completed: {
//     color: 'green',
//   },
//   inProgress: {
//     color: '#e58b00',
//   },
//   date: {
//     fontSize: 11,
//     color: '#aaa',
//   },
// });

// export default OrderScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other'];

// const allOrders = [
//   {
//     id: '1',
//     type: 'Editing',
//     price: '₦25,000',
//     date: '2025-05-21T05:22:00',
//     status: 'Completed',
//     iconcircle: { backgroundColor: '#E31818' },
//   },
//   {
//     id: '2',
//     type: 'Manipulation',
//     price: '₦25,000',
//     date: '2025-05-20T08:15:00',
//     status: 'Completed',
//     iconcircle: { backgroundColor: '#7018E3' },
//   },
//   {
//     id: '3',
//     type: 'Retouching',
//     price: '₦25,000',
//     date: '2025-05-19T11:00:00',
//     status: 'Completed',
//     iconcircle: { backgroundColor: '#E31895' },
//   },
//   {
//     id: '4',
//     type: 'Other',
//     price: '₦25,000',
//     date: '2025-05-22T06:00:00',
//     status: 'In Progress',
//     iconcircle: { backgroundColor: '#E3AA18' },
//   },
// ];

// const icons = {
//   Editing: require('../../assets/PenNib.png'),
//   Manipulation: require('../../assets/Vector (6).png'),
//   Retouching: require('../../assets/DropHalf.png'),
//   Other: require('../../assets/Eyedropper.png'),
// };

// const OrderScreen = () => {
//   const navigation = useNavigation();
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortBy, setSortBy] = useState(null);

//   // Filter by category
//   let filteredOrders =
//     selectedCategory === 'All'
//       ? allOrders
//       : allOrders.filter((order) => order.type === selectedCategory);

//   // Sort by status or date
//   if (sortBy === 'status') {
//     filteredOrders = [...filteredOrders].sort((a, b) =>
//       a.status.localeCompare(b.status)
//     );
//   } else if (sortBy === 'date') {
//     filteredOrders = [...filteredOrders].sort(
//       (a, b) => new Date(b.date) - new Date(a.date)
//     );
//   }

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'Completed':
//         return styles.completed;
//       case 'In Progress':
//         return styles.inProgress;
//       default:
//         return {};
//     }
//   };

//   const formatDateTime = (dateStr) => {
//     const date = new Date(dateStr);
//     return `${date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     })} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Bar */}
//       <View style={styles.topSection}>
//         <View style={styles.topBarRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back" size={28} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Orders</Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryContainer}
//         >
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               onPress={() => setSelectedCategory(cat)}
//               style={[
//                 styles.categoryButton,
//                 selectedCategory === cat && styles.activeCategoryButton,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   selectedCategory === cat && styles.activeCategoryText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Order Cards Section */}
//       <View style={styles.cardSection}>
//         {/* Sorting Buttons */}
//         <View style={styles.sortingRow}>
//           <TouchableOpacity
//             style={[
//               styles.sortButton,
//               sortBy === 'status' && styles.activeSortButton,
//             ]}
//             onPress={() => setSortBy('status')}
//           >
//             <Ionicons name="filter" size={16} color={sortBy === 'status' ? '#000' : '#999'} />
//             <Text style={[styles.sortText, sortBy === 'status' && styles.activeSortText]}>
//               Status
//             </Text>
//             <Ionicons name="chevron-down" size={16} color={sortBy === 'status' ? '#000' : '#999'} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.sortButton,
//               sortBy === 'date' && styles.activeSortButton,
//             ]}
//             onPress={() => setSortBy('date')}
//           >
//             <Ionicons name="calendar" size={16} color={sortBy === 'date' ? '#000' : '#999'} />
//             <Text style={[styles.sortText, sortBy === 'date' && styles.activeSortText]}>
//               Date
//             </Text>
//             <Ionicons name="chevron-down" size={16} color={sortBy === 'date' ? '#000' : '#999'} />
//           </TouchableOpacity>
//         </View>

//         <FlatList
//           data={filteredOrders}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.card}
//               onPress={() => navigation.navigate('OrderDetails', { order: item })}
//             >
//               <View style={styles.cardLeft}>
//                 <View style={[styles.iconCircle, item.iconcircle]}>
//                   <Image
//                     source={icons[item.type] || icons.Other}
//                     style={{ width: 24, height: 24 }}
//                     resizeMode="contain"
//                   />
//                 </View>
//                 <View>
//                   <Text style={styles.orderType}>{`Photo ${item.type}`}</Text>
//                   <Text style={styles.price}>{item.price}</Text>
//                 </View>
//               </View>
//               <View style={styles.cardRight}>
//                 <Text style={[styles.status, getStatusStyle(item.status)]}>
//                   {item.status}
//                 </Text>
//                 <Text style={styles.date}>{formatDateTime(item.date)}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   topSection: {
//     backgroundColor: '#992C55',
//     paddingTop: 70,
//     paddingBottom: 40,
//     paddingHorizontal: 16,
//     zIndex: 0,
//   },
//   topBarRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 10,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   categoryButton: {
//     backgroundColor: '#BA3B6B',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   activeCategoryButton: {
//     backgroundColor: '#fff',
//   },
//   categoryText: {
//     fontSize: 13,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   activeCategoryText: {
//     color: '#000',
//   },
//   cardSection: {
//     flex: 1,
//     backgroundColor: '#F5F5F7',
//     paddingHorizontal: 16,
//     marginTop: -20,
//     paddingTop: 20,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//   },
//   sortingRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 12,
//     gap: 12,
//   },
//   sortButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   activeSortButton: {
//     borderColor: '#992C55',
//   },
//   sortText: {
//     marginHorizontal: 6,
//     fontSize: 13,
//     color: '#777',
//   },
//   activeSortText: {
//     color: '#000',
//     fontWeight: '600',
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 4,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   orderType: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222',
//   },
//   price: {
//     fontSize: 13,
//     color: '#999',
//   },
//   cardRight: {
//     alignItems: 'flex-end',
//   },
//   status: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   completed: {
//     color: 'green',
//   },
//   inProgress: {
//     color: '#e58b00',
//   },
//   date: {
//     fontSize: 11,
//     color: '#aaa',
//   },
// });

// export default OrderScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other'];
// const statusFilters = ['All', 'In Progress', 'Completed'];

// const allOrders = [
//   {
//     id: '1',
//     type: 'Editing',
//     price: '₦25,000',
//     date: '2025-05-21T05:22:00Z',
//     status: 'Completed',
//     iconcircle: { backgroundColor: '#E31818' },
//   },
//   {
//     id: '2',
//     type: 'Manipulation',
//     price: '₦25,000',
//     date: '2025-05-20T06:12:00Z',
//     status: 'Completed',
//     iconcircle: { backgroundColor: '#7018E3' },
//   },
//   {
//     id: '3',
//     type: 'Retouching',
//     price: '₦25,000',
//     date: '2025-05-22T07:00:00Z',
//     status: 'Completed',
//     iconcircle: { backgroundColor: '#E31895' },
//   },
//   {
//     id: '4',
//     type: 'Other',
//     price: '₦25,000',
//     date: '2025-05-19T08:30:00Z',
//     status: 'In Progress',
//     iconcircle: { backgroundColor: '#E3AA18' },
//   },
// ];

// const icons = {
//   Editing: require('../../assets/PenNib.png'),
//   Manipulation: require('../../assets/Vector (6).png'),
//   Retouching: require('../../assets/DropHalf.png'),
//   Other: require('../../assets/Eyedropper.png'),
// };

// const OrderScreen = () => {
//   const navigation = useNavigation();

//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [dateSortAsc, setDateSortAsc] = useState(false);

//   const formatDate = (isoString) => {
//     const date = new Date(isoString);
//     const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     return `${date.toDateString()} - ${time}`;
//   };

//   const getFilteredAndSortedOrders = () => {
//     return allOrders
//       .filter((order) => {
//         const matchesCategory = selectedCategory === 'All' || order.type === selectedCategory;
//         const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
//         return matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => {
//         const aDate = new Date(a.date);
//         const bDate = new Date(b.date);
//         return dateSortAsc ? aDate - bDate : bDate - aDate;
//       });
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'Completed':
//         return styles.completed;
//       case 'In Progress':
//         return styles.inProgress;
//       default:
//         return {};
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Bar */}
//       <View style={styles.topSection}>
//         <View style={styles.topBarRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back" size={28} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Orders</Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryContainer}
//         >
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               onPress={() => setSelectedCategory(cat)}
//               style={[
//                 styles.categoryButton,
//                 selectedCategory === cat && styles.activeCategoryButton,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   selectedCategory === cat && styles.activeCategoryText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Card Section */}
//       <View style={styles.cardSection}>
//         {/* Sorting Bar */}
//         <View style={styles.sortRow}>
//           {/* Status Filter */}
//           <View style={styles.sortButton}>
//             <Text style={styles.sortLabel}>Status:</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {statusFilters.map((status) => (
//                 <TouchableOpacity
//                   key={status}
//                   onPress={() => setSelectedStatus(status)}
//                   style={[
//                     styles.sortOption,
//                     selectedStatus === status && styles.activeSortOption,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.sortText,
//                       selectedStatus === status && styles.activeSortText,
//                     ]}
//                   >
//                     {status}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Date Sort */}
//           <TouchableOpacity
//             onPress={() => setDateSortAsc((prev) => !prev)}
//             style={styles.sortButton}
//           >
//             <Ionicons name="calendar-outline" size={16} color="#555" />
//             <Text style={styles.sortLabel}>
//               Date ({dateSortAsc ? 'Oldest' : 'Newest'})
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Order List */}
//         <FlatList
//           data={getFilteredAndSortedOrders()}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.card}
//               onPress={() => navigation.navigate('OrderDetails', { order: item })}
//             >
//               <View style={styles.cardLeft}>
//                 <View style={[styles.iconCircle, item.iconcircle]}>
//                   <Image
//                     source={icons[item.type] || icons.Other}
//                     style={{ width: 24, height: 24 }}
//                     resizeMode="contain"
//                   />
//                 </View>
//                 <View>
//                   <Text style={styles.orderType}>{`Photo ${item.type}`}</Text>
//                   <Text style={styles.price}>{item.price}</Text>
//                 </View>
//               </View>
//               <View style={styles.cardRight}>
//                 <Text style={[styles.status, getStatusStyle(item.status)]}>
//                   {item.status}
//                 </Text>
//                 <Text style={styles.date}>{formatDate(item.date)}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },

//   topSection: {
//     backgroundColor: '#992C55',
//     paddingTop: 70,
//     paddingBottom: 40,
//     paddingHorizontal: 16,
//     zIndex: 0,
//   },
//   topBarRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 10,
//   },
//   headerTitle: { fontSize: 26, fontWeight: '700', color: '#fff' },
//   categoryContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   categoryButton: {
//     backgroundColor: '#BA3B6B',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   activeCategoryButton: { backgroundColor: '#fff' },
//   categoryText: { fontSize: 13, color: '#fff', fontWeight: '500' },
//   activeCategoryText: { color: '#000' },

//   cardSection: {
//     flex: 1,
//     backgroundColor: '#F5F5F7',
//     paddingHorizontal: 16,
//     marginTop: -20,
//     paddingTop: 20,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//   },
//   sortRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   sortButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   sortLabel: {
//     fontSize: 12,
//     color: '#333',
//     fontWeight: '500',
//   },
//   sortOption: {
//     backgroundColor: '#ddd',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginHorizontal: 4,
//   },
//   activeSortOption: {
//     backgroundColor: '#992C55',
//   },
//   sortText: { fontSize: 12, color: '#333' },
//   activeSortText: { color: '#fff' },

//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 4,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   orderType: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222',
//   },
//   price: {
//     fontSize: 13,
//     color: '#999',
//   },
//   cardRight: { alignItems: 'flex-end' },
//   status: { fontSize: 13, fontWeight: '600' },
//   completed: { color: 'green' },
//   inProgress: { color: '#e58b00' },
//   date: { fontSize: 11, color: '#aaa' },
// });

// export default OrderScreen;
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText'; // Adjust path if necessary

const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other'];
const statusOptions = ['All', 'In Progress', 'Completed'];
const dateOptions = ['Newest', 'Oldest'];

const allOrders = [
  {
    id: '1',
    type: 'Editing',
    price: '₦25,000',
    date: '2025-05-21T05:22:00',
    status: 'Completed',
    iconcircle: { backgroundColor: '#E31818' },
  },
  {
    id: '2',
    type: 'Manipulation',
    price: '₦25,000',
    date: '2025-05-20T04:15:00',
    status: 'Completed',
    iconcircle: { backgroundColor: '#7018E3' },
  },
  {
    id: '3',
    type: 'Retouching',
    price: '₦25,000',
    date: '2025-05-19T06:45:00',
    status: 'Completed',
    iconcircle: { backgroundColor: '#E31895' },
  },
  {
    id: '4',
    type: 'Other',
    price: '₦25,000',
    date: '2025-05-18T08:30:00',
    status: 'In Progress',
    iconcircle: { backgroundColor: '#E3AA18' },
  },
  {
    id: '5',
    type: 'Retouching',
    price: '₦25,000',
    date: '2025-05-21T05:22:00',
    status: 'In Progress',
    iconcircle: { backgroundColor: '#E31895' },
  },
];

const icons = {
  Editing: require('../../assets/PenNib.png'),
  Manipulation: require('../../assets/Vector (6).png'),
  Retouching: require('../../assets/DropHalf.png'),
  Other: require('../../assets/Eyedropper.png'),
};

const OrderScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('Newest');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  let filteredOrders = [...allOrders];

  if (selectedCategory !== 'All') {
    filteredOrders = filteredOrders.filter((order) => order.type === selectedCategory);
  }

  if (selectedStatus !== 'All') {
    filteredOrders = filteredOrders.filter((order) => order.status === selectedStatus);
  }

  filteredOrders.sort((a, b) => {
    if (selectedDate === 'Newest') return new Date(b.date) - new Date(a.date);
    else return new Date(a.date) - new Date(b.date);
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-GB', options).replace(',', ' -');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return styles.completed;
      case 'In Progress':
        return styles.inProgress;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topSection}>
        <View style={styles.topBarRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <ThemedText fontFamily='monaque' weight='bold' style={styles.headerTitle}>Orders</ThemedText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
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

      {/* Order Cards Section */}
      <View style={styles.cardSection}>
        <View style={styles.sortRow}>
          {/* Status Sort */}
          <View>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Ionicons name="filter" size={14} color="#555" style={{ marginRight: 4 }} />
              <ThemedText style={styles.sortText}>Status</ThemedText>
              <Ionicons name="caret-down" size={18} color="#555" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            {showStatusDropdown && (
              <View style={styles.dropdownMenu}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedStatus(option);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <ThemedText style={styles.dropdownItem}>{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date Sort */}
          <View>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setShowDateDropdown(!showDateDropdown)}
            >
              <ThemedText style={styles.sortText}>Date</ThemedText>
              <Ionicons name="caret-down" size={18} color="#555" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            {showDateDropdown && (
              <View style={styles.dropdownMenu}>
                {dateOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedDate(option);
                      setShowDateDropdown(false);
                    }}
                  >
                    <ThemedText style={styles.dropdownItem}>{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('OrderDetails', { order: item })}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconCircle, item.iconcircle]}>
                  <Image
                    source={icons[item.type] || icons.Other}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <ThemedText style={styles.orderType}>{`Photo ${item.type}`}</ThemedText>
                  <ThemedText style={styles.price}>{item.price}</ThemedText>
                </View>
              </View>
              <View style={styles.cardRight}>
                <ThemedText style={[styles.status, getStatusStyle(item.status)]}>{item.status}</ThemedText>
                <ThemedText style={styles.date}>{formatDate(item.date)}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    backgroundColor: '#992C55',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 16,
    zIndex: 0,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#BA3B6B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#000',
  },
  cardSection: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 16,
    marginTop: -20,
    paddingTop: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  sortRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    // elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 42,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 2,
  },
  dropdownItem: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    paddingVertical: 6,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  price: {
    fontSize: 13,
    color: '#999',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  completed: {
    color: 'green',
  },
  inProgress: {
    color: '#e58b00',
  },
  date: {
    fontSize: 11,
    color: '#aaa',
  },
});

export default OrderScreen;
