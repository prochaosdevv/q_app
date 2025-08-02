import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import { ReportListItem } from '../../../components/ReportListItem';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Settings,
} from 'lucide-react-native';

import { useProjectStore } from '../../../zustand/store/projectStore';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';

const PastReportScreen = () => {
  const projectImage = useProjectStore(state => state.image);
  const projectId = useProjectStore(state => state.id);
  const navigation = useNavigation();

  const [pastReport, setPastReport] = useState([]);

  const getPastReport = async () => {
    const res = await api.get(`/project/get/past-goals/by/${projectId}`);
    const result = res.data.pastGoals;
    setPastReport(result);
  };

  const handleReportPress = item => {
    navigation.navigate('report-view', { report: item });
  };
  useEffect(() => {
    getPastReport();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2342" />

      <View style={styles.header}>
        <Text style={styles.greeting}>Past Reports</Text>
        <View style={styles.img_container}>
          <Image
            source={{ uri: projectImage }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
      </View>
      {/* <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#141b41']}
            tintColor="#141b41"
          />
        }
      >
        <PastReport refreshing={refreshing} />
      </ScrollView> */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pastReport.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 300 }}>
            No past report found.
          </Text>
        ) : (
          pastReport.map((item, index) => (
            <ReportListItem
              key={index}
              title={item.title}
              description={item.description}
              startDate={item.startDate}
              endDate={item.endDate}
              onPress={() => handleReportPress(item)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PastReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
  },

  img_container: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E9EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    width: 48,
    height: 22,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
});
