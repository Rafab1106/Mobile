import { getAll, getWithFiltre, getWithFiltreAndOrder, getWithOrder } from '../services/fonctionFirebase';

// Fonction pour récupérer toutes les cryptos
export const getCours = async (crypto) => {
    try {
        const data = await getWithFiltreAndOrder("CryptoCours","crypto",crypto,"==","daty","asc");
        return Array.from(data);
    } catch (err) {
        throw new Error(err.message);
    }
};

export const addCours = async (data) => {
    try {
        const docId = await addDataToCollection("utilisateurs", data);
    } catch (err) {
        throw new Error(err.message);
    }
};