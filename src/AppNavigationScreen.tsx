import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from './screen/auth/Splash/SplashScreen';
import OnBoardingScreen from './screen/auth/OnBoarding/OnBoardingScreen';
import LoginScreen from './screen/auth/Login/LoginScreen';
import SignupScreen from './screen/auth/Signup/SignupScreen';
import OtpScreen from './screen/auth/OtpVerification/OtpScreen';
import ForgotPasswordScreen from './screen/auth/ForgotPassword/ForgotPasswordScreen';

// Main Screens
import ProjectScreen from './screen/main/Project/ProjectScreen';
import CreateNewProject from './screen/main/Project/CreateNewProject';
import DailyReportScreen from './screen/main/Project/DailyReportScreen';
import ManageMemberScreen from './screen/main/Project/ManageMemberScreen';
import ReportViewScreen from './screen/main/Project/ReportViewScreen';
import ReportDetailScreen from './screen/main/Project/ReportDetailScreen';

// Navigation Screen

import BottomNavigationScreen from './navigation/bottomnavigation/BottomNavigationScreen';
// import DrawerNavigationScreen from './navigation/drawernavigation/DrawerNavigationScreen';

// Zustand
import { useAuthStore } from './zustand/store/authStore';
import EditDailyReportScreen from './screen/main/Project/EditDailyReportScreen';
import AccountManagementScreen from './screen/main/Project/Settings/AccountManagementScreen';
import ChangePasswordScreen from './screen/main/Project/Settings/ChangePasswordScreen';
import HelpAndSupportScreen from './screen/main/Project/Settings/HelpAndSupportScreen';
import TermsAndConditionScreen from './screen/main/Project/Settings/TermsAndConditionScreen';
import WeekViewScreen from './screen/main/Project/WeekViewScreen';
import WeeklyWeekReport from './screen/main/Project/WeeklyWeekReport';
import OtpVerificationScreen from './screen/auth/ForgotPassword/OtpVerificationScreen';
import CreateNewPasswordScreen from './screen/auth/ForgotPassword/CreateNewPasswordScreen';

const Stack = createNativeStackNavigator();
const AppNavigationScreen = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const userEmail = useAuthStore(state => state.user?.email);
  const rehydrate = useAuthStore(state => state.rehydrate);
  useEffect(() => {
    const initialize = async () => {
      await rehydrate();
      setTimeout(() => {
        setShowSplashScreen(false);
      }, 4000);
    };
    initialize();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showSplashScreen ? (
          <Stack.Screen
            name="splash"
            component={SplashScreen}
            options={{ headerShown: false, statusBarStyle: 'dark' }}
          />
        ) : null}
        {userEmail ? (
          <Stack.Screen
            name="projects"
            component={ProjectScreen}
            options={{ headerShown: false, statusBarStyle: 'dark' }}
          />
        ) : (
          <Stack.Screen
            name="onboarding"
            component={OnBoardingScreen}
            options={{ headerShown: false, statusBarStyle: 'dark' }}
          />
        )}
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false, statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="signup"
          component={SignupScreen}
          options={{ headerShown: false, statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="otp"
          component={OtpScreen}
          options={{ headerShown: false, statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="forgot-password"
          component={ForgotPasswordScreen}
          options={{ headerShown: false, statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="otp-verify"
          component={OtpVerificationScreen}
          options={{ headerShown: false, statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="create-new-password"
          component={CreateNewPasswordScreen}
          options={{ headerShown: false, statusBarStyle: 'dark' }}
        />

        {/* Auth Route */}
        <Stack.Screen
          name="bottom"
          component={BottomNavigationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="daily-report"
          component={DailyReportScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="create-new-project"
          component={CreateNewProject}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="manage-members"
          component={ManageMemberScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="report-view"
          component={ReportViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="report-details"
          component={ReportDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="edit-daily-report"
          component={EditDailyReportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="week-view"
          component={WeekViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="weekly-week-report"
          component={WeeklyWeekReport}
          options={{ headerShown: false }}
        />
        {/* Settings Screens */}
        <Stack.Screen
          name="account-management"
          component={AccountManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="change-password"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="help-and-support"
          component={HelpAndSupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="terms-and-condition"
          component={TermsAndConditionScreen}
          options={{ headerShown: false }}
        />

        {/* <Stack.Screen name="drawernav" component={DrawerNavigationScreen} /> */}
        <Stack.Screen name="bottomnav" component={BottomNavigationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigationScreen;
