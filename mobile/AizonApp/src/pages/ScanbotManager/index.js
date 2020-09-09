import React, { useContext, useState, useEffect } from 'react';
import { Alert, StatusBar, StyleSheet, SafeAreaView,
  View, Text, RefreshControl, Image, ActivityIndicator,
  TouchableOpacity, Modal, Dimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageList from "../../components/ImageList/ImageList";
import PhotoService from '../../services/photo/PhotoService';

//import PhotoBase64Service from '../../services/photoBase64/PhotoBase64Service';

import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/MaterialIcons";
//import FotoCmp from '../../components/FotoCmp';
import FotoLayerCmp from '../../components/FotoLayerCmp';


import { Background, ContainerMain,
  ContainerImageRight, ContainerImageLeft, ContainerImagens,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText } from './styles';

import { ContainerHeader, ContainerFooter } from '../Home/styles';

import { alertMessage } from '../../util/util';
//import { addList} from '../../components/ScannerBot';
import Pages from '../../components/Pages';

import ScanbotSDK from 'react-native-scanbot-sdk';

export default function ScanbotManager({ navigator, route }) {

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
  const [list, setList] = useState([]);


  const { storageIdUpload } = useContext(AuthContext);


  useEffect(() => {
    //console.log('route ScanbotManager = ', route);

    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server

      //console.log('\n\n ScanbotManager route.params.post = ', route.params.post);
      //console.log('\n\n ScanbotManager route.params.side = ', route.params.side);

      if (route.params.side == 0) {
        new Promise((resolve, reject) => {
          setImageFrontal(route.params.post.base64);
          resolve(true);
        })
        .then((ret) => {
          //console.log('\n vai chamar o FRONT ret= ', imageFrontal);
          if (ret) {
            showImages();
          }
        })
        .catch(() => {
            console.log('\n Deu pau na rotina de frente \n ');
        })
      } else {
        new Promise((resolve, reject) => {
          setImageVerso(route.params.post.base64);
          resolve(true);
        })
        .then((ret) => {
          //console.log('\n vai chamar o VERSO ret= ', imageVerso);
          if (ret) {
            showImages();
          }
        })
        .catch(() => {
            console.log('\n Deu pau na rotina de frente \n ');
        })
      }
    }

  }, [route.params?.post]);


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

    console.log('uploadBase64ToAizonViaBody resposta = ', resposta);

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

  function getMontagemTela() {
    if (!modalVisibleSideUm && !modalVisibleSideZero){
      return getMainScreen();
    } else {
      return getModalPhoto();
    }
  }

  async function startDocumentScanner() {
    const config = {
      // Customize colors, text resources, etc..
      polygonColor: '#d60a0a',
      polygonColorOK: '#88ff00',
      bottomBarBackgroundColor: '#00ffff',
      bottomBarButtonsColor: '#000000',
      topBarBackgroundColor: '#00ffff',
      cameraBackgroundColor: '#00ffff',
      topBarButtonsActiveColor: '#F0B42F',
      topBarButtonsInactiveColor: '#000000',
      userGuidanceBackgroundColor: '#00ffff',
      userGuidanceTextColor: '#9b1212',
      orientationLockMode: 'PORTRAIT',
      pageCounterButtonTitle: '%d Pág(s)',
      multiPageEnabled: true,
      ignoreBadAspectRatio: true,
      autoSnappingSensitivity: 0.85,
      flashButtonTitle: 'Flash',
      multiPageButtonTitle: 'Multi-Pág.',
      cancelButtonTitle: 'Cancelar',
      enableCameraButtonTitle: 'Permitir o uso da câmera',
      enableCameraExplanationText: 'Não houve permissão para o uso da câmera',
      textHintBadAngles: 'Detecção Ok, mas a angulação está ruim',
      textHintBadAspectRatio: 'Detecção Ok, mas o aspecto está ruim',
      textHintNothingDetected: 'Nada foi detectado',
      textHintOK: 'Detecção Ok',
      textHintTooDark: 'Detecção muito escura',
      textHintTooNoisy: 'Detecção muito barulhenta',
      textHintTooSmall: 'Detecção muito pequena',
    };

    const result = await ScanbotSDK.UI.startDocumentScanner(config);
    console.log(' result startDocumentScanner = ', result);

    if (result.status === 'OK') {
      addList(result.pages);

      navigation.navigate('ScanbotImage', { pages: result.pages});
    }
  }

  function add(page) {
    setList(page);
  }

  function cleanList() {
    setList([]);
  }

  function addList(pages) {
    pages.forEach((page) => {
        add(page);
    });
  }


  function getMainScreen() {
    return (

      <Background>
        <ContainerHeader>
          <Header titlePage="Orientações"/>
        </ContainerHeader>

          <ContainerMain>

            <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>
                <ContainerDadosView>
                  <TitleText>Tirar Fotografia: </TitleText>
                  <SubmitButton onPress={ () => startDocumentScanner()}>
                      <SubmitText>Frontal</SubmitText>
                  </SubmitButton>
                </ContainerDadosView>

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
