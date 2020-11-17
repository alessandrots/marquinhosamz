import React, { useContext, useState } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity,
  View, Text, ScrollView, ActivityIndicator, Image, Dimensions, TouchableHighlight,
  Modal} from 'react-native';

import { useNavigation } from '@react-navigation/native';


import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PhotoService from '../../services/photo/PhotoService';

import FotoScan from '../../components/FotoScan';

import { alertMessage, storageUpload, loadStatusProcessingImage, loadStorageUpload, loadBase64PdfView} from '../../util/util';
import RNFetchBlob from 'rn-fetch-blob';

import { Background, ContainerMain, SendImageBackground,
  ContainerImageRight, ContainerImageLeft,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText, ItemText } from './styles';

import { ContainerHeader, ContainerFooter } from '../Home/styles';

export default function SendDocInfo() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idProcess, setIdProcess] = useState("");
  const [imageFrontal, setImageFrontal] = useState(null);

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  /**
  function seguirPageFoto() {
    navigation.navigate('PhotoManager');
  }
   */

  function seguirPageFotoScan() {
    generateIdForImages();

    //generateIdForImagesTmp();
  }

  async function generateIdForImages() {
    //alertMessage( 'Gerando do ID de controle', null, null, 'AIZON-IMAGE')

    setLoading(true);

    const resposta = await PhotoService.getIdForProcessImage('/image/getIdDocument');
    const res = resposta.res

    if (!resposta.isErro) {
      setLoading(false);

      let data = res.data;

      console.log('AIZONApp_FotoScan_SendDocInfo generateIdForImages data = ', data);

      let msg = "ID gerado com sucesso : " + data.Id;

      setIdProcess(data.Id);

      storageUpload(data.Id);

      //alertMessage( msg, null, null, 'AIZON-IMAGE');

      //para abrir a tela q vai chamar o componente de Foto
      setVisible(true);

    } else {
      setLoading(false);
      alertMessage( 'Houve erro na geração do ID para processamento', null, null, 'AIZON-UPLOAD')
    }
  }


  function seguirPageIP () {
    PhotoService.getJsonAxios();
  }

  async function generateIdForImagesTmp() {
    console.log('AIZONApp_  generateIdForImagesTmp = ');
    //alertMessage( 'generateIdForImagesTmp', null, null, 'AIZON-UPLOAD');

    setIdProcess('1001001');

    //para abrir a tela q vai chamar o componente de Foto
    setVisible(true);
  }

  function getUtf8(file) {
      const fs = RNFetchBlob.fs;

      fs.readFile(file)
      .then((dataF) => {
        console.log('\n\n AIZONApp_ getUtf8 = ', dataF);
      }).catch((err) => {
        console.log('AIZONApp_ getUtf8 err = ', err);
      });
  }

  function getBase64(file) {
    const fs = RNFetchBlob.fs;

      fs.readFile(file, 'base64')
      .then((dataF) => {
        console.log('\n\n AIZONApp_ getBase64 = ', dataF);
        setImageFrontal(dataF);
      }).catch((err) => {
        console.log('AIZONApp_ getBase64 err = ', err);
      });
  }


  async function fecharModal () {
    const status = await loadStatusProcessingImage();

    console.log('AIZONApp_ fecharModal  = ', status);

    if (status) {
      if (status === '2') {
        alertMessage( 'Em Processamento! Tela Não pode ser fechada', null, null, 'AIZON-PROCESS');
        return;
      } else if (status === '3') {
        setVisible(!visible);

        const id_ = await loadStorageUpload();
        console.log('AIZONApp_ fecharModal  id_ = ', id_);
        const base64Pdf = await loadBase64PdfView();
        console.log('AIZONApp_ fecharModal  base64Pdf = ', base64Pdf);

        let myData = {};
        myData['id'] = id_;
        myData['base64Pdf'] = base64Pdf;
        let fnGo = goToDataVisualization;

        console.log('AIZONApp_ myData  = ', myData);

        //TODO chamar para redirecionar para a página de Visualizar
        alertMessage( 'Processamento Finalizado com Sucesso', fnGo, myData, 'AIZON-PROCESS');
      } else if (status === '4') {
        setVisible(!visible);

        alertMessage( 'Houve erro no processamento. Tente Novamente!', fnGo, myData, 'AIZON-PROCESS');

        //TODO chamar para redirecionar para a página de Visualizar
      } else {
        console.log('AIZONApp_ else 2 ');
        setVisible(!visible);
      }
    } else  {
      console.log('AIZONApp_ else main ');
      setVisible(!visible);
    }
  }

  function goToDataVisualization(data) {
    console.log('AIZONApp_ goToDataVisualization = ', data);

    navigation.navigate('PdfCertificate', { 'idProcess': data.id, 'base64Pdf': data.base64Pdf});
  }

  function getFotoScan() {
    return (
      <FotoScan idProcesso={idProcess} />
    );
  }

  function getMainArea() {
    return (
      <>
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
        </>
      )
  }

  function getModalPhotoReal() {
        console.log('AIZONApp_  getModalPhotoReal = ');

        return (
          <>
              <View style={photoStyles.container}>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={visible}
                          onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                          }}
                        >
                          <View style={photoStyles.modalView}>
                              <FotoScan idProcesso={idProcess} onFecharModal={ () => fecharModal()}/>
                          </View>

                        </Modal>

                  </View>

          </>
        )
  }


  function getMainScreen() {
    return (
        <Background>
        <ContainerHeader>
          <Header titlePage="Orientações"/>
        </ContainerHeader>

          <ContainerMain>
            <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>

            { getMainArea() }

            {visible && getModalPhotoReal() }

            <ContainerScreenButton>
              <SubmitButton onPress={seguirPageFotoScan}>
                  <SubmitText>Continuar</SubmitText>
              </SubmitButton>

              {/**
              <SubmitButton onPress={seguirPageIP}>
                  <SubmitText>axios</SubmitText>
              </SubmitButton>
              */}

            </ContainerScreenButton>

          </ContainerMain>

        <ContainerFooter>
          <Footer titlePage="AIZON"/>
        </ContainerFooter>

      </Background>
    );
  }

  function getMontagemTela() {
    console.log('AIZONApp_ getMontagemTela = ', visible);

    return getMainScreen();
  }

 return (
    getMontagemTela()
  );
}

const photoStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      margin: 20,
  },

  containerRow: {
    flex: 1,
    //backgroundColor :'#CC0000',
    flexDirection: 'column',
    margin: 20,
  },

  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#0EABB5",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },

  closeButton: {
    backgroundColor: "#0EABB5",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 130,
    height: 40,
    marginLeft: 120,
    marginRight: 20,
    marginBottom: 35,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  textStyleButton: {
    color: "#F0B42F",
    fontWeight: "bold",
    textAlign: "center",
    marginTop:20
  },

  viewPrincipal:{
    flex:1,
    flexDirection: "column",
  },

  viewLine1: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#a0efef",
    ...Platform.select({
      android: { paddingTop: 10, paddingBottom: 10 },
      default: null,
    }),
  },
  viewLine2: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    ...Platform.select({
      android: { paddingTop: 10, paddingBottom: 10},
      default: null,
    }),
  },

  safeAreaViewCmp: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
    marginTop: 10,
  },

  scrollView: {
    backgroundColor: "#FFF",
    marginHorizontal: 15,
  },

  textDataFirst: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,

  },

  textTitleError: {
    fontSize: 14,
    color: "#CC0000",
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 80,
  },

});