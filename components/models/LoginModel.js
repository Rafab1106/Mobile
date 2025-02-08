import {getWithFiltre} from '../services/fonctionFirebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';


// Fonction pour vérifier si l'utilisateur existe avec son email et mot de passe
export const checkUserLogin = async (email, password) => {
    try {
      // Utiliser la fonction getWithFiltre pour récupérer l'utilisateur par email
      const data = await getWithFiltre('user', 'email', email, '==');
  
      if (data.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      bcrypt.hash(password, 10, function(err, hash) {
        console.log("Hashed Password:", hash);
      });
      // Assumes que la collection a un champ 'password' pour stocker le mot de passe hashé
      const userDoc = data[0];  // Il y a une correspondance pour l'email
      const storedPassword = userDoc.password; // Mot de passe stocké dans Firestore
      console.log(storedPassword);
      // Comparaison du mot de passe avec bcrypt
      const isPasswordCorrect = await bcrypt.compare(password, storedPassword);
  
      if (!isPasswordCorrect) {
        throw new Error('Mot de passe incorrect');
      }
  
    //   console.log('Utilisateur trouvé et mot de passe correct');
      return userDoc.id; // Retourne l'ID de l'utilisateur trouvé, tu peux l'utiliser ensuite
  
    } catch (err) {
      throw new Error(err.message); // Renvoie l'erreur si quelque chose échoue
    }
};

export const getUserId = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
            console.log("ID de l'utilisateur récupéré :", userId);
            return userId;
        }
        return null;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
    }
};

