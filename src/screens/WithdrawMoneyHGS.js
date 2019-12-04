import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import {
  miktarValidator,
} from '../core/utils';
import Loader from '../core/loader';
import moment from 'moment';
import { drawer } from "./Dashboard";
import Picker from 'react-native-simple-modal-picker'

export default class WithdrawMoneyHGS extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      selectedAcc: this.props.navigation.state.params.selectedAcc,
      musteri: this.props.screenProps.musteri,
      aktarilacakList: [],
      aktarilacakHesap: '',
      aktarilacakHesapEkNo: '',
      aktarilacakHesapBakiye: '',
      miktar: '',
      miktarError: '',
      isEditable: false
    };

    //alert('hgsBakiye: ' + JSON.stringify(this.props));

  };

  componentWillMount() {
    this.aktarilacakHesapListGetir();
  };

  componentWillUnmount() {
    const { navigation } = this.props
    navigation.state.params.onBack();
  }

  static navigationOptions = {
    title: 'HGS Bakiye Aktar',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  aktarilacakHesapListGetir = async () => {
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
            haveMoneyAcc.push(acc);
          }
          this.setState({ aktarilacakList: haveMoneyAcc });
        } else {
          alert('API ile bağlantı kurulamadı!');
        }
      })
      .catch((error) => {
        alert('Hata:aktarilacakHesapListGetir: ' + error);
      })
  };

  aktarilacakHesapBakiyeGetir = (aktarilacak) => {
    var accList = this.state.aktarilacakList;
    for (let acc of accList) {
      if (acc.hesapEkNo == aktarilacak) {
        this.setState({ aktarilacakHesapBakiye: acc.bakiye });
        this.setState({ aktarilacakHesap: acc });
        break;
      }
    }
  };

  bakiyeAktar = () => {
    const miktarError = miktarValidator(this.state.miktar);

    if (this.state.miktar > this.state.selectedAcc.bakiye) {
      this.setState({ miktarError: 'Bakiyeden yüksek miktar girilemez.'})
      return;
    }

    if (miktarError) {
      this.setState({ miktarError })
      return;
    }

    var miktar = this.state.miktar;
    var yeniBakiye = parseFloat(this.state.aktarilacakHesapBakiye) + parseFloat(miktar);

    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/Hesap/Put',
      {
        method: 'PUT',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapID': this.state.aktarilacakHesap.hesapID,
          'hesapEkNo': this.state.aktarilacakHesap.hesapEkNo,
          'musTCKN': this.state.aktarilacakHesap.musTCKN,
          'aktifmi': this.state.aktarilacakHesap.aktifmi,
          'acilisTarihi': this.state.aktarilacakHesap.acilisTarihi,
          'bakiye': yeniBakiye
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        this.setState({ loading: false });
        var result = resp['Result'];
        if (result == "1") {
          this.aktarilacakIslemGuncelle(miktar);
          this.setState({ aktarilacakHesapBakiye: yeniBakiye });
        }
        else {
          alert('AktarılacakHesapGuncelle: API Bağlantı Sorunu!');
        }
      })
      .catch((error) => {
        alert('Hata:AktarılacakHesapGuncelle: ' + error);
      })

    var yeniHGSBakiye = parseFloat(this.state.selectedAcc.bakiye) - parseFloat(this.state.miktar);

    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/HGS/Put/' + this.state.selectedAcc.hgsID,
      {
        method: 'PUT',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hgsID': this.state.selectedAcc.hgsID,
          'musTCKN': this.state.selectedAcc.musTCKN,
          'bakiye': yeniHGSBakiye,
          'aktifmi': 1,
          'plaka': this.state.selectedAcc.plaka
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        this.setState({ loading: false });
        var result = resp['Result'];
        if (result == "1") {
          this.props.navigation.goBack()
          alert('HGS Bakiye Aktarılması Başarılı!');
        }
        else {
          alert('HGSHesapGuncelle: API Bağlantı Sorunu!');
        }
      })
      .catch((error) => {
        alert('Hata:HGSHesapGuncelle: ' + error);
      })
  };

  aktarilacakIslemGuncelle = (miktar) => {
    var sonAciklama = miktar + ' TL ' + this.state.selectedAcc.plaka + ' Plakalı Araç İçin HGS İadesi Yapildi!';

    fetch('https://householdapi.azurewebsites.net/api/Islem/Post',
      {
        method: 'Post',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapNo': this.state.musteri.hesapNo,
          'hesapEkNo': this.state.aktarilacakHesap.hesapEkNo,
          'aciklama': sonAciklama,
          'tarih': moment().format("YYYY-MM-DD HH:mm:ss"),
          'islemTipi': 'HGS İadesi',
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
          alert('Aktarılacakİşlem: API bağlantı hatası!');
        }
      })
      .catch((error) => {
        alert('Aktarılacakİşlem:Hata Oluştu: ' + error);
      })


  };

  render() {

    return (
      <Background>
        <Loader
          loading={this.state.loading} />


        <Header>HGS Bakiyesi: {this.state.selectedAcc.bakiye} TL</Header>
        <Picker
          ref={instance => this.aktarilacak = instance}
          data={this.state.aktarilacakList}
          label={'hesapEkNo'}
          value={'hesapEkNo'}
          onValueChange={(value) => {
            this.setState({ aktarilacakHesapEkNo: value, isEditable: true, miktar: '' });
            this.aktarilacakHesapBakiyeGetir(value);
          }} />

        <Button mode="contained"
          onPress={() => this.aktarilacak.setModalVisible(true)} >
          Aktarılacak Hesabı Seçin:
        </Button>

        <Header>Seçilen Hesap: {this.state.aktarilacakHesapEkNo}</Header>
        <Header>Bakiyesi: {this.state.aktarilacakHesapBakiye} TL</Header>

        <TextInput
          label="Aktarma Miktarı"
          onChangeText={(miktar) => {

            var mevcutBakiye = this.state.selectedAcc.bakiye;
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

        <Button mode="contained" onPress={this.bakiyeAktar.bind(this)}>
          Bakiye Aktar
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