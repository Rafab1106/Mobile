import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Importer la navigation
import Header from '../Header';
import {getAllCrypto, checkFavorite, supp} from '../models/CryptoModel';
import {addTransact} from '../models/Transaction'
import {getUserId} from '../models/LoginModel'

const Market = () => {
  const [cryptos,setCrypto] = useState([]);
  // const [cryptoPrices, setCryptoPrices] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  // const userid = getUserId();
  const navigation = useNavigation(); // Permet de naviguer vers une autre page
  
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

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await getAllCrypto();
        setCrypto(data);
      } catch (err) {
          setError(err.message);
      }
    };

    fetchCryptos();
  }, []);
  // Générer des prix aléatoires
  const generateRandomPrices = () => {
    const newPrices = {};
    cryptos.forEach(crypto => {
      newPrices[crypto.id] = (Math.random() * 50000 + 10000).toFixed(2);
    });

    // Comparer avec les anciens prix pour déterminer la couleur du contour
    const updatedPrices = {};
    Object.keys(newPrices).forEach(id => {
      const oldPrice = previousPrices[id] || newPrices[id];
      const newPrice = newPrices[id];
      updatedPrices[id] = {
        price: newPrice,
        borderColor: newPrice > oldPrice ? 'green' : newPrice < oldPrice ? 'red' : 'gray',
      };
    });

    setPreviousPrices(newPrices);
    // setCryptoPrices(updatedPrices);
  };

  // Mettre à jour les prix toutes les 10 secondes
  useEffect(() => {
    generateRandomPrices();
    const interval = setInterval(generateRandomPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = async (cryptoId) => {
    try {
        // Étape 1 : Vérifier si l'entrée existe déjà (cryptoId + userId)
        const retour = await checkFavorite("Favoris",cryptoId,userid);

        if (retour.length != 0) {
          console.log("defavorie");
            // L'entrée existe, donc on supprime
            retour.forEach(async (document) => {
                await supp("Favoris",cryptoId,userid);
                console.log(`Favori supprimé : ${document.id}`);
            });

            // Mise à jour de l'état local
            setFavorites(prevFavorites => prevFavorites.filter(fav => fav !== cryptoId));
        } else {
          const data= {
            crypto:cryptoId,
            user: userid
          };
            // L'entrée n'existe pas, donc on l'ajoute
            const docRef = await addTransact("Favoris",data);
            // console.log(`Favori ajouté : ${docRef.id}`);

            // Mise à jour de l'état local
            setFavorites(prevFavorites => [...prevFavorites, cryptoId]);
        }
      } catch (err) {
          setError(err.message);
          console.error("Erreur lors de l'ajout/retrait du favori :", err.message);
      }
  };

  // Fonction pour naviguer vers la page Graphe
  const goToGraphe = (cryptoId) => {
    setModalVisible(false); // Fermer la fenêtre modale
    navigation.navigate('Graph', { cryptoId }); // Naviguer vers la page Graphe avec l'ID
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Liste des Cryptos</Text>

      <FlatList
        data={cryptos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cryptoItem}>
            <Text style={styles.cryptoName}>{item.nom}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Icon
                name={favorites.includes(item.id) ? 'star' : 'star-border'}
                size={30}
                color={favorites.includes(item.id) ? '#FFD700' : '#888'}
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bouton pour ouvrir les favoris */}
      <TouchableOpacity style={styles.favoritesButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.favoritesButtonText}>⭐ Voir mes Favoris</Text>
      </TouchableOpacity>

      {/* Fenêtre modale pour afficher les favoris */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⭐ Mes Cryptos Favoris</Text>

            {favorites.length === 0 ? (
              <Text style={styles.noFavoritesText}>Aucun favori pour l’instant.</Text>
            ) : (
              <FlatList
                data={cryptos.filter(crypto => favorites.includes(crypto.id))}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => goToGraphe(item.id)}>
                    <View style={styles.favoriteItem}>
                      <Text style={styles.favoriteName}>{item.nom}</Text>
                      {/* <Text style={styles.favoritePrice}>${cryptoPrices[item.id]?.price || '...'}</Text> */}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  cryptoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  cryptoName: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    padding: 10,
    borderWidth: 3,
    borderRadius: 5,
  },
  cryptoPrice: {
    color: '#fff',
    fontSize: 16,
  },
  favoritesButton: {
    backgroundColor: '#00ffcc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  favoritesButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#00ffcc',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  favoriteName: {
    color: '#00ffcc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritePrice: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Market;
