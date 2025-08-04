import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useProjectStore } from '../../../zustand/store/projectStore';
import ReportListItem from '../../../components/ReportListItem';

const PastReportScreen = () => {
  const projectImage = useProjectStore(state => state.image);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2342" />

      <View style={styles.header}>
        <Text style={styles.greeting}>Past Reports</Text>
        <View style={styles.img_container}>
          <Image
            source={{ uri: projectImage }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
      </View>
      <ReportListItem />
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
});
