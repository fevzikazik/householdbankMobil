import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView } from 'react-native';
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
  miktarValidator,
  hesapNoValidator,
  hesapEkNoValidator
} from '../core/utils';
import Loader from '../core/loader';
import moment from 'moment';
import { drawer } from "./Dashboard";
import Picker from 'react-native-simple-modal-picker'

export default class Transfer extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      musteri: this.props.screenProps.musteri,
      gonderenList: [],
      alanList: [],
      gonderenHesap: '',
      alanHesap: '',
      alanHesapNo: '',
      alanHesapNoError: '',
      alanAdSoyad: '',
      alanMus: '',
      gonderenHesapEkNo: '',
      alanHesapEkNo: '',
      alanHesapEkNoError: '',
      gonderenHesapBakiye: '',
      alanHesapBakiye: '',
      miktar: '',
      miktarError: '',
      isEditable: false,
      editHesapNo: false,
      editHesapEkNo: false

    };

    //alert('virman: ' + JSON.stringify(this.props));
  };

  static navigationOptions = {
    title: 'Havale',
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

  gonderenHesapBakiyeGetir = (gonderen) => {
    var accList = this.state.gonderenList;
    for (let acc of accList) {
      if (acc.hesapEkNo == gonderen) {
        this.setState({ gonderenHesapBakiye: acc.bakiye });
        this.setState({ gonderenHesap: acc });
        break;
      }
    }
  };

  havaleYap = () => {
    if (this.state.gonderenHesapBakiye == '0') {
      this.setState({ isEditable: false });
      alert('Gönderen Hesabın Bakiyesi Yetersiz!');
      return;
    }
    
    if (this.state.alanHesapNoError || this.state.alanHesapEkNoError) {
      return;
    }

    const alanHesapNoError = hesapNoValidator(this.state.alanHesapNo);
    const alanHesapEkNoError = hesapEkNoValidator(this.state.alanHesapEkNo);
    const miktarError = miktarValidator(this.state.miktar);

    if (this.state.miktar > this.state.gonderenHesapBakiye) {
      this.setState({ miktarError: 'Bakiyeden yüksek miktar girilemez.'})
      return;
    }

    if (alanHesapNoError || alanHesapEkNoError || miktarError) {
      this.setState({ alanHesapNoError, alanHesapEkNoError, miktarError })
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
          alert('Havale Başarılı!');
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
    var sonAciklama = miktar + ' TL ' + this.state.alanMus.hesapNo + ' Nolu Müşterinin ' + this.state.alanHesapEkNo + ' EkNolu Hesabına Havale Yapildi!';

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
          'islemTipi': 'Havale',
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
    var sonAciklama = miktar + ' TL ' + this.state.musteri.hesapNo + ' Nolu Müşterinin ' + this.state.gonderenHesapEkNo + ' EkNolu Hesabından Havale Geldi!';

    fetch('https://householdapi.azurewebsites.net/api/Islem/Post',
      {
        method: 'Post',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapNo': this.state.alanMus.hesapNo,
          'hesapEkNo': this.state.alanHesap.hesapEkNo,
          'aciklama': sonAciklama,
          'tarih': moment().format("YYYY-MM-DD HH:mm:ss"),
          'islemTipi': 'Havale',
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

  hesapNoKontrol = async (hesapNo) => {
    if (hesapNo.length == 9) {
      this.setState({ alanHesapNo: hesapNo });
      return fetch('https://householdapi.azurewebsites.net/api/Musteri/Get',
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
          if (result == "1") {
            var hesapNoVarmi = false;
            var data = responseData['Data'];
            for (var i = 0; i < data.length; i++) {
              if (data[i]['hesapNo'] === hesapNo && hesapNo !== this.state.musteri.hesapNo) {
                this.setState({ alanAdSoyad: data[i].tamAdi, alanMus: data[i] });
                hesapNoVarmi = true;
                break;
              }
            }

            if (hesapNoVarmi == false) {
              this.setState({ alanHesapNoError: 'Girilen müşteri hesapno bulunamadı!' });
            } else {
              this.setState({ alanHesapNoError: '' });
              this.setState({ editHesapEkNo: true });
            }

          } else {
            alert("HesapNoKontrol: API ile bağlantı kurulamadı!");
          }
        })
        .catch((error) => {
          alert("HesapNoKontrol:Hata: " + error);
        })
    } else {
      this.setState({ alanHesapNo: hesapNo, alanHesapNoError: '' });
    }
  };

  hesapEkNoKontrol = async (hesapEkNo) => {
    if (hesapEkNo.length == 4) {
      this.setState({ alanHesapEkNo: hesapEkNo });
      //alert(JSON.stringify(this.state.alanMus));
      return fetch('https://householdapi.azurewebsites.net/api/Hesap/getAccountBy?musTCKN=' + this.state.alanMus.tcKimlikNo + '&hesapEkNo=' + hesapEkNo,
        {
          method: 'GET',
          headers: {
            'Accept-Charset': 'UTF-8',
            'Content-Type': 'application/json'
          }
        })

        .then((response) => response.json())
        .then((responseData) => {
          //alert(JSON.stringify(responseData));
          var result = responseData['Result'];
          if (result == "1") {
            if (responseData['Data'][0]['aktifmi'] == true) {
              this.setState({ alanHesap: responseData['Data'][0], alanHesapEkNoError: '', isEditable: true, alanHesapBakiye: responseData['Data'][0].bakiye });
            } else {
              this.setState({ alanHesapEkNoError: 'Girilen hesapekno aktif değil!' });
            }
          } else {
            this.setState({ alanHesapEkNoError: 'Girilen hesapekno bulunamadı!' });
          }
        })
        .catch((error) => {
          alert("HesapEkNoKontrol:Hata: " + error);
        })
    } else {
      this.setState({ alanHesapEkNo: hesapEkNo, alanHesapEkNoError: '' });
    }
  };

  render() {

    return (
      <ScrollView>
        <Background>
          <Loader
            loading={this.state.loading} />

          <Picker
            ref={instance => this.gonderen = instance}
            data={this.state.gonderenList}
            label={'hesapEkNo'}
            value={'hesapEkNo'}
            onValueChange={(value) => {
              this.setState({ gonderenHesapEkNo: value, alanHesapNo: '', alanHesapEkNo: '', alanAdSoyad: '', alanHesapBakiye: '', editHesapNo: true, editHesapEkNo: false, isEditable: false, miktar: '' });
              this.gonderenHesapBakiyeGetir(value);
            }} />

          <Button mode="contained"
            onPress={() => this.gonderen.setModalVisible(true)} >
            Gönderen Hesap Seçin:
        </Button>

          <Header>Seçilen Hesap: {this.state.gonderenHesapEkNo}</Header>
          <Header>Bakiyesi: {this.state.gonderenHesapBakiye} TL</Header>

          <TextInput
            label="Alici HesapNo"
            onChangeText={(text) => {
              text = text.replace(/[0]*/, '').replace(/[^\d]*/g, '');
              this.setState({ alanHesapEkNo: '', alanHesapEkNoError: '', editHesapEkNo: false, alanAdSoyad: '', alanHesapBakiye: '' });
              this.hesapNoKontrol(text);
            }}
            value={this.state.alanHesapNo}
            error={!!this.state.alanHesapNoError}
            errorText={this.state.alanHesapNoError}
            maxLength={9}
            keyboardType={'numeric'}
            editable={this.state.editHesapNo}

          />

          <TextInput
            label="Alici HesapEkNo"
            onChangeText={(text) => {
              text = text.replace(/[0]*/, '').replace(/[^\d]*/g, '');
              this.setState({ miktar: '', miktarError: '', isEditable: false, alanHesapBakiye: '' });
              this.hesapEkNoKontrol(text);
            }}
            value={this.state.alanHesapEkNo}
            error={!!this.state.alanHesapEkNoError}
            errorText={this.state.alanHesapEkNoError}
            maxLength={4}
            keyboardType={'numeric'}
            editable={this.state.editHesapEkNo}

          />

          <Header>Ad Soyad: {this.state.alanAdSoyad}</Header>
          <Header>Bakiyesi: {this.state.alanHesapBakiye} TL</Header>

          <TextInput
            label="Havale Miktarı"
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

          <Button mode="contained" onPress={this.havaleYap.bind(this)}>
            Havale Yap
      </Button>
        </Background>
      </ScrollView>
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