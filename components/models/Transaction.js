import {addDataToCollection, getWithFiltre} from '../services/fonctionFirebase';

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
  
        // Transformer les données au bon format
        const transactions = data.map((item) => ({
            date: item.daty?.seconds ? new Date(item.daty.seconds * 1000).toLocaleString() : "Date inconnue",
            crypto: item.crypto,
            montant: item.entre != "0" ? item.entre : item.sortie,
            type: item.entre != "0" ? "achat" : "vente"
        }));
  
        return transactions;
  
    } catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error);
        throw error;
    }
  };
    
  