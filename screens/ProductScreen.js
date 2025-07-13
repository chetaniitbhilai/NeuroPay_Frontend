import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Button,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; // Adjust path if needed
import { TouchableWithoutFeedback, Keyboard } from 'react-native';


import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../utils/api';

const categories = ['All', 'Accessories', 'Grocery', 'Electronics'];

export default function ProductScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openProductModal(item)}
      style={styles.cardWrapper}
    >
      <ProductCard product={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Shop by Category</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6f00" style={{ marginTop: 40 }} />
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.noResult}>No products found.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
        />
      )}

      {/* Modal Bottom Sheet */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            {selectedProduct && (
              <>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>₹ {selectedProduct.price}</Text>
                    <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      if (selectedProduct) {
                        dispatch(addToCart(selectedProduct));
                        setModalVisible(false);
                      }
                    }}
                  >
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>

                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', paddingTop: 10 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 6,
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  categoryContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#e0e0e0',
    width: 100,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#ff6f00',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResult: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#888',
  },
  gridContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#ff6f00',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
