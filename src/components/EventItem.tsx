import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface EventItemProps {
  title: string;
  time: string;
  location: string;
  color: string;
}

export function EventItem({ title, time, location, color }: EventItemProps) {
  return (
    <Pressable style={styles.container}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin color="#93a5b1" size={14} />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  colorIndicator: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#141b41',
    marginBottom: 4,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});