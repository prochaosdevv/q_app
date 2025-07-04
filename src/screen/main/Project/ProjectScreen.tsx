import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  StatusBar,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import jsw from '../../../assets/images/jsw.png';
import { useNavigation } from '@react-navigation/native';
import api from '../../../utils/api';
import { useAuthStore } from '../../../zustand/store/authStore';
import moment from 'moment';

const ProjectScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore.getState();
  const [project, setProject] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const currentEmail = user?.email;
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
  const onRefresh = async () => {
    setRefreshing(true);
    await getProject(); // refresh project list
    setRefreshing(false);
  };

  useEffect(() => {
    getProject();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.projectCard}
      onPress={() => navigation.navigate('bottom')}
    >
      <View style={styles.img_container}>
        <Image
          source={item.image ? { uri: item.image } : jsw}
          style={styles.projectLogo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectName}>{item.description}</Text>
        <Text style={styles.projectDate}>
          {moment(item.createdAt).format('MMM YYYY')}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.topSpace} />

          <View style={styles.header}>
            {project.length > 0 ? (
              <>
                <Text style={styles.title}>You’re connected to projects</Text>
                <Text style={styles.subtitle}>
                  Projects linked to
                  <Text style={styles.email}> {currentEmail}</Text>
                </Text>
              </>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.title]}>
                  You’re not connected to any project
                </Text>
                <Text style={styles.subtitle}>
                  Create a project linked to
                  <Text style={styles.email}> {currentEmail}</Text>
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.middleSection}>
          {project.length > 0 ? (
            <>
              <FlatList
                data={project}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
              />
              <Text style={styles.orText}>or</Text>
              <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate('create-new-project')}
              >
                <Text style={styles.createButtonText}>Create new project</Text>
              </Pressable>
            </>
          ) : (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.orText}>or</Text>
              <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate('create-new-project')}
              >
                <Text style={styles.createButtonText}>Create new project</Text>
              </Pressable>
            </View>
          )}
        </View>
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
    paddingHorizontal: wp('5%'),
  },
  topSection: {
    flex: 0.22,
    justifyContent: 'center',
  },
  middleSection: {
    flex: 0.65,
  },

  topSpace: {
    height: hp('5%'),
  },
  header: {
    marginBottom: hp('0.1'),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: wp('9%'),
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
    marginBottom: hp('1%'),
    borderColor: 'rgba(239, 239, 240, 1)',
    borderWidth: 1,
  },
  projectLogo: {
    width: wp('10%'),
    height: hp('10%'),
    borderRadius: hp('1%'),
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
