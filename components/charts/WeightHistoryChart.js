// components/charts/WeightHistoryChart.js
import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

/**
 * @param {Object} props
 * @param {Array} props.data - e.g. [{ date: "YYYY-MM-DD", weight: number }, ...]
 */
export default function WeightHistoryChart({ data = [] }) {
  if (!data.length) {
    return null;
  }

  const labels = data.map(item => item.date.slice(5));
  const values = data.map(item => item.weight);

  return (
    <LineChart
      data={{
        labels,
        datasets: [
          {
            data: values,
            color: (opacity = 1) => `rgba(0, 184, 148, ${opacity})`,
            strokeWidth: 2,
          }
        ],
      }}
      width={Dimensions.get('window').width - 32}
      height={220}
      fromZero
      bezier
      yAxisSuffix=" kg"
      chartConfig={{
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        propsForDots: {
          r: '5',
          strokeWidth: '2',
          stroke: '#fff'
        }
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
}
