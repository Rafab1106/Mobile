import {addDataToCollection, getWithFiltre} from '../services/fonctionFirebase';
import {getbyId} from '../models/CryptoModel';

export const addTransact = async (collectionName,data)=>{
    try {
        const docId = await addDataToCollection(collectionName, data);
        return docId;
      } catch (error) {
          console.error("Échec de l'ajout de la transaction :", error);
      }
}

export const getTransactionsForUser = async (collectionName, userId) => {
    try {
        // Récupérer les transactions de l'utilisateur
        const data = await getWithFiltre(collectionName, "user", userId, "==");
  
        // // Transformer les données au bon format
        // const transactions = data.map((item) => ({
        //     date: item.daty?.seconds ? new Date(item.daty.seconds * 1000).toLocaleString() : "Date inconnue",
        //     crypto: item.crypto,
        //     montant: item.entre != "0" ? item.entre : item.sortie,
        //     type: item.entre != "0" ? "achat" : "vente"
        // }));

        const cryptoIds = [...new Set(data.map(item => item.crypto))];

        // Récupérer les informations des cryptos en parallèle
        const cryptoDataList = await Promise.all(
            cryptoIds.map(async (cryptoId) => {
                const cryptoData = await getbyId(cryptoId); // On suppose que getbyId retourne un tableau avec l'info de la crypto
                // console.log(cryptoData[0].nom);
                return {
                    id: cryptoId,
                    name: cryptoData[0]?.nom || "Crypto Inconnue",
                };
            })
        );

        // Transformer les données au bon format et associer les informations des cryptos
        const transactions = data.map((item) => {
        const cryptoInfo = cryptoDataList.find(c => c.id === item.crypto); // Trouver les infos de la crypto en fonction de son ID
        // console.log("manapotra entre");
        // console.log(item.entre);
        return {
            date: item.daty?.seconds ? new Date(item.daty.seconds * 1000).toLocaleString() : "Date inconnue",
            crypto: cryptoInfo?.name || "Crypto Inconnue", // Utiliser le nom de la crypto récupéré
            montant: item.entre != "0" ? item.entre : item.sortie,
            type: item.entre != "0" ? "achat" : "vente",
        };
        });
  
        return transactions;
  
    } catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error);
        throw error;
    }
  };
    
  