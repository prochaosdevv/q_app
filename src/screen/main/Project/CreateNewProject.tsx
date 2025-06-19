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
} from 'react-native';
import {
  ChevronLeft,
  ChevronDown,
  ClipboardList,
  FileText,
  Settings,
} from 'lucide-react-native';
import { useState } from 'react';
import jsw from '../../../assets/images/jsw_icon.png';
import { useNavigation } from '@react-navigation/native';

const CreateNewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [contributors, setContributors] = useState(['']);
  const navigation = useNavigation();
  const [members, setMembers] = useState([
    { email: 'name@email.com', role: 'can view' },
    { email: 'name@email.com', role: 'can view' },
  ]);

  const handleAddContributor = () => {
    setContributors([...contributors, '']);
  };

  const handleContributorChange = (text: string, index: number) => {
    const newContributors = [...contributors];
    newContributors[index] = text;
    setContributors(newContributors);
  };

  const handleFooterPress = (route: any) => {
    // router.push(route);
  };

  const handleCreateProject = () => {
    // router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#141b41" size={24} />
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
              source={typeof jsw === 'string' ? { uri: jsw } : jsw}
              style={styles.companyLogo}
              resizeMode="cover"
            />
          </View>
          <Pressable style={styles.editImageButton}>
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
              <TextInput
                key={index}
                style={[styles.input, index > 0 && styles.inputSpacing]}
                placeholder="Enter name of project"
                placeholderTextColor="#93a5b1"
                value={contributor}
                onChangeText={text => handleContributorChange(text, index)}
              />
            ))}
          </View>

          <View style={styles.membersSection}>
            {members.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberEmail}>{member.email}</Text>
                <Pressable style={styles.roleSelector}>
                  <Text style={styles.roleText}>{member.role}</Text>
                  <ChevronDown size={16} color="#666" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.createButtonContainer}>
        <Pressable style={styles.createButton} onPress={handleCreateProject}>
          <Text style={styles.createButtonText}>Create Project</Text>
        </Pressable>
      </View>

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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    // width: 40,
    // height: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginRight: 8,
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#141b41',
    textAlign: 'center',
    flex: 1,
    marginLeft: -24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
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
    // marginBottom: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    width: 55,
    height: 26,
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
    marginBottom: 24,
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
  addButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5D8BF4',
  },
  membersSection: {
    marginTop: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(237, 237, 237, 1)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  memberEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    marginRight: 4,
  },
  createButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    backgroundColor: '#fff',
    paddingTop: 16,
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
  
});
