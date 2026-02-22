import React from 'react';
import { Image, TouchableOpacity, Linking } from 'react-native';
import facebook from '../assets/logo.png';


function IconoHeader() {

  return (
  
      <Image resizeMode="contain"
        style={{ width: 40, height: 40, marginRight: 10 }}
        source={facebook}
      />
  );
}

export default IconoHeader;
