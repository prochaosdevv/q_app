import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import { ReportListItem } from '../../../components/ReportListItem';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Settings,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import jsw from '../../../assets/images/jsw_icon.png';
import WeeklyGoal from '../../../components/WeeklyGoal';
import { useState } from 'react';
import { useAuthStore } from '../../../zustand/store/authStore';
import PastReport from '../../../components/PastReport';
import { useProjectStore } from '../../../zustand/store/projectStore';

const PastReportScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const projectImage = useProjectStore(state => state.image);

  const { user } = useAuthStore.getState();
  const currentUserName = user?.fullname;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2342" />

      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hi,
          {currentUserName.length > 6
            ? currentUserName.substring(0, 6) + '...'
            : currentUserName}
        </Text>
        <View style={styles.img_container}>
          <Image
            source={{ uri: projectImage }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#141b41']}
            tintColor="#141b41"
          />
        }
      >
        <PastReport refreshing={refreshing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PastReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: '#14274A',
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
  },

  img_container: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E9EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    width: 48,
    height: 22,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
});
