import React, { useContext, useState } from 'react';
import { ImageBackground, View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../services/api'

import PhotoService from '../../services/photo/PhotoService';

import { Background, ContainerMain, SendImageBackground,
  ContainerScreenHeader, ContainerScreenImage,
  ContainerScreenButton, HeaderTitle,
  SubmitButton, SubmitText} from './styles';
import { ContainerHeader, ContainerFooter } from '../Home/styles';

export default function SendDocument() {

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  function seguirPageOrientacoes() {
    navigation.navigate('Orientation');
  }

 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Enviar Documento"/>
      </ContainerHeader>

      {/** trocar VIew por ImageBackground
       * TODO importante
       *  source={require('../../assets/SendDocument-background.png')}
       *  styles={styles.container}
       *  imageStyle={{width:74, height:383}}


      <SendImageBackground
          source={require('../../assets/material-design-background-orange.jpg')}
          imageStyle={{width:74, height:383}}
      >
      */}
        <ContainerMain>
          <ContainerScreenHeader>

            <HeaderTitle>Qual documento será utilizado ? </HeaderTitle>
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

          <ContainerScreenButton>
            <SubmitButton onPress={seguirPageOrientacoes}>
                <SubmitText>Continuar</SubmitText>
            </SubmitButton>
          </ContainerScreenButton>

        </ContainerMain>
      {/**</SendImageBackground>*/}

      <ContainerFooter>
        <Footer titlePage="AIZON"/>
      </ContainerFooter>

    </Background>
  );
}