import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);

  const showPickerOptions = async (mealType: string) => {
    const title = mealType === 'Bild erneut wählen' ? 'Neues Bild wählen' : `${mealType} hinzufügen`;

    Alert.alert(
      title,
      'Wähle eine Option',
      [
        {
          text: '📷 Kamera öffnen',
          onPress: () => openCamera(mealType),
        },
        {
          text: '🖼️ Aus Galerie wählen',
          onPress: () => openGallery(mealType),
        },
        {
          text: '❌ Abbrechen',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async (mealType: string) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Kamera-Zugriff verweigert');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      console.log(`📷 Kamera-Bild für ${mealType}:`, selectedImage);
    }
  };

  const openGallery = async (mealType: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Galerie-Zugriff verweigert');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      console.log(`🖼️ Galerie-Bild für ${mealType}:`, selectedImage);
    }
  };

  return (
    <LinearGradient
      colors={['#E0F7FA', '#FFFDE7']}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.calorieBox}>
          <Text style={styles.sideNumber}>123</Text>
          <View style={styles.circle}>
            <Text style={styles.centerNumber}>123</Text>
            <Text style={styles.centerLabel}>CAL LEFT</Text>
          </View>
          <Text style={styles.sideNumber}>123</Text>
        </View>

        <View style={styles.grid}>
          {['Snack', 'Frühstück', 'Mittagessen', 'Abendessen'].map((meal) => (
            <Pressable
              key={meal}
              style={styles.mealBox}
              onPress={() => showPickerOptions(meal)}
            >
              <Text style={styles.mealText}>{meal}</Text>
              <Text style={styles.plus}>+</Text>
            </Pressable>
          ))}
        </View>

        {image && (
  <View style={styles.previewContainer}>
    <Image
      source={{ uri: image }}
      style={styles.previewImage}
    />
    <View style={styles.iconRow}>
      <Pressable onPress={() => showPickerOptions('Bild erneut wählen')}>
        <Feather name="edit" size={28} color="#00796B" />
      </Pressable>
      <Pressable onPress={() => router.push('/Analyse')}>
  <Feather name="check" size={28} color="#00796B" />
</Pressable>

    </View>
  </View>
)}

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: 100,
  },
  calorieBox: {
    backgroundColor: '#FFFFFFCC',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  sideNumber: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
  },
  centerNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796B',
  },
  centerLabel: {
    fontSize: 12,
    color: '#004D40',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  mealBox: {
    backgroundColor: '#FFFFFFCC',
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  mealText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
    color: '#333',
  },
  plus: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#26A69A',
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 10,
  },
});
