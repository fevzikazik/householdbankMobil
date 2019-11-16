import { createAppContainer } from 'react-navigation';
import  { createStackNavigator }  from 'react-navigation';

import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  Dashboard
} from './screens';

const Router = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    Dashboard,
  },
  {
    initialRouteName: 'Dashboard',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);
