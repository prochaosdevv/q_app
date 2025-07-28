import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ChevronLeft,
  ChevronDown,
  CirclePlus,
  LogOut,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateNewProject } from '../../../hooks/useCreateNewProject';
import defaultLogo from '../../../assets/images/jsw_icon.png';
import LogoutModal from '../../../components/LogoutModal';
import { useAuthStore } from '../../../zustand/store/authStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const CreateNewProject = () => {
  const {
    projectName,
    setProjectName,
    description,
    setDescription,
    selectedImage,
    handleImagePicker,
    contributors,
    setContributors,
    members,
    setMembers,
    handleRoleChange,
    handleRemoveMember,
    handleContributorChange,
    handleCreateProject,
    error,
    activeRoleMenu,
    setActiveRoleMenu,
    isValidEmail,
    loading,
  } = useCreateNewProject();

  const [showLogouModal, setShowLogouModal] = useState(false);
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState();
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
        <Text style={styles.headerTitle}>Create New Project</Text>
        <Pressable onPress={handleLogout} style={styles.backButton}>
          <LogOut color="white" size={23} />
        </Pressable>
      </View>
      <LogoutModal
        visible={showLogouModal}
        onClose={() => setShowLogouModal(false)}
        onContinue={handleModalContinue}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo Upload */}
          <View style={styles.logoSection}>
            <View style={styles.img_container}>
              <Image
                source={selectedImage ? { uri: selectedImage.uri } : 'NA'}
                style={styles.companyLogo}
                resizeMode="contain"
              />
            </View>
            <Pressable
              onPress={handleImagePicker}
              style={styles.editImageButton}
            >
              <Text style={styles.editImageText}>Edit image</Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name of project"
                placeholderTextColor="#93a5b1"
                value={projectName}
                onChangeText={setProjectName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter project description"
                placeholderTextColor="#93a5b1"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Contributor Emails */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Add contributors</Text>
              {contributors.map((contributor, index) => (
                <>
                  <View key={index} style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter contributor email"
                        placeholderTextColor="#93a5b1"
                        value={contributor.email}
                        onChangeText={text => {
                          handleContributorChange(text, index);
                          setEmailError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    <Pressable
                      style={styles.iconContainer}
                      onPress={() => {
                        const email = contributor.email.trim();
                        if (!email) {
                          setEmailError('Email is required.');
                          return;
                        }
                        if (!isValidEmail(email)) {
                          setEmailError('Please enter a valid email address.');
                          return;
                        }
                        setMembers(prev => [
                          ...prev,
                          { email, role: 'View only' },
                        ]);
                        const updated = [...contributors];
                        updated[index] = { email: '', permission: 'view only' };
                        setContributors(updated);
                      }}
                    >
                      <CirclePlus size={20} color="black" />
                    </Pressable>
                  </View>
                  {emailError !== '' && (
                    <Text style={styles.errorText}>{emailError}</Text>
                  )}
                </>
              ))}
            </View>

            {/* Add contributor field */}
            <Pressable
              style={styles.membersList}
              onPress={() =>
                setContributors([
                  ...contributors,
                  { email: '', permission: 'view only' },
                ])
              }
            >
              {members.map((member, index) => (
                <View key={index} style={styles.memberItem}>
                  <Pressable
                    style={styles.memberButton}
                    onPress={() =>
                      setActiveRoleMenu(activeRoleMenu === index ? null : index)
                    }
                  >
                    <Text style={styles.memberEmail}>{member.email}</Text>
                    <View style={styles.roleContainer}>
                      <Text style={styles.roleText}>{member.role}</Text>
                      <ChevronDown
                        color="#666"
                        size={16}
                        style={[
                          styles.roleIcon,
                          activeRoleMenu === index && styles.roleIconActive,
                        ]}
                      />
                    </View>
                  </Pressable>

                  {activeRoleMenu === index && (
                    <View style={styles.roleMenu}>
                      <Pressable
                        style={styles.roleMenuItem}
                        onPress={() => handleRoleChange(index, 'view only')}
                      >
                        <Text style={styles.roleMenuText}>View only</Text>
                      </Pressable>
                      <Pressable
                        style={styles.roleMenuItem}
                        onPress={() => handleRoleChange(index, 'can edit')}
                      >
                        <Text style={styles.roleMenuText}>Can edit</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.roleMenuItem, styles.removeMenuItem]}
                        onPress={() => handleRemoveMember(index)}
                      >
                        <Text style={styles.removeMenuText}>Remove</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}
            </Pressable>

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            {/* Submit button */}
            <View style={styles.createButtonContainer}>
              <Pressable
                style={styles.createButton}
                onPress={handleCreateProject}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Create Project</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateNewProject;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#14274A',
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginLeft: -24,
  },
  content: {
    flex: 1,
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  img_container: {
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
    width: 76,
    height: 76,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    padding: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    width: 55,
    height: 55,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  editImageButton: {
    paddingVertical: 8,
  },
  editImageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(13, 153, 255, 1)',
    fontWeight: 'bold',
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(247, 248, 254, 1)',
    borderRadius: 28,
    paddingHorizontal: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputSpacing: {
    marginTop: 12,
  },
  textArea: {
    backgroundColor: '#f7f9fc',
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  membersList: {
    paddingVertical: 5,
  },
  memberItem: {
    position: 'relative',
    paddingBottom: 20,
  },
  memberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(237, 237, 237, 1)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  memberEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    marginRight: 4,
  },
  roleIcon: {
    transform: [{ rotate: '0deg' }],
  },
  roleIconActive: {
    transform: [{ rotate: '180deg' }],
  },
  roleMenu: {
    position: 'absolute',
    right: 10, // move it a bit inside
    top: -115, // move it above
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 9999,
  },
  roleMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  roleMenuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
  },
  removeMenuItem: {
    // paddingTop: 12,
  },
  removeMenuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 1)',
  },
  createButtonContainer: {
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 8.5,
  },

  iconContainer: {
    flex: 1.5,
    marginLeft: 8,
    backgroundColor: 'rgba(237, 237, 237, 1)',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    textAlign: 'center',
  },
});
