import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import SplashGif from '../../../assets/images/splash.gif';
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f5f6ff" barStyle="dark-content" />
      <FastImage
        source={SplashGif}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9E8E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp('100%'),
    height: hp('20%'),
  },
});
