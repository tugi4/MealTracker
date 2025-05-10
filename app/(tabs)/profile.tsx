import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  return (
    <LinearGradient colors={['#e8f5e9', '#f1f8e9']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>👤 Persönliches Profil</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Dein Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alter</Text>
          <TextInput
            style={styles.input}
            placeholder="z. B. 25"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Größe (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="z. B. 170"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gewicht (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="z. B. 65"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingTop: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
