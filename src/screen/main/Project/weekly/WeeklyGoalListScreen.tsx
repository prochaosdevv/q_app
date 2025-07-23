import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronLeft,
  Calendar,
  CalendarDays,
  Pencil,
  Plus,
  CirclePlus,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../../../utils/api';
import { useProjectStore } from '../../../../zustand/store/projectStore';
export default function WeeklyGoalListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const projectId = useProjectStore(state => state.id);
  
  useEffect(() => {
    if (route.params?.payload) {
      setGoals(route.params.payload.goals);
    }
  }, [route.params?.payload]);

  const handleDeleteGoal = indexToDelete => {
    const updatedGoals = goals.filter((_, index) => index !== indexToDelete);
    setGoals(updatedGoals);
    setShowPopup(false);
  };

  const handleSubmit = async () => {
    if (goals.length === 0) {
      setError('Please add at least one goal before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        project: projectId, // 🔹 static project ID
        goals: goals.map(goal => ({
          title: goal.title,
          description: goal.description,
          startDate: moment(goal.startDate).format('YYYY-MM-DD'),
          endDate: moment(goal.endDate).format('YYYY-MM-DD'),
        })),
      };

      const response = await api.post('/project/weekly-goal/create', payload);

      console.log('API Success:', response.data);
      setLoading(false);

      navigation.navigate('bottom');
    } catch (err) {
      console.error('API Error:', err?.response?.data || err.message);
      setError('Something went wrong while submitting.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <ChevronLeft color="white" size={wp('5%')} />
        </Pressable>
        <Text style={styles.headerTitle}>Weekly Goals</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goals.map((goal, index) => {
          const formattedStartDate = moment(goal.startDate).format('DD MMM');
          const formattedEndDate = moment(goal.endDate).format('DD MMM');

          return (
            <Pressable key={index} style={styles.card}>
              <View style={styles.dateContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <CalendarDays size={16} color="rgba(0, 0, 0, 1)" />
                  <Text style={styles.dateText}>{formattedStartDate} -</Text>
                  <Text style={styles.dateText}>{formattedEndDate}</Text>
                </View>

                <View style={{ position: 'relative' }}>
                  <Pressable
                    style={styles.edit}
                    onPress={() => setShowPopup(index)} // If you want per-card popup
                  >
                    <Text style={styles.edit_text}>Edit</Text>
                    <Pencil size={14} />
                  </Pressable>

                  {showPopup === index && (
                    <View style={styles.popupMenu}>
                      <Pressable
                        style={styles.popupItem}
                        onPress={() => {
                          navigation.navigate('update-weekly-report', {
                            selectedGoal: goal,
                          });
                          setShowPopup(false);
                        }}
                      >
                        <Text style={styles.popupTextBold}>Edit</Text>
                      </Pressable>

                      <Pressable
                        style={styles.popupItem}
                        onPress={() => handleDeleteGoal(index)}
                      >
                        <Text style={styles.popupTextBold}>Delete</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => setShowPopup(null)}
                        style={styles.cancelButton}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.title}>{goal.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {goal.description}
              </Text>

              <Pressable
              // onPress={() => navigation.navigate('week-view', { id: goal._id })}
              >
                {/* <Text style={styles.viewText}>View</Text> */}
              </Pressable>
            </Pressable>
          );
        })}

        {error !== '' && (
          <Text
            style={{ color: 'red', textAlign: 'center', marginVertical: 8 }}
          >
            {error}
          </Text>
        )}

        {/* Submit */}
        <View style={styles.submitContainer}>
          <Pressable
            style={[styles.submitButton, { marginBottom: hp('1.5%') }]}
            onPress={() => {
              const lastGoal = goals[goals.length - 1]; // 🔹 Get last goal
              const lastEndDate = lastGoal?.endDate;
              const nextStartDate = lastEndDate
                ? moment(lastEndDate).add(1, 'day').format('YYYY-MM-DD') // 🔹 Add 1 day
                : moment().format('YYYY-MM-DD'); // 🔹 If none, use today

              navigation.navigate('create-weekly-goal', {
                existingGoals: goals,
                defaultStartDate: nextStartDate, // 🔹 Send this to next screen
              });
            }}
          >
            <Text style={styles.submitButtonText}>Add</Text>
          </Pressable>
          <Pressable style={styles.submitButton} onPress={() => handleSubmit()}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#14274A',
    paddingTop: hp('7%'),
    paddingBottom: hp('4%'),
  },
  backButton: {
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4%'),
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -wp('6%'),
  },
  content: {
    flex: 1,
    padding: wp('6%'),
  },
  section: {
    marginBottom: hp('2.5%'),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 3,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
    fontWeight: '900',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(100, 100, 100, 1)',
    marginBottom: 12,
  },
  viewText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#141b41',
    fontWeight: '800',
  },
  edit: {
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
  },
  edit_text: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 1)',
    // lineHeight: 24,
  },
  submitContainer: {
    marginTop: hp('2%'),
    marginBottom: hp('10%'),
  },
  submitButton: {
    backgroundColor: '#181446',
    borderRadius: wp('7%'),
    height: hp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4%'),
    color: '#fff',
  },
  // Pop up modal

  popupMenu: {
    position: 'absolute',
    right: -5,
    top: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: 120,
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
    marginBottom: 20,
  },
  cancelText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },
});
