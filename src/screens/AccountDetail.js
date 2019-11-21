import React, { Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text, ScrollView } from 'react-native';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "./Dashboard";
import { Paragraph } from 'react-native-paper';

export default class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactionList: [],
      selectedAcc: this.props.navigation.state.params.selectedAcc,
      musteri: this.props.screenProps.musteri
    };

    //alert('accsD: ' + JSON.stringify(this.props));
  };

  componentDidMount = () => {
    this.GetTransactions();
  };

  static navigationOptions = {
    title: 'Hesap Detayları',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  GetTransactions = () => {
    let musteri = this.props.screenProps.musteri;
    let tcKimlikNo = musteri.tcKimlikNo;

    let secilenHesap = this.props.navigation.state.params.selectedAcc;

    fetch('https://householdwebapi.azurewebsites.net/api/Islem/getTransaction?hesapNo=' + musteri.hesapNo + '&hesapEkNo=' + secilenHesap.hesapEkNo,
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

  render() {
    return (
      <ScrollView>
        <Background>

          <Header>Hesap Detayları:</Header>
          <Paragraph>{this.state.musteri.hesapNo} : {this.state.selectedAcc.hesapEkNo}</Paragraph>
          <Paragraph>Bakiye : {this.state.selectedAcc.bakiye} TL</Paragraph>
          <Paragraph>Açılış Tarihi: {this.state.selectedAcc.acilisTarihi}</Paragraph>

          <Button mode="contained" onPress={() => pass} style={styles.button}>
            Para Yatır
        </Button>
          <Button mode="contained" onPress={() => pass} style={styles.button}>
            Para Çek
        </Button>
          <Button mode="contained" onPress={() => pass} style={styles.button}>
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

