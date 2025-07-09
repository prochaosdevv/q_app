import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../utils/api';

interface PopoverProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

export function Popover({ visible, onClose, onSelect }: PopoverProps) {
  const navigation = useNavigation();
  const route = useRoute();
  if (!visible) return null;
  const { id } = route.params;
  const options = [
    { id: 'add_day_log', label: 'Add new day log' },
    { id: 'send_report', label: 'Send Report' },
    { id: 'manage_members', label: 'Manage members' },
  ];
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendReport, setSendReport] = useState(false);

  const handleOptionPress = (optionId: string) => {
    if (optionId === 'manage_members') {
      navigation.navigate('manage-members', {
        id,
      });
      onClose();
    }
    if (optionId === 'add_day_log') {
      navigation.navigate('daily-report', {
        id,
      });
      onClose();
    }
    if (optionId === 'send_report') {
      setSendReport(true);
    }
    onSelect(optionId);
    // onClose();
  };

  const handleSendReport = async () => {
    try {
      const response = await api.put(`/project/mark-sent/${id}`);
      if (response?.data?.success === true) {
        setShowSuccessModal(true);
      }
      console.log(response.data);
    } catch (error) {
      console.log('Error fetching while sending report', error);
    }
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
                onPress={() => handleOptionPress(option.id)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
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
          <View style={styles.successModalBox}>
            <Text style={styles.successTitle}>Send report? </Text>
            <Text style={styles.successMessage}>
              Reports are sent to admins automatically at the end of week (6pm
              Friday) though you can choose to send early
            </Text>
            <Pressable style={styles.okButton} onPress={handleSendReport}>
              <Text style={styles.okButtonText}>Send early report</Text>
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => setSendReport(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
              style={styles.okButton}
              onPress={() => {
                setShowSuccessModal(false);
                onClose();
              }}
            >
              <Text style={styles.okButtonText}>Continue</Text>
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
    bottom: 160, // Position above the floating button
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
    // borderTopWidth: 1,
    // borderTopColor: '#e5e7eb',
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
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 8,
    textAlign: 'center',
  },

  successMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  okButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingTop: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: 'rgba(0, 11, 35, 1)',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  okButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});
