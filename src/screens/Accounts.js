import React, { useState } from 'react';
import { Icon, ListItem } from 'react-native-elements'
import { StyleSheet, FlatList, Text } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import Header from '../components/Header';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { drawer } from "../navigator/AppNavigation.js";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    navigation.navigate('LoginScreen');
  };

  const list = [
    {
      hesapEkNo: '5001',
      subtitle: 'Vadeli Hesap'
    },
    {
      hesapEkNo: '5002',
      subtitle: 'Vadeli Hesap'
    },
  ]

    return (
      <Background>
  
        <Header>Yeni Hesap Aç</Header>
  
        <Button mode="contained" onPress={() => drawer.current.open()} style={styles.button}>
          Hesap Aç
        </Button>
  
        <Header>Hesaplarım:</Header>
        <FlatList
          style={{minWidth:300}}
          data={list}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => drawer.current.open()}
              title={item.hesapEkNo}
              subtitle={item.subtitle}
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

ForgotPasswordScreen.navigationOptions = {
  title: 'Hesaplarım',
  headerLeft: <Icon name="menu" size={35} onPress={() => drawer.current.open()} />
};
