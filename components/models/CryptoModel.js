import { getAll, getWithFiltre, getWithFiltreMultiple, deleteDataByField} from '../services/fonctionFirebase';

// Fonction pour récupérer toutes les cryptos
export const getAllCrypto = async () => {
  try {
    const data = await getAll("Crypto");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getbyId = async (id) => {
  try {
    const data = await getWithFiltre("Crypto","id",id,"==");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getFavbyId = async (id) => {
  try {
    const data = await getWithFiltre("Favories","user",id,"==");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const checkFavorite = async (collectionName,cryptoId,userId) => {
  try {
    const document = ["crypto","user"];
    const valeur = [cryptoId,userId];

    const data = await getWithFiltreMultiple(collectionName,document,valeur,"==");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const supp = async (collectionName,cryptoId,userId) => {
  try {
    const document = ["crypto","user"];
    const valeur = [cryptoId,userId];

    await deleteDataByField(collectionName,document,valeur);
    return;
  } catch (err) {
    throw new Error(err.message);
  }
}

export const getCryptoBalanceForUser = async (collectionName, userId) => {
  try {
      // Récupérer toutes les transactions pour un utilisateur spécifique
      const data = await getWithFiltre(collectionName, "user", userId, "==");

      // Objet pour stocker les soldes par crypto
      const balancesMap = {};

      // Parcourt tous les documents et agrège les données
      for (let item of data) {
          const cryptoId = item.crypto;
          const entree = item.entre ? parseFloat(item.entre) : 0;
          const sortie = item.sortie ? parseFloat(item.sortie) : 0;
          const balance = entree - sortie;

          // Si la crypto n'existe pas encore dans l'objet, on l'initialise
          if (!balancesMap[cryptoId]) {
              balancesMap[cryptoId] = {
                  id: cryptoId,
                  name: "Crypto Inconnue", // Nom temporaire, sera mis à jour
                  balance: 0,
              };
          }

          // Mise à jour du solde de cette crypto
          
          balancesMap[cryptoId].balance += balance;
      }

      Object.keys(balancesMap).forEach((cryptoId) => {
          if (balancesMap[cryptoId].balance < 0) {
              balancesMap[cryptoId].balance = 0;
          }
      });

      // Récupérer les détails des cryptos (en parallèle pour optimisation)
      const cryptoIds = Object.keys(balancesMap);
      const cryptoDataList = await Promise.all(cryptoIds.map(async (cryptoId) => {
          const cryptoData = await getbyId(cryptoId);
          return { id: cryptoId, name: cryptoData[0]?.nom || "Crypto Inconnue" };
      }));

      // Associer les noms des cryptos récupérés
      cryptoDataList.forEach((cryptoInfo) => {
          if (balancesMap[cryptoInfo.id]) {
              balancesMap[cryptoInfo.id].name = cryptoInfo.name;
          }
      });

      // Convertir l'objet en tableau d'objets
      const result = Object.values(balancesMap);

      // console.log("Soldes par crypto pour l'utilisateur", userId, ":", result);
      return result;
  } catch (error) {
      console.error("Erreur lors du calcul des soldes :", error);
      throw error;
  }
};


