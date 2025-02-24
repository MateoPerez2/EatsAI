// components/charts/Past30DaysChart.js
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Circle, G, Rect, Text as SvgText } from 'react-native-svg';

export default function Past30DaysChart({ data = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!data.length) return null;

  // Limit labels to avoid overlap
  const MAX_LABELS = 6;
  const step = Math.ceil(data.length / MAX_LABELS);
  const labels = data.map((item, index) =>
    index % step === 0 ? item.date.slice(5) : ''
  );
  const values = data.map((item) => item.totalCalories);

  const chartWidth = Dimensions.get('window').width - 32;

  return (
    <LineChart
      data={{
        labels,
        datasets: [
          {
            data: values,
            color: () => '#346BEB', // Darker line color
            strokeWidth: 3,         // Thicker line
          },
        ],
      }}
      width={chartWidth}
      height={220}
      fromZero
      bezier
      yAxisSuffix=" cal"
      chartConfig={{
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(52, 52, 52, ${opacity})`, // Axis label color
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        fillShadowGradient: '#346beb',
        fillShadowGradientOpacity: 0.2,
        propsForDots: {
          r: '0', // Hide the default dots
        },
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
      withInnerLines={false}
      withOuterLines={true}
      withDots={true}
      onDataPointClick={(point) => {
        setSelectedIndex(point.index);
      }}
      renderDotContent={({ x, y, index, indexData }) => {
        if (index === selectedIndex) {
          // Dimensions for the tooltip box
          const tooltipWidth = 60;
          const tooltipHeight = 20;
          const offsetX = 10;
          const offsetY = 30;
          
          // Start with default positions (to the right and above the tapped point)
          let tooltipX = x + offsetX;
          let tooltipY = y - offsetY;

          // Adjust if the tooltip would overflow the right edge
          if (tooltipX + tooltipWidth > chartWidth) {
            tooltipX = chartWidth - tooltipWidth - 5;
          }
          // Ensure tooltip doesn't go off the left edge
          if (tooltipX < 0) {
            tooltipX = 5;
          }
          // If tooltip would be off the top, place it below the tapped point instead
          if (tooltipY < 0) {
            tooltipY = y + 10;
          }

          return (
            <G key={`tooltip-${index}`}>
              {/* Visible dot on the tapped point */}
              <Circle cx={x} cy={y} r={5} fill="#346BEB" />
              {/* Tooltip background */}
              <Rect
                x={tooltipX}
                y={tooltipY}
                width={tooltipWidth}
                height={tooltipHeight}
                fill="white"
                rx={5}
                ry={5}
              />
              {/* Tooltip text */}
              <SvgText
                x={tooltipX + tooltipWidth / 2 - 10}
                y={tooltipY + tooltipHeight / 2 + 4}
                fill="#333"
                fontSize="12"
                textAnchor="middle"
              >
                {indexData} cal
              </SvgText>
            </G>
          );
        }
        return null;
      }}
    />
  );
}
