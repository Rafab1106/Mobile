// Depot.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './Header';

const Depot = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header/>
      <Text style={styles.title}>Dépôt / Retrait</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('DepotPage')}
        >
          <Text style={styles.buttonText}>Dépôt</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('RetraitPage')}
        >
          <Text style={styles.buttonText}>Retrait</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    color: '#00ffcc',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Depot;
