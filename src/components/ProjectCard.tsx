import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Users } from 'lucide-react-native';

interface ProjectCardProps {
  title: string;
  progress: number;
  dueDate: string;
  members: number;
  color: string;
}

export function ProjectCard({ title, progress, dueDate, members, color }: ProjectCardProps) {
  const progressPercent = Math.round(progress * 100);
  
  return (
    <Pressable style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{progressPercent}%</Text>
          <Text style={styles.dueDate}>Due {dueDate}</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercent}%`, backgroundColor: color }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.membersContainer}>
          <Users color="#666" size={16} />
          <Text style={styles.membersText}>{members} Members</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#141b41',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#333',
  },
  dueDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f2f5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});