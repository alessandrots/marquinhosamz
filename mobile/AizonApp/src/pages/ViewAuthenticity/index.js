import React, { useContext, useState, useEffect } from 'react';
import { Alert, StatusBar, StyleSheet, SafeAreaView, View, Text, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
//import Footer from '../../components/Footer';
import ImageList from "../../components/ImageList/ImageList";
import PhotoService from '../../services/photo/PhotoService';

import ImageView from "react-native-image-viewing";
import CheckBox from '@react-native-community/checkbox';


//import { ImageURISource, ImageRequireSource } from "react-native";

import { Background, ContainerHeader, ContainerFooter, ContainerMain} from '../Home/styles';

import {  Link, LinkText, SubmitButtonUpload, SubmitText} from '../SignIn/styles';

//const ImageSource = ImageURISource | ImageRequireSource;

export default function ViewAuthenticity({ navigator, route }) {

  useEffect(() => {
    console.log('route ViewAuthenticity = ', route);
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server

      //console.log('\n\n ViewAuthenticity route.params.post = ', route.params.post);
      //console.log('\n\n ViewAuthenticity route.params.side = ', route.params.side);

      if (route.params.side == 0) {
        setImageFrontal(route.params.post.base64);
      } else {
        setImageVerso(route.params.post.base64);
      }

      /**
       let prom1 = getLoadFrontPhoto64();
      prom1
      .then(() => {
          console.log('\n vai chamar o VERSO \n ');
          let prom1 = getLoadVersoPhoto64();

          prom1
          .then(() => {
              console.log('\n MOSTRRA AS IMAGENSSS \n ');

          })
          .catch(() => {
              console.log('\n Deu pau na rotina de VERSO \n ');
          })
      })
      .catch(() => {
          console.log('\n Deu pau na rotina de frente \n ');
      })
       */

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

  const [images, setImages] = useState([]);
  const [currentImageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imagesOriginal, setImagesOriginal] = useState();

  const [imageFrontal, setImageFrontal] = useState(null);
  const [imageVerso, setImageVerso]     = useState(null);

  const [visibleList, setIsVisibleList] = useState(false);

  const [toggleCheckBox, setToggleCheckBox] = useState(true);

  const onSelect = (images, index) => {
    setImageIndex(index);
    setImagesOriginal(images);
    setIsVisible(true);
  };

  /**
  function getLoadFrontPhoto() {
    let thumb = {
      thumbnail:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=992&q=80",
      uri:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=992&q=80"
    };

    let arr = null;
    if (images && images.length > 0) {
      console.log('1');
      arr = images;
    } else {
      arr = [];
      console.log('2');
    }

    arr.push(thumb);
    setImages(arr);

    if (images && images.length == 2) {
      setIsVisibleList(true);
    }
  }

  function getLoadVersoPhoto() {
    let thumb = {
      thumbnail:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
      uri:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
    };

    let arr = null;
    if (images && images.length > 0) {
      arr = images;
      console.log('1 = ', arr);
    } else {
      arr = [];
      console.log('2');
    }
    arr.push(thumb);
    setImages(arr);

    if (images && images.length == 2) {
      setIsVisibleList(true);
    }
  }
   */

  function showImagesTemp () {
    let arr = [];

    let prom1 = getLoadFrontPhoto64(arr);

    prom1
    .then((arr) => {
        console.log('\n vai chamar o VERSO \n ');
        //arr.push(imageFrontal);

        let prom2 = getLoadVersoPhoto64(arr);

        prom2
        .then((arr) => {
            console.log('\n MOSTRRA AS IMAGENSSS \n ');
            //arr.push(imgVerso);

            console.log(arr);
            setImages(arr);
            setIsVisibleList(true);
        })
        .catch(() => {
            console.log('\n Deu pau na rotina de VERSO \n ');
        })
    })
    .catch(() => {
        console.log('\n Deu pau na rotina de frente \n ');
    });
  }


  async function showImages () {

    //setImageFrontal(await PhotoService.getRGAlexandreFrontBase64());
    //setImageVerso(await PhotoService.getRGAlexandreVersoBase64());
    setImages(null);

    console.log('imageFrontal= ', imageFrontal);
    console.log('imageVerso= ', imageVerso);

    if (imageFrontal && imageVerso) {
      let arr = [];

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
      console.log(images);
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

      /**
      let arr = null;
      if (myImages && myImages.length > 0) {
        console.log('1');
        arr = myImages;
      } else {
        arr = [];
        console.log('2');
      }

      arr.push(thumb);
      fnSetImages(arr);

      if (myImages && myImages.length == 2) {
        fnSetIsVisibleList(true);
      }
      */
      resolve(arr);
    });
  }

  async function getLoadVersoPhoto64(arr) {

    /**
    let myImages = images;
    let fnSetImages = setImages;
    let fnSetIsVisibleList = setIsVisibleList
    */

    return await new Promise((resolve, reject) => {

      console.log('\n getLoadVersoPhoto64 \n ');
      let thumb = {};
      thumb['thumbnail'] = PhotoService.getRGAlexandreVersoBase64();
      thumb['uri'] = PhotoService.getRGAlexandreVersoBase64();
      arr.push(thumb);
      /**
      let arr = null;
      if (myImages && myImages.length > 0) {
        console.log('1');
        arr = myImages;
      } else {
        arr = [];
        console.log('2');
      }

      arr.push(thumb);
      fnSetImages(arr);

      // ESSA LÓGICA ABAIXO PASSARIA PRA O BOTÃO

      if (myImages && myImages.length == 2) {
        fnSetIsVisibleList(true);
      }
      */
     resolve(arr);
    });
  }

  async function uploadBase64ToAizonViaBody3() {
    console.log('uploadBase64ToAizonViaBody3 ...');
    const res = await PhotoService.uploadBase64ToAizonViaBody3('/image/upload3');

      /** fazer a solução que pegue do array de imagens..
       * Primeiro a partir do emulador fazendo o botão chamar o showImagesTemp
       * para preencher o array
       *
       * depois fazer na vera utilizando o mobile mesmo com o app instalado
       *
       * */


    if (res) {
      console.log('Status code: ',res.status);
      console.log('Status text: ',res.statusText);
      console.log('Request method: ',res.request.method);
      console.log('Path: ',res.request.path);

      console.log('Date: ',res.headers.date);
      console.log('Data: ',res.data);
      let data = res.data;
      alertMessageSucess(data);
    }
  }

  /**
   * Após o clique do showImages ou showImagesTemp
   */
  async function uploadBase64ToAizonViaBody() {
    console.log('uploadBase64ToAizonViaBody = ');
    let fileImageFront = images[0]['uri'];
    let fileImageVerso = images[1]['uri'];

    const res = await PhotoService.uploadBase64ToAizonViaBody('/image/upload3', fileImageFront, fileImageVerso);

      /** fazer a solução que pegue do array de imagens..
       * Primeiro a partir do emulador fazendo o botão chamar o showImagesTemp
       * para preencher o array
       *
       * depois fazer na vera utilizando o mobile mesmo com o app instalado
       *
       * */


    if (res) {
      console.log('Status code: ',res.status);
      console.log('Status text: ',res.statusText);
      console.log('Request method: ',res.request.method);
      console.log('Path: ',res.request.path);

      console.log('Date: ',res.headers.date);
      console.log('Data: ',res.data);
      let data = res.data;
      alertMessageSucess(data);

    }
  }

  function refreshTela() {
    setImages([]);
    setIsVisibleList(false);
    setToggleCheckBox(true);
  }

  function alertMessageSucess(data) {
    Alert.alert(
        "AIZON - UPLOAD",
        "Processamento realizado com sucesso. ID: " + data.id + ' => Data: '+ data.date_time,
        [
          {
            text: "Ok",
            onPress: () => {return null},
            style: "ok"
          }
        ],
        { cancelable: false }
    );
  }


 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Visualizar Autenticidade"/>
      </ContainerHeader>

      <ContainerMain>
        {/**
         * <Link onPress={ () => navigation.navigate('Photo')}>
            <LinkText>PHOTO 2</LinkText>
        </Link>
         *
         */}

        <View style={styles.myViewHead}>
          <CheckBox
              style={styles.myCheck}
              disabled={false}
              value={toggleCheckBox}
              onValueChange={() => toggleCheckBox ? setToggleCheckBox(false) : setToggleCheckBox(true)}
            />
            <Text style={styles.myTextView}>Rotina Temporária</Text>
            <Link onPress={ () => refreshTela()}>
                <LinkText>Refresh</LinkText>
            </Link>
        </View>

         { toggleCheckBox && (

            <View  style={styles.myView}>
              <SubmitButtonUpload onPress={ () => showImagesTemp()}>
                  <SubmitText>Exibir Imgs TMP</SubmitText>
              </SubmitButtonUpload>

              <SubmitButtonUpload onPress={ () => uploadBase64ToAizonViaBody3()}>
                  <SubmitText>UPLOAD TEMP</SubmitText>
              </SubmitButtonUpload>
            </View>
         )}

        { !toggleCheckBox && (

          <View style={styles.myViewMain}>
            <View  style={styles.myView}>
              {/** onPress={getLoadFrontPhoto64} */}
              <SubmitButtonUpload onPress={ () => navigation.navigate('Photo', { side: '0' })}>
                  <SubmitText>Foto Frontal</SubmitText>
              </SubmitButtonUpload>

              {/** onPress={getLoadVersoPhoto64} */}
              <SubmitButtonUpload onPress={ () => navigation.navigate('Photo', { side: 1 })}>
                  <SubmitText>Foto Verso</SubmitText>
              </SubmitButtonUpload>
            </View>

            <View style={styles.myView}>
              <SubmitButtonUpload onPress={ () => showImages()}>
                  <SubmitText>Exibir Imgs </SubmitText>
              </SubmitButtonUpload>

              <SubmitButtonUpload onPress={ () => uploadBase64ToAizonViaBody()}>
                  <SubmitText>UPLOAD</SubmitText>
              </SubmitButtonUpload>
            </View>
          </View>

        )}

      </ContainerMain>

      <SafeAreaView style={styles.root}>
      {visibleList && (
          <ImageList
            images={images.map((image) => image.thumbnail)}
            onPress={(index) => onSelect(images, index)}
            shift={0.75}
          />
      )}

          <ImageView
            images={imagesOriginal}
            imageIndex={currentImageIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
        </SafeAreaView>

{/**
        <SubmitButton onPress={getLoadFrontPhoto64}>
            <SubmitText>Upload Foto Front</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={getLoadVersoPhoto64}>
            <SubmitText>Upload Foto Verso</SubmitText>
        </SubmitButton>

      <ContainerFooter>
        <Footer titlePage="AIZON"/>
      </ContainerFooter>
*/}

    </Background>
  );
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

});