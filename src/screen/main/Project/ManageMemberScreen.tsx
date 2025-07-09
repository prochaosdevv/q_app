import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { ChevronLeft, ChevronDown, CirclePlus } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../../../utils/api';

type Member = {
  email: string;
  role: 'view only' | 'can edit';
};
const ManageMembers = () => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [activeRoleMenu, setActiveRoleMenu] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Navigation
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  // Get Members by Project ID
  const getMembersByProjectId = useCallback(async () => {
    try {
      const response = await api.get(`/project/contributors/${id}`);
      const data = response.data?.contributors || [];
      setMembers(data);
    } catch (err) {
      console.log('Error fetching members:', err);
    }
  }, [id]);

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

  // Create Member by Project ID
  const createMemberByProjectId = async () => {
    const email = newMemberEmail.trim().toLowerCase();

    if (!email) return setError('Email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Enter a valid email.');

    try {
      setError('');
      const payload = {
        projectId: id,
        contributors: [{ email, permission: 'can view' }],
      };

      await api.post(`/project/add-contributors/`, payload);
      setNewMemberEmail('');
      await getMembersByProjectId(); // refresh only after success
    } catch (err) {
      console.log('Error creating member:', err);
      setError('Something went wrong. Try again.');
    }
  };

  // Render Item
  const renderMemberItem = ({
    item,
    index,
  }: {
    item: Member;
    index: number;
  }) => (
    <View key={index} style={styles.memberItem}>
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
            onPress={() => handleRemoveMember(index)}
          >
            <Text style={styles.removeMenuText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  useEffect(() => {
    getMembersByProjectId();
  }, [getMembersByProjectId]);
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

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: hp('10%') }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Manage members</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add contributors</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.input}
              placeholder="Enter name of project"
              placeholderTextColor="#93a5b1"
              value={newMemberEmail}
              onChangeText={text => {
                setNewMemberEmail(text);
                if (error) setError('');
              }}
            />
            <Pressable
              style={styles.iconContainer}
              onPress={createMemberByProjectId}
            >
              <CirclePlus size={20} color="black" />
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
      </ScrollView>
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
    padding: wp('7%'),
    paddingBottom: hp('10%'),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('6.8%'),
    color: 'rgba(50, 49, 49, 1)',
    marginBottom: hp('4%'),
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.9%'),
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: hp('1%'),
  },
  input: {
    height: hp('6.8%'),
    width: wp('70%'),
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
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.2%'),
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
    top: '110%',
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
    fontSize: wp('3.5%'),
    color: '#333',
  },
  removeMenuItem: {
    // paddingTop: 12,
  },
  removeMenuText: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.5%'),
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
