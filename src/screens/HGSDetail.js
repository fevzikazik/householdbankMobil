import React, { Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text, ScrollView } from 'react-native';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "./Dashboard";
import { Paragraph } from 'react-native-paper';
import moment from 'moment';
import Loader from '../core/loader';

export default class HGSDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      transactionList: [],
      selectedAcc: this.props.navigation.state.params.selectedAcc,
      musteri: this.props.screenProps.musteri
    };

    //alert('accsD: ' + JSON.stringify(this.props));
  };

  componentWillUnmount() {
    const { navigation } = this.props
    navigation.state.params.refreshProps();
  }

  componentDidMount = () => {
    this.GetTransactions();
  };

  static navigationOptions = {
    title: 'HGS Üyelik Bilgileri',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  updateAccountDetails = () => {
    fetch('https://householdapi.azurewebsites.net/api/HGS/getAccountBy?hgsID=' + this.props.navigation.state.params.selectedAcc.hgsID,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        var acc = responseData['Data'][0];
        this.setState({ selectedAcc: acc });
      })
      .catch((error) => {
        alert(error);
      })
  }

  GetTransactions = () => {
    //var varmi = str.includes("world");
    let musteri = this.props.screenProps.musteri;
    let secilenHesap = this.props.navigation.state.params.selectedAcc;

    fetch('https://householdapi.azurewebsites.net/api/Islem/getTransactionHGS?hesapNo=' + musteri.hesapNo + '&plaka=' + secilenHesap.plaka,
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
          //alert(JSON.stringify(resp['Data']));

          //var transactionListCount = resp['Data'].length;
          //alert(accListCount);
          var transactions = resp['Data'];
          this.setState({ transactionList: transactions.reverse() });
          //alert(accList);


        }
        else {
          //islem yok!
        }
      })
      .catch((error) => {
        alert(error);
      })
  }

  uyelikIptal = () => {
    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/HGS/Delete/' + this.state.selectedAcc.hgsID,
      {
        method: 'DELETE',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        var result = responseData['Result'];
        this.setState({ loading: false });
        if (result == "1") {
          this.props.navigation.goBack();
          alert('Üyelik İptal Edildi!');
        }
        else {
          alert('Üyelik iptali sırasında Hata Oluştu!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert('Üyelikİptal:Hata: ' + error);
      })
  };

  kontrolBakiye = () => {
    if (this.state.selectedAcc.bakiye > 0) {
      return <Button mode="contained" 
      onPress={() => this.props.navigation.navigate('WithdrawMoneyHGS', { selectedAcc: this.state.selectedAcc, onBack: this.onBack.bind(this) })} 
      style={styles.button}> Bakiye Aktar </Button>
    }
    else {
      return <Button mode="contained" onPress={this.uyelikIptal.bind(this)} style={styles.button}> Üyeliği İptal Et </Button>
    }
  }

  onBack = () => {
    const { navigation } = this.props
    navigation.state.params.refreshProps();
    this.updateAccountDetails();
    this.GetTransactions();
  }

  render() {
    return (
      <ScrollView>
        <Background>
        <Loader
          loading={this.state.loading} />

          <Header>Üyelik Bilgileri:</Header>
          <Paragraph>HGS ID : {this.state.selectedAcc.hgsID}</Paragraph>
          <Paragraph>Plaka : {this.state.selectedAcc.plaka}</Paragraph>
          <Paragraph>Bakiye : {this.state.selectedAcc.bakiye} TL</Paragraph>

          <Button mode="contained" 
          onPress={() => this.props.navigation.navigate('DepositMoneyHGS', { selectedAcc: this.state.selectedAcc, onBack: this.onBack.bind(this) })} 
          style={styles.button}>
            Bakiye Yükle
          </Button>
          {this.kontrolBakiye()}
          <Button mode="contained" onPress={() => this.props.navigation.goBack() } style={styles.button}>
            Üyeliklerime Geri Dön
          </Button>

          <Header>HGS Hesabı Hareketleri:</Header>
          <FlatList
            style={{ minWidth: 300 }}
            data={this.state.transactionList}
            renderItem={({ item }) => (
              <ListItem
                topDivider
                onPress={() => alert('İşlem ID: ' + item.islemID + '\nTarih: ' + item.tarih + '\nTipi: ' + item.islemTipi + '\nPlatform: ' + item.platform + '\nAçıklaması:\n ' + item.aciklama)}
                title={item.aciklama}
                subtitle={item.islemTipi}
                bottomDivider
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </Background>
      </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

