import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Profil = () => (
  <Image source={require('../assets/profil.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    marginBottom: 12,
    borderRadius: 20
  },
});

export default memo(Profil);
