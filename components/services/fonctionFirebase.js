import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, where, orderBy, query, getDocs, addDoc, deleteDoc, doc} from "firebase/firestore"; 
import app from './firebase'; // Importer l'instance de Firebase

// Authentification
const auth = getAuth(app);

// Initialisation de Firestore
const db = getFirestore(app);

// Fonction pour se connecter avec email et mot de passe
export const signInUser = (email, password) => {
    return;
    return signInWithEmailAndPassword(auth, email, password);
};

// Fonction pour récupérer des données depuis une collection
export const getAll = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
};

export const getDocumentWithMaxValue = async (collectionName, field) => {
    try {
        // Récupérer tous les documents de la collection
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        
        // Parcourir les documents et les stocker dans un tableau
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        // Trouver le document avec la valeur maximale pour le champ donné
        if (data.length === 0) {
            throw new Error("Aucun document trouvé dans la collection.");
        }

        let maxDoc = data[0]; // Initialiser avec le premier document
        for (const doc of data) {
            if (doc[field] > maxDoc[field]) {
                maxDoc = doc;
            }
        }

        return maxDoc; // Retourner le document avec la valeur maximale
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
};

export const getWithFiltre = async(collectionName,document,valeur,signe) => {
    try {
        const q = query(
            collection(db, collectionName),
            where(document, signe, valeur)
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}
export const getWithFiltreMultiple = async(collectionName,document,valeur,signe) => {
    try {
        const q = query(
            collection(db, collectionName),
            where(document[0], signe, valeur[0]),
            where(document[1], signe, valeur[1])
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

export const getWithOrder = async(collectionName,document,direction) => {
    try {
        const q = query(
            collection(db, collectionName),
            orderBy(document,direction)
            // where(document, signe, valeur)
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

export const getWithFiltreAndOrder = async (collectionName, document, valeur, signe, orderField, orderDirection = "asc") => {
    try {
        const q = query(
            collection(db, collectionName),
            where(document, signe, valeur),
            orderBy(orderField, orderDirection) // Ajoute le tri
        );

        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
};

// Fonction pour ajouter des données dans une collection
export const addDataToCollection = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
    } catch (error) {
        console.error("Erreur lors de l'ajout du document :", error);
    }
};

export const deleteDataByField = async (collectionName, fieldName, fieldValue) => {
    try {
        // Étape 1 : Rechercher le document par un champ
        const q = query(collection(db, collectionName), where(fieldName[0], "==", fieldValue[0]),where(fieldName[1], "==", fieldValue[1]));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`Aucun document trouvé avec ${fieldName} = ${fieldValue}`);
            return;
        }

        // Étape 2 : Supprimer chaque document trouvé
        querySnapshot.forEach(async (document) => {
            await deleteDoc(doc(db, collectionName, document.id));
            console.log(`Document ${document.id} supprimé avec succès.`);
        });

    } catch (error) {
        console.error("Erreur lors de la suppression du document :", error);
    }
};
// Exporter auth et db
export { auth, db };
