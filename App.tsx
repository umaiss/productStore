import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category, Product } from './src/types';

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    category: { id: '', name: '' },
  });
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const addOrUpdateProduct = () => {
    if (editingProductId) {
      setProducts(products.map(product =>
        product.id === editingProductId ? { ...product, ...newProduct } : product
      ));
      setEditingProductId(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
    }
    resetProductForm();
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const editProduct = (id: string) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      setNewProduct({
        name: productToEdit.name,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category,
      });
      setEditingProductId(id);
    }
  };

  const addOrUpdateCategory = () => {
    if (editingCategoryId) {
      setCategories(categories.map(category =>
        category.id === editingCategoryId ? { ...category, ...newCategory } : category
      ));
      setEditingCategoryId(null);
    } else {
      setCategories([...categories, { ...newCategory, id: Date.now().toString() }]);
    }
    resetCategoryForm();
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    setProducts(products.map(product =>
      product.category.id === id ? { ...product, category: { id: '', name: '' } } : product
    ));
  };

  const editCategory = (id: string) => {
    const categoryToEdit = categories.find(category => category.id === id);
    if (categoryToEdit) {
      setNewCategory({
        name: categoryToEdit.name,
      });
      setEditingCategoryId(id);
    }
  };

  const searchProduct = (query: string) => {
    setSearchQuery(query);
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      category: { id: '', name: '' },
    });
  };

  const resetCategoryForm = () => {
    setNewCategory({
      name: '',
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text>{editingCategoryId ? 'Edit Category' : 'Add a New Category'}</Text>
      <TextInput
        placeholder="Category Name"
        value={newCategory.name}
        style={{ borderWidth: 1, paddingVertical: 10, marginVertical: 5 }}
        onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
      />
      <Button disabled={newCategory.name ? false : true} title={editingCategoryId ? "Update Category" : "Add Category"} onPress={addOrUpdateCategory} />

      <Text>Category List</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => editCategory(item.id)} />
            <Button title="Remove" onPress={() => removeCategory(item.id)} />
          </View>
        )}
      />

      <Text>{editingProductId ? 'Edit Product' : 'Add a New Product'}</Text>
      <TextInput
        placeholder="Name"
        value={newProduct.name}
        style={{ borderWidth: 1, paddingVertical: 10, marginVertical: 5 }}

        onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
      />
      <TextInput
        placeholder="Price"
        value={String(newProduct.price)}
        onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) })}
        keyboardType="numeric"
        style={{ borderWidth: 1, paddingVertical: 10, marginVertical: 5 }}

      />
      <TextInput
        placeholder="Description"
        value={newProduct.description}
        style={{ borderWidth: 1, paddingVertical: 10, marginVertical: 5 }}

        onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
      />
      <Picker
        selectedValue={newProduct.category.id}
        onValueChange={(itemValue) => {
          const selectedCategory = categories.find(category => category.id === itemValue);
          setNewProduct({
            ...newProduct,
            category: selectedCategory || { id: '', name: '' },
          });
        }}>
        <Picker.Item label="Select Category" value="" />
        {categories.map(category => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>
      <Button disabled={newProduct.name && newProduct.price ? false : true} title={editingProductId ? "Update Product" : "Add Product"} onPress={addOrUpdateProduct} />

      <TextInput
        style={styles.searchInput}
        placeholder="Search Product"
        value={searchQuery}
        onChangeText={searchProduct}
      />

      <Text>Product List</Text>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>Name: {item.name}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Category: {item.category.name}</Text>
            <Button title="Edit" onPress={() => editProduct(item.id)} />
            <Button title="Remove" onPress={() => removeProduct(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },
  productItem: {
    marginTop: 10,
  },
  categoryItem: {
    marginTop: 10,
  },
  searchInput: {
    marginTop: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default App;