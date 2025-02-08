import React, { useState, useEffect } from 'react';
import { View ,Picker ,Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import {getAllCrypto} from '../models/CryptoModel';
import {getCours} from '../models/GraphModel';
import { Timestamp } from 'firebase/firestore';
import {addTransact} from '../models/Transaction'
import {getUserId} from '../models/LoginModel'

const { width } = Dimensions.get('window');

  const Graph = () => {
    // Liste des cryptos disponibles
    const [cryptos,setCrypto] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCrypto, setSelectedCrypto] = useState("1");
    const [chartData, setChartData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [transactionType, setTransactionType] = useState(null); // "buy" ou "sell"
    const [cryptoAmount, setCryptoAmount] = useState('');
    const navigation = useNavigation();
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

    useEffect(() => {
      const fetchCours = async () => {
        try {
            const valeur = selectedCrypto ?? 1;
            const data = await getCours(valeur);
            setChartData(data.map(item => parseFloat(item.cours)));
        } catch (err) {
            setError(err.message);
        }
      };

      fetchCours();

      const intervalId = setInterval(() => {
        fetchCours();
      }, 11000);

      return () => clearInterval(intervalId);

    }, [selectedCrypto]);

    if (error) {
      return (
          <View style={styles.center}>
              <Text style={styles.error}>Erreur : {error}</Text>
          </View>
      );
    }

  const openModal = (type) => {
    setTransactionType(type);
    setModalVisible(true);
  };


const handleTransaction = async () => {
    let entre = 0;
    let sortie = 0;
    if (transactionType == "buy") {
        entre = cryptoAmount;
    } else {
        sortie = cryptoAmount;
    }
    const data = {
        cours: "1",
        crypto: selectedCrypto,
        daty: Timestamp.now(),
        devise: "1",
        entre: entre,
        sortie: sortie,
        user: userid
    };

    try {
        let id = await addTransact("CryptoTransaction", data);
        // console.log("Transaction ajoutée avec succès. ID du document :", id);
        setModalVisible(false); // Fermer le modal
        setCryptoAmount('');    // Réinitialiser le montant de crypto
    } catch (err) {
        setError(err.message);  // Gérer l'erreur si l'ajout échoue
        console.error("Erreur lors de l'ajout de la transaction :", err.message);
    }
};

  return (
    <View style={styles.container}>

      <Header/>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#00ffcc" />
      </TouchableOpacity>

      {/* Sélection de la crypto */}
      <Text style={styles.label}>Sélectionnez une crypto :</Text>
      <Picker
        selectedValue={selectedCrypto}
        onValueChange={(itemValue) => setSelectedCrypto(itemValue)}
      >
        <Picker.Item key={0} label={"Select One"} value={null} />
        {cryptos.map((crypto, index) => (
          <Picker.Item key={index} label={crypto.nom} value={crypto.id} />
        ))}
      </Picker>

      {/* Graphique */}
      {/* <Text style={styles.graphTitle}>Évolution de {selectedCrypto}</Text> */}
      <LineChart
        
        data={{
          // labels: ['0s', '10s', '20s', '30s', '40s', '50s'],
          datasets: [{ data: chartData }],
        }}
        width={width - 40}
        height={250}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#222',
          backgroundGradientTo: '#444',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 255, 204, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: '6', strokeWidth: '2', stroke: '#fff' },
        }}
        bezier
        style={{ marginVertical: 10, borderRadius: 16 }}
      />

      {/* Boutons Buy et Sell */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buyButton} onPress={() => openModal('buy')}>
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sellButton} onPress={() => openModal('sell')}>
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour Buy/Sell */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              {transactionType === 'buy' ? 'Acheter' : 'Vendre'} {selectedCrypto}
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cryptoAmount}
              onChangeText={setCryptoAmount}
            />
            <View style={styles.modalButtons}>

              <TouchableOpacity
                style={transactionType === 'buy' ? styles.buyButton : styles.sellButton}
                onPress={handleTransaction}
              >
                <Text style={styles.buttonText}>
                  {transactionType === 'buy' ? 'Acheter' : 'Vendre'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  label: {
    color: '#00ffcc',
    fontSize: 18,
    marginBottom: 10,
  },
  graphTitle: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#00ffcc',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00ffcc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#888',
    padding: 15,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
});

// Styles du Picker
const pickerSelectStyles = {
  inputIOS: {
    color: '#00ffcc',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputAndroid: {
    color: '#00ffcc',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
};

export default Graph;
