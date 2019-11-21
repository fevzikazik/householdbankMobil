import React, { Component, createRef } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ScalingDrawer from 'react-native-scaling-drawer';

import NavigationService from '../navigator/NavigationService';

import ManageProfile from './ManageProfile';
import Accounts from './Accounts';
import AccountDetail from './AccountDetail';
import Transfer from './Transfer';
import TransferSelf from './TransferSelf';
import HGS from './HGS';
import CreditPrediction from './CreditPrediction';

import LeftMenu from '../navigator/LeftMenu';

const AppStack = createStackNavigator({
  ManageProfile: {
    screen: ManageProfile
  },
  Accounts: {
    screen: Accounts
  },
  AccountDetail: {
    screen: AccountDetail
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

const AppCon = createAppContainer(AppStack);
//export default createAppContainer(AppStack);

export const drawer = createRef();

const defaultScalingDrawerConfig = {
  scalingFactor: 0.65,
  minimizeFactor: 0.65,
  swipeOffset: 20
};

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

  };

  render() {
    return (
      <ScalingDrawer
        ref={drawer}
        content={<LeftMenu drawer={drawer} musteri={this.props.navigation.state.params.musteri} navigation={this.props.navigation} />}
        {...defaultScalingDrawerConfig}
        onClose={() => console.log('close')}
        onOpen={() => console.log('open')}
      >
        <AppCon
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          screenProps={{musteri:this.props.navigation.state.params.musteri}}
        />
      </ScalingDrawer>
    );
  }
}