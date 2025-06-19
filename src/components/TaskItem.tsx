import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react-native';

interface TaskItemProps {
  title: string;
  time: string;
  completed: boolean;
}

export function TaskItem({ title, time, completed }: TaskItemProps) {
  return (
    <Pressable 
      style={[
        styles.container, 
        completed && styles.completedContainer
      ]}
    >
      <View style={styles.checkContainer}>
        {completed ? (
          <CheckCircle color="#5D8BF4" size={24} />
        ) : (
          <Circle color="#93a5b1" size={24} />
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text 
          style={[
            styles.title, 
            completed && styles.completedTitle
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  completedContainer: {
    opacity: 0.8,
    backgroundColor: '#f8f9fa',
  },
  checkContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#93a5b1',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
});