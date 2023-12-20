import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Button } from 'react-native-paper';

const ProductDetail = ({ route }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceSnapshot = await firestore().collection('services').doc(serviceId).get();
        if (serviceSnapshot.exists) {
          const data = {
            id: serviceSnapshot.id,
            ...serviceSnapshot.data(),
          };
          setService(data);
        } else {
          console.warn('Service not found');
        }
      } catch (error) {
        console.error('Error fetching service: ', error);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleAddToCart = () => {
    // Thêm logic xử lý thêm vào giỏ hàng ở đây
    console.log('Đã thêm vào giỏ hàng:', service);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ImageBackground source={require('../Image/Arcane.jpg')} style={styles.background}>
        <View style={styles.overlay}>
          <View style={styles.productContainer}>
            {service.imageUrl ? (
              <Image source={{ uri: service.imageUrl }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>Tên: {service.serviceName}</Text>
              <Text style={styles.productPrice}>Giá: {`${service.price} VND`}</Text>
              <View style={styles.descriptionContainer}>
                <Text style={styles.productDescription}>Mô tả: {service.description}</Text>
              </View>
              <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                <Text style={styles.goBackButtonText}>Quay lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
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
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '90%',
    paddingVertical: 20,
  },
  productImage: {
    width: 200,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 200,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
  },
  productDetails: {
    marginLeft: 20,
  },
  productName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  productDescription: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
  },
  goBackButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  goBackButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProductDetail;
