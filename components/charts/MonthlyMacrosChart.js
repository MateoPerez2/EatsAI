// components/charts/MonthlyMacrosChart.js
import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

/**
 * @param {Object} props
 * @param {Array} props.data - e.g. [{ month: "YYYY-MM", totalCalories, totalCarbs, ... }, ...]
 * @param {String} props.type - which field to visualize? e.g. "totalCalories" or "totalCarbs"
 */
export default function MonthlyMacrosChart({ data = [], type = "totalCalories" }) {
  if (!data.length) {
    return null;
  }

  const labels = data.map(item => item.month.slice(5)); // "MM"
  const values = data.map(item => item[type] || 0);

  return (
    <BarChart
      data={{
        labels,
        datasets: [{ data: values }]
      }}
      width={Dimensions.get('window').width - 32}
      height={220}
      fromZero
      chartConfig={{
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(52, 107, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
}
