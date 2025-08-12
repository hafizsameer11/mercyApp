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
import ThemedText from '../../components/ThemedText';

const screenWidth = Dimensions.get('window').width;

const icons = {
  Editing: require('../../assets/PenNib.png'),
  Manipulation: require('../../assets/Vector (6).png'),
  Retouching: require('../../assets/DropHalf.png'),
  Other: require('../../assets/Eyedropper.png'),
};

const getIconInfo = (serviceType) => {
  switch (serviceType?.toLowerCase()) {
    case 'photo editing':
    case 'editing':
    case 'photo_editing':
      return { icon: icons.Editing, label: 'Editing', bgColor: '#E31818' };
    case 'photo manipulation':
    case 'manipulation':
      return { icon: icons.Manipulation, label: 'Manipulation', bgColor: '#7018E3' };
    case 'body retouching':
    case 'retouching':
      return { icon: icons.Retouching, label: 'Retouching', bgColor: '#E31895' };
    case 'other services':
    case 'other':
      return { icon: icons.Other, label: 'Other', bgColor: '#E3AA18' };
    default:
      return { icon: icons.Other, label: 'Other', bgColor: '#E3AA18' };
  }
};


const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { color: 'green' };
    case 'pending':
    case 'in progress':
      return { color: '#E58B00' };
    default:
      return { color: '#444' };
  }
};

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};
  console.log("order", order)

  if (!order) return null;

const { icon, label, bgColor } = getIconInfo(order.service_type);

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });

  const formattedTime = new Date(order.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const detailItems = [
    { label: 'Agent Name', value: order?.agent?.name || 'N/A' },
    { label: 'Order type', value: `Photo ${label}` },
    { label: 'No of Images', value: order?.no_of_photos || 'N/A' },
    { label: 'Date', value: formattedDate },
    { label: 'Time', value: formattedTime },
    { label: 'Amount', value: `₦${order?.total_amount || '0.00'}` },
    { label: 'Status', value: order?.status === 'pending' ? 'In Progress' : order?.status },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={{ color: '#fff', fontSize: 15 }}>My Order</ThemedText>

<View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <Image source={icon} style={{ width: 36, height: 36 }} resizeMode="contain" />
        </View>
        <ThemedText style={styles.orderType}>{`Photo ${label}`}</ThemedText>
      </View>

      {/* White Card */}
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
    <TouchableOpacity
  style={styles.chatBtn}
  onPress={() =>
    navigation.navigate('Chat', {
      chat_id: order.chat_id,
      userRole: 'agent', // or order.agent.role
      user: order.agent?.name || 'Unknown',
      agent: {
        name: order.agent?.name || 'Unknown',
        image: order.agent?.profile_picture
          ? { uri: order.agent.profile_picture }
          : require('../../assets/Ellipse 18.png'), // fallback
      },
      service: order.service_type || 'General',
    })
  }
>
  <ThemedText style={styles.chatBtnText}>View Chat</ThemedText>
</TouchableOpacity>

    </View>
  );
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
    // backgroundColor: '#fff',
    width: 100,
    height: 100,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
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
  detailsCard: {
    backgroundColor: '#F5EAEE',
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#f3c9d8',
    backgroundColor: '#F5EAEE',
  },
  topRow: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomRow: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  label: {
    color: '#7A7577',
    fontSize: 14,
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
