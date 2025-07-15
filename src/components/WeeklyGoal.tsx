import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../utils/api';
import { CalendarDays } from 'lucide-react-native';
export default function WeeklyGoal({ refreshing }) {
  const [weeklyReport, setWeeklyReport] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const getWeeklyGoal = async () => {
    try {
      const response = await api.get(`/project/weekly/goal/by/${id}`);
      const data = response.data.weeklyGoals;
      setWeeklyReport(data);
    } catch (error) {
      console.log('Error fetching to weekly report : ', error);
    }
  };
  useEffect(() => {
    if (id) {
      getWeeklyGoal(id);
    }
  }, [id, refreshing]);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('week-view', { id: item._id })}
    >
      <View style={styles.dateContainer}>
        <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
        <Text style={styles.dateText}>
          {' '}
          {moment(item.createdAt).format('DD MMM YYYY')}
        </Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <Text style={styles.viewText}>View</Text>
    </Pressable>
  );

  return (
    <>
      <FlatList
        data={weeklyReport}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            No weekly goals found.
          </Text>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
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
