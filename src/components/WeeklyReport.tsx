import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Check, ClockAlert, Sun } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../utils/api';
import moment from 'moment';

const WeeklyReport = ({ id }) => {
  const [dailyReport, setDailyReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const getDailyReport = async id => {
    setLoading(true);
    try {
      const response = await api.get(`/project/daily-report/${id}`);
      const data = response?.data.reports;
      console.log('Test 1', data);

      setDailyReport(data || []);
      console.log('Test 2', dailyReport);
    } catch (error) {
      console.log('Error fetching daily report', error);
    } finally {
      setLoading(false);
    }
  };
  const handleViewReport = date => {
    navigation.navigate('report-details', {
      date,
    });
  };

  useEffect(() => {
    if (id) {
      getDailyReport(id);
    }
  }, [id]);

  const renderItem = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportDate}>
          {moment(item.createdAt).format('dddd DD MMMM')}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>submitted</Text>
          <Check color="black" size={20} />
        </View>
      </View>

      <Text style={styles.reportDescription}>{item.progressReport}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={[styles.statText, { marginRight: 2 }]}>
            {item.delays}
          </Text>
          <ClockAlert size={16} color="#666" />
        </View>
        <View style={styles.stat}>
          <Sun size={16} color="#666" />
        </View>
        <View style={styles.stat}>
          <Text style={styles.statText}>£0 extra costs</Text>
        </View>
      </View>

      <Pressable
        style={styles.viewButton}
        onPress={() => handleViewReport('2025-07-13')}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </Pressable>
    </View>
  );
  return (
    <>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={dailyReport}
          keyExtractor={(item, index) => item?.createdAt || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 14 }}>
                No daily reports available.
              </Text>
            </View>
          }
        />
      )}
    </>
  );
};

export default WeeklyReport;

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportDate: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    marginRight: 3,
  },
  reportDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(158, 158, 158, 1)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 4,
  },
  viewButton: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    // paddingVertical: 12,
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#e5e7eb',
  },
  viewButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'rgba(24, 20, 70, 1)',
    fontWeight: 'bold',
  },
});
