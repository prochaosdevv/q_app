import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import img from '../assets/images/maintenance.png';

export default function TokenNotFoundScreen() {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate('login');
  };
  return (
    <View style={styles.container}>
      <Image source={img} style={styles.image} />
      <Text style={styles.title}>Token Expired</Text>
      <Text style={styles.description}>
        Your token has expired. Please log in again to continue using the app.
      </Text>
      <Pressable style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  image: {
    height: hp('35%'),
    width: wp('65%'),
    resizeMode: 'contain',
  },
  title: {
    color: '#141b41',
    fontWeight: '900',
    fontSize: hp('3.2%'),
    textAlign: 'center',
    marginBottom: hp('1.2%'),
    fontFamily: 'Inter-Bold',
  },
  description: {
    color: '#666',
    fontSize: hp('1.9%'),
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: hp('3%'),
    marginBottom: hp('4%'),
    fontFamily: 'Inter-Regular',
  },
  btn: {
    backgroundColor: 'rgba(24, 20, 70, 1)',
    height: hp('6.8%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
    width: wp('90%'),
  },
  btnText: {
    fontFamily: 'Inter-Medium',
    fontSize: wp('4%'),
    color: '#fff',
    fontWeight: '700',
  },
});
