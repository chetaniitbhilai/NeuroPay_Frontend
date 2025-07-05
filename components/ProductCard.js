import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  selectCartItems,
} from '../redux/cartSlice';

const CARD_WIDTH = 160;
const CARD_HEIGHT = 260;

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const quantity = cartItems.find((p) => p._id === product._id)?.quantity || 0;

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>

      {quantity === 0 ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => dispatch(addToCart(product))}
        >
          <Text style={styles.addText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => dispatch(removeFromCart(product._id))}>
            <Text style={styles.qtyButton}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(addToCart(product))}>
            <Text style={styles.qtyButton}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    color: 'green',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#ff6f00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 6,
    paddingVertical: 4,
  },
  qtyButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    color: '#ff6f00',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 6,
  },
});
