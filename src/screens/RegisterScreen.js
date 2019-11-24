import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
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
import DatePicker from 'react-native-datepicker'
import moment from 'moment';


export default class RegisterScreen extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      tckn: '',
      pass: '',
      confirmPass: '',
      tcknError: '',
      passwordError: '',
      confirmPasswordError: '',
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

  hesapNoOlustur = async () => {

    return fetch('https://householdapi.azurewebsites.net/api/Musteri',
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
          var essiz = false;
          var hesapNo;
          do {
            hesapNo = Math.floor(Math.random() * ((999999999 - 100000000) + 1) + 100000000);
            var hspNo = hesapNo.toString();

            for (key in responseData) {
              if (((typeof key) == 'hesapNo') && key == hspNo) {
                break;
              }
              essiz = true;
            }
          } while (!essiz);

          var essizHesapNo = hesapNo.toString();
          //alert('essizHesapNo: ' + essizHesapNo);
          return essizHesapNo;
        }
        else {
          alert("API ile bağlantı kurulamadı!");
        }
      })
      .catch((error) => {
        alert("Hata: " + error);
      })
  };

  hesapOlustur = async () => {
    return fetch('https://householdapi.azurewebsites.net/api/Hesap',
      {
        method: 'POST',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'hesapEkNo': '5001',
          'musTCKN': this.state.tckn,
          'aktifmi': 1,
          'acilisTarihi': moment().format("YYYY-MM-DD HH:mm:ss"),
          'bakiye': 0
        })
      })

      .then((response) => response.json())
      .then((responseData) => {
        var result = responseData['Result'];
        if (result == "1") {
          return true;
        } else {
          alert("HesapOluştur: API ile bağlantı kurulamadı!");
          return false;
        }
      })
      .catch((error) => {
        alert("Hata: " + error);
        return false;
      })
  };

  kayitOl = async () => {
    var tcknError;
    if (this.state.tcknError !== '') {
      tcknError = this.state.tcknError;
    }
    else {
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

  tcknKontrol = async (tckn) => {
    if (tckn.length == 11) {
      this.setState({ tckn });
      return fetch('https://householdapi.azurewebsites.net/api/Musteri',
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
            var tcknvarmi = false;
            var data = responseData['Data'];
            for (var i = 0; i < data.length; i++) {
              if (data[i]['tcKimlikNo'] === tckn) {
                tcknvarmi = true;
                break;
              }
            }

            if (tcknvarmi == true) {
              this.setState({ tcknError: 'Bu TCKN Daha önce Kayıtlı!' });
            } else {
              this.setState({ tcknError: '' });
            }

          } else {
            alert("HesapOluştur: API ile bağlantı kurulamadı!");
            return false;
          }
        })
        .catch((error) => {
          alert("Hata: " + error);
          return false;
        })
    } else {
      this.setState({ tckn, tcknError: '' });
    }
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
              text = tckn.replace(/[0]*/, '').replace(/[^\d]*/g, '');
              this.tcknKontrol(text);
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
              adsoyad = adsoyad.replace(/[ ]*/, '').replace(/[^a-zA-ZığüçşöİĞÜÇŞÖ ]*/g, '')
              this.setState({ adsoyad, adsoyadError: '' });
            }}
            value={this.state.adsoyad}
            error={!!this.state.adsoyadError}
            errorText={this.state.adsoyadError}
            maxLength={50}

          />

          <TextInput secureTextEntry={true}
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

          <TextInput secureTextEntry={true}
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
              tel = tel.replace(/^[^0]*/, '').replace(/[^\d]*/g, '');
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
              adres = adres.replace(/[ ]*/, '').replace(/[^[0-9]a-zA-ZığüçşöİĞÜÇŞÖ.:\/ ]*/g, '');
              this.setState({ adres, adresError: '' });
            }}
            value={this.state.adres}
            error={!!this.state.adresError}
            errorText={this.state.adresError}
            maxLength={150}

          />

          <Button mode="contained" onPress={this.kayitOl.bind(this)}>
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