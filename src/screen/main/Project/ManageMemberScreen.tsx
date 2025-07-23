import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  ChevronLeft,
  ChevronDown,
  ClipboardList,
  FileText,
  Settings,
  CirclePlus,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../../../utils/api';
import { useProjectStore } from '../../../zustand/store/projectStore';
type Member = {
  email: string;
  permission: 'view only' | 'can edit';
};

const ManageMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [activeRoleMenu, setActiveRoleMenu] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const projectId = useProjectStore(state => state.id);

  const handleRoleChange = async (
    index: number,
    permission: 'view only' | 'can edit',
  ) => {
    const selectedMember = members[index];

    if (selectedMember.permission === permission) {
      setActiveRoleMenu(null);
      return;
    }

    const updated = [...members];
    updated[index].permission = permission;
    setMembers(updated);
    setActiveRoleMenu(null);

    const payload = {
      projectId: projectId,
      contributors: [
        {
          email: selectedMember.email.trim().toLowerCase(),
          permission: permission,
        },
      ],
    };

    try {
      await api.put('/project/edit-contributors-permissions', payload);
      await getMembersByProjectId();
    } catch (error) {
      console.error('❌ Error updating permission:', error);
    }
  };

  const createMemberByProjectId = async () => {
    const email = newMemberEmail.trim().toLowerCase();
    if (!email) return setError('Email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Enter a valid email.');
    if (members.some(m => m.email.trim().toLowerCase() === email))
      return setError('Email already exists.');
    if (loading) return;

    setLoading(true);
    setError('');
    try {
      const payload = {
        projectId: projectId,
        contributors: [{ email, permission: 'can view' }],
      };
      await api.post(`/project/add-contributors/`, payload);
      setNewMemberEmail('');
      await getMembersByProjectId();
    } catch (err) {
      console.log('Error creating member:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMembersByProjectId = async () => {
    try {
      const response = await api.get(`/project/contributors/${projectId}`);
      console.log(projectId);

      const data = response.data?.contributors || [];

      const uniqueMembers = data.filter(
        (item, index, self) =>
          index === self.findIndex(t => t.email === item.email),
      );

      setMembers(uniqueMembers);
    } catch (err) {
      console.log('Error fetching members:', err);
    }
  };

  useEffect(() => {
    getMembersByProjectId();
  }, []);

  const renderMemberItem = ({ item, index }) => (
    <View style={styles.memberItem}>
      <Pressable
        style={styles.memberButton}
        onPress={() =>
          setActiveRoleMenu(activeRoleMenu === index ? null : index)
        }
      >
        <Text style={styles.memberEmail}>{item.email}</Text>

        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>{item.permission}</Text>
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
            onPress={() => setActiveRoleMenu(null)}
          >
            <Text style={styles.removeMenuText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.input}
              placeholder="Enter name of project"
              placeholderTextColor="#93a5b1"
              value={newMemberEmail}
              onChangeText={text => setNewMemberEmail(text)}
            />
            <Pressable
              style={styles.iconContainer}
              onPress={createMemberByProjectId}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <CirclePlus size={20} color="black" />
              )}
            </Pressable>
          </View>
        </View>

        {error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>
            {error}
          </Text>
        ) : null}

        <FlatList
          data={members}
          keyExtractor={(item, index) => `${item.email}-${index}`}
          renderItem={renderMemberItem}
          contentContainerStyle={{ paddingBottom: hp('1%') }}
        />
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
    paddingHorizontal: wp('6%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#14274A',
    paddingTop: hp('8%'),
    paddingBottom: hp('3.5%'),
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
    fontSize: wp('3.8%'),
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -wp('6%'),
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
    height: 60,
    backgroundColor: 'rgba(247, 248, 254, 1)',
    borderRadius: 50,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    width: wp('70%'),
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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

  iconContainer: {
    height: hp('6.7%'),
    flex: 1.5,
    marginLeft: wp('2%'),
    backgroundColor: 'rgba(247, 248, 254, 1)',
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
