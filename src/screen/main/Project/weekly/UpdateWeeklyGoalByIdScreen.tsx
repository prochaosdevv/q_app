import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { ChevronLeft, CalendarDays, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../../../utils/api';

const UpdateWeeklyGoalByIdScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { title, description, startDate, endDate, id } = route.params;

  const [titleInput, setTitleInput] = useState(title || '');
  const [descriptionInput, setDescriptionInput] = useState(description || '');
  const [startDateState, setStartDateState] = useState(new Date(startDate));
  const [endDateState, setEndDateState] = useState(new Date(endDate));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) setStartDateState(selectedDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) setEndDateState(selectedDate);
  };

  const handleEdit = async () => {
    if (!titleInput.trim() || !descriptionInput.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!startDateState || !endDateState) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        title: titleInput.trim(),
        description: descriptionInput.trim(),
        startDate: moment(startDateState).format('YYYY-MM-DD'),
        endDate: moment(endDateState).format('YYYY-MM-DD'),
      };

      await api.put(`/project/weekly-goal/update/${id}`, payload);

      setShowSuccessModal(true);
    } catch (error) {
      console.log('Error updating goal:', error);
      setError('Something went wrong while updating the goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="white" size={wp('5%')} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Weekly Goal</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter title..."
            placeholderTextColor="#999"
            value={titleInput}
            onChangeText={setTitleInput}
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
            value={descriptionInput}
            onChangeText={setDescriptionInput}
          />
        </View>

        {/* Start Date */}
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
                value={moment(startDateState).format('DD-MM-YYYY')}
                editable={false}
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
              value={startDateState}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}
        </View>

        {/* End Date */}
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
                value={moment(endDateState).format('DD-MM-YYYY')}
                editable={false}
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
              value={endDateState}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
            />
          )}
        </View>

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.submitContainer}>
          <Pressable style={styles.submitButton} onPress={handleEdit}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Update</Text>
            )}
          </Pressable>
        </View>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowSuccessModal(false)}
          >
            <View style={styles.modalBox}>
              <View
                style={{
                  backgroundColor: '#1D7903',
                  borderRadius: 50,
                  padding: 12,
                  marginBottom: 16,
                  width: '20%',
                  alignSelf: 'center',
                }}
              >
                <Check size={40} color="#fff" />
              </View>
              <Text
                style={{
                  fontSize: wp('4.5%'),
                  fontWeight: '800',
                  textAlign: 'center',
                }}
              >
                Success
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 20,
                  color: '#000',
                  textAlign: 'center',
                  fontWeight: '400',
                  lineHeight: 25,
                }}
              >
                Your weekly goal has been updated {'\n'} succesfully.
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#181446',
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  borderRadius: 35,
                  width: '80%',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('bottom', { screen: 'dashboard' });
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  Continue
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default UpdateWeeklyGoalByIdScreen;

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
  // Modal and Dropdown Styles
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
});
