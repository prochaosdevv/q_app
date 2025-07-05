import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {
  FileText,
  Settings as SettingsIcon,
  Lock,
  CircleHelp as HelpCircle,
  LogOut,
  ClipboardList,
  FilePen,
} from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../zustand/store/authStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import api from '../../../utils/api';
import jsw from '../../../assets/images/jsw_icon.png';
const SettingScreen = () => {
  const navigation = useNavigation();
  const [project, setProject] = useState([]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const logout = useAuthStore.getState().logout;
              await logout();

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
              Alert.alert(
                'Error',
                'Something went wrong while logging out...!!',
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };
  const getProject = async () => {
    try {
      const res = await api.get('/project/');
      const projects = res.data.projects;
      console.log('Projects : ', projects);
      setProject(projects);
    } catch (error) {
      console.log('Project Fetching Error', error);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable key={item._id} style={styles.projectItem}>
      <View style={styles.projectLogo_container}>
        <Image
          source={item.image ? { uri: item.image } : jsw}
          style={styles.projectLogo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.projectName}>{item.name}</Text>
    </Pressable>
  );

  useEffect(() => {
    getProject();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2342" />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Manage</Text>

        <Pressable
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('create-new-project');
          }}
        >
          <FilePen size={20} color="#141b41" />
          <Text style={styles.menuText}>Create New Project</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <SettingsIcon size={20} color="#141b41" />
          <Text style={styles.menuText}>Account management</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Lock size={20} color="#141b41" />
          <Text style={styles.menuText}>Change Password</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <HelpCircle size={20} color="#141b41" />
          <Text style={styles.menuText}>Help and Support</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <SettingsIcon size={20} color="#141b41" />
          <Text style={styles.menuText}>Terms and conditions</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={20} color="rgba(0, 11, 35, 1)" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </Pressable>

        <View style={styles.projectsSection}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Projects
          </Text>

          {project.length > 0 ? (
            <FlatList
              data={project}
              keyExtractor={item => item._id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  fontSize: wp('4.3%'),
                  color: '#141b41',
                  marginBottom: hp('1%'),
                  fontWeight: 'bold',
                  paddingHorizontal: 24,
                }}
              >
                You’re not connected to any project.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    fontWeight: '800',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(0, 11, 35, 1)',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'rgba(0, 11, 35, 1)',
  },
  projectsSection: {
    marginTop: 1,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f7f9fc',
    marginBottom: 1,
  },
  projectLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  projectLogo_container: {
    width: 50,
    height: 50,
    padding: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(232, 233, 234, 1)',
    // flex:1
  },
  projectLogoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectLogoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
  },
  projectName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(0, 11, 35, 1)',
    marginLeft: 12,
    fontWeight: 'bold',
  },
});
