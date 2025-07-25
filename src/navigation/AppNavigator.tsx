import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers/rootReducer';
import { getItem } from '../utils/storage';
import { loginSuccess } from '../store/actions/authAction';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import OtpVerification from '../screens/Auth/OtpVerification';
import Home from '../screens/Root/HomeScreen';
import OnboardingScreen from '../screens/Auth/IntroScreen';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  OtpVerification: { email: string };
  OnboardingScreen:undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getItem('authToken');
      if (token) {
        dispatch(loginSuccess({} as any, token));
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <>
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;