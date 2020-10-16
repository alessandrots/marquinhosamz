import React, { useContext, useState } from 'react';
import { ImageBackground, View, Text, Button, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PhotoService from '../../services/photo/PhotoService';

import FotoScan from '../../components/FotoScan';

import { alertMessage } from '../../util/util';

import { Background, ContainerMain, SendImageBackground,
  ContainerImageRight, ContainerImageLeft,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText, ItemText } from './styles';

import { ContainerHeader, ContainerFooter } from '../Home/styles';

export default function SendDocInfo() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idProcess, setIdProcess] = useState(0);

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  function seguirPageFoto() {
    navigation.navigate('PhotoManager');
  }

  function seguirPageFotoScan() {
    //setVisible(true);
    generateIdForImages();
  }

  async function generateIdForImages() {

    alertMessage( 'Gerando do ID de controle', null, null, 'AIZON-UPLOAD')

    setLoading(true);

    const resposta = await PhotoService.getIdForProcessImage('/image/getIdDocument');

    //console.log('SendDocInfo generateIdForImages resposta = ', resposta);

    const res = resposta.res

    //console.log('SendDocInfo generateIdForImages res = ', res);

    if (!resposta.isErro) {
      setLoading(false);

      let data = res.data;

      console.log('SendDocInfo generateIdForImages data = ', data);

      let msg = "ID gerado com sucesso : " + data.Id;

      setIdProcess(data.Id);

      alertMessage( msg, null, null, 'AIZON-UPLOAD');

      //para abrir a tela q vai chamar o componente de Foto
      setVisible(true);

      //seguirPageFotoScan();

    } else {
      setLoading(false);
      alertMessage( 'Houve erro na geração do ID para processamento', null, null, 'AIZON-UPLOAD')
    }
  }

  function getFotoScan() {
    return (
      <FotoScan idProcess={idProcess} />
    );
  }


  function getMainScreen() {
    return (
        <Background>
        <ContainerHeader>
          <Header titlePage="Orientações"/>
        </ContainerHeader>

          <ContainerMain>
            <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>
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