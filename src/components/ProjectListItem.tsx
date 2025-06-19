import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Users, ChevronRight } from 'lucide-react-native';

interface ProjectListItemProps {
  title: string;
  progress: number;
  dueDate: string;
  members: number;
  tasksCompleted: number;
  totalTasks: number;
  color: string;
}

export function ProjectListItem({ 
  title, 
  progress, 
  dueDate, 
  members, 
  tasksCompleted, 
  totalTasks,
  color 
}: ProjectListItemProps) {
  const progressPercent = Math.round(progress * 100);
  
  return (
    <Pressable style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.dueDate}>Due {dueDate}</Text>
        </View>
        
        <View style={styles.progressInfo}>
          <Text style={styles.tasksText}>
            Tasks: {tasksCompleted}/{totalTasks}
          </Text>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercent}%`, backgroundColor: color }
            ]} 
          />
        </View>
        
        <View style={styles.footer}>
          <View style={styles.membersContainer}>
            <Users color="#666" size={16} />
            <Text style={styles.membersText}>{members} Members</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <ChevronRight color="#93a5b1" size={20} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#141b41',
    flex: 1,
    marginRight: 8,
  },
  dueDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tasksText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#333',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f2f5',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
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
  chevronContainer: {
    marginLeft: 8,
  },
});