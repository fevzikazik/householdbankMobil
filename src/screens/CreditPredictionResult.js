import React, { Component } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { FlatList, StyleSheet, Text, View, ScrollView } from 'react-native';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import { drawer } from "./Dashboard";
export default class CreditPredictionResult extends Component {

  constructor(props) {
    super(props); // super arguman geçmenizi sağlar eğer constructor kullanmak isterseniz kullanmak zorunlu oluyor.

    this.state = { // burası bind da kullandığım değerler
      loading: false,
      sonuclar: this.props.navigation.state.params.krediSonuc
    };

  };

  static navigationOptions = {
    title: 'Kredi Tahmini Sonuçları',
    headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
  };

  render() {
    return (
      <ScrollView>
        <Background>

          <FlatList
            style={{ minWidth: 350 }}
            data={this.state.sonuclar}
            renderItem={({ item }) => (
              <ListItem
                topDivider
                onPress={() => alert('!')}
                title={'Model: ' + item.Model}
                subtitle={'Oran: %' + item.Oran}
                rightAvatar={{ source:  item.Oran >= 75 ? require('../assets/accept.png') : require('../assets/reject.png') }}
                bottomDivider
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
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