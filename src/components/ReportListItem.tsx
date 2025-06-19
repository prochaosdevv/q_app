import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface ReportListItemProps {
  title: string;
  dateRange: string;
  description: string;
  onPress: () => void;
}

export function ReportListItem({ title, dateRange, description, onPress }: ReportListItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.dateContainer}>
        <Calendar size={16} color="rgba(0, 0, 0, 1)"  />
        <Text style={styles.dateText}>{dateRange}</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      
      <Text style={styles.viewText}>View</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    marginBottom: 12,
  },
  viewText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#141b41',
  },
});