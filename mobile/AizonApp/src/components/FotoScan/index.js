import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, Image, ActivityIndicator,
  TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';

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

import { Background, ContainerMain,ContainerHeader, ContainerFooter,
  ContainerImageRight, ContainerImageLeft, ContainerImagens,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText } from './styles';

import { alertMessage } from '../../util/util';

export default function FotoScan(props) {

  const [images, setImages] = useState([]);
  const [currentImageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imagesOriginal, setImagesOriginal] = useState();

  const [imageFrontal, setImageFrontal] = useState(null);
  const [imageVerso, setImageVerso]     = useState(null);

  const [visibleList, setIsVisibleList] = useState(false);

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisibleSideZero, setModalVisibleSideZero] = useState(false);
  const [modalVisibleSideUm, setModalVisibleSideUm] = useState(false);
  const [sidePhoto, setSidePhoto] = useState(0);
  const [idUpload, setIdUpload] = useState(0);
  const [idProcess, setIdProcess] = useState("");

  const { storageIdUpload } = useContext(AuthContext);

  useEffect(() => {

    console.log('AIZONApp_FotoScan props = ', props);

    if (props?.idProcesso) {
      setIdProcess(props.idProcesso);
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

  /**
   * Após o clique do showImages ou showImagesTemp
   */
  async function uploadBase64ToAizonViaBody() {

    if (!images || images.length < 2) {
      alertMessage('Clique no botão refresh!', null, null, 'AIZON-UPLOAD');
      return;
    }

    setLoading(true);

    let fileImageFront = images[0]['uri'];
    let fileImageVerso = images[1]['uri'];

    const resposta = await PhotoService.uploadBase64ToAizonViaBody('/image/upload3', fileImageFront, fileImageVerso);

    console.log('AIZONApp_FotoScan uploadBase64ToAizonViaBody resposta = ', resposta);

    const res = resposta.res

    if (!resposta.isErro) {
      setLoading(false);

      let data = res.data;

      setIdUpload(data.id);

      storageIdUpload(data.id);

      let msg = "Processamento realizado com sucesso. ID: " + data.id; //+ ' => Data: '+ data.date_time;
      //alertMessage(msg, true, data);

      let fnGo = goToDataVisualization;

      alertMessage(msg, fnGo, data, 'Aizon-Upload');
    } else {
      setLoading(false);
      alertMessage( 'Houve erro no upload das imagens', null, null, 'AIZON-UPLOAD')
    }
  }

  function refreshTela() {
    console.log(images);
    showImages ();
  }

  function limparTela() {
    setImages([]);
    setIsVisibleList(false);
    setToggleCheckBox(true);
    setImageFrontal(null);
    setImageVerso(null);
    setLoading(false);
    setModalVisibleSideUm(false);
    setModalVisibleSideZero(false);
  }

  function goToDataVisualization(data) {
    navigation.navigate('ViewData', { side: '0', 'identificacaoDocumento': data.id});
  }

  function showNewCompPhotoSideZero() {
    setSidePhoto(0);
    setModalVisibleSideZero(true);
  }

  function showNewCompPhotoSideOne() {
    setSidePhoto(1);
    setModalVisibleSideUm(true);
  }

  function getModalPhoto() {
    return  (
      <Background>
        <ContainerHeader>
          <Header titlePage="Foto de Documento"/>
        </ContainerHeader>

        <FotoLayerCmp side={sidePhoto} onClose= {() => closeModalPhoto() }/>

      </Background>
    );
  }

  function closeModalPhoto() {
    setModalVisibleSideUm(false);
    setModalVisibleSideZero(false);
  }

  /**
  function getMontagemTela() {
    if (!modalVisibleSideUm && !modalVisibleSideZero){
      return getMainScreen();
    } else {
      return getModalPhoto();
    }
  }
  */

  /**
    let promise = new Promise(function(resolve, reject) {
      //
    });
   */
  async function scanImageForProcess(tipoImagem) {
    try {
      var {
        id
      } = await OpenCV.scanImageForProcess(idProcess, tipoImagem);

      Alert.alert(
          'AIZON',
          'scanImageForProcess',
          [
              {text: 'Ok', onPress: () => {postScanner(tipoImagem)}},
          ],
          {cancelable: false},
      )
    } catch (e) {
      console.error(e);
    }
  };

  function scanner(tipoImagem) {
    console.log('AIZONApp_FotoScan_scanner');

    /**
    let promise = new Promise(function(resolve, reject) {
      //
    });
    */

    //scanImage('scanner');
    scanImageForProcess(tipoImagem);
  }

  function postScanner(tipoImagem) {
    console.log('AIZONApp_FotoScan_scanner ');

    /**
    let promise = new Promise(function(resolve, reject) {
      //
    });
    */
  }

  /**
   * recuperando a imagem por tipo
   */
  async function getImageUploadedForType(tipoImagem) {

    //alertMessage( 'Gerando do ID de controle', null, null, 'AIZON-UPLOAD')

    setLoading(true);

    const resposta = await PhotoService.getImageForIdAndType('/image/getImageForIdAndType/'+ idProcess + "/" + tipoImagem);

    //console.log('SendDocInfo generateIdForImages resposta = ', resposta);

    const res = resposta.res

    //console.log('SendDocInfo generateIdForImages res = ', res);

    if (!resposta.isErro) {
      setLoading(false);

      let data = res.data;

      console.log('SendDocInfo generateIdForImages data = ', data);

      let msg = "ID gerado com sucesso : " + data.Id;

      setIdProcess(data.Id);

      //alertMessage( msg, null, null, 'AIZON-UPLOAD');

      //para abrir a tela q vai chamar o componente de Foto
      setVisible(true);

    } else {
      setLoading(false);
      //alertMessage( 'Houve erro na geração do ID para processamento', null, null, 'AIZON-UPLOAD')
    }
  }

  function getMontagemTela() {
    return getMainScreen();
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
                  <TitleText> Foto (Frente): </TitleText>
                  <SubmitButton onPress={ () => scanner(0) }>
                    <SubmitText>Frente</SubmitText>
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
                <TitleText>Foto (Verso): </TitleText>
                  <SubmitButton onPress={ () =>scanner(1) }>
                    <SubmitText>Verso</SubmitText>
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
                    <Icon name="refresh" size={20} color={"#F0B42F"} />
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
              <SubmitButton onPress={ () => uploadBase64ToAizonViaBody()}>
                  <SubmitText>Processar</SubmitText>
              </SubmitButton>


            </ContainerScreenButton>

          </ContainerMain>

        <ContainerFooter>
          <Footer titlePage="AIZON"/>
        </ContainerFooter>

      </Background>
    );
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
