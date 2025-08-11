
// export default OrderScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other'];
const statusOptions = ['All', 'In Progress', 'Completed', 'Pending'];
const dateOptions = ['Newest', 'Oldest'];

const icons = {
  Editing: require('../../assets/PenNib.png'),
  Manipulation: require('../../assets/Vector (6).png'),
  Retouching: require('../../assets/DropHalf.png'),
  Other: require('../../assets/Eyedropper.png'),
};

const getIconInfo = (serviceType) => {
  switch (serviceType.toLowerCase()) {
    case 'photo editing':
    case 'editing':
    case 'photo_editing':
      return { icon: icons.Editing, bgColor: '#E31818', type: 'Editing' };
    case 'photo manipulation':
    case 'manipulation':
      return { icon: icons.Manipulation, bgColor: '#7018E3', type: 'Manipulation' };
    case 'body retouching':
    case 'retouching':
      return { icon: icons.Retouching, bgColor: '#E31895', type: 'Retouching' };
    case 'other services':
    case 'other':
      return { icon: icons.Other, bgColor: '#E3AA18', type: 'Other' };
    default:
      return { icon: icons.Other, bgColor: '#E3AA18', type: 'Other' };
  }
};

const OrderScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('Newest');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await fetch('https://editbymercy.hmstech.xyz/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.status === 'success') {
          setOrders(json.data);
        }
      } catch (err) {
        console.error('Fetch orders failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  let filteredOrders = orders
    .map((order) => {
      const { icon, bgColor, type } = getIconInfo(order.service_type);
      return {
        id: order.id.toString(),
        type,
        price: order.total_amount,
        date: order.created_at,
        status: order.status,
        icon,
        iconcircle: { backgroundColor: bgColor },
        fullData: order,
      };
    });

  if (selectedCategory !== 'All') {
    filteredOrders = filteredOrders.filter((order) => order.type === selectedCategory);
  }
  if (selectedStatus !== 'All') {
    filteredOrders = filteredOrders.filter((order) => order.status === selectedStatus);
  }
  filteredOrders.sort((a, b) => {
    return selectedDate === 'Newest'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#992C55" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topBarRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <ThemedText fontFamily="monaque" weight="bold" style={styles.headerTitle}>Orders</ThemedText>
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

      <View style={styles.cardSection}>
        <View style={styles.sortRow}>
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
              onPress={() => navigation.navigate('OrderDetails', { order: item.fullData })}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconCircle, item.iconcircle]}>
                  <Image source={item.icon} style={{ width: 24, height: 24 }} resizeMode="contain" />
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

export default OrderScreen;

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

