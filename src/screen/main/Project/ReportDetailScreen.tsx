import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Modal,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  ChevronLeft,
  ClipboardList,
  Edit,
  FileText,
  Pencil,
  Settings,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../../utils/api';
import moment from 'moment';
const ReportDetailScreen = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [ShowDeleteReport, setShowDeleteReport] = useState(false);
  const [ShowSuccessReport, setShowSuccessReport] = useState(false);
  const [dailyReport, setDailyReport] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { reportId } = route.params;

  // Get Daily Report By Id
  const getDailyReportById = async () => {
    try {
      const response = await api.get(`/project/daily-report/${reportId}`);
      const data = response.data.report;
      setDailyReport(data);
    } catch (error) {
      console.log('Error Fetching to daily report by id : ', error);
    }
  };

  // Delete Daily Report
  const deleteDailyReport = () => {
    try {
      const response = api.delete(`/project/daily-report/${reportId}`);
      setShowDeleteReport(false);
      setShowSuccessReport(true);
    } catch (error) {
      console.log('Error fetching to delete daily report.', error);
    }
  };

  useEffect(() => {
    getDailyReportById();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Daily Report</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* // Inside the ScrollView > top_section */}
        <View style={styles.top_section}>
          <Text style={styles.date}>
            {moment(dailyReport.createdAt).format('dddd DD MMMM')}
          </Text>

          <View style={{ position: 'relative' }}>
            <Pressable
              onPress={() => setShowPopup(!showPopup)}
              style={styles.edit}
            >
              <Text style={styles.edit_text}>Edit</Text>
              <Pencil size={16} />
            </Pressable>

            {showPopup && (
              <View style={styles.popupMenu}>
                <Pressable
                  style={styles.popupItem}
                  onPress={() =>
                    navigation.navigate('edit-daily-report', {
                      report: dailyReport,
                    })
                  }
                >
                  <Text style={styles.popupTextBold}>Edit log</Text>
                </Pressable>

                <Pressable
                  style={styles.popupItem}
                  onPress={() => {
                    setShowDeleteReport(true);
                  }}
                >
                  <Text style={styles.popupTextBold}>Delete</Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowPopup(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').width - 48}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {dailyReport?.photos?.map((photoUrl, index) => (
              <Image
                key={index}
                source={{ uri: photoUrl }}
                style={styles.sliderImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress report</Text>
          <View style={styles.textBox}>
            <Text style={styles.reportText}>{dailyReport.progressReport}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather</Text>
          <View style={styles.textBox_}>
            <Text style={styles.reportText}>
              {dailyReport.weather?.condition}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delays</Text>
          <View style={styles.textBox_}>
            <Text style={styles.reportText}>{dailyReport.delays} hours</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant</Text>
          <View style={styles.textBox_}>
            <Text style={styles.reportText}>{dailyReport.plant}</Text>
            {console.log('Final', dailyReport)}
          </View>
        </View>
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>Labour</Text>
          <View style={styles.tableWrapper}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.headerCell]}>Name</Text>
              <Text
                style={[
                  styles.cell,
                  styles.headerCell,
                  { borderLeftWidth: 1, borderRightWidth: 1 },
                ]}
              >
                Role
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.headerCell,
                  {
                    textAlign: 'center',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                  },
                ]}
              >
                Qty
              </Text>
            </View>

            {/* Table Rows */}
            {dailyReport.labour?.map((item, index) => (
              <View key={item._id} style={styles.tableRow}>
                <Text style={[styles.cell]}>{item.name}</Text>
                <Text style={styles.cell}>{item.role}</Text>
                <Text style={[styles.cell, { textAlign: 'center' }]}>
                  {item.qty}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material</Text>

          <View style={styles.tableWrapper}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.headerCell]}>
                Material Type
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.headerCell,
                  {
                    textAlign: 'center',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                  },
                ]}
              >
                Qty
              </Text>
            </View>

            {/* Table Rows */}
            {dailyReport.material?.map((item, index) => (
              <View key={item._id} style={styles.tableRow}>
                <Text style={styles.cell}>{item.type}</Text>
                <Text style={[styles.cell, { textAlign: 'center' }]}>
                  {item.qty}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={ShowDeleteReport}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteReport(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowDeleteReport(false)}
          />
          <View style={styles.deleteModalBox}>
            <Text style={styles.deleteTitle}>
              Are you sure you want to delete?{' '}
            </Text>
            <Text style={styles.deleteMessage}>
              This report will be lost for this day. You will not be able to
              undo.
            </Text>

            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                gap: 10,
              }}
            >
              <Pressable
                style={styles.deleteButton}
                onPress={deleteDailyReport}
              >
                <Text style={styles.deleteButtonText}>Delete Report</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton_}
                onPress={() => setShowDeleteReport(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={ShowSuccessReport}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessReport(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowSuccessReport(false)}
          />
          <View style={styles.deleteModalBox}>
            <Text style={styles.deleteTitle}>Report deleted</Text>
            <Text style={styles.deleteMessage}>
              Reports was removed Successfully
            </Text>

            {/* <View> */}
            <Pressable
              style={styles.okButton}
              onPress={() => {
                setShowSuccessReport(false);
                navigation.navigate('bottom', {
                  screen: 'dashboard',
                });
              }}
            >
              <Text style={styles.deleteButtonText}>Okay</Text>
            </Pressable>

            {/* </View> */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReportDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#14274A',
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginLeft: -24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  date: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'rgba(50, 49, 49, 1)',
    // marginHorizontal: 24,
    // marginTop: 24,
    // marginBottom: 24,
    fontWeight: 'bold',
  },

  // Slider Styles
  sliderContainer: {
    marginBottom: 24,
    height: 380,
  },
  sliderContent: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  sliderImage: {
    width: Dimensions.get('window').width - 48,
    height: 380,
    borderRadius: 12,
    marginRight: 12,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 5,
  },
  edit: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
    display: 'flex',
    gap: 5,
    flexDirection: 'row',
  },
  top_section: {
    display: 'flex',
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  edit_text: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    // lineHeight: 24,
  },
  textBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
  },
  textBox_: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
  },
  reportText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    lineHeight: 24,
  },

  popupMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  popupIcon: {
    marginRight: 12,
  },
  popupTextBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cancelText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  deleteModalBox: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  deleteTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1a1447',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    // width: '100%',
    alignItems: 'center',
    // marginBottom: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  cancelButton_: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1a1447',
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },

  // Table
  tableSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    borderRightWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
});
