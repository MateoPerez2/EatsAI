// WheelDatePicker.js
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT; // 200px
const CONTAINER_WIDTH = 60;
const CENTER_OFFSET = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2; // 80px

const WheelDatePicker = ({ onDateChange }) => {
  const flatListRef = useRef(null);
  const today = new Date();

  // Build the dates array from 30 days in the past to 2 days in the future.
  const dates = [];
  for (let offset = -30; offset <= 2; offset++) {
    const date = new Date();
    date.setDate(today.getDate() + offset);
    dates.push(date);
  }

  // Today is at index 30.
  const initialIndex = 30;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    // Scroll so that the selected item (today) is centered.
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: initialIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, 0);
  }, []);

  const onScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedIndex(newIndex);
    if (onDateChange) {
      onDateChange(dates[newIndex]);
    }
  };

  const renderItem = ({ item, index }) => {
    // Compare year, month, and day explicitly.
    const isActualDay =
      item.getFullYear() === today.getFullYear() &&
      item.getMonth() === today.getMonth() &&
      item.getDate() === today.getDate();

    const isSelected = index === selectedIndex;
    const weekdayInitial = item.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
    const dateNumber = item.getDate();

    return (
      <View style={[styles.itemContainer, isSelected && styles.selectedItem]}>
        <Text
          style={[
            styles.weekdayText,
            isActualDay && styles.actualDayText, // Ensure actual day is always black.
            isSelected && styles.selectedText,
          ]}
        >
          {weekdayInitial}
        </Text>
        <Text
          style={[
            styles.dateText,
            isActualDay && styles.actualDayText, // Ensure actual day is always black.
            isSelected && styles.selectedText,
          ]}
        >
          {dateNumber}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dates}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingVertical: CENTER_OFFSET }}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      <View style={styles.selectorOverlay} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 12,
    color: '#888', // default grey
  },
  dateText: {
    fontSize: 14,
    color: '#888', // default grey
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // selected items use black
  },
  actualDayText: {
    color: '#000', // actual day always uses black
    fontWeight: 'bold',
  },
  selectorOverlay: {
    position: 'absolute',
    top: CENTER_OFFSET,
    left: (CONTAINER_WIDTH - 30) / 2,
    width: 30,
    height: ITEM_HEIGHT,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
});

export default WheelDatePicker;
