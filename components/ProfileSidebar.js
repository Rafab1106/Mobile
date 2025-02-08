import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileSidebar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ModifyPhoto')}
      >
        <Text style={styles.buttonText}>Modifier la Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ModifyName')}
      >
        <Text style={styles.buttonText}>Modifier le Nom</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileSidebar;
