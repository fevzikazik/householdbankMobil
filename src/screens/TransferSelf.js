import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements'
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { Paragraph } from 'react-native-paper';
import {
  miktarValidator
} from '../core/utils';
import Loader from '../core/loader';
import moment from 'moment';
import { drawer } from "./Dashboard";
import Picker from 'react-native-simple-modal-picker'

export default class TransferSelf extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      musteri: this.props.screenProps.musteri,
      gonderenList: [],
      alanList: [],
      gonderenHesap: '',
      alanHesap: '',
      gonderenHesapEkNo: '',
      alanHesapEkNo: '',
      gonderenHesapBakiye: '',
      alanHesapBakiye: '',
      miktar: '',
      miktarError: '',
      isEditable: false
    };

    //alert('virman: ' + JSON.stringify(this.props));
  };

  static navigationOptions = {
    title: 'Virman',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  componentWillMount() {
    this.gonderenHesapListGetir();
  };

  gonderenHesapListGetir = async () => {
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
        var result = responseData['Result'];
        if (result == '1') {
          var accList = responseData['Data'];
          var haveMoneyAcc = [];
          for (let acc of accList) {
            if (acc.bakiye > 0) {
              haveMoneyAcc.push(acc);
            }
          }
          this.setState({ gonderenList: haveMoneyAcc });
        } else {
          alert('API ile bağlantı kurulamadı!');
        }
      })
      .catch((error) => {
        alert('Hata:aktifHesaplariGetir: ' + error);
      })
  };

  alanHesapListGetir = async (gonderen) => {
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
        var result = responseData['Result'];
        if (result == '1') {
          var accList = responseData['Data'];
          var haveMoneyAcc = [];
          for (let acc of accList) {
            if (acc.hesapEkNo == gonderen) {
              this.setState({ gonderenHesapBakiye: acc.bakiye });
              this.setState({ gonderenHesap: acc });
              continue;
            }
            haveMoneyAcc.push(acc);
          }
          this.setState({ alanList: haveMoneyAcc });
        } else {
          alert('API ile bağlantı kurulamadı!');
        }
      })
      .catch((error) => {
        alert('Hata: ' + error);
      })
  };

  alanHesapBakiyeGetir = (alan) => {
    var accList = this.state.alanList;
    for (let acc of accList) {
      if (acc.hesapEkNo == alan) {
        this.setState({ alanHesapBakiye: acc.bakiye });
        this.setState({ alanHesap: acc });
        break;
      }
    }
  };

  virmanYap = () => {
    if (this.state.gonderenHesapBakiye == '0') {
      this.setState({ isEditable: false });
      alert('Gönderen Hesabın Bakiyesi Yetersiz!');
      return;
    }

    if (this.state.alanHesapEkNo == '') {
      alert('Lütfen Gönderici ve Alıcı Hesapları Seçin!');
      return;
    }

    const miktarError = miktarValidator(this.state.miktar);

    if (this.state.miktar > this.state.gonderenHesapBakiye) {
      this.setState({ miktarError: 'Bakiyeden yüksek miktar girilemez.'})
      return;
    }
    
    if (miktarError) {
      this.setState({ miktarError })
      return;
    }

    var miktar = this.state.miktar;
    var yeniGonderenBakiye = parseFloat(this.state.gonderenHesapBakiye) - parseFloat(miktar);

    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/Hesap/Put',
      {
        method: 'PUT',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapID': this.state.gonderenHesap.hesapID,
          'hesapEkNo': this.state.gonderenHesap.hesapEkNo,
          'musTCKN': this.state.gonderenHesap.musTCKN,
          'aktifmi': this.state.gonderenHesap.aktifmi,
          'acilisTarihi': this.state.gonderenHesap.acilisTarihi,
          'bakiye': yeniGonderenBakiye
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        this.setState({ loading: false });
        var result = resp['Result'];
        if (result == "1") {
          this.gonderenIslemGuncelle(miktar);
          this.setState({ gonderenHesapBakiye: yeniGonderenBakiye });
        }
        else {
          alert('GonderenHesapGuncelle: API Bağlantı Sorunu!');
        }
      })
      .catch((error) => {
        alert('Hata:GonderenHesapGuncelle: ' + error);
      })

    var yeniAlanBakiye = parseFloat(this.state.alanHesapBakiye) + parseFloat(this.state.miktar);

    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/Hesap/Put',
      {
        method: 'PUT',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapID': this.state.alanHesap.hesapID,
          'hesapEkNo': this.state.alanHesap.hesapEkNo,
          'musTCKN': this.state.alanHesap.musTCKN,
          'aktifmi': this.state.alanHesap.aktifmi,
          'acilisTarihi': this.state.alanHesap.acilisTarihi,
          'bakiye': yeniAlanBakiye
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        this.setState({ loading: false });
        var result = resp['Result'];
        if (result == "1") {
          if (yeniGonderenBakiye.toString() == '0') {
            this.setState({ isEditable: false });
          }
          this.alanIslemGuncelle(miktar);
          this.setState({ alanHesapBakiye: yeniAlanBakiye });
          this.setState({ miktar: '' });
          alert('Virman Başarılı!');
          this.gonderenHesapListGetir();
        }
        else {
          alert('AlanHesapGuncelle: API Bağlantı Sorunu!');
        }
      })
      .catch((error) => {
        alert('Hata:AlanHesapGuncelle: ' + error);
      })
  };

  gonderenIslemGuncelle = (miktar) => {
    var sonAciklama = miktar + ' TL ' + this.state.alanHesapEkNo + ' EkNolu Hesaba Virman Yapildi!';

    fetch('https://householdapi.azurewebsites.net/api/Islem/Post',
      {
        method: 'Post',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapNo': this.state.musteri.hesapNo,
          'hesapEkNo': this.state.gonderenHesap.hesapEkNo,
          'aciklama': sonAciklama,
          'tarih': moment().format("YYYY-MM-DD HH:mm:ss"),
          'islemTipi': 'Virman',
          'platform': 'mobil'
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        var result = resp['Result'];
        if (result == "1") {
          return;
        }
        else {
          alert('Gönderenİşlem: API bağlantı hatası!');
        }
      })
      .catch((error) => {
        alert('Gönderenİşlem:Hata Oluştu: ' + error);
      })


  };

  alanIslemGuncelle = (miktar) => {
    var sonAciklama = miktar + ' TL ' + this.state.gonderenHesapEkNo + ' EkNolu Hesaptan Virman Geldi!';

    fetch('https://householdapi.azurewebsites.net/api/Islem/Post',
      {
        method: 'Post',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapNo': this.state.musteri.hesapNo,
          'hesapEkNo': this.state.alanHesap.hesapEkNo,
          'aciklama': sonAciklama,
          'tarih': moment().format("YYYY-MM-DD HH:mm:ss"),
          'islemTipi': 'Virman',
          'platform': 'mobil'
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        var result = resp['Result'];
        if (result == "1") {
          return;
        }
        else {
          alert('Alanİşlem: API bağlantı hatası!');
        }
      })
      .catch((error) => {
        alert('Alanİşlem:Hata Oluştu: ' + error);
      })


  };

  render() {

    return (
      <Background>
        <Loader
          loading={this.state.loading} />

        <Picker
          ref={instance => this.gonderen = instance}
          data={this.state.gonderenList}
          label={'hesapEkNo'}
          value={'hesapEkNo'}
          onValueChange={(value) => {
            this.setState({ gonderenHesapEkNo: value, alanHesapEkNo: '', alanHesapBakiye: '' , isEditable: false, miktar: '' });
            this.alanHesapListGetir(value);
          }} />

        <Button mode="contained"
          onPress={() => this.gonderen.setModalVisible(true)} >
          Gönderen Hesap Seçin:
        </Button>

        <Header>Seçilen Hesap: {this.state.gonderenHesapEkNo}</Header>
        <Header>Bakiyesi: {this.state.gonderenHesapBakiye} TL</Header>

        <Picker
          ref={instance => this.alan = instance}
          data={this.state.alanList}
          label={'hesapEkNo'}
          value={'hesapEkNo'}
          onValueChange={(value) => {
            this.setState({ alanHesapEkNo: value, isEditable: true });
            this.alanHesapBakiyeGetir(value);
          }} />

        <Button mode="contained"
          onPress={() => {
            if (this.state.alanList.length > 0) {
              this.alan.setModalVisible(true);
            }
            else{
              alert('Aktarılacak hesabınız yok!');
            }
          }} >
          Alacak Hesap Seçin:
        </Button>

        <Header>Seçilen Hesap: {this.state.alanHesapEkNo}</Header>
        <Header>Bakiyesi: {this.state.alanHesapBakiye} TL</Header>

        <TextInput
          label="Virman Miktarı"
          onChangeText={(miktar) => {

            var mevcutBakiye = this.state.gonderenHesapBakiye;
            var max = parseFloat(mevcutBakiye).toFixed(2);
            var noktadanOnce = parseInt(mevcutBakiye).toFixed(0);
            var beforeDecimal = noktadanOnce.length;

            miktar = miktar.replace(/[.]*/, '')
              .replace(/[0]*/, '')
              .replace(/[^\d.]/g, '')
              .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), '$1')
              .replace(/(\..*)\./g, '$1')
              .replace(new RegExp("(\\.[\\d]{2}).", "g"), '$1')
              .replace(/(\.\d*)\./g, '$1');

            //alert(miktar+':'+max);
            if (miktar.length >= noktadanOnce.length) {
              if (miktar.indexOf(".") == -1) {
                if (miktar > max) {
                  miktar = max;
                }
              }
              else { // nokta varsa
                if (miktar.substr(0, miktar.indexOf('.')) == noktadanOnce && miktar.substr(miktar.indexOf('.') + 1, miktar.length) > max.substr(miktar.indexOf('.') + 1, max.length)) {
                  if (miktar > max) {
                    miktar = max;
                  }
                }
              }
            }

            this.setState({ miktar, miktarError: '' });

          }}
          value={this.state.miktar}
          error={!!this.state.miktarError}
          errorText={this.state.miktarError}
          keyboardType={'numeric'}
          editable={this.state.isEditable}

        />

        <Button mode="contained" onPress={this.virmanYap.bind(this)}>
          Virman Yap
      </Button>
      </Background>
    )
  };

};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});