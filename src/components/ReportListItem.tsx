import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar, CalendarDays } from 'lucide-react-native';

interface ReportListItemProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  onPress: () => void;
}

export function ReportListItem({
  title,
  description,
  startDate,
  endDate,
  onPress,
}: ReportListItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.dateContainer}>
        <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
        <Text style={styles.dateText}>{`${startDate} | ${endDate}`}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

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
    fontSize: 17,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
    fontWeight: '900',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    marginBottom: 12,
  },
  viewText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#141b41',
    fontWeight: '800',
  },
});
