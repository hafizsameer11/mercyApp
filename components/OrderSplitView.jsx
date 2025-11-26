import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/OrderScreens/OrdersScreen';
import OrderDetails from '../screens/OrderScreens/OrderDetails';

const Stack = createNativeStackNavigator();

// Wrapper component to provide navigation context for OrderDetails
const OrderDetailsWrapper = ({ orderData }) => {
  return (
    <NavigationIndependentTree>
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="OrderDetail"
            initialParams={{ order: orderData }}
          >
            {(props) => <OrderDetails {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

const OrderSplitView = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [firstOrderLoaded, setFirstOrderLoaded] = useState(false);

  // Callback to handle when orders are loaded (for auto-selecting first order)
  const handleOrdersLoaded = (firstOrderData) => {
    if (!firstOrderLoaded && firstOrderData && !selectedOrder) {
      setSelectedOrder(firstOrderData);
      setFirstOrderLoaded(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Panel - Orders List */}
      <View style={styles.leftPanel}>
        <OrdersScreen 
          onOrderSelect={(orderData) => {
            setSelectedOrder(orderData);
            setFirstOrderLoaded(true); // Mark as loaded after manual selection
          }}
          onFirstOrderReady={handleOrdersLoaded}
          isTabletSplitView={true}
        />
      </View>

      {/* Right Panel - Order Details */}
      <View style={styles.rightPanel}>
        {selectedOrder ? (
          <OrderDetailsWrapper 
            key={`order-${selectedOrder.id}`} // Force remount when order changes
            orderData={selectedOrder}
          />
        ) : (
          <View style={styles.emptyState}>
            {/* Empty state - no order selected */}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F7', // Light gray background like Figma
    borderRadius: 20,
    overflow: 'hidden',
  },
  leftPanel: {
    width: 430, // Fixed width as per Figma
    backgroundColor: '#F5F5F7', // Light gray background
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  rightPanel: {
    flex: 1,
    minWidth: 500,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
});

export default OrderSplitView;

