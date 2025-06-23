import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
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
import { useNavigation } from '@react-navigation/native';

type Member = {
  email: string;
  role: 'view only' | 'can edit';
};
const ManageMembers = () => {
  const [members, setMembers] = useState<Member[]>([
    { email: 'name@email.com', role: 'view only' },
    { email: 'name@email.com', role: 'can edit' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [activeRoleMenu, setActiveRoleMenu] = useState<number | null>(null);

  const navigation = useNavigation();
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

  const handleFooterPress = (route: any) => {
    // router.push(route);
  };
  return (
    <SafeAreaView style={styles.container}>
     <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Project members</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Manage members</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add contributors</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name of project"
            placeholderTextColor="#93a5b1"
            value={newMemberEmail}
            onChangeText={setNewMemberEmail}
          />
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
      </View>
    </SafeAreaView>
  );
};

export default ManageMembers;

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
    fontSize: 14,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 80,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'rgba(50, 49, 49, 1)',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(247, 248, 254, 1)',
    borderRadius: 50,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
  },
  membersList: {
    marginTop: 16,
  },
  memberItem: {
    marginBottom: 12,
    position: 'relative',
  },
  memberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(237, 237, 237, 1)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontSize: 14,
    color: '#333',
  },
  removeMenuItem: {
    // paddingTop: 12,
  },
  removeMenuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  },
});
