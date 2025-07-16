import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function EditWeekGoalModal({
  showWeekGoalEditModal,
  setShowWeekGoalEditModal,
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOkPress = () => {
    setShowWeekGoalEditModal(false);
    setShowSuccessModal(true); // Show the success modal
  };
  return (
    <>
      <Modal
        visible={showWeekGoalEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWeekGoalEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowWeekGoalEditModal(false)}
          />
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Weekly Goal</Text>
              <Pressable onPress={() => setShowWeekGoalEditModal(false)}>
                <X size={24} color="#000" />
              </Pressable>
            </View>

            <TextInput
              placeholder="Enter Title"
              style={styles.input}
              placeholderTextColor="black"
            />
            <TextInput
              placeholder="Enter Description"
              style={styles.input}
              placeholderTextColor="black"
            />

            <Pressable style={styles.okButton} onPress={handleOkPress}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Success Modal */}
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
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconCircle}>
                <Check size={24} color="#fff" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.successMessage}>
              Your weekly goal has been updated successfully.
            </Text>

            <Pressable
              style={styles.okButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalBox: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('6%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hp('1.8%'),
  },
  modalTitle: {
    fontSize: wp('4.8%'),
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
  successModalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('6%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconWrapper: {
    marginBottom: hp('2%'),
  },
  successIconCircle: {
    backgroundColor: 'green',
    padding: hp('1.5%'),
    borderRadius: 50,
  },
  successMessage: {
    fontSize: wp('3.6%'),
    color: '#444',
    textAlign: 'center',
    marginTop: hp('1.2%'),
    marginBottom: hp('2%'),
    lineHeight: hp('2.5%'),
  },
});
