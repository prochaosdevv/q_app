import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ClipboardList, History, Settings } from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavigationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getActiveTab = () => {
    switch (route.name) {
      case 'dashboard':
        return 'Tasks';
      case 'past-reports':
        return 'Past Reports';
      case 'settings':
        return 'Settings';
      default:
        return '';
    }
  };

  const activeTab = getActiveTab();

  const tabs = [
    { name: 'Tasks', icon: ClipboardList },
    { name: 'Past Reports', icon: History },
    { name: 'Settings', icon: Settings },
  ];

  const handlePress = tab => {
    switch (tab) {
      case 'Tasks':
        navigation.navigate('dashboard');
        break;
      case 'Past Reports':
        navigation.navigate('past-reports');
        break;
      case 'Settings':
        navigation.navigate('settings');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.name;
        return (
          <Pressable
            key={index}
            style={styles.tab}
            onPress={() => handlePress(tab.name)}
          >
            <Icon color="#0A2342" size={hp('3%')} strokeWidth={2} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.name}
            </Text>
            {isActive && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp('9%'),
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: hp('1.6%'),
    color: '#0A2342',
    marginTop: hp('0.5%'),
    fontWeight: '400',
  },
  activeLabel: {
    fontWeight: '700',
  },
  underline: {
    height: 2,
    backgroundColor: '#0A2342',
    width: wp('8%'),
    marginTop: hp('0.3%'),
    borderRadius: 2,
  },
});

export default BottomNavigationScreen;
