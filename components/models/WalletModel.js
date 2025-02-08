import {getWithFiltre, getWithFiltreAndOrder, getWithOrder, getWithFiltreMultiple} from '../services/fonctionFirebase';

export const calculerSommeEntreeSortie = async (userId,collectionName) => {
    try {
        const document = ["user","etat"];
        const valeur = [userId,11];

        const data = await getWithFiltreMultiple(collectionName,document,valeur,"==");

        let totalEntree = 0;
        let totalSortie = 0;
  
        // Parcourt tous les documents et calcule les sommes
        data.forEach((item) => {
            const entree = item.entre ? parseFloat(item.entre) : 0;
            const sortie = item.sortie ? parseFloat(item.sortie) : 0;
  
            totalEntree += entree;
            totalSortie += sortie;
        });
  
        // Calcul de la différence entre les entrées et sorties
        const difference = totalEntree - totalSortie;
  
        return difference;
    } catch (error) {
        console.error("Erreur lors du calcul des sommes :", error);
        throw error;
    }
  };
  