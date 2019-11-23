import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { Icon, ListItem } from 'react-native-elements'
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {
  passValidator,
  tcknValidator,
  adsoyadValidator,
  emailValidator,
  telValidator,
  dogumtarihValidator,
  adresValidator
} from '../core/utils';
import Loader from '../core/loader';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';

export default class ManageProfile extends Component {
  constructor(props) {
    super(props);

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      tckn: this.props.screenProps.musteri.tcKimlikNo,
      pass: this.props.screenProps.musteri.sifre,
      confirmPass: this.props.screenProps.musteri.sifre,
      tcknError: '',
      passwordError: '',
      confirmPasswordError: '',
      adsoyad: this.props.screenProps.musteri.tamAdi,
      adsoyadError: '',
      tel: this.props.screenProps.musteri.telefon,
      telError: '',
      email: this.props.screenProps.musteri.ePosta,
      emailError: '',
      dogumtarih: this.props.screenProps.musteri.dogumTarihi,
      dogumtarihError: '',
      adres: this.props.screenProps.musteri.adres,
      adresError: ''
    };

    //alert('ManageProfile: ' + JSON.stringify(this.props));
  };

  componentDidMount = () => {
  };

  static navigationOptions = {
    title: 'Profil',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  bilgileriGuncelle = async () => {
    var tcknError;
    if (this.state.tcknError!=='') {
      tcknError = this.state.tcknError;
    }
    else{
      tcknError = tcknValidator(this.state.tckn);
    }
    const adsoyadError = adsoyadValidator(this.state.adsoyad);
    const passwordError = passValidator(this.state.pass);
    const confirmPasswordError = passValidator(this.state.confirmPass);
    const emailError = emailValidator(this.state.email);
    const telError = telValidator(this.state.tel);
    const dogumtarihError = dogumtarihValidator(this.state.dogumtarih);
    const adresError = adresValidator(this.state.adres);

    if (tcknError || adsoyadError || passwordError || confirmPasswordError || emailError || telError || dogumtarihError || adresError) {
      this.setState({
        tcknError,
        adsoyadError,
        passwordError,
        confirmPasswordError,
        emailError,
        telError,
        dogumtarihError,
        adresError
      });
      return;
    }


    const hesapNo = await this.hesapNoOlustur();
    const sonuc = await this.hesapOlustur();
    //alert(sonuc);

    this.setState({ loading: true });

    fetch('https://householdapi.azurewebsites.net/api/Musteri',
      {
        method: 'POST',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'tcKimlikNo': this.state.tckn,
          'tamAdi': this.state.adsoyad,
          'ePosta': this.state.email,
          'sifre': this.state.pass,
          'dogumTarihi': this.state.dogumtarih,
          'telefon': this.state.tel,
          'adres': this.state.adres,
          'hesapNo': hesapNo
        })
      })

      .then((response) => response.json())
      .then((responseData) => {
        var result = responseData['Result'];
        if (result == "1" && sonuc == true) {
          this.setState({ loading: false });
          alert('Kayıt Yapıldı!');
          this.props.navigation.navigate('LoginScreen');
        }
        else {
          this.setState({ loading: false });
          alert('Kayıt Olurken Hata Oluştu!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert('KayıtOl:Hata: ' + error);
      })


  };

  render() {
    return (
      <Background>

        <Header>Profil Ayarları</Header>
      </Background>
    )
  }

  render() {

    return (
      <ScrollView >
        <Background>
          <Loader
            loading={this.state.loading} />

          <Logo />

          <Header>Profil Düzenle</Header>

          <TextInput
            label="TCKN"
            onChangeText={(tckn) => {
              this.tcknKontrol(tckn);
            }}
            value={this.state.tckn}
            error={!!this.state.tcknError}
            errorText={this.state.tcknError}
            maxLength={11}
            keyboardType={'numeric'}
            editable={false}
          />

          <TextInput
            label="Ad Soyad"
            onChangeText={(adsoyad) => {
              this.setState({ adsoyad, adsoyadError: '' });
            }}
            value={this.state.adsoyad}
            error={!!this.state.adsoyadError}
            errorText={this.state.adsoyadError}
            maxLength={50}

          />

          <TextInput
            label="Şifre"
            onChangeText={(pass) => {
              this.setState({ pass, passwordError: '', confirmPasswordError: '' });
              if (pass.length === 8 && this.state.confirmPass !== '' && this.state.confirmPass.length === 8) {
                if (this.state.confirmPass !== pass) {
                  this.setState({ passwordError: 'Şifreler Farklı!' });
                } else {
                  this.setState({ passwordError: '' });
                }
              } else {
                this.setState({ passwordError: '' });
              }
            }}
            value={this.state.pass}
            error={!!this.state.passwordError}
            errorText={this.state.passwordError}
            maxLength={8}
            keyboardType={'numeric'}
          />

          <TextInput
            label="Şifre Tekrar"
            onChangeText={(confirmPass) => {
              this.setState({ confirmPass, confirmPasswordError: '', passwordError: '' });
              if (confirmPass.length === 8) {
                if (this.state.pass !== confirmPass) {
                  this.setState({ confirmPasswordError: 'Şifreler Farklı!' });
                } else {
                  this.setState({ confirmPasswordError: '' });
                }
              } else {
                this.setState({ confirmPasswordError: '' });
              }
            }}
            value={this.state.confirmPass}
            error={!!this.state.confirmPasswordError}
            errorText={this.state.confirmPasswordError}
            maxLength={8}
            keyboardType={'numeric'}
          />

          <TextInput
            label="Telefon"
            onChangeText={(tel) => {
              this.setState({ tel, telError: '' });
            }}
            value={this.state.tel}
            error={!!this.state.telError}
            errorText={this.state.telError}
            maxLength={11}
            keyboardType={'numeric'}
          />

          <TextInput
            label="Eposta"
            returnKeyType="next"
            value={this.state.email}
            onChangeText={(email) => {
              this.setState({ email, emailError: '' });
            }}
            error={!!this.state.emailError}
            errorText={this.state.emailError}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            maxLength={50}
          />

          <DatePicker
            style={{ width: 200 }}
            date={this.state.dogumtarih}
            mode="date"
            placeholder="Doğum Tarihi Seçin"
            format="YYYY-MM-DD"
            minDate="1920-01-01"
            maxDate="2001-01-01"
            confirmBtnText="Seç"
            cancelBtnText="İptal"
            onDateChange={(date) => { this.setState({ dogumtarih: date, dogumtarihError: '' }) }}
            hideText={true}
          />

          <TextInput
            label="Doğum tarihi"
            onChangeText={(dogumtarih) => {
              this.setState({ dogumtarih, dogumtarihError: '' });
            }}
            value={this.state.dogumtarih}
            error={!!this.state.dogumtarihError}
            errorText={this.state.dogumtarihError}
            editable={false}
          />

          <TextInput
            label="Adres"
            onChangeText={(adres) => {
              this.setState({ adres, adresError: '' });
            }}
            value={this.state.adres}
            error={!!this.state.adresError}
            errorText={this.state.adresError}
            maxLength={150}

          />

          <Button mode="contained">
            Güncelle
          </Button>
        </Background>
      </ScrollView >
    )
  };
};