import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
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
  aciklamaValidator,
} from '../core/utils';
import Loader from '../core/loader';
import moment from 'moment';
import { drawer } from "./Dashboard";

export default class WithdrawMoney extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      selectedAcc: this.props.navigation.state.params.selectedAcc,
      musteri: this.props.screenProps.musteri,
      miktar: '',
      miktarError: '',
      aciklama: '',
      aciklamaError: ''
    };

    //alert('w: ' + JSON.stringify(this.props));

  };

  componentWillUnmount() {
    const { navigation } = this.props
    navigation.state.params.onBack();
  }

  static navigationOptions = {
    title: 'Para Çek',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  paraCek = () => {
    const miktarError = miktarValidator(this.state.miktar);
    const aciklamaError = aciklamaValidator(this.state.aciklama);

    if (this.state.miktar > this.state.selectedAcc.bakiye) {
      this.setState({ miktarError: 'Bakiyeden yüksek miktar girilemez.'})
      return;
    }

    if (miktarError || aciklamaError) {
      this.setState({ miktarError, aciklamaError })
      return;
    }

    //alert(parseFloat(this.state.selectedAcc.bakiye).toFixed(2)+':'+parseFloat(this.state.miktar).toFixed(2));
    //var yeniBakiye = parseFloat(parseFloat(this.state.selectedAcc.bakiye).toFixed(2) + parseFloat(this.state.miktar).toFixed(2)).toFixed(2);
    var yeniBakiye = parseFloat(this.state.selectedAcc.bakiye) - parseFloat(this.state.miktar);
    //alert(yeniBakiye);

    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/Hesap/Put',
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
          'aktifmi': this.state.selectedAcc.aktifmi,
          'acilisTarihi': this.state.selectedAcc.acilisTarihi,
          'bakiye': yeniBakiye
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        var result = resp['Result'];
        if (result == "1") {
          this.islemGuncelle();
          this.setState({ loading: false });
          this.props.navigation.goBack();
          alert('Para Çekme işlemi Başarılı!');
        }
        else {
          alert('Para Çekme işlemi sırasında servis bağlantı hatası!');
        }
      })
      .catch((error) => {
        alert('ParaÇek:Hata Oluştu: ' + error);
      })


  };

  islemGuncelle = () => {
    var miktar = this.state.miktar;
    var aciklama = this.state.aciklama;
    var sonAciklama = miktar + ' TL Para Çekildi - ' + aciklama;

    fetch('https://householdapi.azurewebsites.net/api/Islem/Post',
      {
        method: 'Post',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapNo': this.state.musteri.hesapNo,
          'hesapEkNo': this.state.selectedAcc.hesapEkNo,
          'aciklama': sonAciklama,
          'tarih': moment().format("YYYY-MM-DD HH:mm:ss"),
          'islemTipi': 'Para Çekme',
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
          alert('İşlem servisine bağlantı hatası!');
        }
      })
      .catch((error) => {
        alert('İşlem:Hata Oluştu: ' + error);
      })


  };

  render() {

    return (
      <Background>
        <Loader
          loading={this.state.loading} />

        <Logo />

        <Header>Para Çekme</Header>
        <Header>Mevcut Bakiye: {this.state.selectedAcc.bakiye} TL</Header>

        <TextInput
          label="Çekilecek Miktar"
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

        />

        <TextInput
          label="Açıklama"
          onChangeText={(aciklama) => {
            aciklama = aciklama.replace(/[ ]*/, '').replace(/[^[0-9]a-zA-ZığüçşöİĞÜÇŞÖ.:\/ ]*/g, '');
            this.setState({ aciklama, aciklamaError: '' });
          }}
          value={this.state.aciklama}
          error={!!this.state.aciklamaError}
          errorText={this.state.aciklamaError}
          maxLength={150}

        />

        <Button mode="contained" onPress={this.paraCek.bind(this)}>
          Para Çek
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