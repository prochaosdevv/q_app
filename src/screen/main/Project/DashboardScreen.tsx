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
  CirclePlus,
} from 'lucide-react-native';
import { Popover } from '../../../components/Popover';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import WeeklyGoal from '../../../components/WeeklyGoal';
import { useAuthStore } from '../../../zustand/store/authStore';
import moment from 'moment';
import CircularProgress from './CircularProgress ';
import DailySubmission from '../../../components/DailySubmission';
import { useProjectStore } from '../../../zustand/store/projectStore';
const DashboardScreen = () => {
  const projectImage = useProjectStore(state => state.image);
  const { user } = useAuthStore.getState();
  const createdById = useProjectStore(state => state.createdBy);
  const currentuser = user?._id || user?.id;

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserName = user?.fullname;

  const isOwner = createdById === currentuser;
  console.log('Rs', isOwner);

  const navigation = useNavigation();

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
        <Text style={styles.greeting}>
          Hi,
          {currentUserName.length > 6
            ? currentUserName.substring(0, 6) + '...'
            : currentUserName}
        </Text>
        <View style={styles.img_container}>
          <Image
            source={{ uri: projectImage }}
            style={styles.companyLogo}
            resizeMode="contain"
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
            colors={['#141b41']}
            tintColor="#141b41"
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
                <Text style={styles.reportTitle}>
                  {moment().format('dddd D MMM')} report
                </Text>
                <Text style={styles.reportStatus}>In progress</Text>

                <CircularProgress percentage={0} />

                <Pressable
                  style={styles.continueButton}
                  onPress={() => navigation.navigate('daily-report')}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
              </LinearGradient>
            ) : (
              <View style={[styles.reportCard, styles.reportCardWeb]}>
                <Text style={styles.reportTitle}>Thursday 14 Jan report</Text>
                <Text style={styles.reportStatus}>In progress</Text>
                <CircularProgress percentage={0} />
                <Pressable
                  style={styles.continueButton}
                  // onPress={handleContinuePress}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
              </View>
            )}
          </View>
          {/* Weekly Report */}

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.sectionTitle}>Weeks goal</Text>
            <Pressable
              style={[styles.add, isOwner == false && { opacity: 0.5 }]}
              onPress={() => {
                if (isOwner == true) {
                  navigation.navigate('create-weekly-goal');
                }
              }}
            >
              <Text
                style={[styles.add_text, isOwner == false && { color: 'gray' }]}
              >
                Add
              </Text>
              <CirclePlus
                size={14}
                color={isOwner == false ? 'gray' : 'black'}
              />
            </Pressable>
          </View>
          <WeeklyGoal refreshing={refreshing} />

          {/* Daily Submission */}
          <Text style={styles.sectionTitle}>Submissions this week</Text>

          <DailySubmission refreshing={refreshing} />
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
    fontSize: 22,
    color: '#141b41',
    marginBottom: 4,
    fontWeight: '800',
  },
  reportStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
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
  add: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(175, 175, 175, 1)',
    display: 'flex',
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 3,
  },
  add_text: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 1)',
    // lineHeight: 24,
  },
});
