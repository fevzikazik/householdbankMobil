import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';

const HomeScreen = ({ navigation }) => (
  <Background>
    <Logo />
    <Header>HouseholdBank Mobil</Header>
    
    <Paragraph>
      Hoşgeldiniz, Bankacılık işlemleri artık mobilde!
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
      Giriş Yap
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('RegisterScreen')}
    >
      Kayıt Ol
    </Button>
  </Background>
);

export default memo(HomeScreen);
