import React, { useState, Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "./Dashboard";

export default class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accs: []
    };
    
    alert('accs: ' + JSON.stringify(this.props));
  };

  static navigationOptions = {
    title: 'Hesaplarım',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  GetAccounts = () => {
    let Customer = this.props.navigation.state.params.musteri;
    let tcKimlikNo = Customer.tcKimlikNo;

    fetch('https://householdwebapi.azurewebsites.net/api/Hesap/' + tcKimlikNo,
      {
        method: 'GET',
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json'
        }
      })

      .then((response) => response.json())
      .then((responseData) => {
        var accListCount = responseData['Data'].length;
        //alert(accListCount);
        var accList= responseData['Data'];
        this.setState({ accs: accList });
        //alert(accList);
      })
      .catch((error) => {
        alert(error);
      })
  }

  list = [
    {
      hesapEkNo: '5001',
      subtitle: 'Vadeli Hesap'
    },
    {
      hesapEkNo: '5002',
      subtitle: 'Vadeli Hesap'
    },
  ]

  render() {
    return (
      <Background>

        <Header>Yeni Hesap Aç</Header>

        <Button mode="contained" onPress={() => this.GetAccounts()} style={styles.button}>
          Hesap Aç
        </Button>

        <Header>Hesaplarım:</Header>
        <FlatList
          style={{ minWidth: 300 }}
          data={this.state.accs}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => drawer.current.open()}
              title={item.hesapEkNo}
              subtitle={item.bakiye}
              rightAvatar={{
                source: 'https://cdn3.iconfinder.com/data/icons/basicsiconic/512/right-512.png' && { uri: 'https://cdn3.iconfinder.com/data/icons/basicsiconic/512/right-512.png' }
              }}
              bottomDivider
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </Background>
    )
  }
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

