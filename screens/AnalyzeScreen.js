// screens/AnalyzeScreen.js
import React, { useState } from 'react';
import { 
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

export default function AnalyzeScreen({ navigation }) {
  const [mealName, setMealName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        t('errorTitle') || "Error", 
        t('cameraRollPermissionNeeded') || "Need camera roll permission!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setAnalysis(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      return Alert.alert(t('noImageSelected'), t('pickImageFirst'));
    }
    setLoading(true);
    setAnalysis(null);

    try {
      const base64Data = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64
      });
      const dataUrl = `data:image/jpeg;base64,${base64Data}`;

      const response = await fetch(`${API_URL}/analyze-structured`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: dataUrl })
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || t('analyzingError'));
      }

      if (json.refusal) {
        Alert.alert(t('analysisRefusal'), json.refusal);
        return;
      }

      let structured;
      if (typeof json.analysis === 'string') {
        structured = JSON.parse(json.analysis);
      } else {
        structured = json.analysis;
      }

      setAnalysis({
        calories: structured.calories,
        carbs: structured.carbs,
        protein: structured.protein,
        fats: structured.fats,
        notes: structured.notes
      });
    } catch (err) {
      Alert.alert(t('analyzingError'), err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, val) => {
    setAnalysis(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    if (!analysis) return;
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return Alert.alert(t('notLoggedIn'), t('pleaseLoginFirst'));
      }

      const body = {
        meal: mealName || t('untitledMeal') || 'Untitled Meal',
        calories: parseInt(analysis.calories),
        macros: {
          carbs: parseInt(analysis.carbs),
          protein: parseInt(analysis.protein),
          fats: parseInt(analysis.fats)
        }
      };

      const response = await fetch(`${API_URL}/intakes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('failedSaveIntake'));
      }

      Alert.alert(t('saved'), t('mealSaved'));
      // reset
      setMealName('');
      setSelectedImage(null);
      setAnalysis(null);
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert(t('saveError') || t('errorTitle'), err.message);
    }
  };

  const handleDismiss = () => {
    setAnalysis(null);
    Alert.alert(
      t('dismissedTitle') || "Dismissed", 
      t('dismissedMsg') || "Meal not logged."
    );
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>{t('analyzeHeader')}</Text>

      {/* Optional meal name */}
      <View style={styles.mealNameContainer}>
        <Text style={{ marginRight: 8 }}>{t('mealNameOptionalLabel')}</Text>
        <TextInput
          style={styles.mealNameInput}
          placeholder="e.g. Chicken Salad"
          value={mealName}
          onChangeText={setMealName}
        />
      </View>

      <Button title={t('pickImageButton')} onPress={pickImage} />

      {selectedImage && (
        <View style={{ marginVertical: 12, alignItems: 'center' }}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <Button title={t('analyzeHeader')} onPress={analyzeImage} />
        </View>
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {analysis && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>{t('editEstimatedMacros')}</Text>

          <Text>{t('caloriesLabel')}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(analysis.calories || '')}
            onChangeText={val => updateField('calories', val)}
          />

          <Text>{t('carbsLabel')}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(analysis.carbs || '')}
            onChangeText={val => updateField('carbs', val)}
          />

          <Text>{t('proteinLabel')}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(analysis.protein || '')}
            onChangeText={val => updateField('protein', val)}
          />

          <Text>{t('fatsLabel')}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(analysis.fats || '')}
            onChangeText={val => updateField('fats', val)}
          />

          <Text style={styles.notesLabel}>{t('aiNotesLabel')}</Text>
          <Text style={styles.notesBox}>{analysis.notes}</Text>

          <View style={{ marginTop: 10 }}>
            <Button title={t('saveButton') || "Save"} onPress={handleSave} />
            <View style={{ marginVertical: 5 }} />
            <Button title={t('dismissButton')} color="red" onPress={handleDismiss} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  mealNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  mealNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 8,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 8
  },
  notesLabel: { marginTop: 8, marginBottom: 4 },
  notesBox: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6
  }
});
