import React, { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';

import {  Text, StyleSheet, Image } from 'react-native';

import Swiper from 'react-native-swiper';

import { Background, Container2, Container1, Logo, AreaText,
  AreaImage, ContainerMain, ContainerScreenImage,
  ContainerScreenHeader, HeaderTitle } from './styles';

export default function Boarding(props) {



  const { user } = useContext(AuthContext);

  //para atualizar a foto após ser retirado
  //const encodedData = 'R0lGODlhAQABAIAAAAAA...7';
  //<Image source={{uri: `data:image/gif;base64,${encodedData}`}} />
  //https://medium.com/@awesomejerry/image-with-react-native-98e7363f6dfe


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

        <ContainerScreenImage>
          <Text style={styles.text}>1 - Beautiful</Text>
        </ContainerScreenImage>

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