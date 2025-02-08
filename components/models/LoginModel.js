import {getWithFiltre} from '../services/fonctionFirebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';


export const checkUserLogin = async (email, password) => {
    try {
      const data = await getWithFiltre('user', 'email', email, '==');
  
      if (data.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      // bcrypt.hash("2413", 10, function(err, hash) {
      //   console.log("Hashed Password:", hash);
      // });

      const userDoc = data[0];
      const storedPassword = userDoc.password;
      const isPasswordCorrect = await bcrypt.compare(password, storedPassword);
  
      if (!isPasswordCorrect) {
        throw new Error('Mot de passe incorrect');
      }
  
      return userDoc.id;
  
    } catch (err) {
      throw new Error(err.message); // Renvoie l'erreur si quelque chose échoue
    }
};

export const getUserId = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        // console.log(userId);
        return userId;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
    }
};

