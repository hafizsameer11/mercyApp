// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;

// const OrderDetails = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { order } = route.params || {};

//   if (!order) return null;

//   // Format date and time like: 21 May, 25 - 05:22 AM
//   const formattedDate = new Date(order.date).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: '2-digit',
//   });

//   const formattedTime = new Date(order.date).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

//   const detailItems = [
//     { label: 'Agent Name', value: 'Sasha' },
//     { label: 'Order type', value: `Photo ${order.type}` },
//     { label: 'No of Images', value: '5' },
//     { label: 'Date', value: formattedDate },
//     { label: 'Time', value: formattedTime },
//     { label: 'Amount', value: order.price },
//     { label: 'Status', value: order.status },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Top Header */}
//       <View style={styles.topSection}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Ionicons name="chevron-back" size={28} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.orderType}>{`Photo ${order.type}`}</Text>

//         <View style={styles.iconCircle}>
//           <Image
//             source={require('../../assets/PenNib.png')} // Make dynamic if needed
//             style={{ width: 36, height: 36 }}
//             resizeMode="contain"
//           />
//         </View>
//       </View>

//       {/* Details Card */}
//       <View style={styles.detailsCard}>
//         {detailItems.map((item, index) => (
//           <View style={styles.row} key={index}>
//             <Text style={styles.label}>{item.label}</Text>
//             <Text style={[styles.value, item.label === 'Status' && getStatusStyle(item.value)]}>
//               {item.value}
//             </Text>
//           </View>
//         ))}
//       </View>

//       {/* Chat Button */}
//       <TouchableOpacity style={styles.chatBtn}>
//         <Text style={styles.chatBtnText}>View Chat</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case 'Completed':
//       return { color: 'green' };
//     case 'In Progress':
//       return { color: '#E58B00' };
//     default:
//       return { color: '#444' };
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F7',
//   },
//   topSection: {
//     backgroundColor: '#992C55',
//     paddingTop: 70,
//     paddingBottom: 40,
//     alignItems: 'center',
//     position: 'relative',
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//   },
//   backBtn: {
//     position: 'absolute',
//     left: 20,
//     top: 70,
//   },
//   orderType: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: '700',
//     marginTop: 16,
//   },
//   iconCircle: {
//     backgroundColor: '#fff',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   detailsCard: {
//     backgroundColor: '#FFEFF5',
//     marginHorizontal: 20,
//     borderRadius: 16,
//     padding: 20,
//     marginTop: -30,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//   },
//   row: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   paddingVertical: 12,
//   paddingHorizontal: 12,
//   borderWidth: 1,
//   borderColor: '#f3c9d8',
//   borderRadius: 8,
// //   marginBottom: 10, // Adds spacing between rows
//   backgroundColor: '#FFEFF5', // Optional for consistency
// },
//   label: {
//     color: '#333',
//   },
//   value: {
//     fontWeight: '600',
//   },
//   chatBtn: {
//     backgroundColor: '#992C55',
//     marginHorizontal: 20,
//     marginTop: 30,
//     paddingVertical: 16,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   chatBtnText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default OrderDetails;
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText'; // Adjust path accordingly

const screenWidth = Dimensions.get('window').width;

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};

  if (!order) return null;

  const formattedDate = new Date(order.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });

  const formattedTime = new Date(order.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const detailItems = [
    { label: 'Agent Name', value: 'Sasha' },
    { label: 'Order type', value: `Photo ${order.type}` },
    { label: 'No of Images', value: '5' },
    { label: 'Date', value: formattedDate },
    { label: 'Time', value: formattedTime },
    { label: 'Amount', value: order.price },
    { label: 'Status', value: order.status },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={{ color:'#fff', fontSize:15 }}>My Order</ThemedText>

        <View style={styles.iconCircle}>
          <Image
            source={require('../../assets/PenNib.png')}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </View>
        <ThemedText style={styles.orderType}>{`Photo ${order.type}`}</ThemedText>
      </View>

      {/* White Wrapper + Details Card */}
      <View style={styles.detailsCardWrapper}>
        <View style={styles.detailsCard}>
          {detailItems.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === detailItems.length - 1;
            return (
              <View
                key={index}
                style={[
                  styles.row,
                  isFirst && styles.topRow,
                  isLast && styles.bottomRow,
                ]}
              >
                <ThemedText style={styles.label}>{item.label}</ThemedText>
                <ThemedText style={[styles.value, item.label === 'Status' && getStatusStyle(item.value)]}>
                  {item.value}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>

      {/* Chat Button */}
      <TouchableOpacity style={styles.chatBtn}>
        <ThemedText style={styles.chatBtnText}>View Chat</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return { color: 'green' };
    case 'In Progress':
      return { color: '#E58B00' };
    default:
      return { color: '#444' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  topSection: {
    backgroundColor: '#4A1227',
    paddingTop: 70,
    paddingBottom: 100,
    alignItems: 'center',
    position: 'relative',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 70,
  },
  orderType: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
  },
  iconCircle: {
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  /** NEW: White wrapper card **/
  detailsCardWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: -50,
    padding: 17,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },

  /** Light pink card inside white wrapper **/
  detailsCard: {
    backgroundColor: '#F5EAEE',
    borderRadius: 16,
  },

  /** Each detail row **/
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    // borderTopWidth: 1,
    borderWidth:1,
    borderColor: '#f3c9d8',
    backgroundColor: '#F5EAEE',
  },

  /** Only for first row **/
  topRow: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderWidth: 1,
  },

  /** Only for last row **/
  bottomRow: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f3c9d8',
  },

  label: {
    color: '#7A7577',
    fontSize: 14,
    // fontWeight: '500',
  },
  value: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
  },
  chatBtn: {
    backgroundColor: '#992C55',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  chatBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetails;
