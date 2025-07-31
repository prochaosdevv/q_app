import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  StatusBar,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Check, ChevronRight, EllipsisVertical, X } from 'lucide-react-native';
import { useAuthStore } from '../../../../zustand/store/authStore';
import api from '../../../../utils/api';
import { getAccessToken } from '../../../../utils/tokenSetting';

export default function PendingStatusScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore.getState();
  const [pendingStatus, setPendingStatus] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activePopupId, setActivePopupId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const currentEmail = user?.email;
  const token = getAccessToken();

  const getPendingStatus = async () => {
    try {
      const res = await api.get('/project/get/contributor/pending-status');
      const invitations = res.data.invitations;
      console.log('Projects : ', invitations);
      setPendingStatus(invitations);
    } catch (error) {
      console.log('Project Fetching Error', error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getPendingStatus();
    setRefreshing(false);
  };

  useEffect(() => {
    getPendingStatus();
  }, []);

  const handleInvitationAction = async () => {
    try {
      const payload = {
        projectId: selectedItemId,
      };
      if (actionType === 'accept') {
        await api.post(`/project/accept-invitation/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setShowAcceptModal(false);
        setShowSuccessModal(true);
        navigation.navigate('projects');
      } else if (actionType === 'reject') {
        await api.post(`/project/decline-invitation/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setShowAcceptModal(false);
        setShowRejectModal(true);
        navigation.navigate('projects');
      }
    } catch (err) {
      console.log('Action error:', err);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.projectCard}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.email}</Text>
        <Text style={[styles.projectDate]}>
          {moment(item.createdAt).format('MMM YYYY')}
        </Text>
      </View>

      {item.email === currentEmail ? (
        <Pressable
          style={styles.menuIcon}
          onPress={() =>
            setActivePopupId(activePopupId === item._id ? null : item._id)
          }
        >
          <EllipsisVertical size={22} color="black" />
        </Pressable>
      ) : null}

      {activePopupId === item._id && (
        <TouchableOpacity
          style={styles.popupMenu}
          onPress={() => setActivePopupId(null)}
        >
          <Pressable
            style={styles.popupItem}
            onPress={() => {
              setSelectedItemId(item.project);
              setActionType('accept');
              setShowAcceptModal(true);
              setActivePopupId(null);
            }}
          >
            <Text style={styles.popupTextBold}>Accept</Text>
          </Pressable>

          <Pressable
            style={styles.popupItem}
            onPress={() => {
              setSelectedItemId(item.project);
              setActionType('reject');
              setShowAcceptModal(true);
              setActivePopupId(null);
            }}
          >
            <Text style={styles.popupTextBold}>Decline</Text>
          </Pressable>
        </TouchableOpacity>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.topSpace} />
          <View style={styles.header}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.title}>Pending Invitations</Text>
              <ChevronRight
                color="#141b41"
                onPress={() => navigation.navigate('projects')}
                size={28}
                style={{ marginTop: -5 }}
              />
            </View>
            <Text style={styles.subtitle}>
              Pending invites linked to
              <Text style={styles.email}> {currentEmail}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.middleSection}>
          <FlatList
            data={pendingStatus}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  height: hp('60%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, color: '#999' }}>
                  Pending invitation not found.
                </Text>
              </View>
            )}
          />
        </View>
      </View>

      <Modal
        visible={showAcceptModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowAcceptModal(false)}
          />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to{' '}
              {actionType === 'accept' ? 'accept' : 'decline'} this invitation?
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={handleInvitationAction}
            >
              <Text style={styles.modalButtonText}>Okay</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton_}
              onPress={() => setShowAcceptModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
              Your invitation has been accepted {'\n'} succesfully.
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
                getPendingStatus();
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

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowRejectModal(false)}
          />
          <View style={styles.modalBox}>
            <View
              style={{
                backgroundColor: '#141b41',
                borderRadius: 50,
                padding: 12,
                marginBottom: 16,
                width: '20%',
                alignSelf: 'center',
              }}
            >
              <X size={40} color="#fff" />
            </View>

            <Text
              style={{
                fontSize: wp('4.5%'),
                fontWeight: '800',
                textAlign: 'center',
                color: '#000',
              }}
            >
              Declined
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
              You have declined the invitation {'\n'} successfully.
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
                setShowRejectModal(false);
                getPendingStatus();
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
  content: {
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  topSection: {
    flex: 0.17,
    justifyContent: 'center',
  },
  middleSection: {
    flex: 0.65,
  },

  topSpace: {
    height: hp('5%'),
  },
  header: {
    marginBottom: hp('0.1'),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('6%'),
    color: '#141b41',
    marginBottom: hp('1%'),
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('4%'),
    color: '#000',
  },

  email: {
    fontFamily: 'Inter-Medium',
    color: '#000',
    fontWeight: 'bold',
  },

  projectCard: {
    flexDirection: 'row',
    backgroundColor: '#f7f9fc',
    borderRadius: hp('2%'),
    padding: hp('2%'),
    marginBottom: hp('1%'),
    borderColor: 'rgba(239, 239, 240, 1)',
    borderWidth: 1,
  },

  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontFamily: 'Inter-Bold',
    fontSize: hp('1.6%'),
    color: 'black',
    fontWeight: '700',
    marginBottom: hp('0.5%'),
  },
  projectDate: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('1.5%'),
    color: 'rgba(137, 139, 141, 1)',
    fontWeight: 'bold',
  },
  orText: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('2%'),
    color: '#666',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  createButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: hp('50%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: hp('2%'),
    color: '#fff',
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    right: 15,
    padding: 4,
    zIndex: 1,
  },
  // Pop up modal

  popupMenu: {
    position: 'absolute',
    right: 15,
    top: 55,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  popupIcon: {
    marginRight: 12,
  },
  popupTextBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cancelText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
  },

  // modal Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalBox: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 25,
    color: '#1a1447',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  cancelButton_: {
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1447',
    width: '100%',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1a1447',
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
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
});
