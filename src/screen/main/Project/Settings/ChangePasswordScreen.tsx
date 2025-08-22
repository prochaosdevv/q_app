import React, { use, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Eye, EyeOff, ChevronLeft, Check } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../../zustand/store/authStore';
import api from '../../../../utils/api';

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { user } = useAuthStore.getState();
  const provider = user?.provider;
  console.log('Welcome', provider);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const token = useAuthStore.getState().token;

  const handleChangePassword = async () => {
    setError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError('All fields are required.');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const res = await api.put(
        '/user/change-password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowSuccessModal(true);
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Server error.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14274A" barStyle="light-content" />{' '}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Create New Password</Text>
      </View>
      <View style={styles.body}>
        {/* Heading */}
        <Text style={styles.heading}>Create new password</Text>
        <Text style={styles.subheading}>
          Your new password must be different{'\n'}from your previous password
        </Text>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter Old Password</Text>
          <View
            style={[
              styles.passwordContainer,
              provider && { backgroundColor: '#d3d3d3' }, // gray if provider
            ]}
          >
            <TextInput
              placeholder="********"
              value={oldPassword}
              onChangeText={text => {
                setOldPassword(text);
                setError(null);
              }}
              secureTextEntry={!showOldPassword}
              placeholderTextColor="#999"
              style={styles.input}
              editable={!provider}
            />
            <TouchableOpacity
              onPress={() => setShowOldPassword(!showOldPassword)}
              disabled={!!provider}
            >
              {showOldPassword ? (
                <Eye color="#2E2E2E" size={22} />
              ) : (
                <EyeOff color="#2E2E2E" size={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter New Password</Text>
          <View
            style={[
              styles.passwordContainer,
              provider && { backgroundColor: '#d3d3d3' }, // gray if provider
            ]}
          >
            <TextInput
              placeholder="********"
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text);
                setError(null);
              }}
              secureTextEntry={!showNewPassword}
              placeholderTextColor="#999"
              style={styles.input}
              editable={!provider}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              disabled={!!provider}
            >
              {showNewPassword ? (
                <Eye color="#2E2E2E" size={22} />
              ) : (
                <EyeOff color="#2E2E2E" size={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View
            style={[
              styles.passwordContainer,
              provider && { backgroundColor: '#d3d3d3' }, // gray if provider
            ]}
          >
            <TextInput
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                setError(null);
              }}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
              style={styles.input}
              editable={!provider}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={!!provider}
            >
              {showConfirmPassword ? (
                <Eye color="#2E2E2E" size={22} />
              ) : (
                <EyeOff color="#2E2E2E" size={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* Error Display */}
        {error && (
          <Text
            style={{
              color: 'red',
              textAlign: 'center',
              marginBottom: hp('2%'),
              fontWeight: '500',
            }}
          >
            {error}
          </Text>
        )}

        {/* Password rules */}
        <Text style={styles.passwordRule}>Must be at least 6 characters</Text>
        <Text style={styles.passwordRule}>
          Must contain a unique character like !@?
        </Text>

        {/* Submit Button */}
        <Pressable
          style={[
            styles.submitButton,
            provider && { backgroundColor: 'gray' }, // disable color
          ]}
          onPress={!provider ? handleChangePassword : undefined}
        >
          <Text style={styles.submitButtonText}>Submit new password</Text>
        </Pressable>
      </View>
      {/* Success Modal */}
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

              <Text style={styles.modalTitle}>Password changed</Text>

              <Text style={styles.modalSubtitle}>
                You successfully changed your {'\n'} password and can use this
                now.
              </Text>

              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={styles.modalContinueButton}
                  android_ripple={{ color: '#ccc' }}
                  onPress={() => navigation.navigate('login')}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#14274A',
    backgroundColor: '#14274A',
    paddingTop: hp('6%'),
    paddingBottom: hp('3%'),
  },
  backButton: {
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: hp('1.7%'),
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginLeft: -hp('2%'),
  },
  body: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('2%'),
  },

  heading: {
    fontSize: wp('6%'),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp('1%'),
  },
  subheading: {
    fontSize: wp('4%'),
    color: '#555',
    marginBottom: hp('4%'),
    lineHeight: hp('3%'),
  },
  inputGroup: {
    marginBottom: hp('2.5%'),
  },
  label: {
    fontSize: wp('3.5%'),
    marginBottom: hp('0.8%'),
    color: '#666666',
    fontWeight: '400',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    height: hp('6.5%'),
  },
  input: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#000',
  },
  passwordRule: {
    color: 'green',
    fontSize: wp('3.6%'),
    marginBottom: hp('0.5%'),
  },
  submitButton: {
    marginTop: hp('4%'),
    backgroundColor: '#1C174F',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp('4.2%'),
    fontWeight: '600',
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
    fontWeight: '900',
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('1.8%'),
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: hp('5%'),
    lineHeight: hp('3%'),
    paddingHorizontal: wp('2%'),
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
