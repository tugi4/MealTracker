import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [previousImages, setPreviousImages] = useState<string[]>([]);

  const motivationalQuotes = [
    'Du bist, was du isst – mach’s bunt und gesund! 🥦',
    'Jeder Biss zählt. Mach ihn wertvoll! 💪',
    'Iss, um zu leben – nicht andersrum. 🍎',
    'Kleine Schritte führen zu großen Veränderungen! 🚶‍♀️',
    'Eine gesunde Entscheidung pro Tag reicht schon. ✅',
  ];

  const recipes = [
    {
      title: 'Grüner Smoothie',
      desc: 'Spinat, Banane, Apfel und Haferdrink – ein Powerstart! 🥬🍌🍏',
    },
    {
      title: 'Linsensalat',
      desc: 'Linsen, Paprika, Feta und Zitrone. Sättigend & leicht. 🥗',
    },
    {
      title: 'Avocado-Brot',
      desc: 'Vollkornbrot mit Avocado, Tomate & Sesam. Perfekt fürs Frühstück! 🥑🥞',
    },
  ];

  const knowledge = [
    'Brokkoli enthält mehr Vitamin C als Orangen! 🥦',
    'Haferflocken liefern langanhaltende Energie. ⚡',
    'Wasser trinken kurbelt deinen Stoffwechsel an! 💧',
    'Beeren sind reich an Antioxidantien. 🍇',
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Guten Morgen!');
    else if (hour < 18) setGreeting('Guten Tag!');
    else setGreeting('Guten Abend!');
  }, []);

  const dailyQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const recipe = recipes[Math.floor(Math.random() * recipes.length)];
  const fact = knowledge[Math.floor(Math.random() * knowledge.length)];

  const showPickerOptions = async (mealType: string) => {
    const title = mealType === 'Bild erneut wählen' ? 'Neues Bild wählen' : `${mealType} hinzufügen`;
    Alert.alert(title, 'Wähle eine Option', [
      { text: '📷 Kamera öffnen', onPress: () => openCamera(mealType) },
      { text: '🖼️ Aus Galerie wählen', onPress: () => openGallery(mealType) },
      { text: '❌ Abbrechen', style: 'cancel' },
    ]);
  };

  const openCamera = async (mealType: string) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert('Kamera-Zugriff verweigert');
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      setPreviousImages([selectedImage, ...previousImages.slice(0, 4)]);
      setProgress(prev => Math.min(prev + 25, 100));
    }
  };

  const openGallery = async (mealType: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Galerie-Zugriff verweigert');
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      setPreviousImages([selectedImage, ...previousImages.slice(0, 4)]);
      setProgress(prev => Math.min(prev + 25, 100));
    }
  };

  return (
    <LinearGradient colors={['#e8f5e9', '#f1f8e9']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>{greeting}</Text>

        <View style={styles.calorieBox}>
          <Text style={styles.calorieTitle}>Tagesübersicht</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#00796B' }}>Eingenommen</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#004D40' }}>1023 kcal</Text>
            </View>
            <View style={styles.circle}>
              <Text style={styles.centerNumber}>477</Text>
              <Text style={styles.centerLabel}>Kalorien übrig</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#00796B' }}>Maximal</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#BF360C' }}>1500 kcal</Text>
            </View>
          </View>
        </View>

        <Text style={styles.quote}>{dailyQuote}</Text>

        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${progress}%` }]} />
        </View>

        <View style={styles.grid}>
          {['Snack', 'Frühstück', 'Mittagessen', 'Abendessen'].map((meal) => (
            <Pressable key={meal} style={styles.mealBox} onPress={() => showPickerOptions(meal)}>
              <Feather name="camera" size={22} color="#00796B" />
              <Text style={styles.mealText}>{meal} hinzufügen</Text>
            </Pressable>
          ))}
        </View>

        {image && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Bildvorschau</Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <View style={styles.iconRow}>
              <Pressable onPress={() => showPickerOptions('Bild erneut wählen')}>
                <Feather name="edit" size={28} color="#00796B" />
              </Pressable>
              <Pressable onPress={() => router.push({ pathname: '/Analyse', params: { image } })}>
                <Feather name="check-circle" size={28} color="#00796B" />
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.recipeBox}>
          <Text style={styles.recipeTitle}>Rezept des Tages</Text>
          <Text style={styles.recipeName}>{recipe.title}</Text>
          <Text style={styles.recipeDesc}>{recipe.desc}</Text>
        </View>

        <View style={styles.selfcareBox}>
          <Text style={styles.selfcareTitle}>Heute schon etwas Gutes für dich getan?</Text>
          <View style={{ rowGap: 4 }}>
            <Text style={styles.checkItem}>✅ Wasser getrunken</Text>
            <Text style={styles.checkItem}>✅ Obst gegessen</Text>
            <Text style={styles.checkItem}>✅ Bewegung gemacht</Text>
            <Text style={styles.checkItem}>✅ Entspannung genossen</Text>
          </View>
        </View>

        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>Deine Woche auf einen Blick</Text>
          <Text style={styles.insightItem}>🥗 3x gesund gegessen</Text>
          <Text style={styles.insightItem}>🍔 1x ungesund erkannt</Text>
          <Text style={styles.insightItem}>📸 4 Mahlzeiten analysiert</Text>
        </View>

        <View style={styles.goalBox}>
          <Text style={styles.goalTitle}>🎯 Dein Tagesziel</Text>
          <Text style={styles.goalText}>5 gesunde Lebensmittel erreichen!</Text>
        </View>

        <View style={styles.knowledgeBox}>
          <Text style={styles.knowledgeTitle}>Wusstest du schon?</Text>
          <Text style={styles.knowledgeText}>{fact}</Text>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            ℹ️ Hinweis: Die Analyse basiert auf Farben und Objekterkennung. Gute Beleuchtung und klare Sicht auf das Essen verbessern die Ergebnisse.
          </Text>
        </View>

        {previousImages.length > 0 && (
          <View style={styles.galleryBox}>
            <Text style={styles.galleryTitle}>Letzte Mahlzeiten</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {previousImages.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, paddingTop: 100, paddingBottom: 100 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#2E7D32', marginBottom: 16, textAlign: 'center' },
  calorieBox: { backgroundColor: '#FFFFFFCC', borderRadius: 20, alignItems: 'center', padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  calorieTitle: { fontSize: 18, fontWeight: '600', color: '#004D40', marginBottom: 10 },
  circle: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#26A69A', justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0F2F1' },
  centerNumber: { fontSize: 24, fontWeight: 'bold', color: '#00796B' },
  centerLabel: { fontSize: 12, color: '#004D40' },
  quote: { fontStyle: 'italic', fontSize: 16, color: '#555', marginVertical: 10, textAlign: 'center' },
  progressBarOuter: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginVertical: 16 },
  progressBarInner: { height: 12, backgroundColor: '#4CAF50', borderRadius: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  mealBox: { backgroundColor: '#FFFFFF', width: '48%', padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  mealText: { fontSize: 16, marginTop: 8, fontWeight: '500', color: '#333' },
  previewContainer: { alignItems: 'center', marginTop: 30 },
  previewTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#004D40' },
  previewImage: { width: 240, height: 240, borderRadius: 12 },
  iconRow: { flexDirection: 'row', gap: 30, marginTop: 12 },
  recipeBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginTop: 30, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  recipeTitle: { fontSize: 18, fontWeight: '600', color: '#4CAF50' },
  recipeName: { fontSize: 16, fontWeight: '500', color: '#333' },
  recipeDesc: { fontSize: 14, color: '#555', marginTop: 4 },
  selfcareBox: { backgroundColor: '#F9FBE7', padding: 16, borderRadius: 12, marginTop: 30, borderColor: '#C5E1A5', borderWidth: 1 },
  selfcareTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#558B2F', textAlign: 'center' },
  checkItem: { fontSize: 14, color: '#33691E' },
  insightBox: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginTop: 30, borderColor: '#FFB74D', borderWidth: 1 },
  insightTitle: { fontSize: 16, fontWeight: '600', color: '#EF6C00', marginBottom: 8 },
  insightItem: { fontSize: 14, color: '#E65100', marginBottom: 2 },
  goalBox: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, marginTop: 20, borderColor: '#66BB6A', borderWidth: 1 },
  goalTitle: { fontSize: 16, fontWeight: '600', color: '#388E3C', marginBottom: 4 },
  goalText: { fontSize: 14, color: '#2E7D32' },
  knowledgeBox: { backgroundColor: '#E3F2FD', padding: 16, borderRadius: 12, marginTop: 30 },
  knowledgeTitle: { fontSize: 16, fontWeight: '600', color: '#1976D2', marginBottom: 6 },
  knowledgeText: { fontSize: 14, color: '#0D47A1' },
  noticeBox: { backgroundColor: '#F3E5F5', padding: 12, borderRadius: 10, marginTop: 30, borderColor: '#BA68C8', borderWidth: 1 },
  noticeText: { fontSize: 13, color: '#6A1B9A', fontStyle: 'italic' },
  galleryBox: { marginTop: 30 },
  galleryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  galleryImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
});
