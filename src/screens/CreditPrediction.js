import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import Background from '../components/Background';
import { Icon } from 'react-native-elements'
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { Switch } from 'react-native-paper';
import {
  krediMiktarValidator,
  yasValidator,
  aldigiKrediSayisiValidator
} from '../core/utils';
import Loader from '../core/loader';

export default class CreditPrediction extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      krediMiktar: '',
      krediMiktarError: '',
      yas: '',
      yasError: '',
      aldigiKrediSayisi: '',
      aldigiKrediSayisiError: '',
      evDurumu: 'evsahibi',
      telefonDurumu: 'var',
      isTelDurumu: true,
      isEvDurumu: true
    };

  };

  static navigationOptions = {
    title: 'Kredi Tahmini',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  predict = () => {
    const krediMiktarError = krediMiktarValidator(this.state.krediMiktar);
    const yasError = yasValidator(this.state.yas);
    const aldigiKrediSayisiError = aldigiKrediSayisiValidator(this.state.aldigiKrediSayisi);

    if (krediMiktarError || yasError || aldigiKrediSayisiError) {
      this.setState({ krediMiktarError, yasError, aldigiKrediSayisiError })
      return;
    }

    this.setState({ loading: true });

    fetch('https://kreditahmini.azurewebsites.net/test',
      {
        method: 'POST',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'krediMiktari': this.state.krediMiktar,
          'yas': this.state.yas,
          'aldigi_kredi_sayi': this.state.aldigiKrediSayisi,
          'evDurumu': this.state.evDurumu,
          'telefonDurumu': this.state.telefonDurumu
        })
      })

      .then((response) => response.json())
      .then((resp) => {
        this.setState({ loading: false });
        //alert(JSON.stringify(resp));
        var sonuc = resp;
        this.props.navigation.navigate('CreditPredictionResult', { krediSonuc: sonuc });
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert('Hata:KrediServisi: ' + error);
      })


  };

  test = () => {

    var sonuc = [
      { "Model": "LogisticRegression", "Oran": "90.64" },
      { "Model": "GradientBoosting", "Oran": "94.02" },
      { "Model": "NaiveBayes", "Oran": "91.55" },
      { "Model": "DecisionTree(NoParam)", "Oran": "100.0" },
      { "Model": "DecisionTree(GridSearch)", "Oran": "54.55" },
      { "Model": "RandomForest(GridSearch)", "Oran": "76.95" },
      { "Model": "RandomForest(2 Param)", "Oran": "90.0" },
      { "Model": "KNeighborsClassifier", "Oran": "100.0" },
      { "Model": "LinearDiscriminantAnalysis", "Oran": "89.44" },
      { "Model": "AdaBoostClassifier", "Oran": "50.95" },
      { "Model": "BaggingClassifier", "Oran": "70.0" }
    ];

    this.props.navigation.navigate('CreditPredictionResult', { krediSonuc: sonuc });
  };

  evDurumuKontrol = (value) => {
    if (value) {
      this.setState({ evDurumu: 'evsahibi' });
    }
    else {
      this.setState({ evDurumu: 'kiraci' });
    }
  };

  telefonDurumuKontrol = (value) => {
    if (value) {
      this.setState({ telefonDurumu: 'var' });
    }
    else {
      this.setState({ telefonDurumu: 'yok' });
    }
  };

  render() {
    return (
      <Background>
        <Loader
          loading={this.state.loading} />

        <Header>Kredi Bilgilerini Girin</Header>

        <TextInput
          label="Kredi Miktarı"
          onChangeText={(krediMiktar) => {
            krediMiktar = krediMiktar.replace(/[0]*/, '').replace(/[^\d]*/g, '');
            this.setState({ krediMiktar, krediMiktarError: '' });
          }}
          value={this.state.krediMiktar}
          error={!!this.state.krediMiktarError}
          errorText={this.state.krediMiktarError}
          maxLength={6}
          keyboardType={'numeric'}

        />

        <TextInput
          label="Yaş"
          onChangeText={(yas) => {
            yas = yas.replace(/[0]*/, '').replace(/[^\d]*/g, '');
            this.setState({ yas, yasError: '' });
          }}
          value={this.state.yas}
          error={!!this.state.yasError}
          errorText={this.state.yasError}
          maxLength={3}
          keyboardType={'numeric'}

        />

        <TextInput
          label="Aldığı Kredi Sayısı"
          onChangeText={(aldigiKrediSayisi) => {
            aldigiKrediSayisi = aldigiKrediSayisi.replace(/[ ]*/, '').replace(/[^\d]*/g, '');
            this.setState({ aldigiKrediSayisi, aldigiKrediSayisiError: '' });
          }}
          value={this.state.aldigiKrediSayisi}
          error={!!this.state.aldigiKrediSayisiError}
          errorText={this.state.aldigiKrediSayisiError}
          maxLength={2}
          keyboardType={'numeric'}

        />
        <Header>Ev Durumu: ({this.state.evDurumu})</Header>
        <Switch
          value={this.state.isEvDurumu}
          onValueChange={(value) => {
            this.setState({ isEvDurumu: value });
            this.evDurumuKontrol(value);
          }
          }
        />


        <Header>Telefon Durumu: ({this.state.telefonDurumu})</Header>
        <Switch
          value={this.state.isTelDurumu}
          onValueChange={(value) => {
            this.setState({ isTelDurumu: value });
            this.telefonDurumuKontrol(value);
          }
          }
        />

        <Button mode="contained" onPress={this.predict.bind(this)}>
          Kredi Tahminle
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