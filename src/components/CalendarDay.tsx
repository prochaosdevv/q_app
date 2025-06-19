import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface CalendarDayProps {
  day: number;
  isToday?: boolean;
  hasEvents?: boolean;
}

export function CalendarDay({ day, isToday = false, hasEvents = false }: CalendarDayProps) {
  return (
    <Pressable style={styles.dayContainer}>
      <View 
        style={[
          styles.dayCircle,
          isToday && styles.todayCircle,
        ]}
      >
        <Text 
          style={[
            styles.dayText,
            isToday && styles.todayText
          ]}
        >
          {day}
        </Text>
      </View>
      
      {hasEvents && (
        <View style={styles.eventDot} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: 40,
    height: 52,
    alignItems: 'center',
    margin: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    backgroundColor: '#141b41',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
  },
  todayText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5D8BF4',
    marginTop: 4,
  },
});