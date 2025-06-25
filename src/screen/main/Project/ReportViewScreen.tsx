import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  ChevronLeft,
  Clock,
  KeyRound as Pound,
  ClipboardList,
  FileText,
  Settings,
  Sun,
  Check,
  ClockAlert,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import WeeklyReport from '../../../components/WeeklyReport';

const ReportViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dateRange, title, description } = route.params;

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

        <Text style={styles.headerTitle}>Week View</Text>

        {/* Invisible spacer to balance the layout */}
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.dateRange}>{dateRange}</Text>

        <View style={styles.weekGoal}>
          <Text style={styles.sectionTitle}>Weeks goal</Text>
          <Text style={styles.goalTitle}>{title}</Text>
          <Text style={styles.goalDescription}>{description}</Text>
        </View>

        <WeeklyReport />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    // width: 40,
    // height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginLeft: -24,
  },

  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  dateRange: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'rgba(50, 49, 49, 1)',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  weekGoal: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
  },
  goalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    lineHeight: 20,
  },
  
});
