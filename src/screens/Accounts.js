import React, { useState, Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text, ScrollView } from 'react-native';
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

    //alert('accs: ' + JSON.stringify(this.props));
  };

  componentDidMount = () => {
    this.GetAccounts();
  };

  static navigationOptions = {
    title: 'Hesaplarım',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  GetAccounts = () => {
    let Customer = this.props.screenProps.musteri;
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
        var accList = responseData['Data'];
        this.setState({ accs: accList });
        //alert(accList);
      })
      .catch((error) => {
        alert(error);
      })
  }

  render() {
    return (
      <ScrollView>
        <Background>

          <Header>Yeni Hesap Aç</Header>

          <Button mode="contained" onPress={() => pass} style={styles.button}>
            Hesap Aç
        </Button>

          <Header>Hesaplarım:</Header>
          <FlatList
            style={{ minWidth: 300 }}
            data={this.state.accs}
            renderItem={({ item }) => (
              <ListItem
                topDivider
                onPress={() => this.props.navigation.navigate('AccountDetail', { selectedAcc: item })}
                title={item.hesapEkNo}
                subtitle={'Bakiye: ' + item.bakiye + ' TL'}
                rightAvatar={{
                  source: 'https://cdn3.iconfinder.com/data/icons/basicsiconic/512/right-512.png' && { uri: 'https://cdn3.iconfinder.com/data/icons/basicsiconic/512/right-512.png' }
                }}
                bottomDivider
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </Background>
      </ScrollView>
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

