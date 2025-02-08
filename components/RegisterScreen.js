import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

import InputField from './InputField';
import LoginButton from './LoginButton';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Utiliser une seule fonction pour éviter le blocage
      Alert.alert('Inscription réussie', 'Vous pouvez maintenant vous connecter.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);

    } catch (error) {
      Alert.alert('Erreur d’inscription', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <LoginButton onPress={handleRegister} text="S'inscrire" />
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
  labelText: {
    alignSelf: 'flex-start', // Aligner à gauche
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
});

export default RegisterScreen;
