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
import CreateProject from './screen/main/Project/CreateProject';
import ManageMemberScreen from './screen/main/Project/ManageMemberScreen';
import ReportViewScreen from './screen/main/Project/ReportViewScreen';
import ReportDetailScreen from './screen/main/Project/ReportDetailScreen';

// Navigation Screen

import BottomNavigationScreen from './navigation/bottomnavigation/BottomNavigationScreen';
// import DrawerNavigationScreen from './navigation/drawernavigation/DrawerNavigationScreen';

// Zustand
import { useAuthStore } from './zustand/store/authStore';

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
          name="create-project"
          component={CreateProject}
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

        {/* <Stack.Screen name="drawernav" component={DrawerNavigationScreen} /> */}
        <Stack.Screen name="bottomnav" component={BottomNavigationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigationScreen;
