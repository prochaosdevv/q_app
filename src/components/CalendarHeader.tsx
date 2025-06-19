import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface CalendarHeaderProps {
  day: string;
}

export function CalendarHeader({ day }: CalendarHeaderProps) {
  return (
    <Text style={styles.day}>{day}</Text>
  );
}

const styles = StyleSheet.create({
  day: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
});