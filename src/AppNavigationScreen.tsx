import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screen/auth/Splash/SplashScreen';
import OnBoardingScreen from './screen/auth/OnBoarding/OnBoardingScreen';
import LoginScreen from './screen/auth/Login/LoginScreen';
import SignupScreen from './screen/auth/Signup/SignupScreen';
import OtpScreen from './screen/auth/OtpVerification/OtpScreen';
import DrawerNavigationScreen from './navigation/drawernavigation/DrawerNavigationScreen';
import ForgotPasswordScreen from './screen/auth/ForgotPassword/ForgotPasswordScreen';
import ProjectScreen from './screen/main/Project/ProjectScreen';
import DashboardScreen from './screen/main/Project/DashboardScreen';
import CreateNewProject from './screen/main/Project/CreateNewProject';
import DailyReportScreen from './screen/main/Project/DailyReportScreen';
import CreateProject from './screen/main/Project/CreateProject';
import ManageMemberScreen from './screen/main/Project/ManageMemberScreen';
import PastReportScreen from './screen/main/Project/PastReportScreen';
import ReportViewScreen from './screen/main/Project/ReportViewScreen';
import ReportDetailScreen from './screen/main/Project/ReportDetailScreen';
import SettingScreen from './screen/main/Project/SettingScreen';
import BottomNavigationScreen from './navigation/bottomnavigation/BottomNavigationScreen';
const Stack = createNativeStackNavigator();
const AppNavigationScreen = () => {
  const [showSplashScreen, setshowSplashScreen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setshowSplashScreen(false);
    }, 2000);
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          statusBarHidden: false,
          statusBarStyle: 'dark',
        }}
      >
        {showSplashScreen ? (
          <Stack.Screen
            name="splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : null}
        <Stack.Screen
          name="onboarding"
          component={OnBoardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="otp"
          component={OtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgot-password"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="projects"
          component={ProjectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="dashboard"
          component={DashboardScreen}
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
          name="past-reports"
          component={PastReportScreen}
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
          name="settings"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="drawernav" component={DrawerNavigationScreen} />
        <Stack.Screen name="bottomnav" component={BottomNavigationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigationScreen;
