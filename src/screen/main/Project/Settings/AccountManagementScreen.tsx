import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Linking,
} from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../utils/api';
import { useAuthStore } from '../../../../zustand/store/authStore';
import { getAccessToken } from '../../../../utils/tokenSetting';
import moment from 'moment';

const AccountManagementScreen = () => {
  const [userData, setUserData] = useState({});
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [subscriptionExpirydate, setSubscriptionExpirydate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user } = useAuthStore.getState();
  const currentEmail = user?.email;
  const token = getAccessToken();
  const fetchUser = async () => {
    try {
      const response = await api.get(`/user/user/${currentEmail}`);
      const user = response.data.user;
      setUserData(user);
      setFullname(user.fullname || '');
      setEmail(user.email || '');
      setBio(user.bio || 'NA');
      setSubscriptionExpirydate(
        user.subscriptionExpirydate
          ? moment(user.subscriptionExpirydate).format('YYYY-MM-DD')
          : 'NA',
      );
      setSubscriptionPlan(user.subscriptionPlan || 'NA');
    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError(null);
    try {
      const payload = {
        fullname,
        email,
        bio,
      };

      const response = await api.put(`/user/profile/update/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setShowSuccessModal(true);
        fetchUser();
      } else {
        setError('Update failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong while updating profile.');
    }
  };

  const handleOpenURL = () => {
    Linking.openURL(
      'http://localhost:3000/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxZWYxZjE0NmUzNjlkNDc2MmIzZDAiLCJlbWFpbCI6InNzQGdtYWlsLmNvbSIsImlhdCI6MTc1NDM5NDQwMCwiZXhwIjoxNzU0NDgwODAwfQ.onFozSascbjCLZNFZbkGe1B18CRqYWN6lHmniZsPu68',
    ).catch(err => console.error("Couldn't load page", err));
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14274A" barStyle="light-content" />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Account Management</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userData?.image || 'NA',
            }}
            style={styles.avatar}
          />
        </View>

        {/* Fullname */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fullname</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter fullname"
            placeholderTextColor="black"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>

        {/* Email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="black"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter bio"
            placeholderTextColor="black"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Subscription Expiry Date */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              alignItems: 'center',
            }}
          >
            <Text style={styles.sectionTitle}>Subscription</Text>
            <Pressable style={[styles.statusBadge]} onPress={handleOpenURL}>
              <Text style={styles.statusText}>Renew</Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.input,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <Text>{subscriptionPlan}</Text>
            <Text>{subscriptionExpirydate}</Text>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.updateContainer}>
          <Pressable style={styles.updateButton} onPress={() => handleUpdate()}>
            <Text style={styles.updateButtonText}>Update</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalBox}>
            <View
              style={{
                backgroundColor: '#1D7903',
                borderRadius: 50,
                padding: 12,
                marginBottom: 16,
                width: '20%',
                alignSelf: 'center',
              }}
            >
              <Check size={40} color="#fff" />
            </View>
            <Text
              style={{
                fontSize: wp('4.5%'),
                fontWeight: '800',
                textAlign: 'center',
              }}
            >
              Success
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 20,
                color: '#000',
                textAlign: 'center',
                fontWeight: '400',
                lineHeight: 25,
              }}
            >
              Your details has been updated {'\n'} succesfully.
            </Text>
            <Pressable
              style={{
                backgroundColor: '#181446',
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 35,
                width: '80%',
                alignSelf: 'center',
              }}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('bottom', { screen: 'setting' });
              }}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '500',
                }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountManagementScreen;

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
  content: {
    flex: 1,
    padding: wp('6%'),
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  avatar: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('50%'),
    borderWidth: 2,
    borderColor: '#ccc',
  },
  section: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(132, 132, 132, 1)',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8'),
    fontSize: wp('3.8%'),
    color: 'black',
    marginBottom: hp('2%'),
  },
  textArea: {
    backgroundColor: 'rgba(247, 248, 254, 1)',
    borderRadius: 28,
    padding: 16,
    minHeight: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
  },
  updateContainer: {
    marginTop: hp('2%'),
    marginBottom: hp('10%'),
  },
  updateButton: {
    backgroundColor: '#181446',
    borderRadius: wp('7%'),
    height: hp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4%'),
    color: '#fff',
  },

  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
    fontFamily: 'Inter-Regular',
    marginVertical: hp('2%'),
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  modalBox: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp('6%'),
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  statusBadge: {
    borderRadius: 5,
    backgroundColor: '#14274A',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
});
