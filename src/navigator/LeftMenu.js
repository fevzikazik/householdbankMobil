import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BgDashBoard from '../components/BgDashBoard';
import BackButton from '../components/BackButton';
import Profil from '../components/Profil';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';

import { drawer } from "../screens/Dashboard";
import NavigationService from './NavigationService';

export default class LeftMenu extends Component {
  constructor(props) {
    super(props);
    //alert('LeftMenu: ' + JSON.stringify(this.props.musteri));
  };

  render() {
    return (
      <BgDashBoard>
        <Profil />

        <Header>Hoşgeldiniz, {this.props.musteri.tamAdi}</Header>

        <Button mode="contained" onPress={() => {
          this.props.drawer.current.close();
          NavigationService.navigate('ManageProfile');
        }}>
          Profili Düzenle
    </Button>
        <Header>İşlem Menüsü</Header>

        <Button mode="outlined" onPress={() => {
          this.props.drawer.current.close();
          NavigationService.navigate('Accounts');
        }}>
          Hesaplarım
    </Button>
        <Button mode="outlined" onPress={() => {
          this.props.drawer.current.close();
          NavigationService.navigate('Transfer');
        }}>
          Havale Yap
    </Button>
        <Button mode="outlined" onPress={() => {
          this.props.drawer.current.close();
          NavigationService.navigate('TransferSelf');
        }}>
          Virman Yap
    </Button>
        <Button mode="outlined" onPress={() => {
          this.props.drawer.current.close();
          NavigationService.navigate('HGS');
        }}>
          HGS
    </Button>
        <Button mode="outlined" onPress={() => {
          this.props.drawer.current.close();
          NavigationService.navigate('CreditPrediction');
        }}>
          Kredi Tahmini
    </Button>
      </BgDashBoard>
    );
  }
}
