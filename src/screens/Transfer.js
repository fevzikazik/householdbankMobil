import React, { useState } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text, Picker } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "./Dashboard";

export default function Transfer({ navigation }) {

  return (
    <Background>

      <Header>Transfer</Header>

      <Picker
        mode='dialog'
        selectedValue={'java'}
        style={{ height: 50, width: 100 }}
        onValueChange={(itemValue, itemIndex) => drawer.current.open()}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>

    </Background>
  )
}

Transfer.navigationOptions = {
  title: 'Havale',
  headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
};
