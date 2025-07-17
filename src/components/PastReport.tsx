import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../utils/api';
import { CalendarDays } from 'lucide-react-native';
import { useProjectStore } from '../zustand/store/projectStore';
export default function PastReport({ refreshing }) {
  const [pastReport, setPastReport] = useState([]);
  const navigation = useNavigation();
  const projectId = useProjectStore(state => state.id);

  const getPastReport = async () => {
    try {
      const response = await api.get(
        `/project/get/past-report/by/${projectId}`,
      );
      const data = response.data.reports;
      setPastReport(data);
    } catch (error) {
      console.log('Error fetching to weekly report : ', error);
    }
  };
  useEffect(() => {
    if (projectId) {
      getPastReport(projectId);
    }
  }, [projectId, refreshing]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <View style={styles.dateContainer}>
        <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
        <Text style={styles.dateText}>
          {' '}
          {moment(item.createdAt).format('DD MMM')}
        </Text>
      </View>

      <Text style={styles.title}>{item.project.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.project.description}
      </Text>

      <Pressable
        onPress={() =>
          navigation.navigate('report-details', { reportId: item._id })
        }
      >
        <Text style={styles.viewText}>View</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <>
      <FlatList
        data={pastReport}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            No past report found.
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
    fontSize: 22,
    color: '#141b41',
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
