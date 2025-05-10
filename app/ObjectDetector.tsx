import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as FileSystem from 'expo-file-system';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { decode as base64Decode } from 'base-64';

interface DetectedObject {
  class: string;
  score: number;
}

export function useObjectDetection(imageUri: string | null) {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [rawObjects, setRawObjects] = useState<DetectedObject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const detectObjects = async () => {
      if (!imageUri) return;

      try {
        setLoading(true);
        await tf.ready();

        const model = await cocoSsd.load();

        const fileBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const decoded = base64Decode(fileBase64);
        const byteArray = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; ++i) {
          byteArray[i] = decoded.charCodeAt(i);
        }

        const imageTensor = decodeJpeg(byteArray);

        const results = await model.detect(imageTensor);

        const filtered = results
          .filter(obj => obj.score >= 0.6)
          .map(obj => ({
            class: obj.class,
            score: obj.score,
          }));

        setRawObjects(filtered);

        const displayList = filtered.map(
          (obj) => `${obj.class} (${Math.round(obj.score * 100)}%)`
        );
        setPredictions(displayList);

      } catch (error) {
        console.error('❌ Fehler bei Objekterkennung:', error);
        setPredictions(['Fehler bei der Objekterkennung']);
        setRawObjects([]);
      } finally {
        setLoading(false);
      }
    };

    detectObjects();
  }, [imageUri]);

  return { predictions, rawObjects, loading };
}
