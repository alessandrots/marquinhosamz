import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, Image, ActivityIndicator,
  TouchableOpacity, Modal, Dimensions, Alert, TouchableHighlight} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../Header';
import Footer from '../Footer';
import ImageList from "../ImageList/ImageList";
import PhotoService from '../../services/photo/PhotoService';
import FotoLayerCmp from '../FotoLayerCmp';

import OpenCV from '../../NativeModules/OpenCV';

import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/MaterialIcons";

import RNFetchBlob from 'rn-fetch-blob';

import { Background, ContainerMain,ContainerHeader, ContainerFooter,
  ContainerImageRight, ContainerImageLeft, ContainerImagens,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText } from './styles';

import { alertMessage, storageStatusProcessingImage, storageBase64PdfView } from '../../util/util';

export default function FotoScan(props) {

  const [images, setImages] = useState([]);
  const [currentImageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  const [imagesOriginal, setImagesOriginal] = useState();
  const [imageFrontal, setImageFrontal] = useState(null);
  const [imageVerso, setImageVerso]     = useState(null);

  const [visibleList, setIsVisibleList] = useState(false);
  const [loading, setLoading] = useState(false);

  const [idProcess, setIdProcess] = useState("");
  const [urlsPipeline, setUrlsPipeline] = useState([]);

  useEffect(() => {

    console.log('AIZONApp_ FotoScan props = ', props);

    if (props?.idProcesso) {
      alertMessage( 'Gerado do ID de controle ' + props.idProcesso, null, null, 'AIZON-IMAGE')
      storageStatusProcessingImage(1);
      setIdProcess(props.idProcesso);
      let urls = new Array();
      urls.push("/image/classification2");
      urls.push("/image/pre_process_image2");
      urls.push("/image/data_extract2");
      urls.push("/image/data_validate2");
      urls.push("/image/pdf_process_certify2");
      setUrlsPipeline(urls);
    }

  }, []);

  /**
   *
   * colocar as imgs base64 dentro do array ao carregar a tela
   * vê se o useEffect serve para isso
   *
   * aí vẽ se as imagens das identidades do Alexandre são mostradas
   *
   */
  const navigation = useNavigation();

  const onSelect = (images, index) => {
    setImageIndex(index);
    setImagesOriginal(images);
    setIsVisible(true);
  };



  function scanner(tipoImagem) {
    console.log('AIZONApp_FotoScan_scanner');

    //scanImage('scanner');
    scanImageForProcess(tipoImagem);
  }

  /**
    let promise = new Promise(function(resolve, reject) {
      //
    });
   */
  async function scanImageForProcess(tipoImagem) {
    try {
      const response = await OpenCV.scanImageForProcess(idProcess, tipoImagem);

      console.log('\n\n AIZONApp_ response = ', response);

      let msg = "scanImageForProcess";

      postScanner(tipoImagem);

      alertMessage( msg, null, null, 'AIZON-IMAGE');
    } catch (e) {
      console.error(e);
    }
  };


  function postScanner(tipoImagem) {
    console.log('AIZONApp_ postScanner');
    setLoading(true);

    let myVar = null;
    let filename = 'SCANNED.jpg'

    let sTipoImg = tipoImagem.toString();

    let file = '/storage/emulated/0/Android/data/com.aizonapp/files/Pictures/AizonApp/' + idProcess + '/' + sTipoImg + '/' + filename ;

     myVar = setTimeout(() => {

       const fs = RNFetchBlob.fs;

       fs.readFile(file, 'base64')
       .then((dataF) => {
         //console.log('\n\n AIZONApp_ setTimeout = ', dataF);
         setLoading(false);

         if (dataF) {
          if (tipoImagem == 0) {
            setImageFrontal(dataF);
            showImageFrontal(dataF);
          } else {
            setImageVerso(dataF);
            showImageVerso(dataF);
          }

           console.log('\n\n AIZONApp_ clearTimeout');
           clearTimeout(myVar);
         }

       }).catch((err) => {
         console.log('AIZONApp_ readFile err = ', err);
         clearTimeout(myVar);
       });

     }, 3000);
  }

  //FORMA 1 DE CHAMAR TODO O FLUXO DE PROCESSAMENTO
  //Processa todo o fluxo via Chamadas via Promise
  async function processAllViaPromise() {

    if (!images || images.length == 0) {
      alertMessage('Não foi tirado nenhuma foto para processamento!', null, null, 'AIZON-PROCESS');
      return;
    }

    //Executando
    storageStatusProcessingImage(2);

    setLoading(true);

    executePromisePipeline(0);//await PhotoService.processPipeline('/image/processPipeline', idProcess);
  }

   /**
   * Após o clique do showImages ou showImagesTemp
   * Sugestão - Execução do Pipeline pelo Front:
   *  0- http://45.4.186.2:5000//image/classification2/{{id}}
   *  1- http://45.4.186.2:5000//image/pre_process_image2/{{id}}
   *  2- http://45.4.186.2:5000//image/data_extract2/{{id}}
   *  3- http://45.4.186.2:5000//image/data_validate2/{{id}}
   *  4- http://45.4.186.2:5000//image/pdf_process_certify2/{{id}}
   */
  function executePromisePipeline(contador) {
    console.log('AIZONApp_ Contador = ' + contador.toString() );

    new Promise((resolve, reject) => {
      let retorno = processSequencePipeline(urlsPipeline[contador]);

      if (retorno) {
        console.log('AIZONApp_ Sucesso na execução do pipeline. Fluxo : ', urlsPipeline[contador]);
        contador++;
        resolve(true);
      } else {
        throw new Error('Erro na execução do pipeline.');
      }
    })
    .then((ret) => {
      if (ret && (contador < urlsPipeline.length())) {
        console.log('AIZONApp_ resolve true execute again ');
        executePromisePipeline(contador);
      } else {
         setLoading(false);

         console.log('AIZONApp_ Finalização da execução do pipeline.');

         let msg = "Processamento finalizado com sucesso. Feche a janela.";

         //Finalizado
         storageStatusProcessingImage(3);
         alertMessage(msg, null, null, 'AIZON-PROCESS');
      }
    })
    .catch((err) => {
      setLoading(false);
      storageStatusProcessingImage(4);
      console.log('AIZONApp_ Erro na execução do pipeline. Fluxo : ', urlsPipeline[contador]);
      alertMessage( 'Houve erro no processamento das imagens', null, null, 'AIZON-PROCESS');
    })
  }

  async function processSequencePipeline(url) {
      const resposta = await PhotoService.processPipelineViaGet(url, idProcess);

      console.log('AIZONApp_ FotoScan processSequencePipeline resposta = ', resposta);

      const res = resposta.res;

      if (!resposta.isErro) {
        let data = res.data;

        console.log('AIZONApp_ FotoScan processSequencePipeline data = ', data);

        return true;
      } else {
        return false;
      }
   }


  //FORMA 2 DE CHAMAR TODO O FLUXO DE PROCESSAMENTO
  //Processa todo o fluxo via Chamadas de cada método e retorno
  async function processAll() {
    if (!images || images.length == 0) {
      alertMessage('Não foi tirado nenhuma foto para processamento!', null, null, 'AIZON-PROCESS');
      return;
    }

    //Executando
    storageStatusProcessingImage(2);

    setLoading(true);

    await classification();
  }

  async function classification() {

    const resposta = await PhotoService.processPipelineViaGet(urlsPipeline[0], idProcess);

    const res = resposta.res;

    if (!resposta.isErro) {
      let data = res.data;

      //console.log('AIZONApp_ FotoScan classification data = ', data);
      console.log('AIZONApp_ FotoScan classification SUCESS');

      preProcessImage();
    } else {
      storageStatusProcessingImage(4);
      setLoading(false);
      alertMessage( 'Houve erro no classification das imagens', null, null, 'AIZON-PROCESS');
    }
  }

  async function preProcessImage() {

    const resposta = await PhotoService.processPipelineViaGet(urlsPipeline[1], idProcess);

    const res = resposta.res;

    if (!resposta.isErro) {
      let data = res.data;

      //console.log('AIZONApp_ FotoScan preProcessImage data = ', data);
      console.log('AIZONApp_ FotoScan preProcessImage SUCESS');

      dataExtract();
    } else {
      storageStatusProcessingImage(4);
      setLoading(false);
      alertMessage( 'Houve erro no preProcessImage imagens', null, null, 'AIZON-PROCESS');
    }
  }

  async function dataExtract() {

    const resposta = await PhotoService.processPipelineViaGet(urlsPipeline[2], idProcess);

    const res = resposta.res;

    if (!resposta.isErro) {
      let data = res.data;

      //console.log('AIZONApp_ FotoScan data_extract2 data = ', data);
      console.log('AIZONApp_ FotoScan data_extract2 SUCESS');

      dataValidate();
    } else {
      storageStatusProcessingImage(4);
      setLoading(false);
      alertMessage( 'Houve erro no data_extract2 das imagens', null, null, 'AIZON-PROCESS');
    }
  }

  async function dataValidate() {

    const resposta = await PhotoService.processPipelineViaGet(urlsPipeline[3], idProcess);

    const res = resposta.res;

    if (!resposta.isErro) {
      let data = res.data;

      //console.log('AIZONApp_ FotoScan dataValidate data = ', data);
      console.log('AIZONApp_ FotoScan dataValidate SUCESS');

      pdfProcessCertify();
    } else {
      storageStatusProcessingImage(4);
      setLoading(false);
      alertMessage( 'Houve erro no dataValidate das imagens', null, null, 'AIZON-PROCESS');
    }
  }

  async function pdfProcessCertify() {

    const resposta = await PhotoService.processPipelineViaGet(urlsPipeline[4], idProcess);

    const res = resposta.res;

    if (!resposta.isErro) {
      setLoading(false);

      let data = res.data;

      console.log('AIZONApp_ FotoScan pdfProcessCertify base64 = ', data.pdf);

      storageBase64PdfView(data.pdf)

      let msg = "Processamento finalizado com sucesso. Feche a janela.";

      //Finalizado
      storageStatusProcessingImage(3);
      alertMessage(msg, null, null, 'AIZON-PROCESS');
    } else {
      storageStatusProcessingImage(4);
      setLoading(false);
      alertMessage( 'Houve erro no pdfProcessCertify das imagens', null, null, 'AIZON-PROCESS');
    }
  }

  //************************************************************ */

  async function showImageFrontal (imgBase64) {
    if (imgBase64) {
      let imgObjFrontal = {};
      imgObjFrontal['thumbnail'] = 'data:image/jpeg;base64,' + imgBase64;
      imgObjFrontal['uri'] = 'data:image/jpeg;base64,' + imgBase64;

      let arrTmp = [];

      if (images) {
        arrTmp = [...images];
        arrTmp.push(imgObjFrontal);
        console.log('AIZONApp_ showImageFrontal if = ');
        setImages(arrTmp);
        setIsVisibleList(true);
      } else {
        arrTmp.push(imgObjFrontal);
        console.log('AIZONApp_ showImageFrontal else = ');
        setImages(arrTmp);
        setIsVisibleList(true);
      }

      console.log('AIZONApp_ showImageFrontal f = ', images.length());
    }
  }

  async function showImageVerso (imgBase64) {
    if (imgBase64) {
      let imgObjVerso = {};
      imgObjVerso['thumbnail'] = 'data:image/jpeg;base64,' + imgBase64;
      imgObjVerso['uri'] = 'data:image/jpeg;base64,' + imgBase64;

      let arrTmp = [];

      if (images) {
        arrTmp = [...images];
        arrTmp.push(imgObjVerso);
        console.log('AIZONApp_ showImageVerso if = ');
        setImages(arrTmp);
        setIsVisibleList(true);
      } else {
        arrTmp.push(imgObjVerso);
        console.log('AIZONApp_ showImageVerso else = ');
        setImages(arrTmp);
        setIsVisibleList(true);
      }

      console.log('AIZONApp_ showImageVerso V = ', images.length());
    }
  }

  function refreshTela() {
    showImages ();
  }

  async function showImages () {

    if (imageFrontal && imageVerso) {
      let arr = [];

      let imgObjFrontal = {};
      imgObjFrontal['thumbnail'] = 'data:image/jpeg;base64,' + imageFrontal;
      imgObjFrontal['uri'] = 'data:image/jpeg;base64,' + imageFrontal;

      arr.push(imgObjFrontal);

      let imgObjVerso = {};
      imgObjVerso['thumbnail'] = 'data:image/jpeg;base64,' + imageVerso;
      imgObjVerso['uri'] = 'data:image/jpeg;base64,' + imageVerso;

      arr.push(imgObjVerso);

      setImages(arr);
      setIsVisibleList(true);
    }
  }

  function limparTela() {
    setImages([]);
    setIsVisibleList(false);
    setImageFrontal(null);
    setImageVerso(null);
    setLoading(false);
  }

  function goToDataVisualization(data) {
    navigation.navigate('ViewData', { side: '0', 'identificacaoDocumento': data.id});
  }

  function getMainScreen() {
    return (

      <Background>
        <ContainerHeader>
        <Header titlePage="Foto Scanner"/>
        </ContainerHeader>

          <ContainerMain>

            <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>
            <ContainerImageRight>

                <ContainerDadosView>
                  <TitleText> Frente - {idProcess}: </TitleText>
                  <SubmitButton onPress={ () => scanner(0) }>
                    <SubmitText>Foto</SubmitText>
                  </SubmitButton>
                </ContainerDadosView>

                {imageFrontal && (
                    <Image
                      source={{uri: `data:image/gif;base64,${imageFrontal}`}}
                      style={{
                        width: 150,
                        height: 100,
                        resizeMode: 'contain'
                      }}
                      />
                )}

                {!imageFrontal && (
                    <Image
                      source={require('../../assets/IdentidadeFrente.png')}
                      style={{
                        width: 150,
                        height: 150,
                        resizeMode: 'contain'
                      }}
                      />
                )}

            </ContainerImageRight>

            <ContainerImageLeft>
              <ContainerDadosView>
                <TitleText>Verso- {idProcess}: </TitleText>
                  <SubmitButton onPress={ () =>scanner(1) }>
                    <SubmitText>Foto</SubmitText>
                  </SubmitButton>
              </ContainerDadosView>

              {imageVerso && (
                    <Image
                      source={{uri: `data:image/gif;base64,${imageVerso}`}}
                      style={{
                        width: 150,
                        height: 100,
                        marginTop: 10,
                        resizeMode: 'contain'
                      }}
                      />
                )}

                {!imageVerso && (
                    <Image
                      source={require('../../assets/IdentidadeTras.png')}
                      style={{
                        width: 150,
                        height: 150,
                        resizeMode: 'contain'
                      }}
                      />
                )}
            </ContainerImageLeft>

            <ContainerImagens>
                <SafeAreaView>
                  {visibleList && (
                      <ImageList
                        images={images.map((image) => image.thumbnail)}
                        onPress={(index) => onSelect(images, index)}
                        shift={0.75}
                      />
                  )}

                  <TouchableOpacity onPress={() => refreshTela()} style={styles.capture}>
                    <Icon name="refresh" size={30} color={"#F0B42F"} />
                  </TouchableOpacity>

                  {visibleList && (
                    <ImageView
                        images={imagesOriginal}
                        imageIndex={currentImageIndex}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                        style={{
                          width: 150,
                          height: 120,
                          resizeMode: 'contain'
                        }}
                      />
                  )}
                </SafeAreaView>
            </ContainerImagens>

            <ContainerScreenButton>

              <SubmitButton onPress={ () => processAll()}>
                  <SubmitText>Processar</SubmitText>
              </SubmitButton>

              <SubmitButton onPress={ () => props.onFecharModal()}>
                  <SubmitText>Fechar</SubmitText>
              </SubmitButton>

            </ContainerScreenButton>

          </ContainerMain>

        <ContainerFooter>
          <Footer titlePage="AIZON"/>
        </ContainerFooter>

      </Background>
    );
  }

  function getMontagemTela() {
    return getMainScreen();

    //return getModalPhotoReal();

    //return getMainScreen2();
  }

 return (
    getMontagemTela()
 )

}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
      default: null,
    }),
  },
  myViewMain: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
  },
  myViewHead: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'flex-start',
  },
  myView: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
  },
  myCheck: {
    marginTop:1,
  },
  myTextView: {
    marginTop:10,
  },
  capture: {
    backgroundColor:  'transparent',
    borderRadius: 5,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 10,
  },

  //PHOTO MODAL
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

  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
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
  }


});


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

  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
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
    backgroundColor: "#CC0BB5",
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