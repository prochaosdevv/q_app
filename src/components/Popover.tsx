import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  X,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../utils/api';
import { useProjectStore } from '../zustand/store/projectStore';
import { useAuthStore } from '../zustand/store/authStore';
import DatePicker from 'react-native-date-picker';
import pdfImg from '../assets/images/file.png';
import excelImg from '../assets/images/excel.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
interface PopoverProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

export function Popover({ visible, onClose, onSelect }: PopoverProps) {
  if (!visible) return null;

  const projectId = useProjectStore(state => state.id);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendReport, setSendReport] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [openPicker, setOpenPicker] = useState({ visible: false, field: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    dropdown: '',
    radio: '',
    date: '',
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [items, setItems] = useState([
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Custom date', value: 'custom_date' },
    { label: 'Current week', value: 'current_week' },
    { label: 'Last week', value: 'last_week' },
    { label: 'All', value: 'all' },
  ]);

  const navigation = useNavigation();

  const { user } = useAuthStore.getState();

  const createdById = useProjectStore(state => state.createdBy);
  const currentuser = user?._id || user?.id;

  const options = [
    {
      id: 'add_day_log',
      label: 'Add new day log',
      disabled: createdById !== currentuser,
    },
    { id: 'send_report', label: 'Send Report' },
    {
      id: 'manage_members',
      label: 'Manage members',
      disabled: createdById !== currentuser,
    },
  ];

  const handleOptionPress = (optionId: string) => {
    if (optionId === 'manage_members') {
      navigation.navigate('manage-members');
      onClose();
    }
    if (optionId === 'add_day_log') {
      navigation.navigate('daily-report');
      onClose();
    }
    if (optionId === 'send_report') {
      setSendReport(true);
    }
    onSelect(optionId);
    // onClose();
  };

  const formatDate = date => (date ? moment(date).format('YYYY-MM-DD') : '');

  const handleSendReport = async () => {
    // Reset errors
    setError({ dropdown: '', radio: '', date: '' });

    // Validate dropdown
    if (!value) {
      setError(prev => ({ ...prev, dropdown: 'Please select an option' }));
      return;
    }

    // Validate radio
    if (!selectedOption) {
      setError(prev => ({ ...prev, radio: 'Please select report type' }));
      return;
    }

    // Validate dates only if "custom_date" selected
    if (value === 'custom_date' && (!startDate || !endDate)) {
      setError(prev => ({ ...prev, date: 'Select start and end date' }));
      return;
    }

    // Create payload
    const payload = {
      startDate: value === 'custom_date' ? formatDate(startDate) : null,
      endDate: value === 'custom_date' ? formatDate(endDate) : null,
      reportType: selectedOption,
      dateType: value === 'custom_date' ? 'custom' : value,
    };

    try {
      setIsLoading(true);
      console.log('Payload:', payload);
      const res = await api.post(
        `/project/export-report/${projectId}`,
        payload,
      );

      // console.log('Result', res.data);

      setShowSuccessModal(true);
      setSendReport(false);
      setSelectedOption(null);
      setStartDate(null);
      setEndDate(null);
      setValue(null);
    } catch (err) {
      console.log('Failed to send report');
    } finally {
      setIsLoading(false);
    }

    // setShowSuccessModal(true);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.popoverContainer}>
        <View style={styles.popover}>
          {options.map(option => {
            return (
              <Pressable
                key={option.id}
                style={styles.option}
                onPress={() => {
                  if (!option.disabled) handleOptionPress(option.id);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.disabled && { color: 'gray' }, // ← gray text if disabled
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>

      {/* send report  */}

      <Modal
        visible={sendReport}
        transparent
        animationType="fade"
        onRequestClose={() => setSendReport(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSendReport(false)}
          />
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Report</Text>
              <Pressable onPress={() => setSendReport(false)}>
                <X size={24} color="#000" />
              </Pressable>
            </View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Start Option"
              style={[styles.inputWrapper, { paddingVertical: 20 }]}
              maxHeight={100}
            />

            {value === 'custom_date' && (
              <>
                {/* Start Date Field */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Start Date"
                    value={formatDate(startDate)}
                    style={styles.input}
                    placeholderTextColor="black"
                    editable={false}
                  />
                  <Pressable
                    onPress={() =>
                      setOpenPicker({ visible: true, field: 'start' })
                    }
                  >
                    <CalendarDays size={22} color="black" />
                  </Pressable>
                </View>
                {/* End Date Field */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="End Date"
                    value={formatDate(endDate)}
                    style={styles.input}
                    placeholderTextColor="black"
                    editable={false}
                  />
                  <Pressable
                    onPress={() =>
                      setOpenPicker({ visible: true, field: 'end' })
                    }
                  >
                    <CalendarDays size={22} color="black" />
                  </Pressable>
                </View>
              </>
            )}
            <View style={styles.radioContainer}>
              <Pressable
                style={styles.radioButton}
                onPress={() => setSelectedOption('pdf')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    selectedOption === 'pdf' && styles.selected,
                  ]}
                />
                <Text style={styles.radioText}>Pdf</Text>
              </Pressable>

              <Pressable
                style={styles.radioButton}
                onPress={() => setSelectedOption('excel')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    selectedOption === 'excel' && styles.selected,
                  ]}
                />
                <Text style={styles.radioText}>Excel</Text>
              </Pressable>
            </View>

            <DatePicker
              modal
              open={openPicker.visible}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                setOpenPicker({ visible: false, field: '' });
                openPicker.field === 'start'
                  ? setStartDate(date)
                  : setEndDate(date);
              }}
              onCancel={() => setOpenPicker({ visible: false, field: '' })}
            />

            {(error.dropdown || error.date || error.radio) && (
              <View style={{ marginBottom: 15 }}>
                {error.dropdown && (
                  <Text style={{ color: 'red', textAlign: 'center' }}>
                    {error.dropdown}
                  </Text>
                )}
                {error.date && (
                  <Text style={{ color: 'red', textAlign: 'center' }}>
                    {error.date}
                  </Text>
                )}
                {error.radio && (
                  <Text style={{ color: 'red', textAlign: 'center' }}>
                    {error.radio}
                  </Text>
                )}
              </View>
            )}
            <Pressable style={styles.okButton} onPress={handleSendReport}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowSuccessModal(false)}
          />
          <View style={styles.successModalBox}>
            <View style={styles.iconWrapper}>
              <View style={styles.successIconCircle}>
                <Check color="#fff" size={24} />
              </View>
            </View>
            <Text style={styles.successTitle}>Report sent successfully</Text>
            <Text style={styles.successMessage}>
              You can continue to add to your report until end of week (6pm
              Friday) and updates will be sent automatically
            </Text>
            <Pressable
              style={[styles.okButton, { width: '100%', borderRadius: 30 }]}
              onPress={() => {
                setShowSuccessModal(false);
                onClose();
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popoverContainer: {
    position: 'absolute',
    bottom: 160,
    right: 24,
    width: 250,
  },
  popover: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'flex-start',
    padding: 16,
    marginLeft: 10,
  },
  cancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(24, 20, 70, 1)',
    fontWeight: '700',
  },
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
  successModalBox: {
    width: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  iconWrapper: {
    marginBottom: 12,
  },

  successIconCircle: {
    backgroundColor: 'rgba(29, 121, 3, 1)',
    borderRadius: 40,
    padding: 10,
  },

  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '800',
  },

  successMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginBottom: 10,
    marginTop: 5,
    justifyContent: 'space-between',
  },
  input: {
    fontSize: wp('3.8%'),
    color: 'black',
  },
  exportIcons: {
    flexDirection: 'row',
    gap: 40,
    marginVertical: 20,
  },

  okButton: {
    paddingVertical: hp('1.9%'),
    paddingHorizontal: wp('10%'),
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(24, 20, 70, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selected: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
  },
  radioText: {
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
  },
});
