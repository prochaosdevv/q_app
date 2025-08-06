import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  CircleCheck,
  ClockAlert,
  Sun,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useProjectStore } from '../../../../zustand/store/projectStore';
import api from '../../../../utils/api';
import { WeatherIconsMap } from '../../../../components/WeatherIconsMap';
export default function PastReportByWeeklyDateScreen({
  refreshing,
  startDate,
  endDate,
}) {
  const [dailyReport, setDailyReport] = useState([]);
  const navigation = useNavigation();
  const projectId = useProjectStore(state => state.id);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const getDailyReport = async projectId => {
    console.log(projectId);

    try {
      const response = await api.get(
        `/project/get/past-report/by/${projectId}?startDate=${startDate}&endDate=${endDate}`,
      );
      const data = response?.data.reports;
      setDailyReport(data || []);
    } catch (error) {
      console.log('Error fetching daily report', error);
    }
  };
  const handleViewReport = reportId => {
    navigation.navigate('report-details', {
      reportId,
    });
  };

  useEffect(() => {
    if (projectId) {
      getDailyReport(projectId);
    }
  }, [projectId, refreshing]);

  const renderItem = ({ item }) => {
    const reportId = item._id;

    const handleStatusUpdate = async status => {
      try {
        const response = await api.put(
          `/project/daily-log/status/${reportId}`,
          {
            status: status,
          },
        );
        setShowSuccessModal(true);
        setShowModal(false);
      } catch (error) {
        console.log('Error while submitting.');
      }
    };

    return (
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportDate}>
            {moment(item.createdAt).format('dddd D MMM')}
          </Text>

          <Pressable
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 1
                    ? '#f9c1a5ff'
                    : item.status === 2
                    ? '#edbabaff'
                    : '#e8f5e9',
              },
            ]}
            onPress={() => {
              if (item.status !== 1 && item.status !== 2) {
                setShowModal(true);
              }
            }}
          >
            <Text style={styles.statusText}>
              {item.status === 1
                ? 'Approved'
                : item.status === 2
                ? 'Rejected'
                : 'Submitted'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.reportDescription}>{item.progressReport}</Text>

        <View style={styles.statsContainer}>
          {item.delays == 0 ? null : (
            <View style={styles.stat}>
              <ClockAlert size={16} color="red" />
            </View>
          )}

          <View style={styles.stat}>
            <Text style={[styles.statText, { marginRight: 2 }]}>
              {WeatherIconsMap[item.weather?.condition]}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.viewButton}
          onPress={() => handleViewReport(reportId)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </Pressable>
        {/* Status update modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowModal(false)}
          >
            <View style={styles.modalBox}>
              <Text
                style={{
                  fontSize: wp('4.5%'),
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                Please Confirm
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 20,
                  color: '#000',
                  textAlign: 'center',
                  fontWeight: '400',
                  lineHeight: 25,
                }}
              >
                Would you like to approve or reject the report?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Pressable
                  style={styles.Btn}
                  onPress={() => handleStatusUpdate(1)}
                >
                  <Text style={styles.BtnText}>Approve</Text>
                </Pressable>
                <Pressable
                  style={styles.Btn}
                  onPress={() => handleStatusUpdate(2)}
                >
                  <Text style={styles.BtnText}>Reject</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowSuccessModal(false)}
          >
            <View style={styles.modalBox}>
              <View
                style={{
                  backgroundColor: '#1D7903',
                  borderRadius: 50,
                  padding: 12,
                  marginBottom: 16,
                  width: '20%',
                  alignSelf: 'center',
                }}
              >
                <Check size={40} color="#fff" />
              </View>
              <Text
                style={{
                  fontSize: wp('4.5%'),
                  fontWeight: '800',
                  textAlign: 'center',
                }}
              >
                Success
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 20,
                  color: '#000',
                  textAlign: 'center',
                  fontWeight: '400',
                  lineHeight: 25,
                }}
              >
                Your status has been updated {'\n'} succesfully.
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#181446',
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  borderRadius: 35,
                  width: '80%',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  setShowSuccessModal(false);
                  getDailyReport(projectId);
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  Continue
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  };
  return (
    <>
      <FlatList
        data={dailyReport}
        keyExtractor={(item, index) => item?.createdAt || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#888', fontSize: 14 }}>
              No daily reports available.
            </Text>
          </View>
        }
      />
    </>
  );
}

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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('6%'),
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  Btn: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: wp('38%'),
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  BtnText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '600',
  },
});
