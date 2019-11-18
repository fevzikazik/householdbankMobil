import React, { Component, createRef } from 'react';
import { createStackNavigator } from 'react-navigation';
import ScalingDrawer from 'react-native-scaling-drawer';

import NavigationService from './NavigationService';

import ManageProfile from '../screens/ManageProfile';
import Accounts from '../screens/Accounts';
import Transfer from '../screens/Transfer';
import TransferSelf from '../screens/TransferSelf';
import HGS from '../screens/HGS';
import CreditPrediction from '../screens/CreditPrediction';

import LeftMenu from './LeftMenu';

const AppStack = createStackNavigator({
  ManageProfile: {
    screen: ManageProfile
  },
  Accounts: {
    screen: Accounts
  },
  Transfer: {
    screen: Transfer
  },
  TransferSelf: {
    screen: TransferSelf
  },
  HGS: {
    screen: HGS
  },
  CreditPrediction: {
    screen: CreditPrediction
  }
},
{
  initialRouteName: 'Accounts',
});

export const drawer = createRef();

const defaultScalingDrawerConfig = {
  scalingFactor: 0.65,
  minimizeFactor: 0.65,
  swipeOffset: 20
};

export default class AppNavigation extends Component {
  render() {
    return (
      <ScalingDrawer
        ref={drawer}
        content={<LeftMenu drawer={drawer} />}
        {...defaultScalingDrawerConfig}
        onClose={() => console.log('close')}
        onOpen={() => console.log('open')}
      >
        <AppStack
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </ScalingDrawer>
    );
  }
}
