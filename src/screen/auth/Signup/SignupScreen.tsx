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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../../../utils/api';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      if (!fullname || !email || !password) {
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
          'Message',
          'Password must be at least 6 characters...!!',
        );
      }

      // Payload
      const payload = {
        fullname: fullname.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      const response = await api.post('user/register', payload);
      const data = response.data;

      if (data.success) {
        Alert.alert('Success', 'User registration successful...!!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('login'),
          },
        ]);
      } else {
        if (
          data.message &&
          data.message.toLowerCase().includes('Email already exists...!!')
        ) {
          Alert.alert('Error', 'Email already exists. Please try another...!!');
        } else {
          Alert.alert('Error', 'User registration failed...!!');
        }
      }
    } catch (error) {
      console.error('Signup Error:', error);

      // Handle if server sends specific error response
      if (error.response && error.response.data?.message) {
        const serverMessage = error.response.data.message.toLowerCase();

        if (serverMessage.includes('email already exists')) {
          return Alert.alert(
            'Error',
            'Email already exists. Please try another...!!',
          );
        }
        return Alert.alert('Error', error.response.data.message);
      }
      Alert.alert('Error', 'Signup failed. Please try again...!!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              onChangeText={setFullname}
            />
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
          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.link}>Terms of service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
          <Pressable style={styles.signInButton} onPress={handleSignUp}>
            <Text style={styles.signInButtonText}>Sign Up</Text>
          </Pressable>

          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </Pressable>

          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
          </Pressable>
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
});
