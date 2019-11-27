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

export default class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      transactionList: [],
      selectedAcc: this.props.navigation.state.params.selectedAcc,
      musteri: this.props.screenProps.musteri,
      aktifHesapSayisi: 0
    };

    //alert('accsD: ' + JSON.stringify(this.props));
  };

  componentWillUnmount() {
    const { navigation } = this.props
    navigation.state.params.refreshProps();
  }

  componentDidMount = () => {
    this.GetTransactions();
    this.aktifHesapSayisi();
  };

  static navigationOptions = {
    title: 'Hesap Detayları',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  updateAccountDetails = () => {
    let musteri = this.props.screenProps.musteri;
    let secilenHesap = this.props.navigation.state.params.selectedAcc;
    fetch('https://householdapi.azurewebsites.net/api/Hesap/getAccountBy?musTCKN=' + musteri.tcKimlikNo + '&hesapEkNo=' + secilenHesap.hesapEkNo,
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
    let musteri = this.props.screenProps.musteri;
    let secilenHesap = this.props.navigation.state.params.selectedAcc;

    fetch('https://householdapi.azurewebsites.net/api/Islem/getTransaction?hesapNo=' + musteri.hesapNo + '&hesapEkNo=' + secilenHesap.hesapEkNo,
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

  aktifHesapSayisi = () => {
    let Customer = this.props.screenProps.musteri;

    let tcKimlikNo = Customer.tcKimlikNo;

    fetch('https://householdapi.azurewebsites.net/api/Hesap/getActiveAccounts/' + tcKimlikNo,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        if (responseData['Data'] != null) {
          this.setState({ aktifHesapSayisi: responseData['Data'].length });
        }
        else{
          this.setState({ aktifHesapSayisi: 0 });
        }
      })
      .catch((error) => {
        alert(error);
      })
  }

  hesapKapat = () => {

    if (this.state.aktifHesapSayisi == 1) {
      alert('Son aktif hesabınızı kapatamazsınız!');
      return;
    }
    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/Hesap/Put/' + this.state.selectedAcc.hesapEkNo,
      {
        method: 'PUT',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapID': this.state.selectedAcc.hesapID,
          'hesapEkNo': this.state.selectedAcc.hesapEkNo,
          'musTCKN': this.state.selectedAcc.musTCKN,
          'aktifmi': 0,
          'acilisTarihi': this.state.selectedAcc.acilisTarihi,
          'kapanisTarihi': moment().format("YYYY-MM-DD HH:mm:ss"),
          'bakiye': 0
        })
      })

      .then((response) => response.json())
      .then((responseData) => {
        var result = responseData['Result'];
        this.setState({ loading: false });
        if (result == "1") {
          this.props.navigation.goBack();
          alert('Hesap Kapatıldı!');
        }
        else {
          alert('Hesap kapatılma sırasında Hata Oluştu!');
        }
      })
      .catch((error) => {
        alert('HesapKapatma:Hata: ' + error);
      })
  };


  kontrolBakiye = () => {
    if (this.state.selectedAcc.bakiye > 0) {
      return <Button mode="contained" 
      onPress={() => this.props.navigation.navigate('WithdrawMoney', { selectedAcc: this.state.selectedAcc, onBack: this.onBack.bind(this) })} 
      style={styles.button}> Para Çek </Button>
    }
    else {
      return <Button mode="contained" onPress={this.hesapKapat.bind(this)} style={styles.button}> Hesabı Kapat </Button>
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

          <Header>Hesap Detayları:</Header>
          <Paragraph>{this.state.musteri.hesapNo} : {this.state.selectedAcc.hesapEkNo}</Paragraph>
          <Paragraph>Bakiye : {this.state.selectedAcc.bakiye} TL</Paragraph>
          <Paragraph>Açılış Tarihi: {this.state.selectedAcc.acilisTarihi}</Paragraph>

          <Button mode="contained" 
          onPress={() => this.props.navigation.navigate('DepositMoney', { selectedAcc: this.state.selectedAcc, onBack: this.onBack.bind(this) })} 
          style={styles.button}>
            Para Yatır
          </Button>
          {this.kontrolBakiye()}
          <Button mode="contained" onPress={() => this.props.navigation.goBack() } style={styles.button}>
            Hesaplarıma Geri Dön
          </Button>

          <Header>Hesap Hareketleri:</Header>
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

