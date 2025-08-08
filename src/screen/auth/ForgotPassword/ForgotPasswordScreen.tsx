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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import forgotPasswordApi from '../../../utils/apiForgotPassword';
const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = email => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async () => {
    const userEmail = email.trim().toLowerCase();

    if (!userEmail) return setError('Email is required.');
    if (!validateEmail(userEmail)) return setError('Enter a valid email.');

    setLoading(true);
    setError('');

    try {
      const response = await forgotPasswordApi.post('/user/request-otp', {
        email: userEmail,
      });
      const result = response.data;

      if (result.success) {
        const token = await result.token;
        await AsyncStorage.setItem('forget_password_access_token', token);
        navigation.navigate('otp-verify', { email: userEmail });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Request OTP error.');
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
          <Text style={styles.title}>Cant sign in?</Text>
          <Text style={styles.subtitle}>
            Enter the email associated to your account and we will send you a
            link to reset your password
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="email@gmail.com"
              placeholderTextColor="#93a5b1"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        {error ? (
          <Text
            style={{
              color: 'red',
              marginBottom: hp('1.8%'),
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        ) : null}
        <Pressable
          style={styles.signInButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={'small'} color={'white'} />
          ) : (
            <Text style={styles.signInButtonText}>Reset password</Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Return to</Text>
          <Pressable onPress={() => navigation.navigate('login')}>
            <Text style={styles.footerLink}> Sign in </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

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
