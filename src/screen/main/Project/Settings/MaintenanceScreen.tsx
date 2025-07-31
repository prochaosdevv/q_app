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
import img from '../../../../assets/images/maintenance.png';

export default function MaintenanceScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={img} style={styles.image} />
      <Text style={styles.title}>Under Maintenance</Text>
      <Text style={styles.description}>
        Maintenance in progress. Thank you for your patience and support.
      </Text>
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
});
