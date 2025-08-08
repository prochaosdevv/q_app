import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProjectStore } from '../zustand/store/projectStore';
import api from '../utils/api';
import { CalendarDays } from 'lucide-react-native';
import moment from 'moment';

type PastReport = {
  startDate: string; // or Date, depending on your data
  endDate: string;
  // ...other fields
};
export default function ReportListItem() {
  const [pastReports, setPastReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const projectId = useProjectStore(state => state.id);

  const fetchPastReports = async () => {
    try {
      const res = await api.get(`/project/get/past-goals/by/${projectId}`);

      const result = res.data.pastGoals;
      setPastReports(result);
      console.log('Dta', pastReports);
    } catch (error) {
      console.log('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const getTitleAndDescription = () => {
    pastReports.forEach(async report => {
      try {
        const res = await api.get(
          `/project/get/goal/by/dates/${projectId}?startDate=${report.startDate}&endDate=${report.endDate}`,
        );
        console.log('res', res.data);
      } catch (error) {
        console.error('API Error for report:', error);
      }
    });
  };

  useEffect(() => {
    if (projectId) {
      fetchPastReports(projectId);
      getTitleAndDescription(projectId);
    }
  }, [projectId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPastReports();
  }, []);

  const handleReportPress = item => {
    navigation.navigate('report-view', { item });
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.container} onPress={() => handleReportPress(item)}>
      <View style={styles.dateContainer}>
        <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
        <Text style={styles.dateText}>
          {`${moment(item.startDate).format('DD MMM')} - ${moment(
            item.endDate,
          ).format('DD MMM')}`}
        </Text>
      </View>

      <Text style={styles.title}>{item.title ? item.title : 'NA'}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description ? item.description : 'NA'}
      </Text>

      <Text style={styles.viewText}>View</Text>
    </Pressable>
  );

  if (loading && !refreshing) {
    return (
      <ActivityIndicator
        style={{ marginTop: 20 }}
        size="large"
        color="#14274A"
      />
    );
  }

  if (!loading && pastReports.length === 0) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 300, color: '#888' }}>
        No past reports found.
      </Text>
    );
  }

  return (
    <FlatList
      data={pastReports}
      keyExtractor={(item, index) => item._id?.toString() || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
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
