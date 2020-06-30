import React, { useContext, useState, useEffect } from 'react';
import { Alert, StatusBar, StyleSheet, SafeAreaView,
  View, Text, RefreshControl, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageList from "../../components/ImageList/ImageList";
import PhotoService from '../../services/photo/PhotoService';

import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Background, ContainerMain, SendImageBackground,
  ContainerImageRight, ContainerImageLeft, ContainerImagens,ContainerDadosView,
  ContainerScreenButton, SubmitButton, SubmitText,
  TitleText, ItemText, Link, LinkText } from './styles';
import { ContainerHeader, ContainerFooter } from '../Home/styles';

export default function PhotoManager({ navigator, route }) {

  const [images, setImages] = useState([]);
  const [currentImageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imagesOriginal, setImagesOriginal] = useState();

  const [imageFrontal, setImageFrontal] = useState(null);
  const [imageVerso, setImageVerso]     = useState(null);

  const [visibleList, setIsVisibleList] = useState(false);

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //console.log('route PhotoManager = ', route);

    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server

      //console.log('\n\n PhotoManager route.params.post = ', route.params.post);
      //console.log('\n\n PhotoManager route.params.side = ', route.params.side);

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

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  //const architecture = [];

  //arr = [];

  //const arrayImagesOriginal = [];



  const onSelect = (images, index) => {
    setImageIndex(index);
    setImagesOriginal(images);
    setIsVisible(true);
  };



  async function showImages () {

    if (imageFrontal && imageVerso) {
      let arr = [];
      console.log('\n\n showImages 2= ');

      let imgObjFrontal = {};
      imgObjFrontal['thumbnail'] = 'data:image/jpeg;base64,' + imageFrontal;
      imgObjFrontal['uri'] = 'data:image/jpeg;base64,' + imageFrontal;

      //imgObjFrontal['thumbnail'] = imageFrontal;
      //imgObjFrontal['uri'] = imageFrontal;
      arr.push(imgObjFrontal);

      let imgObjVerso = {};
      imgObjVerso['thumbnail'] = 'data:image/jpeg;base64,' + imageVerso;
      imgObjVerso['uri'] = 'data:image/jpeg;base64,' + imageVerso;

      //imgObjVerso['thumbnail'] = imageVerso;
      //imgObjVerso['uri'] = imageVerso;
      arr.push(imgObjVerso);

      setImages(arr);
      //console.log(images);
      setIsVisibleList(true);
    }
  }

  async function getLoadFrontPhoto64(arr) {

    /**
    let myImages = images;
    let fnSetImages = setImages;
    let fnSetIsVisibleList = setIsVisibleList
    */

    return await new Promise((resolve, reject) => {

      console.log('\n getLoadFrontPhoto64 \n ');
      let thumb = {};
      thumb['thumbnail'] = PhotoService.getRGAlexandreFrontBase64();
      thumb['uri'] = PhotoService.getRGAlexandreFrontBase64();
      arr.push(thumb);


      resolve(arr);
    });
  }

  async function getLoadVersoPhoto64(arr) {

    return await new Promise((resolve, reject) => {

      console.log('\n getLoadVersoPhoto64 \n ');
      let thumb = {};
      thumb['thumbnail'] = PhotoService.getRGAlexandreVersoBase64();
      thumb['uri'] = PhotoService.getRGAlexandreVersoBase64();
      arr.push(thumb);

      resolve(arr);
    });
  }

  async function uploadBase64ToAizonViaBody3() {
    console.log('uploadBase64ToAizonViaBody3 ...');
    const res = await PhotoService.uploadBase64ToAizonViaBody3('/image/upload3');

    if (res) {
      console.log('Status code: ',res.status);
      console.log('Status text: ',res.statusText);
      console.log('Request method: ',res.request.method);
      console.log('Path: ',res.request.path);

      console.log('Date: ',res.headers.date);
      console.log('Data: ',res.data);
      let data = res.data;
      alertMessageUpload(data, true);
    }
  }

  /**
   * Após o clique do showImages ou showImagesTemp
   */
  async function uploadBase64ToAizonViaBody() {

    if (!images || images.length < 2) {
      alertMessageUpload('Clique no botão refresh!', false);
      return;
    }

    setLoading(true);

    console.log('uploadBase64ToAizonViaBody = ');
    let fileImageFront = images[0]['uri'];
    let fileImageVerso = images[1]['uri'];

    const res = await PhotoService.uploadBase64ToAizonViaBody('/image/upload3', fileImageFront, fileImageVerso);

    if (res) {
      setLoading(false);
      //console.log('Status code: ',res.status);
      //console.log('Data: ',res.data);
      let data = res.data;
      let msg = "Processamento realizado com sucesso. ID: " + data.id; //+ ' => Data: '+ data.date_time;
      alertMessageUpload(msg, true);

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
  }

  function alertMessageUpload( msg, sendForPage) {
    let arr =[
      {
        text: "Ok",
        style: "ok"
      }
    ]

    if (sendForPage) {
      arr = [
        {
          text: "Ok",
          onPress: () => goToDataVisualization(),
          style: "ok"
        }
      ]
    }

    Alert.alert(
        "AIZON - UPLOAD",
        msg,
        arr,
        { cancelable: false }
    );
  }

  function goToDataVisualization() {
    navigation.navigate('ViewData', { side: '0'});
  }

  function isShowImageList() {
    //console.log('\n\n 1) isShowImageList route = ', route)
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server

      console.log('\n\n PhotoManager route.params.post = ', route.params.post);
      //console.log('\n\n PhotoManager route.params.side = ', route.params.side);

      if (route.params.side == 0) {
        new Promise((resolve, reject) => {
          setImageFrontal(route.params.post.base64);
          resolve(true);
        })
        .then((ret) => {
          console.log('\n vai chamar o FRONT ret= ', imageFrontal);
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
          console.log('\n vai chamar o VERSO ret= ', imageVerso);
          if (ret) {
            showImages();
          }
        })
        .catch(() => {
            console.log('\n Deu pau na rotina de frente \n ');
        })
      }
    }
    return false;
  }

 return (
      <Background>
            <ContainerHeader>
              <Header titlePage="Orientações"/>
            </ContainerHeader>

              <ContainerMain>

                <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>
                <ContainerImageRight>

                    <ContainerDadosView>
                      <TitleText>Primeira Fotografia: </TitleText>
                      <SubmitButton onPress={ () => navigation.navigate('Photo', { side: '0', visible: true })}>
                          <SubmitText>Frontal</SubmitText>
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
                    <TitleText>Segunda Fotografia: </TitleText>
                    <SubmitButton onPress={ () => navigation.navigate('Photo', { side: 1, visible: true })}>
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

                      {!visibleList && (

                          <TouchableOpacity onPress={() => refreshTela()} style={styles.capture}>
                            <Icon name="refresh" size={50} color={"#F0B42F"} />
                          </TouchableOpacity>
                      )}

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
                    </SafeAreaView>
                </ContainerImagens>

                <ContainerScreenButton>
                  <SubmitButton onPress={ () => uploadBase64ToAizonViaBody()}>
                      <SubmitText>Upload</SubmitText>
                  </SubmitButton>

                  <SubmitButton onPress={ () => limparTela()}>
                      <SubmitText>Limpar</SubmitText>
                  </SubmitButton>
                </ContainerScreenButton>

              </ContainerMain>
            {/**</SendImageBackground>*/}

            <ContainerFooter>
              <Footer titlePage="AIZON"/>
            </ContainerFooter>

          </Background>
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

});