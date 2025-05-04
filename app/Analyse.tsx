import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AnalyseScreen() {
  return (
    <LinearGradient colors={['#E0F7FA', '#FFFDE7']} style={styles.container}>
      <Text style={styles.title}>Ergebnis</Text>

      <View style={styles.analysisBox}>
        <Text style={styles.analysisText}>Rot:       50%</Text>
        <Text style={styles.analysisText}>Grün:      20%</Text>
        <Text style={styles.analysisText}>Gelb:      10%</Text>
        <Text style={styles.analysisText}>Orange: 15%</Text>
        <Text style={styles.analysisText}>Braun:    0%</Text>
        <Text style={styles.analysisText}>Weiß:     0%</Text>
      </View>

      <Feather name="bar-chart-2" size={80} color="#333" style={styles.icon} />
      <Feather name="check" size={40} color="#333" style={styles.check} />

      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackText}>Super, du bist auf dem richtigen Weg!</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  analysisBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    width: '70%',
    marginBottom: 40,
  },
  analysisText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  icon: {
    marginBottom: 30,
  },
  check: {
    marginBottom: 30,
  },
  feedbackBox: {
    backgroundColor: '#C8E6C9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  feedbackText: {
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
});
