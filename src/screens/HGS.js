import React, { useState, Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text, ScrollView } from 'react-native';
import TextInput from '../components/TextInput';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "./Dashboard";
import moment from 'moment';
import Loader from '../core/loader';
import PTRView from 'react-native-pull-to-refresh';
import {
  plakaValidator
} from '../core/utils';


export default class HGS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      accs: [],
      allAccs: [],
      yeniPlaka: '',
      yeniPlakaError: ''
    };

    //alert('accs: ' + JSON.stringify(this.props));
  };

  _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); this.refreshProps(); }, 1000)
    });
  }

  componentDidMount = () => {
    this.aktifUyelikleriGetir();
    this.tumUyelikleriGetir();
  };

  static navigationOptions = {
    title: 'HGS',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  uyelikOlustur = () => {

    const yeniPlakaError = plakaValidator(this.state.yeniPlaka);

    if (yeniPlakaError) {
      this.setState({ yeniPlakaError })
      return;
    }

    var essizMi = true;
    var accList = this.state.allAccs;
    if (accList != null) {
      for (let acc of accList) {
        if (acc.plaka == this.state.yeniPlaka.toUpperCase()) {
          essizMi = false;
          break;
        }
      }
    }

    if (essizMi == false) {
      this.setState({ yeniPlakaError: 'Bu plaka ile üyelik kaydı zaten var.' });
      return;
    }

    this.setState({ loading: true });
    return fetch('https://householdapi.azurewebsites.net/api/HGS/Post',
      {
        method: 'POST',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'musTCKN': this.props.screenProps.musteri.tcKimlikNo,
          'bakiye': 0,
          'aktifmi': 1,
          'plaka': this.state.yeniPlaka.toUpperCase(),
        })
      })

      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ loading: false });
        var result = responseData['Result'];
        if (result == "1") {
          this.setState({ yeniPlaka: '', yeniPlakaError: '' });
          this.aktifUyelikleriGetir();
          this.tumUyelikleriGetir();
        } else {
          alert("HGSKaydı: API ile bağlantı kurulamadı!");
        }
      })
      .catch((error) => {
        alert("HGSKaydı:Hata: " + error);
      })
  };

  tumUyelikleriGetir = () => {

    fetch('https://householdapi.azurewebsites.net/api/HGS/getAllAccounts/' + this.props.screenProps.musteri.tcKimlikNo,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        var accList = responseData['Data'];
        this.setState({ allAccs: accList });
      })
      .catch((error) => {
        alert(error);
      })
  }

  aktifUyelikleriGetir = () => {
    let Customer = this.props.screenProps.musteri;

    let tcKimlikNo = Customer.tcKimlikNo;

    fetch('https://householdapi.azurewebsites.net/api/HGS/getActiveAccounts/' + tcKimlikNo,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        var accList = responseData['Data'];
        this.setState({ accs: accList });
      })
      .catch((error) => {
        alert(error);
      })
  }

  refreshProps = () => {
    this.aktifUyelikleriGetir();
    this.tumUyelikleriGetir();
  }

  render() {
    return (
      <ScrollView>
        <PTRView onRefresh={this._refresh}>
          <Background>
            <Loader
              loading={this.state.loading} />

            <Header>Yeni HGS Kaydı</Header>

            <TextInput
              label="Plaka"
              value={this.state.yeniPlaka}
              error={!!this.state.yeniPlakaError}
              errorText={this.state.yeniPlakaError}
              maxLength={10}
              onChangeText={(text) => {
                text = text.replace(/[ ]*/, '').replace(/[^a-zA-Z[0-9]]*/g, '');
                this.setState({ yeniPlaka: text, yeniPlakaError: '' });
              }}

            />

            <Button mode="contained" onPress={this.uyelikOlustur.bind(this)} style={styles.button}>
              Üyelik Oluştur
        </Button>

            <Header>Aktif HGS Listesi(Tüm Araçlar):</Header>
            <FlatList
              style={{ minWidth: 300 }}
              data={this.state.accs}
              renderItem={({ item }) => (
                <ListItem
                  topDivider
                  onPress={() => this.props.navigation.navigate('HGSDetail', { selectedAcc: item, refreshProps: this.refreshProps.bind(this) })}
                  title={'Plaka: ' + item.plaka}
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
        </PTRView>
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

