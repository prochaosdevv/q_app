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
} from 'lucide-react-native';

const ReportViewScreen = () => {
  const handleFooterPress = (route: any) => {
    // router.push(route);
  };

  const handleViewReport = (date: string) => {
    // router.push({
    //   pathname: '/report-details',
    //   params: { date },
    // });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <ChevronLeft color="#141b41" size={24} />
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
        {/* <Text style={styles.dateRange}>{dateRange}</Text> */}

        <View style={styles.weekGoal}>
          <Text style={styles.sectionTitle}>Weeks goal</Text>
          {/* <Text style={styles.goalTitle}>{title}</Text> */}
          {/* <Text style={styles.goalDescription}>{description}</Text> */}
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportDate}>Friday 14 July</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>submitted</Text>
            </View>
          </View>

          <Text style={styles.reportDescription}>
            Finish main infrastructure of the kitchen alongside finishing
            bathroom
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Clock size={16} color="#666" />
              <Text style={styles.statText}>0</Text>
            </View>
            <View style={styles.stat}>
              <Sun size={16} color="#666" />
            </View>
            <View style={styles.stat}>
              {/* <Pound size={16} color="#666" /> */}
              <Text style={styles.statText}>£0 extra costs</Text>
            </View>
          </View>

          <Pressable
            style={styles.viewButton}
            onPress={() => handleViewReport('2025-07-14')}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </Pressable>
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportDate}>Thursday 13 July</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>submitted</Text>
            </View>
          </View>

          <Text style={styles.reportDescription}>
            Finish main infrastructure of the kitchen alongside finishing
            bathroom
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Clock size={16} color="#666" />
              <Text style={styles.statText}>0</Text>
            </View>
            <View style={styles.stat}>
              <Clock size={16} color="#666" />
              <Text style={styles.statText}>0</Text>
            </View>
            <View style={styles.stat}>
              <Pound size={16} color="#666" />
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
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Pressable
            style={styles.footerTab}
            onPress={() => handleFooterPress('/dashboard')}
          >
            <ClipboardList size={20} color="#93a5b1" />
            <Text style={styles.footerTabText}>Tasks</Text>
          </Pressable>

          <Pressable
            style={[styles.footerTab, styles.footerTabActive]}
            onPress={() => handleFooterPress('/past-reports')}
          >
            <FileText size={20} color="#141b41" />
            <Text style={[styles.footerTabText, styles.footerTabTextActive]}>
              Past Reports
            </Text>
          </Pressable>

          <Pressable
            style={styles.footerTab}
            onPress={() => handleFooterPress('/settings')}
          >
            <Settings size={20} color="#93a5b1" />
            <Text style={styles.footerTabText}>Settings</Text>
          </Pressable>
        </View>
      </View>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: 'rgba(0, 11, 35, 1)',
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
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerContent: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerTab: {
    alignItems: 'center',
  },
  footerTabActive: {
    borderTopWidth: 2,
    borderTopColor: '#141b41',
    paddingTop: 10,
  },
  footerTabText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#93a5b1',
    marginTop: 4,
  },
  footerTabTextActive: {
    color: '#141b41',
    fontFamily: 'Inter-Medium',
  },
});
