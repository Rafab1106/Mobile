import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import InputField from './InputField';
import LoginButton from './LoginButton';
import {checkUserLogin} from './models/LoginModel'


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Hook pour la navigation
  const [error,setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      const userId = await checkUserLogin(email, password);
      console.log('ID de l\'utilisateur :', userId);
      await AsyncStorage.setItem('userId', userId);
      navigation.navigate('Accueil'); // Navigue vers l'écran d'accueil
    } catch (error) {
      setError(error.message);
      setModalVisible(true);
      console.error('Erreur lors de la connexion:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>$EAFN_Crypto</Text>
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <LoginButton onPress={handleLogin} />

      {/* Bouton pour aller vers l'inscription */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        {/* <Text style={styles.registerText}>S'inscrire?</Text> */}
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}  // Fermer la modal si on appuie en dehors
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{error}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#00ffcc',
    fontWeight: 'bold',
    marginBottom: 40,
    textShadowColor: '#00ffcc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  registerText: {
    marginTop: 15,
    color: '#00ffcc',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: '#ffcccc',  // Fond rouge clair pour l'erreur
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 250,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#d80000',  // Texte rouge pour indiquer l'erreur
  },
  modalButton: {
    backgroundColor: '#d80000',  // Couleur rouge pour le bouton d'erreur
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',  // Texte du bouton en blanc pour contraster avec le rouge
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default LoginScreen;
