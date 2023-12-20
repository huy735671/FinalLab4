import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useMyContextController, logout } from '../context';
import { useNavigation } from '@react-navigation/native';

const Customer = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogout = () => {
    logout(dispatch);
    navigation.goBack();
  };
  
  const handleVisitShop = () => {
    // Chuyển hướng tới trang chủ (hoặc trang khác tùy bạn đặt tên)
    navigation.navigate('HomeScreen');
  };

  const handleOpenCart = () => {
    // Điều hướng đến trang giỏ hàng (hoặc trang khác tùy bạn đặt tên)
    navigation.navigate('Cart');
  };

  return (
    <ImageBackground source={require('../Image/Arcane.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.greetingText}>Xin chào {userLogin?.name}</Text>
        <TouchableOpacity style={styles.visitShopButton} onPress={handleVisitShop}>
          <Text style={styles.visitShopButtonText}>Ghé thăm shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={handleOpenCart}>
          <Text style={styles.cartButtonText}>Giỏ hàng ({cartItemCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Thoát</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Your styles here
const styles = {
  background: {
    flex: 1,
    resizeMode: 'cover',
    // Additional styles for your background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    color: 'white', // Change the color as needed
    marginBottom: 20,
  },
  visitShopButton: {
    backgroundColor: '#3598db', // Màu xanh lá cây (hoặc màu khác tùy bạn)
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  visitShopButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#2ecc71', // Màu xanh lá cây (hoặc màu khác tùy bạn)
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#3598db',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export default Customer;
