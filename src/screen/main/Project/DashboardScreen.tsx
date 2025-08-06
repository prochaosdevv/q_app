import { useEffect, useState } from 'react';
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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Plus, KeyRound as Pound, X } from 'lucide-react-native';
import { Popover } from '../../../components/Popover';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
// import WeeklyGoal from '../../../components/WeeklyGoal';
import { useAuthStore } from '../../../zustand/store/authStore';
import moment from 'moment';
import CircularProgress from './CircularProgress ';
import DailySubmission from '../../../components/DailySubmission';
import { useProjectStore } from '../../../zustand/store/projectStore';
import api from '../../../utils/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const DashboardScreen = () => {
  const projectImage = useProjectStore(state => state.image);
  const projectId = useProjectStore(state => state.id);
  const { user } = useAuthStore.getState();
  const [goalData, setGoalData] = useState();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const currentUserName = user?.fullname;

  const createdById = useProjectStore(state => state.createdBy);
  const currentuser = user?._id || user?.id;

  const navigation = useNavigation();

  const handleOptionSelect = (option: string) => {
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

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/project/get/current/week/by/${projectId}`);
      const goal = res.data.goal;
      setGoalData(goal);
    } catch (error) {
      console.error('API fetching error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const openModal = () => {
    setTitle(goalData?.title || '');
    setDescription(goalData?.description || '');
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const payload = {
        title,
        description,
      };
      const res = await api.put(
        `/project/set/weekly-goal/by/${projectId}`,
        payload,
      );
      setGoalData(res.data);
      setModalVisible(false);
      fetchGoal();
    } catch (err) {
      console.error('Update goal failed:', err);
    } finally {
      setUpdating(false);
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
            <Text style={styles.sectionTitle}>Week’s Goal</Text>
          </View>

          {goalData == null ? (
            <View style={styles.goalCard}>
              <Text style={{ color: '#888', fontSize: 14 }}>
                Weekly goal is not set
              </Text>
              <Pressable
                onPress={createdById === currentuser ? openModal : null}
                disabled={createdById !== currentuser}
              >
                <Text
                  style={[
                    styles.editButtonText,
                    createdById !== currentuser && {
                      color: '#666',
                    },
                  ]}
                >
                  Edit
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goalData?.title}</Text>
              </View>

              <Text style={styles.goalDescription}>
                {goalData?.description}
              </Text>
              <Pressable
                onPress={createdById === currentuser ? openModal : null}
                disabled={createdById !== currentuser}
              >
                <Text
                  style={[
                    styles.editButtonText,
                    createdById !== currentuser && {
                      color: '#666',
                    },
                  ]}
                >
                  Edit
                </Text>
              </Pressable>
            </View>
          )}

          {/* Edit Modal */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <Pressable style={styles.modalBackdrop} />
              <View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Weekly Goal</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <X size={24} color="#000" />
                  </Pressable>
                </View>

                <TextInput
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  placeholderTextColor="black"
                />
                <TextInput
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                  style={[
                    styles.input,
                    { height: 80, textAlignVertical: 'top' },
                  ]}
                  placeholderTextColor="black"
                  numberOfLines={3}
                />

                <Pressable style={styles.okButton} onPress={handleUpdate}>
                  {updating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Update</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* <WeeklyGoal refreshing={refreshing} /> */}
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
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(24, 20, 70, 1)',
    marginTop: 10,
    fontWeight: 'bold',
  },

  // Modal Style
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hp('1.8%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.8'),
    fontSize: wp('3.8%'),
    color: 'black',
    marginBottom: hp('2%'),
  },
  okButton: {
    paddingVertical: hp('1.9%'),
    paddingHorizontal: wp('10%'),
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: 28,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
});
