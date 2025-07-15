import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import WeeklyWeekReport from './WeeklyWeekReport';

export default function WeekViewScreen() {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14274A" barStyle="light-content" />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Week view</Text>
      </View>
      <WeeklyWeekReport id={id} refreshing={refreshing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#14274A',
    backgroundColor: '#14274A',
    paddingTop: hp('6%'),
    paddingBottom: hp('3%'),
  },
  backButton: {
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: hp('1.7%'),
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginLeft: -hp('2%'),
  },
});
