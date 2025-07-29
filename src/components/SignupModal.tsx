import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Check } from 'lucide-react-native';
import api from '../utils/api';
export default function SignupModal({
  showSignupModal,
  setShowSignupModal,
  handleSignupModal,
}) {
  const handleAccept = async () => {
    try {
      const res = await api.post('/project/accept-invitation');
      setShowSignupModal(false);
      console.log('Accept successfully');
    } catch (error) {
      console.log('Accept Error:', error);
    }
  };
  const handleReject = async () => {
    try {
      const res = await api.post('/project/decline-invitation');
      setShowSignupModal(false);
      console.log('Reject successfully');
    } catch (error) {
      console.log('Reject Error:', error);
    }
  };
  return (
    <Modal
      visible={showSignupModal}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setShowSignupModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentWrapper}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Check size={40} color="white" />
            </View>

            <Text style={styles.modalTitle}>
              You've been invited to join "$" on Quentessential App
            </Text>

            <Text style={styles.modalSubtitle}>
              Please click the button below to accept the invitation
            </Text>

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.modalContinueButton}
                android_ripple={{ color: '#ccc' }}
                onPress={handleAccept}
              >
                <Text style={styles.modalContinueButtonText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={handleReject}>
                <Text style={styles.cancelButtonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: hp('2%'),
  },
  modalContentWrapper: {
    width: '100%',
    maxWidth: hp('80%'),
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: hp('2%'),
    paddingVertical: hp('5%'),
    paddingHorizontal: hp('4%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: hp('2%'),
    elevation: 10,
    zIndex: 9999,
  },
  successIconContainer: {
    marginBottom: hp('2%'),
    backgroundColor: '#1D7903',
    borderRadius: hp('50%'),
    padding: hp('2%'),
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: hp('2.3%'),
    color: '#141b41',
    textAlign: 'center',
    marginBottom: hp('1%'),
    lineHeight: hp('3.5%'),
    fontWeight: '800',
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('2%'),
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: hp('2%'),
    lineHeight: hp('3%'),
    paddingHorizontal: wp('1%'),
  },
  modalButtonContainer: {
    width: '100%',
  },
  modalContinueButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    height: hp('7.5%'),
    borderRadius: hp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContinueButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: hp('2%'),
    color: '#fff',
    fontWeight: '700',
  },
  cancelBtn: {
    height: hp('7.5%'),
    borderRadius: hp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: hp('1.5%'),
  },

  cancelButtonText: {
    color: 'rgba(0, 11, 35, 1)',
    fontFamily: 'Inter-Medium',
    fontSize: hp('2%'),
    fontWeight: '700',
  },
});
