import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Modal,
  Platform,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  Plus,
  KeyRound as Pound,
  Clock,
  ClipboardList,
  FileText,
  Settings,
  Check,
} from 'lucide-react-native';
import { Popover } from '../../../components/Popover';
import jsw from '../../../assets/images/jsw_icon.png';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import WeeklyReport from '../../../components/WeeklyReport';
const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const handleOptionSelect = (option: string) => {
    // Handle option selection
    console.log('Selected option:', option);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2342" />
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
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#141b41']} // Android spinner color
            tintColor="#141b41" // iOS spinner color
          />
        }
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Due today</Text>

          <View>
            {Platform.OS !== 'web' ? (
              <LinearGradient
                colors={[
                  'rgba(234, 236, 247, 1)',
                  'rgba(247, 247, 250, 1)',
                  'rgba(233, 234, 237, 1)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.reportCard}
              >
                <Text style={styles.reportTitle}>Thursday 14 Jan report</Text>
                <Text style={styles.reportStatus}>In progress</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressCircle}>
                    <LinearGradient
                      colors={['rgba(24, 20, 70, 1)', 'rgba(131, 196, 231, 1)']}
                      style={styles.gradientRing}
                    />
                    <View style={styles.progressCenter}>
                      <Text style={styles.progressText}>60%</Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  style={styles.continueButton}
                  onPress={() =>
                    navigation.navigate('daily-report', {
                      id,
                    })
                  }
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
              </LinearGradient>
            ) : (
              <View style={[styles.reportCard, styles.reportCardWeb]}>
                <Text style={styles.reportTitle}>Thursday 14 Jan report</Text>
                <Text style={styles.reportStatus}>In progress</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressCircle}>
                    <View
                      style={[styles.gradientRing, styles.gradientRingWeb]}
                    />
                    <View style={styles.progressCenter}>
                      <Text style={styles.progressText}>60%</Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  style={styles.continueButton}
                  // onPress={handleContinuePress}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Weeks goal</Text>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Counting bricks</Text>
            </View>

            <Text style={styles.goalDescription}>
              Finish main infrastructure of the kitchen alongside finishing
              bathroom
            </Text>
            <Pressable>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Submissions this week</Text>

          <WeeklyReport id={id} refreshing={refreshing} />
        </View>
      </ScrollView>

      <Popover
        visible={isPopoverVisible}
        onClose={() => setIsPopoverVisible(false)}
        onSelect={handleOptionSelect}
      />

      <Pressable
        style={styles.floatingButton}
        onPress={() => setIsPopoverVisible(true)}
      >
        <Plus color="#fff" size={24} />
      </Pressable>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 30,
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 10,
  },
  reportCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 32,
  },
  reportCardWeb: {
    backgroundColor: '#f8f9fc',
  },
  reportTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#141b41',
    marginBottom: 4,
  },
  reportStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressCircle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 60,
    padding: 6,
  },
  gradientRingWeb: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
  },
  progressCenter: {
    width: 76,
    height: 76,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#141b41',
    fontWeight: '300',
  },
  continueButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
    width: 120,
  },
  continueButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
    marginBottom: 32,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'rgba(24, 20, 70, 1)',
    fontWeight: 'bold',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(24, 20, 70, 1)',
    marginTop: 10,
    fontWeight: 'bold',
  },
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#141b41',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
