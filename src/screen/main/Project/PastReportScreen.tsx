import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';

import { ReportListItem } from '../../../components/ReportListItem';
import { ClipboardList, FileText, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigationScreen from '../../../navigation/bottomnavigation/BottomNavigationScreen';
import jsw from '../../../assets/images/jsw_icon.png';
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
      <StatusBar backgroundColor="white"/>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, John Doe</Text>
        <View style={styles.img_container}>
          <Image
            source={typeof jsw === 'string' ? { uri: jsw } : jsw}
            style={styles.companyLogo}
            resizeMode="cover"
          />
        </View>
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
