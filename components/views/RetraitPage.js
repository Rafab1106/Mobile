import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';
import { addTransact } from '../models/Transaction';
import { getUserId } from '../models/LoginModel';

const RetraitPage = () => {
  const [montant, setMontant] = useState('');
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [userid, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  // Etat de la Modal
  const [message, setMessage] = useState('');  // Message à afficher dans la Modal

  useEffect(() => {
    const fetchid = async () => {
      try {
        const data = await getUserId();
        setUserId(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchid();
  }, []);

  const handleRetrait = async () => {
    const data = {
      daty: Timestamp.now(),
      entre: 0,
      etat: 1,
      sortie: montant,
      user: userid,
    };

    try {
      let id = await addTransact("UserTransaction", data);
      setMessage("Demande de Retrait envoyer");
      setModalVisible(true);  // Affiche la Modal après succès
    } catch (err) {
      setError(err.message);
      setMessage("Erreur lors du retrait, veuillez réessayer.");
      setModalVisible(true);  // Affiche la Modal en cas d'erreur
    }
    setMontant('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#00ffcc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retour</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Page de Retrait</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le montant"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={montant}
          onChangeText={setMontant}
        />
        <TouchableOpacity style={styles.button} onPress={handleRetrait}>
          <Text style={styles.buttonText}>Retirer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour afficher le message */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}  // Fermer la modal si on appuie en dehors
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{message}</Text>
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
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#00ffcc',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#00ffcc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Styles pour la Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 250,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#00ffcc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RetraitPage;
