import React, { Component, createRef } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ScalingDrawer from 'react-native-scaling-drawer';

import NavigationService from '../navigator/NavigationService';

import ManageProfile from './ManageProfile';
import Accounts from './Accounts';
import AccountDetail from './AccountDetail';
import DepositMoney from './DepositMoney';
import WithdrawMoney from './WithdrawMoney';
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
  DepositMoney: {
    screen: DepositMoney
  },
  WithdrawMoney: {
    screen: WithdrawMoney
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

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}


export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guncelMusteri: this.props.navigation.state.params.musteri
    };
  };

  componentDidMount = () => {
    this.guncelMusteriBilgisi();
  };

  guncelMusteriBilgisi = async () => {
    return fetch('https://householdapi.azurewebsites.net/api/Musteri/Get/' + this.props.navigation.state.params.musteri.tcKimlikNo,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((resp) => {
        var result = resp['Result'];
        if (result == "1") {
          var gelenMusteri = resp['Data'][0];
          //alert(JSON.stringify(gelenMusteri));
          this.setState({ guncelMusteri: gelenMusteri });
        }
        else {
          alert('API ile bağlantı kurulamadı!');
        }
      })
      .catch((error) => {
        alert('Hata Oluştu: ' + error);
      })
  };
  render() {
    return (
      <ScalingDrawer
        ref={drawer}
        content={<LeftMenu drawer={drawer} musteri={this.state.guncelMusteri} />}
        {...defaultScalingDrawerConfig}
        onClose={() => console.log('close')}
        onOpen={this.guncelMusteriBilgisi.bind(this)}
      >
        <AppCon
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prevState, currentState, action) => {
            const currentRouteName = getActiveRouteName(currentState);
            const previousRouteName = getActiveRouteName(prevState);
            //console.log(previousRouteName + ':' +  currentRouteName);

            if (currentRouteName === 'ManageProfile') {
              //this.guncelMusteriBilgisi();
            }
          }}
          screenProps={{ musteri: this.state.guncelMusteri }}
        />
      </ScalingDrawer>
    );
  }
}