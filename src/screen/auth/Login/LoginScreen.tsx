import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Check } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import api from '../../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Google sign in
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '65469867457-5lidjejs2imrmfmmsgkoh7uvhr2s6lff.apps.googleusercontent.com',
  offlineAccess: true,
});

// Google sign in end
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  // Handle Login
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        return Alert.alert('Message', 'All fields are required...!!');
      }

      if (!email.includes('@')) {
        return Alert.alert(
          'Message',
          'Please enter a valid email address...!!',
        );
      }

      if (password.length < 6) {
        return Alert.alert(
          'message',
          'Password must be atleast 6 characters...!!',
        );
      }

      // Payload
      const payload = { email: email.trim(), password: password.trim() };

      const response = await api.post(`/user/login`, payload);
      const data = response.data;

      if (data.success) {
        Alert.alert('Success', 'Login successful...!!');
        await AsyncStorage.setItem('token', data.token);
        console.log('Token has been saved successfully...!!' + data.token);
        navigation.navigate('otp');
      } else {
        Alert.alert('Error', 'Invalid email or password...!!');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again later...!!');
    }
  };

  // Google sign in
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log(response.data.idToken);
        navigation.navigate('projects');
      } else {
        console.log('Sign in was cancelled by user...!!');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Sign in is in progress...!!');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Play services not available...!!');
            break;
          default:
            console.log('Google Sign-In error code:', error.code);
        }
      } else {
        Alert.alert('Error', 'Google sign-in error...!!');
      }
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.topSpace} />

        <View style={styles.header}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Welcome back! Please enter your details
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#93a5b1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#93a5b1"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.options}>
            <Pressable
              style={styles.checkbox}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  rememberMe && styles.checkboxChecked,
                ]}
              >
                {rememberMe && <Check size={wp('3.5%')} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </Pressable>

            <Pressable
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </Pressable>
          </View>

          <Pressable style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => handleGoogleSignIn()}
          >
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </Pressable>

          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

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
    fontSize: wp('4.1%'),
    color: '#000',
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
    marginBottom: hp('3%'),
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
    color: '#000',
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('3.8%'),
    color: 'rgba(51, 128, 215, 1)',
  },
});
