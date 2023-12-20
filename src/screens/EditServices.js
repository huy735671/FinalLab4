import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EditServiceScreen = ({ route, navigation }) => {
  const { serviceId, initialServiceName, initialPrice } = route.params;
  const [serviceName, setServiceName] = useState(initialServiceName);
  const [price, setPrice] = useState(initialPrice);
  const [error, setError] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching service data');

        const servicesSnapshot = await firestore().collection('services').limit(1).get();

        if (!servicesSnapshot.empty) {
          const servicesData = servicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Service data:', servicesData);

          const { serviceName, price } = servicesData[0];

          setServiceName(serviceName);
          setPrice(price);
          setIsDataReady(true);
        } else {
          console.log('No service found');
          setError('No service found');
        }
      } catch (error) {
        console.error('Error fetching service data: ', error);
        setError('Failed to fetch service data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const confirmUpdate = async () => {
    try {
      if (!isDataReady) {
        setError('Service data is not ready. Please wait a moment and try again.');
        return;
      }

      await firestore().collection('services').doc(serviceId).update({
        serviceName: serviceName,
        price: price,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error updating service: ', error);
      setError('Failed to update service. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Cập nhật dịch vụ</Text>

        {isDataReady ? (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Service Name"
                value={serviceName}
                onChangeText={(text) => setServiceName(text)}
                placeholderTextColor="#fff"
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={(text) => setPrice(text)}
                keyboardType="numeric"
                placeholderTextColor="#fff"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={confirmUpdate}>
              <Text style={styles.updateButtonText}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
              <Text style={styles.goBackButtonText}>Trở lại</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    height: 50,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  updateButton: {
    backgroundColor: '#3598db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  goBackButton: {
    backgroundColor: '#3598db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EditServiceScreen;
