import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import jsw from '../../../assets/images/jsw.png';
import { useNavigation } from '@react-navigation/native';
const ProjectScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSpace} />

        <View style={styles.header}>
          <Text style={styles.title}>You’re connect to projects</Text>
          <Text style={styles.subtitle}>
            Projects linked to
            <Text style={styles.email}>emailname@gmail.com</Text>
          </Text>
        </View>
        <Pressable
          style={styles.projectCard}
          onPress={() => navigation.navigate('dashboard')}
        >
          <View style={styles.img_container}>
            <Image
              source={typeof jsw === 'string' ? { uri: jsw } : jsw}
              style={styles.projectLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>Wales Project name</Text>
            <Text style={styles.projectName}>2025</Text>
            <Text style={styles.projectDate}>Jan 2025</Text>
          </View>
        </Pressable>
        <Text style={styles.orText}>or</Text>
        <Pressable
          style={styles.createButton}
          onPress={() => navigation.navigate('create-new-project')}
        >
          <Text style={styles.createButtonText}>Create new project</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: hp('2%'),
    paddingTop: hp('2%'),
  },
  topSpace: {
    height: hp('6%'),
  },
  header: {
    marginBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('7%'),
    color: '#141b41',
    marginBottom: hp('1%'),
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('4.1%'),
    color: '#000',
    lineHeight: hp('2.5%'),
  },

  email: {
    fontFamily: 'Inter-Medium',
    color: '#000',
    fontWeight: 'bold',
  },

  projectCard: {
    flexDirection: 'row',
    backgroundColor: '#f7f9fc',
    borderRadius: hp('2%'),
    padding: hp('2%'),
    marginBottom: hp('2%'),
    borderColor: 'rgba(239, 239, 240, 1)',
    borderWidth: 1,
    marginTop: hp('2%'),
  },
  projectLogo: {
    width: wp('10%'),
    height: hp('10%'),
    borderRadius: hp('20%'),
  },
  img_container: {
    backgroundColor: 'rgba(239, 237, 237, 1)',
    height: hp('12%'),
    width: wp('20%'),
    marginRight: hp('2%'),
    borderRadius: hp('2%'),
    padding: hp('0.1%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontFamily: 'Inter-Bold',
    fontSize: hp('2%'),
    color: 'black',
    fontWeight: 'bold',
    // marginBottom: 4,
  },
  projectDate: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('1.5%'),
    color: 'rgba(137, 139, 141, 1)',
    marginTop: hp('1%'),
    fontWeight: 'bold',
  },
  orText: {
    fontFamily: 'Inter-Regular',
    fontSize: hp('2%'),
    color: '#666',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  createButton: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    borderRadius: hp('50%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: hp('2%'),
    color: '#fff',
  },
});
