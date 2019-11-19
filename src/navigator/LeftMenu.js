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

        <Header>Profilim</Header>

        <Button mode="contained" onPress={() => {
          NavigationService.navigate('ManageProfile', { musteri: this.props.musteri });
          this.props.drawer.current.close();
        }}>
          Yönet
    </Button>
        <Header>Menü</Header>

        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('Accounts', { musteri: this.props.musteri });
          this.props.drawer.current.close();
        }}>
          Hesaplarım
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('Transfer', { musteri: this.props.musteri });
          this.props.drawer.current.close();
        }}>
          Havale Yap
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('TransferSelf', { musteri: this.props.musteri });
          this.props.drawer.current.close();
        }}>
          Virman Yap
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('HGS', { musteri: this.props.musteri });
          this.props.drawer.current.close();
        }}>
          HGS
    </Button>
        <Button mode="outlined" onPress={() => {
          NavigationService.navigate('CreditPrediction', { musteri: this.props.musteri });
          this.props.drawer.current.close();
        }}>
          Kredi Tahmini
    </Button>
      </BgDashBoard>
    );
  }
}
