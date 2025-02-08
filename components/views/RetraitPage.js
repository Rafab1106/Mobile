import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';
import {addTransact} from '../models/Transaction'
import {getUserId} from '../models/LoginModel'

const RetraitPage = () => {
  const [montant, setMontant] = useState('');
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [userid,setUserId] = useState(null);
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
    const data= {
      daty:Timestamp.now(),
      entre:0,
      etat:1,
      sortie:montant,
      user: userid
    };

    try {
      let id = await addTransact("UserTransaction", data);
      // console.log('Montant déposé :', montant);
      console.log("Transaction ajoutée avec succès. ID du document :", id);
    } catch (err) {
        setError(err.message);  // Gérer l'erreur si l'ajout échoue
        console.error("Erreur lors de l'ajout de la transaction :", err.message);
    }
    // console.log('Montant retiré :', montant);
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

      {/* Contenu centré */}
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
    justifyContent: 'center', // ✅ Centre verticalement
    alignItems: 'center', // ✅ Centre horizontalement
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
    textAlign: 'center', // ✅ Centre le texte
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center', // ✅ Centre le texte dans le bouton
    width: '80%', // ✅ Garde une bonne proportion
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RetraitPage;
