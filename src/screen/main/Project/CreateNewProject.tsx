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
} from 'react-native';
import { ChevronLeft, ChevronDown, CirclePlus } from 'lucide-react-native';
import { useState } from 'react';
import defaultLogo from '../../../assets/images/jsw_icon.png';
import { useNavigation } from '@react-navigation/native';
import api from '../../../utils/api';
import { launchImageLibrary } from 'react-native-image-picker';

type Member = {
  email: string;
  role: 'view only' | 'can edit';
};
const CreateNewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [contributors, setContributors] = useState(['']);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  // Members

  const [members, setMembers] = useState<Member[]>([
    { email: 'name@email.com', role: 'View only' },
    { email: 'name@email.com', role: 'Can edit' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [activeRoleMenu, setActiveRoleMenu] = useState<number | null>(null);
  const handleRoleChange = (index: number, role: Member['role']) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = role;
    setMembers(updatedMembers);
    setActiveRoleMenu(null);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
    setActiveRoleMenu(null);
  };
  // End Members

  const handleContributorChange = (text, index) => {
    const newContributors = [...contributors];
    newContributors[index] = text;
    setContributors(newContributors);
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image.');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
        }
      },
    );
  };
  const handleCreateProject = async () => {
    if (!projectName || !description || contributors.some(c => !c)) {
      Alert.alert('Validation', 'Please fill all required fields!');
      return;
    }

    try {
      const formData = new FormData();

      // Append project fields
      formData.append('name', projectName);
      formData.append('description', description);

      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          name: selectedImage.fileName || 'Screenshot 2025-06-20 104646.png',
          type: selectedImage.type || 'image/png',
        });
      } else {
        const defaultImageUri = Image.resolveAssetSource(defaultLogo).uri;
        formData.append('image', {
          uri: defaultImageUri,
          name: 'default-logo.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await api.post('/project/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        Alert.alert('Success', 'Project created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('bottom'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to create project...!!');
      }
    } catch (error) {
      console.log('API Error:', error);
      Alert.alert('Error', 'Something went wrong while creating the project.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Create New Project</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoSection}>
          <View style={styles.img_container}>
            <Image
              source={selectedImage ? { uri: selectedImage.uri } : defaultLogo}
              style={styles.companyLogo}
              resizeMode="contain"
            />
          </View>
          <Pressable style={styles.editImageButton} onPress={handleImagePicker}>
            <Text style={styles.editImageText}>Edit image</Text>
          </Pressable>
        </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add contributors</Text>
            {contributors.map((contributor, index) => (
              <View key={index} style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter name of project"
                    placeholderTextColor="#93a5b1"
                    value={contributor}
                    onChangeText={text => handleContributorChange(text, index)}
                  />
                </View>
                <View style={styles.iconContainer}>
                  <CirclePlus size={20} color="black" />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.membersList}>
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
          </View>

          <View style={styles.createButtonContainer}>
            <Pressable
              style={styles.createButton}
              onPress={handleCreateProject}
            >
              <Text style={styles.createButtonText}>Create Project</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    borderBottomColor: '#e5e7eb',
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
    paddingBottom: 60,
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
    right: 0,
    top: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
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
});
