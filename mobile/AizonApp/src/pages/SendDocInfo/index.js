import React, { useContext, useState } from 'react';
import { ImageBackground, View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../services/api';

import FotoScan from '../../components/FotoScan';

import { Background, ContainerMain, SendImageBackground,
  ContainerImageRight, ContainerImageLeft,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText, ItemText } from './styles';

import { ContainerHeader, ContainerFooter } from '../Home/styles';

export default function SendDocInfo() {

  const [visible, setVisible] = useState(false);

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  function seguirPageFoto() {
    navigation.navigate('PhotoManager');
  }

  function seguirPageFotoScan() {
    setVisible(true);
  }

  function getFotoScan() {
    return (
      <FotoScan/>
    );
  }


  function getMainScreen() {
    return (
        <Background>
        <ContainerHeader>
          <Header titlePage="Orientações"/>
        </ContainerHeader>

          <ContainerMain>
            <ContainerImageRight>

              <Image
                source={require('../../assets/IdentidadeFrente.png')}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: 'contain'
                }}
                />
                <ContainerDadosView>
                  <TitleText>Primeira Fotografia: </TitleText>
                  <ItemText>
                    1 - Posicione primeiramente o
                    documento pelo lado que contenha a
                    foto do documento.
                  </ItemText>
                  <ItemText>
                    2 - Tire a fotografia dessa
                    parte do documento conforme linhas
                    de orientação.
                  </ItemText>
                </ContainerDadosView>
            </ContainerImageRight>

            <ContainerImageLeft>
              <ContainerDadosView>
                <TitleText>Segunda Fotografia: </TitleText>
                <ItemText>
                    1 - Posicione primeiramente o
                    documento pelo lado que contenha os
                    dados do documento.
                </ItemText>
                <ItemText>
                    2 - Tire a fotografia dessa
                    parte do documento conforme linhas
                    de orientação.
                </ItemText>
              </ContainerDadosView>

              <Image
                source={require('../../assets/IdentidadeTras.png')}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: 'contain'
                }}
                />
            </ContainerImageLeft>

            <ContainerScreenButton>
              <SubmitButton onPress={seguirPageFotoScan}>
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

  function getMontagemTela() {
    console.log('getMontagemTela = ', visible);

    if (!visible){
      return getMainScreen();
    } else {
     return getFotoScan();
    }
  }

 return (
    getMontagemTela()
  );
}