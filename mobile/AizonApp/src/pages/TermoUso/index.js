import React, { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';

import {  Text, StyleSheet, Image } from 'react-native';

import { Background, Container2, Container1, ContainerScreenImage,
  AreaText,AreaInfoText, AreaTitleText, SubmitButton, SubmitText } from './styles';

import { useNavigation } from '@react-navigation/native';

import { storageTermoUso, loadTermoUso } from '../../util/util';


export default function TermoUso(props) {

  const { user, signed } = useContext(AuthContext);

  const [termoUsoStore, setTermoUsoStore] = useState(false);

    useEffect(()=> {
       async function loadStorageTermoUso(){
           const data = await loadTermoUso();

           console.log('useEffect loadTermoUso = ', data);

            if (data) {
              setTermoUsoStore(true);
            }
       }

       loadStorageTermoUso();
    }, []);

  const navigation = useNavigation();

  async function handleAceito() {
    console.log('handleAceito = ');
    await storageTermoUso();
    setTermoUsoStore(true);
  }

  function confirmarTermoUso() {
    if (termoUsoStore) {
      return (
        <ContainerScreenImage>
          <AreaInfoText>
              Termo de uso foi aceito!
          </AreaInfoText>
       </ContainerScreenImage>
      )
    } else {
      return (
        <ContainerScreenImage>
          <SubmitButton onPress={handleAceito}>
              <SubmitText> Concordo </SubmitText>
          </SubmitButton>
        </ContainerScreenImage>
      )
    }
  }


 return (

      <Background>

          <Container1
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            enabled
          >
             <AreaTitleText>
                Importante
              </AreaTitleText>

              <AreaText>
                    Para criar uma conta no AizonApp você precisa
                    concordar com nosso termo de uso.
              </AreaText>
          </Container1>

          <Container2>
                <AreaTitleText>
                    1. A Empresa
                </AreaTitleText>

                <AreaText>
                    Amazon Informática Ltda é uma empresa
                    brasileira com sede em Belém-PA, que desenvolveu
                    um aplicativo (app) para uso em smarthphone, o mesmo
                    permite ao usuário cadastrar e processar os seus dados
                    pessoais de modo automático com uso de recurso de inteligência
                    artificial, o mesmo também ortoga ao usuário o controle sobre
                    os seus dados pessoais, bem como, a autorização dos fornecedores
                    de produtos e serviços na utilização ou não dos mesmos, conforme
                    Lei 13709 de 14/08/2018.
                    A idéia surgiu a partir da
                    constatação na falta de controle
                    eletrônico para a pessoa física
                    natural sobre os fornecedores
                    de produtos e/ou serviços que possuem
                    a real autorização para uso de
                    seus dados pessoais e dados sensíveis.
                </AreaText>

                <AreaText>

                </AreaText>


                {confirmarTermoUso()}
        </Container2>

      </Background>
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