// components/charts/DailyCaloriesChart.js
import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

/**
 * @param {Object} props
 * @param {Array} props.data - e.g. [{ date: "YYYY-MM-DD", calories: number }, ...]
 * @param {Object} props.chartStyle - additional styles for the chart
 */
export default function DailyCaloriesChart({ data = [], chartStyle = {} }) {
  if (!data.length) {
    return null; // or return a <Text>No data</Text>
  }

  const labels = data.map(item => item.date.slice(5)); // "MM-DD"
  const values = data.map(item => item.calories);

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
        color: (opacity = 1) => `rgba(52, 107, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        barPercentage: 0.7,
      }}
      style={[{ marginVertical: 8, borderRadius: 16 }, chartStyle]}
    />
  );
}
