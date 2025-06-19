import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MoveVertical as MoreVertical, Mail } from 'lucide-react-native';

interface TeamMemberProps {
  name: string;
  role: string;
  status: 'online' | 'offline';
  assignedProjects: number;
  email: string;
}

export function TeamMember({ name, role, status, assignedProjects, email }: TeamMemberProps) {
  return (
    <Pressable style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {name.split(' ').map(n => n[0]).join('')}
        </Text>
        <View 
          style={[
            styles.statusIndicator,
            status === 'online' ? styles.onlineStatus : styles.offlineStatus
          ]} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.projectsText}>
            {assignedProjects} Project{assignedProjects !== 1 ? 's' : ''}
          </Text>
          
          <View style={styles.emailContainer}>
            <Mail color="#93a5b1" size={14} />
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>
      
      <Pressable style={styles.moreButton}>
        <MoreVertical color="#93a5b1" size={24} />
      </Pressable>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5D8BF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineStatus: {
    backgroundColor: '#4CAF50',
  },
  offlineStatus: {
    backgroundColor: '#9e9e9e',
  },
  contentContainer: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#141b41',
  },
  role: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5D8BF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#eef3ff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});