import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
  RefreshControl,
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
import { useState } from 'react';
import moment from 'moment';
import PastReportByWeeklyDateScreen from './past-report/PastReportByWeeklyDateScreen';

const ReportViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#141b41']}
            tintColor="#141b41"
          />
        }
      >
        <Text style={styles.dateRange}>{`${moment(item.startDate).format(
          'DD MMM',
        )} - ${moment(item.endDate).format('DD MMM YYYY')}`}</Text>

        <View style={styles.weekGoal}>
          <Text style={styles.sectionTitle}>Week’s Goal</Text>
          <Text style={styles.goalTitle}>{item.title}</Text>
          <Text style={styles.goalDescription}>{item.description}</Text>
        </View>

        <PastReportByWeeklyDateScreen
          refreshing={refreshing}
          startDate={item.startDate}
          endDate={item.endDate}
        />
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
    fontSize: 18,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
    fontWeight: '900',
  },
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    lineHeight: 20,
  },
});
