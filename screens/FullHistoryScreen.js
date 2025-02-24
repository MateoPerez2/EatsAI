// screens/FullHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FullHistoryScreen({ navigation }) {
  const [allMeals, setAllMeals] = useState([]);

  const fetchAllMeals = async () => {
    // same approach as the smaller snippet, but no limit or date filter
  };

  useEffect(() => {
    fetchAllMeals();
  }, []);

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'bold', marginBottom:10 }}>Full Meal History</Text>
      <FlatList
        data={allMeals}
        renderItem={({item}) => (
          <View style={{ padding:12, marginBottom:10, backgroundColor:'#fff' }}>
            <Text style={{ fontWeight:'bold' }}>{item.meal}</Text>
            <Text>{item.calories} cals</Text>
          </View>
        )}
        keyExtractor={(it,idx) => `${it._id||idx}`}
      />
    </View>
  );
}
