import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../../../utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import signInWithGoogle from '../../../utils/signInWithGoogle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../../zustand/store/authStore';

const SignupScreen = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { setUser, setToken } = useAuthStore.getState();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const clearFieldError = field =>
    setErrors(prev => ({ ...prev, [field]: '' }));

  const handleSignUp = async () => {
    const newErrors = {};

    // Validation
    if (!fullname) newErrors.fullname = 'Full name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!email.includes('@'))
      newErrors.email = 'Enter a valid email address.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const payload = {
        fullname: fullname.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      const response = await api.post('/user/register', payload);
      const data = response.data;

      if (data.success) {
        await AsyncStorage.setItem('access_token', data.token);
        setToken(data.token);
        setUser(data.user);
        navigation.navigate('pending-status');
      } else {
        setErrors({
          email: data.message?.toLowerCase().includes('email already')
            ? 'Email already exists. Please try another.'
            : '',
          general: data.message || 'User registration failed.',
        });
      }
    } catch (error) {
      console.error('Signup Error:', error);

      const serverMessage = error.response?.data?.message?.toLowerCase() || '';

      if (serverMessage.includes('email already exists')) {
        setErrors({ email: 'Email already exists. Please try another.' });
      } else {
        setErrors({ general: serverMessage || 'Signup failed. Try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <View style={styles.container}>
        <View style={styles.topSpace} />

        <View style={styles.header}>
          <Text style={styles.title}>Join JSW 2025 project management</Text>
          <Text style={styles.subtitle}>
            Our project management app brings better visibility to your projects
            progress
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full name </Text>
            <TextInput
              style={styles.input}
              placeholder="John Johnson"
              placeholderTextColor="#93a5b1"
              value={fullname}
              onChangeText={text => {
                setFullname(text);
                clearFieldError('fullname');
              }}
            />
            {errors.fullname && (
              <Text style={styles.errorText}>{errors.fullname}</Text>
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@gmail.com"
              placeholderTextColor="#93a5b1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={text => {
                setEmail(text);
                clearFieldError('email');
              }}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#93a5b1"
              secureTextEntry
              value={password}
              onChangeText={text => {
                setPassword(text);
                clearFieldError('password');
              }}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
          {errors.general && (
            <Text
              style={[
                styles.errorText,
                { textAlign: 'center', fontWeight: '800' },
              ]}
            >
              {errors.general}
            </Text>
          )}
          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.link}>Terms of service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
          <Pressable style={styles.signInButton} onPress={handleSignUp}>
            {loading ? (
              <ActivityIndicator size={'small'} color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign Up</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => signInWithGoogle({ navigation })}
          >
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </Pressable>

          {/* <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
          </Pressable> */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

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
    marginBottom: hp('4%'),
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
    fontSize: wp('4%'),
    color: '#000',
    lineHeight: hp('2.5%'),
  },
  form: {
    flex: 1,
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
    borderWidth: 1,
  },

  signInButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    height: hp('6.8%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
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
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(133, 133, 133, 1)',
    marginBottom: 24,
    lineHeight: 20,
    marginTop: hp('4%'),
  },
  link: {
    color: 'rgba(51, 128, 215, 1)',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: wp('3.8%'),
    marginTop: hp('0.5%'),
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.8%'),
    color: '#000',
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('3.8%'),
    color: 'rgba(51, 128, 215, 1)',
  },
});
