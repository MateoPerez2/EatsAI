// screens/onboarding/OnboardingLanguageScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppContext } from '../../AppContext';
import { useTranslation } from '../../useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingLanguageScreen({ navigation }) {
  const { language, setLanguage } = useContext(AppContext);
  const { t } = useTranslation();
  
  const [tempLang, setTempLang] = useState(language);

  const handleNext = async () => {
    // Update global context
    await setLanguage(tempLang);
    // Possibly also set 'hasOnboarded' = false or step to next
    navigation.navigate('OnboardingGoals'); // example next screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('languageLabel')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={tempLang}
          onValueChange={(val) => setTempLang(val)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
        </Picker>
      </View>
      <Button title="Next" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, justifyContent:'center' },
  header:{ fontSize:22, fontWeight:'bold', marginBottom:12 },
  pickerWrapper:{
    borderWidth:1, borderColor:'#ccc', borderRadius:6, marginBottom:20
  }
});
