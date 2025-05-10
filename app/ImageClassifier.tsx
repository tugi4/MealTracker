import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const modelJson = require('../assets/models/model.json');
const modelWeights = [
  require('../assets/models/group1-shard1of3.bin'),
  require('../assets/models/group1-shard2of3.bin'),
  require('../assets/models/group1-shard3of3.bin'),
];

export default function ImageClassifier() {
  const [isTfReady, setIsTfReady] = useState(false);
  const [model, setModel] = useState<any>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
      setModel(loadedModel);
      setIsTfReady(true);
    };
    loadModel();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      classifyImage(uri);
    }
  };

  const classifyImage = async (uri: string) => {
    try {
      if (!model) return;
      setLoading(true);

      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const imageBuffer = tf.util.encodeString(fileBase64, 'base64').buffer;
      let imageTensor = decodeJpeg(new Uint8Array(imageBuffer));

      imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
      imageTensor = imageTensor.expandDims(0).toFloat().div(tf.scalar(255));

      const output = model.predict(imageTensor) as tf.Tensor;
      const data = await output.data();

      const topPredictionIndex = data.indexOf(Math.max(...data));
      setPredictions([`Index: ${topPredictionIndex} - Score: ${Math.round(data[topPredictionIndex] * 100)}%`]);

    } catch (error) {
      console.error('❌ Fehler bei Klassifikation:', error);
      setPredictions(['Fehler bei der Klassifikation']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="📷 Bild auswählen" onPress={pickImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginTop: 20 }}
          resizeMode="contain"
        />
      )}
      {!isTfReady && <ActivityIndicator size="large" color="#000" />}
      {loading && <ActivityIndicator size="large" color="#00796B" />}
      {predictions.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>🍽️ Vorhersage:</Text>
          {predictions.map((pred, idx) => (
            <Text key={idx}>🔍 {pred}</Text>
          ))}
        </View>
      )}
    </View>
  );
}
