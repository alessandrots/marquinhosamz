import React, { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';

import {  View, Text, StyleSheet, Image,
  Dimensions, TouchableHighlight, Modal} from 'react-native';

import Swiper from 'react-native-swiper';

export default function Boarding(props) {



  const { user } = useContext(AuthContext);

  //para atualizar a foto após ser retirado
  //const encodedData = 'R0lGODlhAQABAIAAAAAA...7';
  //<Image source={{uri: `data:image/gif;base64,${encodedData}`}} />
  //https://medium.com/@awesomejerry/image-with-react-native-98e7363f6dfe


 return (

    <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>
        <Text style={styles.text}>Hello Swiper</Text>
        </View>
        <View style={styles.slide2}>
        <Text style={styles.text}>Beautiful</Text>
        </View>
        <View style={styles.slide3}>
        <Text style={styles.text}>And simple</Text>
        </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB'
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
  });