import { createAppContainer } from 'react-navigation';
import  { createStackNavigator }  from 'react-navigation';

import {
  HomeScreen,
  RegisterScreen,
  Dashboard
} from './screens';

import LoginScreen from '../src/screens/LoginScreen';

const Router = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    Dashboard,
  },
  {
    initialRouteName: 'HomeScreen',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);
