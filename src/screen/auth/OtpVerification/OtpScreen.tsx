import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  Keyboard,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Check } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../zustand/store/authStore';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation();
  const { user } = useAuthStore.getState();
  const currentEmail = user?.email;
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => setKeyboardVisible(true),
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => setKeyboardVisible(false),
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }
    setShowSuccessModal(true);
  };

  const handleModalContinue = () => {
    setShowSuccessModal(false);
    navigation.navigate('projects');
  };
  const handleResendCode = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    Alert.alert(
      'Code Sent',
      'A new verification code has been sent to your email',
    );
  };

  const isComplete = otp.every(digit => digit !== '');
  return (
    <SafeAreaView style={styles.scrollContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <View style={styles.container}>
        <View style={styles.topSpace} />

        <View style={styles.header}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We have sent a 4 digit code to{' '}
            <Text style={styles.email}>{currentEmail}</Text>. Also check your
            spam
          </Text>
        </View>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              value={digit}
              onChangeText={value => handleOtpChange(value.slice(-1), index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        <View
          style={[
            styles.buttonContainer,
            keyboardVisible
              ? styles.buttonContainerKeyboard
              : styles.buttonContainerNormal,
          ]}
        >
          <Pressable
            style={[
              styles.continueButton,
              !isComplete && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isComplete || isLoading}
          >
            <Text
              style={[
                styles.continueButtonText,
                !isComplete && styles.continueButtonTextDisabled,
              ]}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </Text>
          </Pressable>

          {!keyboardVisible && (
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <Pressable onPress={handleResendCode}>
                <Text style={styles.resendLink}>Resend code</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.successIconContainer}>
                <Check size={40} color="white" />
              </View>

              <Text style={styles.modalTitle}>
                You have logged in successfully
              </Text>

              <Text style={styles.modalSubtitle}>
                You can now continue to your projects
              </Text>

              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={styles.modalContinueButton}
                  onPress={handleModalContinue}
                  android_ripple={{ color: '#ccc' }}
                >
                  <Text style={styles.modalContinueButtonText}>Continue</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('6%'),
  },
  topSpace: {
    height: hp('2%'),
  },
  header: {
    marginBottom: hp('6%'),
    paddingHorizontal: wp('2%'),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('7%'),
    color: '#141b41',
    marginBottom: hp('1%'),
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('4.1%'),
    color: '#000',
    lineHeight: hp('2.5%'),
  },

  email: {
    fontFamily: 'Inter-Medium',
    color: '#000',
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('6%'),
    paddingHorizontal: wp('2%'),
  },
  otpInput: {
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: wp('10%'),
    backgroundColor: '#f7f9fc',
    fontSize: wp('6%'),
    fontFamily: 'Inter-Bold',
    color: '#141b41',
    borderWidth: 1,
    borderColor: 'rgba(225, 225, 225, 1)',
  },
  otpInputFilled: {
    backgroundColor: '#fff',
    borderColor: 'rgba(225, 225, 225, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: hp('0.3%'),
    elevation: 2,
  },
  buttonContainer: {
    paddingHorizontal: wp('2%'),
    marginTop: hp('1%'),
  },
  buttonContainerNormal: {
    justifyContent: 'flex-end',
  },
  buttonContainerKeyboard: {
    marginTop: hp('2.5%'),
  },
  continueButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    height: hp('7%'),
    borderRadius: hp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  continueButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  continueButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4.2%'),
    color: '#fff',
  },
  continueButtonTextDisabled: {
    color: '#93a5b1',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('4%'),
    color: '#666',
  },
  resendLink: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4%'),
    color: '#181446',
    fontWeight: '900',
  },
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
    marginBottom: hp('2%'),
    lineHeight: hp('3.5%'),
    fontWeight: '800',
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('2%'),
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: hp('5%'),
    lineHeight: hp('3%'),
    paddingHorizontal: wp('10%'),
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
});
