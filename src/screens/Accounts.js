import React, { useState, Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text, ScrollView } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "./Dashboard";
import moment from 'moment';
import Loader from '../core/loader';

export default class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      accs: [],
      allAccs: []
    };

    //alert('accs: ' + JSON.stringify(this.props));
  };

  componentDidMount = () => {
    this.aktifHesaplariGetir();
    this.tumHesaplariGetir();
  };

  static navigationOptions = {
    title: 'Hesaplarım',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  hesapOlustur = () => {
    const { allAccs } = this.state;
    var max = allAccs[0]['hesapEkNo'];
    for (var i = 0; i < allAccs.length; i++) {
      if (max == null || parseInt(allAccs[i]['hesapEkNo']) > parseInt(max))
        max = allAccs[i]['hesapEkNo'];
    }
    var yeniHesapEkNo = parseInt(max) + 1;
    //alert(yeniHesapEkNo);
    this.setState({ loading: true });
    return fetch('https://householdapi.azurewebsites.net/api/Hesap/Post',
      {
        method: 'POST',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapEkNo': yeniHesapEkNo,
          'musTCKN': this.props.screenProps.musteri.tcKimlikNo,
          'aktifmi': 1,
          'acilisTarihi': moment().format("YYYY-MM-DD HH:mm:ss"),
          'bakiye': 0
        })
      })

      .then((response) => response.json())
      .then((responseData) => {
        var result = responseData['Result'];
        if (result == "1") {
          this.aktifHesaplariGetir();
          this.tumHesaplariGetir();
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
          alert("HesapOluştur: API ile bağlantı kurulamadı!");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert("Hata: " + error);
      })
  };

  tumHesaplariGetir = () => {

    fetch('https://householdapi.azurewebsites.net/api/Hesap/Get/' + this.props.screenProps.musteri.tcKimlikNo,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        var accListCount = responseData['Data'].length;
        //alert(accListCount);
        var accList = responseData['Data'];
        this.setState({ allAccs: accList });
        //alert(accList);
      })
      .catch((error) => {
        alert(error);
      })
  }

  aktifHesaplariGetir = () => {
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
        var accListCount = responseData['Data'].length;
        //alert(accListCount);
        var accList = responseData['Data'];
        this.setState({ accs: accList });
        //alert(accList);
      })
      .catch((error) => {
        alert(error);
      })
  }
  
  refreshProps = () => {
    this.aktifHesaplariGetir();
    this.tumHesaplariGetir();
  }

  render() {
    return (
      <ScrollView>
        <Background>
          <Loader
            loading={this.state.loading} />

          <Header>Yeni Hesap Aç</Header>

          <Button mode="contained" onPress={this.hesapOlustur.bind(this)} style={styles.button}>
            Hesap Aç
        </Button>

          <Header>Hesaplarım:</Header>
          <FlatList
            style={{ minWidth: 300 }}
            data={this.state.accs}
            renderItem={({ item }) => (
              <ListItem
                topDivider
                onPress={() => this.props.navigation.navigate('AccountDetail', { selectedAcc: item, refreshProps: this.refreshProps.bind(this) })}
                title={item.hesapEkNo}
                subtitle={'Bakiye: ' + item.bakiye + ' TL'}
                rightAvatar={{
                  source: 'https://cdn3.iconfinder.com/data/icons/basicsiconic/512/right-512.png' && { uri: 'https://cdn3.iconfinder.com/data/icons/basicsiconic/512/right-512.png' }
                }}
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

