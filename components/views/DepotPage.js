import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';
import { addTransact } from '../models/Transaction';
import { getUserId } from '../models/LoginModel';

const DepotPage = () => {
  const [montant, setMontant] = useState('');
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [userid, setUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  // Nouveau state pour la Modal

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

  const handleDepot = async () => {
    const data = {
      daty: Timestamp.now(),
      entre: montant,
      etat: 1,
      sortie: 0,
      user: userid,
    };

    try {
      let id = await addTransact("UserTransaction", data);
      setMessage("Demande de Depot envoyée");
      setModalVisible(true);  // Afficher la Modal après succès
    } catch (err) {
      setError(err.message);  // Gérer l'erreur si l'ajout échoue
      console.error("Erreur lors de l'ajout de la transaction :", err.message);
    }
    setMontant('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={30} color="#00ffcc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dépôt</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Entrez le montant"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={montant}
          onChangeText={setMontant}
        />
        <TouchableOpacity style={styles.button} onPress={handleDepot}>
          <Text style={styles.buttonText}>Déposer</Text>
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
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fond semi-transparent
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

export default DepotPage;
