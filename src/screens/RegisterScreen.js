import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert,ScrollView } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { Paragraph } from 'react-native-paper';
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

export default class RegisterScreen extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      tckn: '',
      pass: '',
      tcknError: '',
      passwordError: '',
      adsoyad: '',
      adsoyadError: '',
      tel: '',
      telError: '',
      email: '',
      emailError: '',
      dogumtarih: '',
      dogumtarihError: '',
      adres: '',
      adresError: ''
    };

  };

  goRegister = () => {
    const tcknError = tcknValidator(this.state.tckn);
    const adsoyadError = adsoyadValidator(this.state.adsoyad);
    const passwordError = passValidator(this.state.pass);
    const emailError = emailValidator(this.state.email);
    const telError = telValidator(this.state.tel);
    const dogumtarihError = dogumtarihValidator(this.state.dogumtarih);
    const adresError = adresValidator(this.state.adres);

    if (tcknError || adsoyadError || passwordError || emailError || telError || dogumtarihError || adresError) {
      this.setState({ 
        tcknError,
        adsoyadError,
        passwordError,
        emailError,
        telError,
        dogumtarihError,
        adresError
      });
      return;
    }

    this.setState({ loading: true });

    fetch('https://householdwebapi.azurewebsites.net/api/Musteri',
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
          'hesapNo': '000000000'
        })
      })

      .then((response) => response.json())
      .then((responseData) => {
        var result = responseData['Result'];
        if (result == "1") {
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
        alert(error);
      })


  };

  render() {

    return (
      <ScrollView >
        <Background>
        <Loader
          loading={this.state.loading} />
        <BackButton goBack={() => this.props.navigation.navigate('HomeScreen')} />

        <Logo />

        <Header>Kayıt Ol</Header>

        <TextInput
          label="TCKN"
          onChangeText={(tckn) => {
            this.setState({ tckn, tcknError: '' });
          }}
          value={this.state.tckn}
          error={!!this.state.tcknError}
          errorText={this.state.tcknError}
          maxLength={11}
          keyboardType={'numeric'}

        />

        <TextInput
          label="Ad Soyad"
          onChangeText={(adsoyad) => {
            this.setState({ adsoyad, adsoyadError: '' });
          }}
          value={this.state.adsoyad}
          error={!!this.state.adsoyadError}
          errorText={this.state.adsoyadError}
          maxLength={11}

        />

        <TextInput secureTextEntry={true}
          label="Şifre"
          onChangeText={(pass) => {
            this.setState({ pass, passwordError: '' });
          }}
          value={this.state.pass}
          error={!!this.state.passwordError}
          errorText={this.state.passwordError}
          maxLength={8}
          keyboardType={'numeric'}
        />

        <TextInput secureTextEntry={true}
          label="ŞifreTekrar"
          onChangeText={(pass) => {
            this.setState({ pass, passwordError: '' });
          }}
          value={this.state.pass}
          error={!!this.state.passwordError}
          errorText={this.state.passwordError}
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
        />

        <TextInput
          label="Doğum tarihi"
          onChangeText={(dogumtarih) => {
            this.setState({ dogumtarih, dogumtarihError: '' });
          }}
          value={this.state.dogumtarih}
          error={!!this.state.dogumtarihError}
          errorText={this.state.dogumtarihError}
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

        <Button mode="contained" onPress={this.goRegister.bind(this)}>
          Kayıt Ol
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Zaten Kayıtlı mısın? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </Background>
      </ScrollView >
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