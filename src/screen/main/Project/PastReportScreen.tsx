import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { ReportListItem } from '../../../components/ReportListItem';
import { ClipboardList, FileText, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigationScreen from '../../../navigation/bottomnavigation/BottomNavigationScreen';

const PastReportScreen = () => {
  const navigation = useNavigation();
  const reports = [
    {
      id: '1',
      title: 'Counting bricks',
      dateRange: '10 Jul - 17 Jul',
      description:
        'Finish main infrastructure of the kitchen alongside finishing bathroom',
    },
    {
      id: '2',
      title: 'Scaffolding work',
      dateRange: '10 Jul - 17 Jul',
      description:
        'Finish main infrastructure of the kitchen alongside finishing bathroom',
    },
    {
      id: '3',
      title: 'Getting equipment into site',
      dateRange: '10 Jul - 17 Jul',
      description:
        'Finish main infrastructure of the kitchen alongside finishing bathroom',
    },
  ];

  const handleReportPress = report => {
    console.log('Data', report);

    navigation.navigate('/report-view');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Past Reports</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {reports.map((report, index) => (
          <View key={report.id}>
            <ReportListItem
              title={report.title}
              dateRange={report.dateRange}
              description={report.description}
              onPress={() => handleReportPress(report)}
            />
          </View>
        ))}
      </ScrollView>
      <BottomNavigationScreen />
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#e5e7eb',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'rgba(50, 49, 49, 1)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
});
