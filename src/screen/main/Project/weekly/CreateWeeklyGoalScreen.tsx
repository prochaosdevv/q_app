import React, { useState } from 'react';
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
import { ChevronLeft, Calendar, CalendarDays } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProjectStore } from '../../../../zustand/store/projectStore';

export default function CreateWeeklyGoalScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const route = useRoute();
  const existingGoals = route.params?.existingGoals || [];
  const defaultStartDate = route.params?.defaultStartDate
    ? new Date(route.params.defaultStartDate)
    : new Date();

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(
    moment(defaultStartDate).add(7, 'days').toDate(),
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const projectId = useProjectStore(state => state.id);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    setError('');

    const newGoal = {
      title: title.trim(),
      description: description.trim(),
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    };
    const updatedGoals = [...existingGoals, newGoal];

    const updatedPayload = {
      project: projectId,
      goals: updatedGoals,
    };

    setLoading(false);
    navigation.navigate('weekly-list', { payload: updatedPayload });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <ChevronLeft color="white" size={wp('5%')} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Weekly Goal</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter title..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter description..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Start Date with calendar icon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Date</Text>
          <View style={styles.iconInputWrapper}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setShowStartPicker(true)}
            >
              <TextInput
                style={styles.iconInput}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#999"
                value={moment(startDate).format('DD-MM-YYYY')}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => setShowStartPicker(true)}
            >
              <CalendarDays color="#000" size={wp('4.5%')} />
            </Pressable>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}
        </View>

        {/* End Date with calendar icon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>End Date</Text>
          <View style={styles.iconInputWrapper}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setShowEndPicker(true)}
            >
              <TextInput
                style={styles.iconInput}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#999"
                value={moment(endDate).format('DD-MM-YYYY')}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => setShowEndPicker(true)}
            >
              <CalendarDays color="#000" size={wp('4.5%')} />
            </Pressable>
          </View>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
            />
          )}
        </View>

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        {/* Submit */}
        <View style={styles.submitContainer}>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
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

// ---------------- STYLES ----------------
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
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1%'),
  },
  textInput: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    fontSize: wp('3.8%'),
    color: '#000',
    borderWidth: 1,
    borderColor: '#e8e9ea',
  },
  iconInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#e8e9ea',
    paddingRight: wp('3%'),
  },
  iconInput: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    fontSize: wp('3.8%'),
    color: '#000',
  },

  iconButton: {
    paddingLeft: wp('2%'),
  },
  textArea: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    minHeight: hp('15%'),
    fontSize: wp('3.8%'),
    color: '#000',
    borderWidth: 1,
    borderColor: '#e8e9ea',
    textAlignVertical: 'top',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    textAlign: 'center',
  },
});
