import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  addToCart,
  removeFromCart,
  clearCart,
} from '../redux/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { handleStripePayment } from '../utils/handleStripePayment';
import { launchUPIPayment } from '../utils/handleUPIPayment';
import { handleUPIPaymentSuccess } from '../utils/handleUPIPaymentSuccess';


export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const appState = useRef(AppState.currentState);
  const [didInitiateUPI, setDidInitiateUPI] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        didInitiateUPI
      ) {
        // ✅ User is back from UPI app
        Alert.alert(
          'Confirm Payment',
          'Did you complete the UPI payment?',
          [
            {
              text: 'Yes',
              onPress: () => {
                handleUPIPaymentSuccess(cartItems, totalPrice,'9355844091@ptsbi', dispatch, clearCart);
              },
            },
            {
              text: 'No',
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
        setDidInitiateUPI(false); // reset
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove(); // ✅ cleanup safely
    };
  }, [didInitiateUPI]);

  const handleUPIPayment = async () => {
    const result = await launchUPIPayment(totalPrice);
    if (result) {
      setDidInitiateUPI(true);
    }
  };



  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => dispatch(removeFromCart(item._id))}>
            <Text style={styles.qtyBtn}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(addToCart(item))}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>🛒 Cart is Empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₹{totalPrice}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.payBtn}
                onPress={() => handleStripePayment(cartItems, totalPrice, dispatch, clearCart)}
              >
                <Text style={styles.payText}>Pay with Stripe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.payBtn, { backgroundColor: '#4caf50' }]}
                onPress={handleUPIPayment}
              >
                <Text style={styles.payText}>Pay with UPI</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.binBtn}
                onPress={() => dispatch(clearCart())}
              >
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  list: { padding: 16 },
  itemContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: { fontSize: 17, fontWeight: '600' },
  itemPrice: { marginTop: 6, color: '#888', fontSize: 15 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    fontSize: 20,
    paddingHorizontal: 12,
    color: '#ff6f00',
  },
  qty: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 6,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 20,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  empty: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
    color: '#888',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payBtn: {
    backgroundColor: '#ff6f00',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  payText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  binBtn: {
    backgroundColor: '#ff3d00',
    padding: 10,
    borderRadius: 6,
  },
});
