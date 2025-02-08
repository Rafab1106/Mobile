import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Charger l'image de profil au lancement
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const imageUri = await AsyncStorage.getItem('profileImage');
        if (imageUri) {
          setProfileImage(imageUri);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error);
      }
    };

    loadProfileImage();
  }, []);

  // Sauvegarder l'image de profil
  const saveProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri);
      setProfileImage(imageUri);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'image:", error);
    }
  };

  // Sélectionner une image depuis la galerie
  const pickImageFromGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets) {
        saveProfileImage(response.assets[0].uri);
      }
      setModalVisible(false);
    });
  };

  const takePhotoWithCamera = () => {
    setModalVisible(false);
    setTimeout(() => {
      ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
        if (!response.didCancel && response.assets) {
          saveProfileImage(response.assets[0].uri);
        }
      });
    }, 500);
  };
  

  // Déconnexion
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅ Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Modifier le Profil</Text>

      {/* Photo de profil */}
      <Image
        source={profileImage ? { uri: profileImage } : require('../assets/images/profil.jpg')}
        style={styles.profileImage}
      />

      {/* Bouton pour modifier la photo */}
      <TouchableOpacity style={styles.editPhotoButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.editPhotoButtonText}>Modifier la photo de profil</Text>
      </TouchableOpacity>

      {/* Fenêtre modale pour changer la photo */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Changer la photo de profil</Text>

            {/* Ouvrir la galerie */}
            <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
              <FontAwesome name="folder-open" size={40} color="#00ffcc" />
            </TouchableOpacity>

            {/* Ouvrir la caméra */}
            <TouchableOpacity style={styles.modalButton} onPress={takePhotoWithCamera}>
              <FontAwesome name="camera" size={40} color="#ffcc00" />
            </TouchableOpacity>

            {/* Annuler */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bouton Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#00ffcc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#00ffcc',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00ffcc',
  },
  editPhotoButton: {
    backgroundColor: '#00ffcc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editPhotoButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#00ffcc',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 50,
    marginVertical: 5,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 7,
    marginTop: 30,
    width: '60%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;