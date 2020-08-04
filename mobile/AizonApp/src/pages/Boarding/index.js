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

  function getSwipeOne() {
    return (
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
                          Esse é o Aizon App
                          com ele você pode centralizar
                          e manter todos os seus documentos
                          e dados pessoais.
                      </AreaText>
            </Container2>

        </Background>
    )
  }

  function getSwipeTwo() {
    return (
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
                          O seu principal objetivo é de
                          empoderar a pessoa quanto ao uso
                          ou não dos seus dados pessoais
                          e de seus dependentes junto aos
                          seus fornecedores de produtos e/ou
                          serviços.
                      </AreaText>
            </Container2>

        </Background>
    );
  }

  function getSwipeThird() {
    return (
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
                          E o melhor de tudo, você
                          define quem pode ou não utilizar
                          o uso dos seus dados pessoais
                          e de seus dependentes conforme
                          a LGPD - Lei Geral de Proteção
                          aos Dados (Lei 13.709 de
                          14/08/2018).
                      </AreaText>
            </Container2>
          </Background>
    )

  }

  function getSwipeFour() {
    return (
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
                        AizonApp
                        é a solução para riscos de fraudes
                        com uso de seus dados pessoais.
                    </AreaText>

                    <AreaText>
                        Para primeiro acesso é necessário criar uma conta no
                        app.
                    </AreaText>





            <SubmitButton onPress={handleApp}>
                <SubmitText> Login </SubmitText>
            </SubmitButton>
          </Container2>

        </Background>
    )

  }


 return (

    <Swiper style={styles.wrapper} showsButtons={true} loop={false}>

      { getSwipeOne()}
      { getSwipeTwo()}
      { getSwipeThird()}
      { getSwipeFour()}

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