import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BgDashBoard from '../components/BgDashBoard';
import BackButton from '../components/BackButton';
import Profil from '../components/Profil';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';

import { drawer } from "../navigator/AppNavigation.js";
import NavigationService from './NavigationService';

class LeftMenu extends Component {

  render() {
    return (
      <BgDashBoard>
        <Profil />

        <Header>Profilim</Header>

        <Button mode="contained" onPress={() => {
          NavigationService.navigate('ManageProfile');
          this.props.drawer.current.close();
        }}>
          Yönet
    </Button>
        <Header>Menü</Header>

        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('Accounts');
          this.props.drawer.current.close();
        }}>
          Hesaplarım
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('Transfer');
          this.props.drawer.current.close();
        }}>
          Havale Yap
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('TransferSelf');
          this.props.drawer.current.close();
        }}>
          Virman Yap
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('HGS');
          this.props.drawer.current.close();
        }}>
          HGS
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('CreditPrediction');
          this.props.drawer.current.close();
        }}>
          Kredi Tahmini
    </Button>
      </BgDashBoard>
    );
  }
}

export default LeftMenu;
