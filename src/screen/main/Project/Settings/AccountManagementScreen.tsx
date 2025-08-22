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
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Check, ChevronLeft, Pencil } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../utils/api';
import { useAuthStore } from '../../../../zustand/store/authStore';
import { getAccessToken } from '../../../../utils/tokenSetting';
import moment from 'moment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AccountManagementScreen = () => {
  const [userData, setUserData] = useState({});
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
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
      setAvatar(user.image || '');
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

  const handleOpenURL = () => {
    Linking.openURL('https://q-surv-payment.vercel.app/').catch(err =>
      console.error("Couldn't load page", err),
    );
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('bio', bio);

      // agar naya avatar select kiya gaya hai
      if (avatar && avatar.startsWith('file')) {
        formData.append('image', {
          uri: avatar,
          name: 'profile.jpg', // koi bhi naam de sakte ho
          type: 'image/jpeg', // ya image/png based on file
        });
      }

      const response = await api.put(`/user/profile/update/`, formData, {
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

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (!res.didCancel && !res.errorCode && res.assets?.[0]?.uri) {
        setAvatar(res.assets[0].uri);
        setShowPhotoModal(false);
      }
    });
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, res => {
      if (!res.didCancel && !res.errorCode && res.assets?.[0]?.uri) {
        setAvatar(res.assets[0].uri);
        setShowPhotoModal(false);
      }
    });
  };

  const today = moment().format('YYYY-MM-DD');
  const isExpired = today < subscriptionExpirydate;

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
              uri: avatar || userData?.image,
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => setShowPhotoModal(true)}
          >
            <Pencil size={20} color="#fff" />
          </TouchableOpacity>
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
            editable={false}
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
            <Text>{isExpired ? 'Expired' : subscriptionExpirydate}</Text>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.updateContainer}>
          <Pressable style={styles.updateButton} onPress={() => handleUpdate()}>
            <Text style={styles.updateButtonText}>Update</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlayPhoto}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowPhotoModal(false)}
          />
          <View style={styles.photoModalBoxPhoto}>
            <Text style={styles.photoModalTitlePhoto}>Add photos</Text>
            <Pressable
              style={styles.photoOptionButtonPhoto}
              onPress={openGallery}
            >
              <Text style={styles.photoOptionTextPhoto}>From device</Text>
            </Pressable>
            <Pressable
              style={styles.photoOptionButtonPhoto}
              onPress={openCamera}
            >
              <Text style={styles.photoOptionTextPhoto}>Take photo</Text>
            </Pressable>
            <Pressable
              style={styles.continueButtonPhoto}
              onPress={() => setShowPhotoModal(false)}
            >
              <Text style={styles.continueButtonTextPhoto}>Continue</Text>
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
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: wp('32%'),
    backgroundColor: '#14274A',
    padding: wp('2%'),
    borderRadius: hp('50%'),
  },
  // Modal and Dropdown Styles
  modalOverlayPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdropPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainerPhoto: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 24,
    maxHeight: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownHeaderPhoto: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dropdownTitlePhoto: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'rgba(0, 11, 35, 1)',
    textAlign: 'center',
  },
  dropdownListPhoto: {
    maxHeight: 300,
  },
  dropdownItemPhoto: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  dropdownItemSelectedPhoto: {
    backgroundColor: '#f7f9fc',
  },
  dropdownItemTextPhoto: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelectedPhoto: {
    fontFamily: 'Inter-Medium',
    color: 'rgba(0, 11, 35, 1)',
  },

  photoModalBoxPhoto: {
    width: 280,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  photoModalTitlePhoto: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginBottom: 16,
  },

  photoOptionButtonPhoto: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(225, 225, 225, 1)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },

  photoOptionTextPhoto: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  },

  continueButtonPhoto: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    width: '100%',
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  continueButtonTextPhoto: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fff',
  },
});
