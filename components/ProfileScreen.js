import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Ouvrir la galerie
  const pickImageFromGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets) {
        setProfileImage(response.assets[0].uri);
      }
      setModalVisible(false);
    });
  };

  // Ouvrir la caméra
  const takePhotoWithCamera = () => {
    ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets) {
        setProfileImage(response.assets[0].uri);
      }
      setModalVisible(false);
    });
  };

  return (
    <View style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅ Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Modifier le Profil</Text>

      {/* Photo de profil */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/images/profil.jpg')}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* Champ de saisie du Nom */}
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom" />

      {/* Champ de saisie du Mot de passe */}
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry />

      {/* Bouton de sauvegarde */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>

      {/* Fenêtre modale pour modifier la photo */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Changer la photo de profil</Text>
            <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
        <Image source={require('../assets/images/iconDossierVert.jpg')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalButton} onPress={takePhotoWithCamera}>
        <Image source={require('../assets/images/camera.jpg')} style={styles.buttonImage} />
      </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  input: {
    width: '90%',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00ffcc',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
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
    backgroundColor: '#222222',
    padding: 0,
    width:100,
    height:55,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
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
  buttonImage: {
    width: 100,  
    height: 55, 
    resizeMode: 'contain',
    borderRadius:100,
  },
});

export default ProfileScreen;
