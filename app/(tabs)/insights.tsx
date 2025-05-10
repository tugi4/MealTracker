import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatsScreen() {
  return (
    <LinearGradient colors={['#e8f5e9', '#f1f8e9']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>📈 Statistiken</Text>
        <Text style={styles.subtitle}>Deine letzten Auswertungen</Text>

        <View style={styles.box}>
          <Text style={styles.label}>Gesamtanzahl der Mahlzeiten:</Text>
          <Text style={styles.value}>48</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Durchschnittliche Bewertung:</Text>
          <Text style={styles.value}>🟢 Gesund</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Gesunde Mahlzeiten:</Text>
          <Text style={styles.value}>36</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Ungesunde Mahlzeiten:</Text>
          <Text style={styles.value}>12</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Letzte Aktivität:</Text>
          <Text style={styles.value}>10. Mai 2025 – Frühstück</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  box: {
    backgroundColor: '#ffffffcc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
