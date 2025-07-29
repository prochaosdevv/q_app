import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../../../utils/api';
import forgotPasswordApi from '../../../utils/apiForgotPassword';
import { getForgotPasswordAccessToken } from '../../../utils/forgotPasswordTokenSetting';
import ForgotPasswordSuccessModal from '../../../components/ForgotPasswordSuccessModal';
import { useNavigation } from '@react-navigation/native';

export default function CreateNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordSuccessModal, setShowForgotPasswordSuccessModal] =
    useState(false);

  const token = getForgotPasswordAccessToken();
  const navigation = useNavigation();

  const handleForgotPassword = () => {
    setShowForgotPasswordSuccessModal(false);
    navigation.navigate('login');
  };
  const createNewPassword = async () => {
    setLoading(true);
    try {
      const response = await forgotPasswordApi.post(
        `/user/reset-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setShowForgotPasswordSuccessModal(true);
      }
    } catch (error) {
      console.log('Error fetching create new password.');
    } finally {
      setLoading(false); 
    }
  };
  return (
    <ScrollView style={styles.scrollContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#000000" />
      <View style={styles.container}>
        <View style={styles.topSpace} />
        <View style={styles.header}>
          <Text style={styles.title}>Create new password</Text>
          <Text style={styles.subtitle}>
            Enter the new password to your account.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter new password</Text>
            <TextInput
              style={styles.input}
              placeholder="John@1123"
              placeholderTextColor="#93a5b1"
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
        </View>

        <Pressable style={styles.signInButton} onPress={createNewPassword}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.signInButtonText}>Submit</Text>
          )}
        </Pressable>
      </View>

      <ForgotPasswordSuccessModal
        visible={showForgotPasswordSuccessModal}
        onClose={() => setShowForgotPasswordSuccessModal(false)}
        onContinue={handleForgotPassword}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('6%'),
    minHeight: '100%',
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
  form: {
    // flex: 1,
  },
  inputGroup: {
    marginBottom: hp('2.5%'),
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('3.5%'),
    color: '#000',
    marginBottom: hp('1%'),
    opacity: 0.6,
  },
  input: {
    height: hp('6.5%'),
    backgroundColor: '#f7f9fc',
    borderRadius: wp('10%'),
    paddingHorizontal: wp('4%'),
    fontFamily: 'Inter-Regular',
    fontSize: wp('4%'),
    color: '#333',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('3%'),
    marginTop: hp('8%'),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 2,
    borderColor: '#737373',
    marginRight: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#141b41',
    borderColor: '#141b41',
  },
  checkboxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('4%'),
    color: '#333',
  },
  forgotPassword: {
    marginLeft: 'auto',
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4%'),
    color: 'rgba(214, 55, 57, 1)',
  },
  signInButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    height: hp('6.8%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1.5'),
  },
  signInButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4.2%'),
    color: '#fff',
    fontWeight: '700',
  },

  socialButton: {
    height: hp('6.8%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#a3a3a3',
  },
  socialButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4.2%'),
    color: 'rgba(24, 20, 70, 1)',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.8%'),
    color: 'rgba(24, 20, 70, 1)',
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('3.8%'),
    color: 'rgba(24, 20, 70, 1)',
    fontWeight: '800',
  },
});
