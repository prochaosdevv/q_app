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
import jsw from '../../../assets/images/jsw.png';
import { useNavigation } from '@react-navigation/native';
import api from '../../../utils/api';
import { useAuthStore } from '../../../zustand/store/authStore';
import moment from 'moment';
import { useProjectStore } from '../../../zustand/store/projectStore';
import { Check, EllipsisVertical, Settings } from 'lucide-react-native';
import { getAccessToken } from '../../../utils/tokenSetting';
import LogoutModal from '../../../components/LogoutModal';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const ProjectScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore.getState();
  const [project, setProject] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const setProjectId = useProjectStore(state => state.setProjectId);
  const setProjectImage = useProjectStore(state => state.setProjectImage);
  const setCreatedBy = useProjectStore(state => state.setCreatedBy);
  const [activePopupId, setActivePopupId] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const token = getAccessToken();
  const [showPopup, setShowPopup] = useState(false);

  const currentEmail = user?.email;
  const getProject = async () => {
    try {
      const res = await api.get('/project/get/by/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const projects = res.data.projects;

      setProject(projects);
    } catch (error) {
      console.log('Project Fetching Error', error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getProject(); // refresh project list
    setRefreshing(false);
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/project/delete/by/${selectedProjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200 || res.status === 204) {
        setShowDeleteConfirmModal(false);
        setActivePopupId(null);
        getProject();
      } else {
        console.log('Project deleting error :', res.status);
      }
    } catch (error) {
      console.log('Error deleting project :', error);
    }
  };

  const handleArchive = async () => {
    try {
      await api.put(`/project/archive/by/${selectedProjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Success");

      setShowSuccessModal(true);
      setActivePopupId(null);
    } catch (error) {
      console.log('Error deleting project :', error);
    }
  };

  useEffect(() => {
    getProject();
  }, []);

  // Handle Logout
  const [showLogouModal, setShowLogouModal] = useState(false);
  const handleLogout = () => {
    setShowLogouModal(true);
  };
  const handleModalContinue = async () => {
    setShowLogouModal(false);
    try {
      const logout = useAuthStore.getState().logout;
      await logout();
      console.log('✅ Sign-out successful...!!');
      // Sign out from Google
      try {
        await GoogleSignin.signOut();
        console.log('✅ Google sign-out successful...!!');
      } catch (googleError) {
        console.warn('⚠️ Google Sign-Out failed:', googleError);
      }

      // Navigate to login screen
      navigation.navigate('login');
    } catch (error) {
      console.log('❌ Logout Error:', error);
    }
  };

  // Set project id
  const navigateToBottom = item => {
    setProjectId(item._id);
    setProjectImage(item.image);
    setCreatedBy(item.createdBy._id);
    navigation.navigate('bottom');
  };
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.projectCard}
      onPress={() => navigateToBottom(item)}
    >
      <View style={styles.img_container}>
        <Image
          source={item.image ? { uri: item.image } : jsw}
          style={styles.projectLogo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectName}>{item.description}</Text>
        <Text style={styles.projectDate}>
          {moment(item.createdAt).format('MMM YYYY')}
        </Text>
      </View>
      {item.createdBy.email === currentEmail ? (
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
              setSelectedProjectId(item._id);
              handleArchive();
            }}
          >
            <Text style={styles.popupTextBold}>Archive</Text>
          </Pressable>

          <Pressable
            style={styles.popupItem}
            onPress={() => {
              setSelectedProjectId(item._id);
              setShowDeleteConfirmModal(true);
              setActivePopupId(null);
            }}
          >
            <Text style={styles.popupTextBold}>Delete</Text>
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
            {project.length > 0 ? (
              <>
                <Text style={styles.title}>
                  You’re connected to {'\n'}projects
                </Text>
                <Text style={styles.subtitle}>
                  Projects linked to
                  <Text style={styles.email}> {currentEmail}</Text>
                </Text>
                <Settings
                  onPress={() => setShowPopup(prev => !prev)}
                  style={{ position: 'absolute', top: 15, right: 5 }}
                />
              </>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.title]}>
                  You’re not connected{'\n'}to any project
                </Text>
                <Text style={styles.subtitle}>
                  Create a project linked to
                  <Text style={styles.email}> {currentEmail}</Text>
                </Text>
                <Settings
                  onPress={() => setShowPopup(prev => !prev)}
                  style={{ position: 'absolute', top: 12, right: 3 }}
                />
              </View>
            )}

            {showPopup && (
              <View style={styles.popupMenu1}>
                <Pressable
                  style={styles.popupItem1}
                  onPress={() => navigation.navigate('pending-status')}
                >
                  <Text style={styles.popupTextBold1}>Invitations</Text>
                </Pressable>

                <Pressable style={styles.popupItem1} onPress={handleLogout}>
                  <Text style={styles.popupTextBold1}>Logout</Text>
                </Pressable>

                <LogoutModal
                  visible={showLogouModal}
                  onClose={() => setShowLogouModal(false)}
                  onContinue={handleModalContinue}
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.middleSection}>
          {project.length > 0 ? (
            <>
              <FlatList
                data={project}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
              />
              <Text style={styles.orText}>or</Text>
              <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate('create-new-project')}
              >
                <Text style={styles.createButtonText}>Create new project</Text>
              </Pressable>
            </>
          ) : (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.orText}>or</Text>
              <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate('create-new-project')}
              >
                <Text style={styles.createButtonText}>Create new project</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={showDeleteConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowDeleteConfirmModal(false)}
          />
          <View style={styles.deleteModalBox}>
            <Text style={styles.deleteTitle}>
              Are you sure you want to delete?
            </Text>
            <Text style={styles.deleteMessage}>
              This week goal will be lost. You will not be able to undo.
            </Text>

            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Okay</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton_}
              onPress={() => setShowDeleteConfirmModal(false)}
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
              Your project has been archived {'\n'} succesfully.
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
                setActivePopupId(null);
                getProject();
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

export default ProjectScreen;

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
    flex: 0.22,
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

  projectCard: {
    flexDirection: 'row',
    backgroundColor: '#f7f9fc',
    borderRadius: hp('2%'),
    padding: hp('2%'),
    marginBottom: hp('1%'),
    borderColor: 'rgba(239, 239, 240, 1)',
    borderWidth: 1,
  },
  projectLogo: {
    width: wp('10%'),
    height: hp('10%'),
    borderRadius: hp('1%'),
  },
  img_container: {
    backgroundColor: 'rgba(239, 237, 237, 1)',
    height: hp('12%'),
    width: wp('20%'),
    marginRight: hp('2%'),
    borderRadius: hp('2%'),
    padding: hp('0.1%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontFamily: 'Inter-Bold',
    fontSize: hp('2%'),
    color: 'black',
    fontWeight: 'bold',
    // marginBottom: 4,
  },
  projectDate: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('1.5%'),
    color: 'rgba(137, 139, 141, 1)',
    marginTop: hp('1%'),
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
    right: 20,
    bottom: -4,
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

  popupTextBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    fontWeight: '800',
  },

  // Delete Modal
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
  deleteModalBox: {
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
  deleteTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1a1447',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '80%',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonText: {
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
    width: '80%',
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

  popupMenu1: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 9,
    width: 110,
    padding: 5,
  },
  popupItem1: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  popupTextBold1: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
