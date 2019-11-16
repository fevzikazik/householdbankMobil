import React, { useState } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "../navigator/AppNavigation.js";

export default function HGS({ navigation }) {
  
  return (
      <Background>
  
        <Header>HGS</Header>
      </Background>
    )
}

HGS.navigationOptions = {
  title: 'HGS',
  headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
};
