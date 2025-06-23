import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.subTitle}>Project management app</Text>

        <View style={styles.titleWrapper}>
          <Text style={styles.q}>Q</Text>
          <Text style={styles.titleRest}>uentessential</Text>
        </View>

        <View style={[styles.titleWrapper, { marginTop: -10 }]}>
          <Text style={styles.s}>S</Text>
          <Text style={styles.titleRestGreen}>urveying</Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    alignItems: 'center',
  },
  subTitle: {
    fontSize: wp('4%'),
    color: 'black',
    marginBottom: hp('1.5%'),
    fontWeight: '700',
    fontFamily: 'Inter-Regular',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  q: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#121622',
    fontFamily: 'Inter-Bold',
  },
  s: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#121622',
    fontFamily: 'Inter-Bold',
  },
  titleRest: {
    fontSize: wp('9%'),
    fontWeight: '500',
    color: '#333',
    marginLeft: wp('1%'),
    fontFamily: 'Inter-Regular',
  },
  titleRestGreen: {
    fontSize: wp('9%'),
    fontWeight: '500',
    color: '#20a393',
    marginLeft: wp('1%'),
    fontFamily: 'Inter-Regular',
  },
});
