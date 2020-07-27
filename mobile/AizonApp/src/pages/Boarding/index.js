import React, { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';

import {  Text, StyleSheet, Image } from 'react-native';

import Swiper from 'react-native-swiper';

import { Background, Container2, Container1, Logo, AreaText,
  AreaImage, ContainerMain, ContainerScreenImage,
  ContainerScreenHeader, HeaderTitle, SubmitButton, SubmitText } from './styles';

import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function Boarding(props) {

  const { user, signed } = useContext(AuthContext);

  const navigation = useNavigation();

  //import AsyncStorage from '@react-native-community/async-storage';
  //tem um boardingPage=1
  async function handleApp() {
    console.log('====================================');
    console.log('\n Fazer o tratamento  \n');
    console.log('====================================');

    //await AsyncStorage.setItem('boardingPage', true);
    await AsyncStorage.setItem('boardingPage', JSON.stringify(true));

    navigation.navigate('Login');
  }

 return (

    <Swiper style={styles.wrapper} showsButtons={true} loop={false}>
        <Background>
            <Container1
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              enabled
            >
              <AreaImage>
                  <Logo source={require('../../assets/logo_aizon.png')}/>
              </AreaImage>
            </Container1>

            <Container2>
                  <AreaText>
                      blabla
                      blabla
                      blabla
                      blabla
                      blabla
                      blabla
                      blabla
                  </AreaText>
            </Container2>
      </Background>

      <Background>

          <ContainerMain>
            <ContainerScreenHeader>

              <HeaderTitle>Utilize sua identidade blabla ...  </HeaderTitle>
            </ContainerScreenHeader>

            <ContainerScreenImage>

              <Image
                source={require('../../assets/IdentidadeCPF.png')}
                style={{
                  width: 300,
                  height: 200,
                  resizeMode: 'contain'
                }}
                />
            </ContainerScreenImage>

          </ContainerMain>


      </Background>

      <Background>

      <ContainerMain>
        <ContainerScreenHeader>

          <HeaderTitle>
              blabla
              blabla
              blabla ...
          </HeaderTitle>
        </ContainerScreenHeader>

        <Container1>
                  <AreaText>
                      blabla
                      blabla
                      blabla
                      blabla
                      blabla
                      blabla
                      blabla
                  </AreaText>


        </Container1>

        <Container2>

          <SubmitButton onPress={handleApp}>
              <SubmitText> Login </SubmitText>
          </SubmitButton>
        </Container2>

      </ContainerMain>

      </Background>
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