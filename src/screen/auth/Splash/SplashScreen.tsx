import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <Text style={styles.subTitle}>Project management app</Text>
        <Text style={styles.title}>Quentessentials</Text>
      </View>

      <Text style={styles.version}>v1.0</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4ede9',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp('20%'),
  },
  logoContainer: {
    flex: 2.5,
    alignItems: 'center',
  },
  logo: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    backgroundColor: '#141b41',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('4%'),
  },
  logoText: {
    color: '#ffffff',
    fontSize: wp('7%'),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: wp('4.2%'),
    color: '#333',
    marginBottom: hp('1%'),
    fontFamily: 'Inter-Regular',
  },
  title: {
    fontSize: wp('8%'),
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
  },
  version: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#666',
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
});
