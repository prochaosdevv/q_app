import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../utils/api';
import { CalendarDays, Pencil } from 'lucide-react-native';
import EditWeekGoalModal from './modal/EditWeekGoalModal';
import { useProjectStore } from '../zustand/store/projectStore';
export default function WeeklyGoal({ refreshing }) {
  const [weeklyGoal, setWeeklyGoal] = useState();
  const [showWeekGoalEditModal, setShowWeekGoalEditModal] = useState(false);
  const navigation = useNavigation();
  const projectId = useProjectStore(state => state.id);

  const getWeeklyGoal = async () => {
    try {
      const response = await api.get(`/project/weekly/goal/by/${projectId}`);
      const data = response.data.weeklyGoals;
      setWeeklyGoal(data);
    } catch (error) {
      console.log('Error fetching to weekly report : ', error);
    }
  };
  useEffect(() => {
    if (projectId) {
      getWeeklyGoal(projectId);
    }
  }, [projectId, refreshing]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <View style={styles.dateContainer}>
        <View style={{ flexDirection: 'row' }}>
          <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
          <Text style={styles.dateText}>
            {' '}
            {moment(item.startDate).format('DD MMM YYYY')}
          </Text>
        </View>
        <Pressable
          style={styles.edit}
          onPress={() => setShowWeekGoalEditModal(true)}
        >
          <Text style={styles.edit_text}>Edit</Text>
          <Pencil size={14} />
        </Pressable>

        <EditWeekGoalModal
          showWeekGoalEditModal={showWeekGoalEditModal}
          setShowWeekGoalEditModal={setShowWeekGoalEditModal}
        />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Pressable
        onPress={() => navigation.navigate('week-view', { id: item._id })}
      >
        <Text style={styles.viewText}>View</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <>
      <FlatList
        data={weeklyGoal}
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
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 3,
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
  edit: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
    display: 'flex',
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  edit_text: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 1)',
    // lineHeight: 24,
  },
});
