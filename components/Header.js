import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const imageUri = await AsyncStorage.getItem('profileImage');
        if (imageUri) {
          setProfileImage(imageUri);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchProfileImage);

    fetchProfileImage();

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>CryptoByDago</Text>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image source={require('../assets/images/profil.jpg')} style={styles.profileImage} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 24,
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ffcc',
  },
});

export default Header;