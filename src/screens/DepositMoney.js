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

export default class DepositMoney extends Component {

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

    //alert('dep: ' + JSON.stringify(this.props));

  };

  componentWillUnmount() {
    const { navigation } = this.props
    navigation.state.params.onBack();
  }

  static navigationOptions = {
    title: 'Para Yatır',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  paraYatir = () => {
    const miktarError = miktarValidator(this.state.miktar);
    const aciklamaError = aciklamaValidator(this.state.aciklama);

    if (miktarError || aciklamaError) {
      this.setState({ miktarError, aciklamaError })
      return;
    }

    //alert(parseFloat(this.state.selectedAcc.bakiye).toFixed(2)+':'+parseFloat(this.state.miktar).toFixed(2));
    //var yeniBakiye = parseFloat(parseFloat(this.state.selectedAcc.bakiye).toFixed(2) + parseFloat(this.state.miktar).toFixed(2)).toFixed(2);
    var yeniBakiye = parseFloat(this.state.selectedAcc.bakiye) + parseFloat(this.state.miktar);
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
          alert('Para Yatırma işlemi Başarılı!');
        }
        else {
          alert('Para Yatırma işlemi sırasında servis bağlantı hatası!');
        }
      })
      .catch((error) => {
        alert('ParaYatır:Hata Oluştu: ' + error);
      })


  };

  islemGuncelle = () => {
    var miktar = this.state.miktar;
    var aciklama = this.state.aciklama;
    var sonAciklama = miktar + ' TL Para Yatırıldı - ' + aciklama;

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
          'islemTipi': 'Para Yatırma',
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

        <Header>Para Yatırma</Header>

        <TextInput
          label="Yatırılacak Miktar"
          onChangeText={(miktar) => {
            miktar = miktar.replace(/[.]*/, '')
              .replace(/[0]*/, '')
              .replace(/[^\d.]/g, '')
              .replace(new RegExp("(^[\\d]{6})[\\d]", "g"), '$1')
              .replace(/(\..*)\./g, '$1')
              .replace(new RegExp("(\\.[\\d]{2}).", "g"), '$1')
              .replace(/(\.\d*)\./g, '$1');
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

        <Button mode="contained" onPress={this.paraYatir.bind(this)}>
          Para Yatır
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