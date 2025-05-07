import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const uploadImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'meal.jpg',
      type: 'image/jpeg',
    } as any);

    console.log('⏳ Sende Bild an Backend:', imageUri);

    const response = await fetch(
      'https://17cd-193-170-2-74.ngrok-free.app/analyse',
      {
        method: 'POST',
        body: formData,
        
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Serverantwort: ${response.status}`);
    }

    const result = await response.json();
    console.log('📊 Analyse-Ergebnis:', result);
    return result;

  } catch (error) {
    console.error('❌ Fehler beim Senden:', error);
    return null;
  }
};

export default function AnalyseScreen() {
  const { image } = useLocalSearchParams();
  const [analysis, setAnalysis] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (typeof image === 'string') {
      console.log('📤 Starte Analyse für Bild:', image);
      uploadImage(image).then((res) => {
        if (res) {
          console.log('✅ Analyse empfangen');
          setAnalysis(res);
        } else {
          console.log('⚠️ Keine Analyse empfangen');
        }
      });
    }
  }, [image]);

  return (
    <LinearGradient colors={['#E0F7FA', '#FFFDE7']} style={styles.container}>
      <Text style={styles.title}>Ergebnis</Text>

      <View style={styles.analysisBox}>
        {analysis ? (
          Object.entries(analysis).map(([key, value]) => (
            <Text key={key} style={styles.analysisText}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}%
            </Text>
          ))
        ) : (
          <Text style={styles.analysisText}>Bild wird analysiert...</Text>
        )}
      </View>

      <Feather name="bar-chart-2" size={80} color="#333" style={styles.icon} />
      <Feather name="check" size={40} color="#333" style={styles.check} />

      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackText}>
          {analysis
            ? 'Super, du bist auf dem richtigen Weg!'
            : 'Bitte warte, Analyse läuft...'}
        </Text>
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
