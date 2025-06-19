import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { ClipboardList, FileText, Settings2 } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const BottomNavigationScreen = () => {
  const navigate = useNavigation();
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Pressable
          style={[styles.footerTab, styles.footerTabActive]}
          onPress={() => navigate.navigate('dashboard')}
        >
          <ClipboardList size={wp('5%')} color="#141b41" />
          <Text style={[styles.footerTabText, styles.footerTabTextActive]}>
            Tasks
          </Text>
        </Pressable>

        <Pressable
          style={styles.footerTab}
          onPress={() => navigate.navigate('past-reports')}
        >
          <FileText size={wp('5%')} color="#93a5b1" />
          <Text style={styles.footerTabText}>Past Reports</Text>
        </Pressable>

        <Pressable
          style={styles.footerTab}
          onPress={() => navigate.navigate('settings')}
        >
          <Settings2 size={wp('5%')} color="#93a5b1" />
          <Text style={styles.footerTabText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BottomNavigationScreen;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: hp('2%'), // gap from bottom
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerContent: {
    flexDirection: 'row',
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: hp('2%'),
  },
  footerTab: {
    alignItems: 'center',
  },
  footerTabActive: {
    borderTopWidth: 2,
    borderTopColor: '#141b41',
    paddingTop: hp('1%'),
  },
  footerTabText: {
    fontFamily: 'Inter-Regular',
    fontSize: wp('3.2%'),
    color: '#93a5b1',
    marginTop: hp('0.5%'),
  },
  footerTabTextActive: {
    color: '#141b41',
    fontFamily: 'Inter-Medium',
  },
});
