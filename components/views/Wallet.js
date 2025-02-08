import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView} from 'react-native';
import Header from '../Header';
import {calculerSommeEntreeSortie} from '../models/WalletModel';
import {getCryptoBalanceForUser,getbyId} from '../models/CryptoModel';
import {getTransactionsForUser} from '../models/Transaction';
import {getUserId} from '../models/LoginModel'

const Wallet = () => {
  const [wallet, setWallet] = useState([]);
  // const [cryptoPrices, setCryptoPrices] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState(null);
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
    const totalTran = async () => {
      try {
        // console.log(userid);
        const data = await calculerSommeEntreeSortie(userid,"UserTransaction");
        console.log(JSON.stringify(data));
        setTotalAmount(data);
      } catch (error) {
        setError(error.message);
      }
    }
    totalTran();
    const intervalId = setInterval(() => {
      totalTran();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []); 
// 
  useEffect(() => {
    const totalcrypt = async () => {
      try {
        const data = await getCryptoBalanceForUser("CryptoTransaction",userid);
        // console.log(JSON.stringify(data));
        setWallet(data);
      } catch (error) {
        setError(error.message);
      }
    }
    totalcrypt();
    const intervalId = setInterval(() => {
      totalcrypt();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []); 
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await getTransactionsForUser("CryptoTransaction", userid);
        setTransactions(result);
      } catch (error) {
        console.error("Erreur lors du chargement des transactions :", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <Header/>
      <Text style={styles.title}>Portefeuille</Text>

      {/* Montant total du portefeuille */}
      <Text style={styles.totalAmount}>Montant exact : {totalAmount}EUR</Text>

      {/* Liste des cryptos dans le portefeuille */}
      <FlatList
        data={wallet}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cryptoItem}>
            <Text style={styles.cryptoName}>{item.name}</Text>
            <Text style={styles.cryptoQuantity}>Quantité : {item.balance}</Text>
            {/* <Text style={styles.cryptoPrice}>Prix actuel : ${cryptoPrices[item.id] || '...'}</Text> */}
            {/* <Text style={styles.totalValue}>
              Valeur totale : ${((cryptoPrices[item.id] || 0) * item.quantity).toFixed(2)}
            </Text> */}
          </View>
        )}
      />

      {/* Bouton Historique */}
      <TouchableOpacity style={styles.historyButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.historyButtonText}>Historique</Text>
      </TouchableOpacity>

      {/* Fenêtre modale pour l'historique */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Historique des transactions</Text>

            {/* Liste des transactions */}
            <View style={{ flexGrow: 1 }}>
            <ScrollView style={{ maxHeight: 300 }}>
              <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <View style={[styles.transactionItem, item.type === "achat" ? styles.buy : styles.sell]}>
                    <Text style={styles.transactionText}>
                      {item.type} {item.montant} {item.crypto}
                    </Text>
                    <Text style={styles.transactionDate}>Date : {item.date}</Text>
                  </View>
                )}
              />
            </ScrollView>
              {/* <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={[styles.transactionItem, item.type === "achat" ? styles.buy : styles.sell]}>
                    <Text style={styles.transactionText}>
                      {item.type} {item.montant} {item.crypto}
                    </Text>
                    <Text style={styles.transactionDate}>Date : {item.date}</Text>
                  </View>
                )}
              /> */}
            </View>


            {/* Bouton pour fermer la fenêtre */}
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
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 22,
    color: '#00ffcc',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cryptoItem: {
    backgroundColor: '#222',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  cryptoName: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cryptoQuantity: {
    color: '#fff',
    fontSize: 16,
  },
  cryptoPrice: {
    color: '#fff',
    fontSize: 16,
  },
  totalValue: {
    color: '#00ffcc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#00ffcc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  historyButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    color: '#00ffcc',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  transactionItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  buy: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  sell: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  transactionText: {
    fontSize: 16,
    color: '#fff',
  },
  transactionDate: {
    fontSize: 14,
    color: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Wallet;
