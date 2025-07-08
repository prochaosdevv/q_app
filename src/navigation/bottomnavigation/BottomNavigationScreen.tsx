import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';

import DashboardScreen from '../../screen/main/Project/DashboardScreen';
import PastReportScreen from '../../screen/main/Project/PastReportScreen';
import SettingScreen from '../../screen/main/Project/SettingScreen';

import clipActive from '../../assets/images/icons/clipActive.png';
import reportActive from '../../assets/images/icons/reportActive.png';
import settingActive from '../../assets/images/icons/settingActive.png';

import clipNormal from '../../assets/images/icons/clipRegular.png';
import reportNormal from '../../assets/images/icons/reportRegular.png';
import settingNormal from '../../assets/images/icons/settingRegular.png';

const Tab = createBottomTabNavigator();

// ✅ Custom Bottom Tab Bar using image icons
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    {
      name: 'dashboard',
      label: 'Tasks',
      activeIcon: clipActive,
      inactiveIcon: clipNormal,
    },
    {
      name: 'past-report',
      label: 'Past Reports',
      activeIcon: reportActive,
      inactiveIcon: reportNormal,
    },
    {
      name: 'setting',
      label: 'Settings',
      activeIcon: settingActive,
      inactiveIcon: settingNormal,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const iconSource = isFocused ? tab.activeIcon : tab.inactiveIcon;

        return (
          <Pressable
            key={index}
            onPress={() => navigation.navigate(tab.name)}
            style={styles.tab}
          >
            <Image
              source={iconSource}
              style={[
                styles.icon,
                isFocused && styles.activeIcon, // Apply larger size when active
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {tab.label}
            </Text>
            {isFocused && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
};

// ✅ Main Bottom Tab Navigation
const BottomNavigationScreen = () => {
  const route = useRoute();
  const { id } = route.params;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A2342" />

      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tab.Screen
          name="dashboard"
          component={DashboardScreen}
          initialParams={{ id }}
        />
        <Tab.Screen name="past-report" component={PastReportScreen} />
        <Tab.Screen name="setting" component={SettingScreen} />
      </Tab.Navigator>
    </>
  );
};

export default BottomNavigationScreen;

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp('12%'),
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    paddingHorizontal: hp('5%'),
    paddingBottom: hp('2%'),
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp('7.2%'),
    height: hp('4%'),
  },
  label: {
    fontSize: hp('1.8%'),
    color: '#0A2342',
    marginTop: hp('0.5%'),
    fontWeight: '400',
  },
  activeLabel: {
    fontWeight: '800',
  },
  underline: {
    height: 2,
    backgroundColor: '#0A2342',
    width: wp('8%'),
    marginTop: hp('0.3%'),
    borderRadius: 2,
  },
  activeIcon: {
    width: wp('8%'),
    height: hp('5%'),
  },
});
