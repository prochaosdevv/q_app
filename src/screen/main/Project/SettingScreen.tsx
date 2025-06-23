import React from 'react';
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
import jsw from '../../../assets/images/jsw_icon.png';
import BottomNavigationScreen from '../../../navigation/bottomnavigation/BottomNavigationScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../zustand/store/authStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const SettingScreen = () => {
  const navigation = useNavigation();
  const projects = [
    {
      id: '1',
      name: 'JSW Big project',
      logo: jsw,
    },
    {
      id: '2',
      name: 'Wales House',
      logo: null,
    },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" />
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
          <Text style={styles.sectionTitle}>Projects</Text>

          {projects.map(project => (
            <Pressable key={project.id} style={styles.projectItem}>
              {/* {project.logo ? ( */}

              <View style={styles.projectLogo_container}>
                <Image
                  source={
                    typeof project.logo === 'string'
                      ? { uri: project?.logo }
                      : project.logo
                  }
                  style={styles.projectLogo}
                  resizeMode="contain"
                />
              </View>

              {/* ) : ( */}
              {/* <View style={styles.projectLogoPlaceholder}>
                  <Text style={styles.projectLogoText}>
                    {project.name.charAt(0)}
                  </Text>
                </View> */}
              {/* )} */}
              <Text style={styles.projectName}>{project.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavigationScreen />
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
    marginTop: 20,
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
    marginTop: 24,
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
