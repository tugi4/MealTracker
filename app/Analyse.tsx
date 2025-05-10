import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useObjectDetection } from './ObjectDetector'; 

const uploadImage = async (imageUri: string, objectPredictions: string[]) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'meal.jpg',
      type: 'image/jpeg',
    } as any);

    formData.append('objects', JSON.stringify(objectPredictions));

    console.log('⏳ Sende Bild an Backend:', imageUri);
    console.log('🧠 Mit Objekten:', objectPredictions);

    const response = await fetch(
      'https://b9d1-2001-871-24e-b027-d087-e223-aee0-4204.ngrok-free.app/analyse',
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
  const [analysis, setAnalysis] = useState<Record<string, any> | null>(null);
  const { predictions: objectPredictions, loading: objectLoading } = useObjectDetection(
    typeof image === 'string' ? image : null
  );

  useEffect(() => {
    if (typeof image === 'string') {
      console.log('📤 Starte Analyse für Bild:', image);
      uploadImage(image, objectPredictions).then((res) => {
        if (res) {
          console.log('✅ Analyse empfangen');
          setAnalysis(res);
        } else {
          console.log('⚠️ Keine Analyse empfangen');
        }
      });
    }
  }, [image, objectPredictions]);

  const getFeedbackMessage = (bewertung: string) => {
    if (bewertung === 'gesund 🥗') return 'Super! Weiter so mit gesunder Ernährung! 💪';
    if (bewertung === 'ungesund 🍔') return 'Lass es dir schmecken – einmal ist keinmal! 🍔';
    if (bewertung === 'okay 🍽️') return 'Mahlzeit! 🍽️';
    return 'Analyse abgeschlossen.';
  };

  return (
    <LinearGradient colors={['#e8f5e9', '#f1f8e9']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.analysisBox}>
          {analysis ? (
            <>
              <Text style={styles.resultLabel}>Deine Auswertung:</Text>
              <Text style={styles.resultValue}>{String(analysis.bewertung)}</Text>

              <Text style={styles.sectionLabel}>🍽 Farbanteile im Gericht:</Text>
              {Object.entries(analysis).map(([key, value]) => {
                if (key === 'formen' || key === 'bewertung' || key === 'hinweise') return null;

                const colorMap: Record<string, string> = {
                  rot: '🍓',
                  rot2: '🍓',
                  orange: '🍊',
                  gelb: '🧀',
                  gruen: '🥦',
                  blau: '🫐',
                  lila: '🍇',
                  braun: '🍖',
                  weiss: '🍚',
                  schwarz: '⚫',
                };

                const emoji = colorMap[key] || '⬜';

                return (
                  <View key={key} style={styles.colorRow}>
                    <Text style={styles.colorEmoji}>{emoji}</Text>
                    <Text style={styles.analysisText}>{value}%</Text>
                  </View>
                );
              })}

              <Text style={styles.sectionLabel}>🧠 Objekterkennung:</Text>
              {objectLoading ? (
                <ActivityIndicator size="small" color="#00796B" />
              ) : objectPredictions.length > 0 ? (
                objectPredictions.map((pred, index) => (
                  <Text key={index} style={styles.analysisText}>🔍 {pred}</Text>
                ))
              ) : (
                <Text style={styles.analysisText}>Keine Objekte erkannt.</Text>
              )}

              {analysis.hinweise && Array.isArray(analysis.hinweise) && (
                <>
                  <Text style={styles.sectionLabel}>📌 Hinweise zur Bewertung:</Text>
                  {analysis.hinweise.map((hinweis: string, index: number) => (
                    <Text key={index} style={styles.analysisText}>• {hinweis}</Text>
                  ))}
                </>
              )}
            </>
          ) : (
            <Text style={styles.analysisText}>Bild wird analysiert...</Text>
          )}
        </View>

        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>
            {analysis
              ? getFeedbackMessage(analysis.bewertung)
              : 'Bitte warte, deine Analyse läuft...'}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 80,
  },
  analysisBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 30,
  },
  analysisText: {
    fontSize: 16,
    color: '#333',
  },
  sectionLabel: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '600',
    color: '#00796B',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004D40',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  feedbackBox: {
    backgroundColor: '#C8E6C9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  feedbackText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
