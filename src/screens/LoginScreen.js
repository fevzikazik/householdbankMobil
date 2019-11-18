import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
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
} from '../core/utils';
import Loader from '../core/loader';

export default class LoginScreen extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      tckn: '',
      pass: '',
      tcknError: '',
      passwordError: ''
    };

  };

  goLogin = () => {
    const tcknError = tcknValidator(this.state.tckn);
    const passwordError = passValidator(this.state.pass);

    if (tcknError || passwordError) {
      //alert(tcknError);
      //alert(passwordError);
      this.setState({ tcknError, passwordError })
      return;
    }

    this.setState({ loading: true });
    var tckn = this.state.tckn;
    var pass = this.state.pass;
    //alert(tckn + " " + pass);

    fetch('https://householdwebapi.azurewebsites.net/api/Musteri/' + tckn,
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
          //alert(JSON.stringify(responseData['Data'][0]));
          var sifre = responseData['Data'][0]['sifre'];
          if (sifre == pass) {
            this.setState({ loading: false });
            alert('Giriş Yapıldı!');
            this.props.navigation.navigate('Dashboard');
          }
          else {
            this.setState({ loading: false });
            alert('Şifre Yanlış!');
          }
        }
        else {
          this.setState({ loading: false });
          alert('TCKN Bulunamadı!');
        }
      })
      .catch((error) => {
        alert(error);
      })


  };

  render() {

    return (
      <Background>
        <Loader
          loading={this.state.loading} />
        <BackButton goBack={() => this.props.navigation.navigate('HomeScreen')} />

        <Logo />

        <Header>Hoşgeldiniz</Header>

        <TextInput secureTextEntry={true}
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

        <Button mode="contained" onPress={this.goLogin.bind(this)}>
          Giriş Yap
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Kayıtlı Değilmisin? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('RegisterScreen')}>
            <Text style={styles.link}>Hemen Ol</Text>
          </TouchableOpacity>
        </View>
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