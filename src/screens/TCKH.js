import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCart } from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartScreen from './Cart';
import { IconButton } from 'react-native-paper';  // Thêm import

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [cart,setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(data);
      });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (item) => {
    if (cart.findIndex((cartItem) => cartItem.id === item.id) !== -1) return null;
    const updatedCart = [...cart, { ...item, amount: 1 }];
    setCart(updatedCart);
    addToCart(item);
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItemContainer}
      onPress={() => navigation.navigate('product', { serviceId: item.id })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <View style={styles.serviceItem}>
        <Text style={styles.serviceName}>Tên: {item.serviceName}</Text>
        <Text style={styles.servicePrice}>Giá: {item.price}</Text>
      </View>
      <View style={styles.viewButton}>
        {/* Thay đổi nút thành icon giỏ hàng */}
        <IconButton
          icon="cart-outline"
          color="white"
          size={20}
          onPress={() => handleAddToCart(item)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => <HomeScreenContent services={services} renderServiceItem={renderServiceItem} />}
      </Tab.Screen>
      <Tab.Screen name='Cart'>
        {() => <CartScreen services={services} renderServiceItem={renderServiceItem} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const HomeScreenContent = ({ services, renderServiceItem }) => (
  <View style={styles.container}>
    <ImageBackground source={require('../Image/Arcane.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Danh sách sản phẩm</Text>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceItem}
        />
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  serviceItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    width: '90%',
    paddingVertical: 10,
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  serviceItem: {
    flex: 1,
    marginLeft: 10,
  },
  serviceName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    color: 'white',
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
