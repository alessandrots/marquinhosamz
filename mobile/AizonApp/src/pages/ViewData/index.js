import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageList from "../../components/ImageList/ImageList";

import ImageView from "react-native-image-viewing";

import PhotoService from '../../services/photo/PhotoService';

import { ImageURISource, ImageRequireSource } from "react-native";

import { Background, ContainerHeader, ContainerFooter, ContainerMain} from '../Home/styles';

import {  Link, LinkText, SubmitButton, SubmitText } from '../SignIn/styles';

const ImageSource = ImageURISource | ImageRequireSource;

export default function ViewData({ navigator, route }) {

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  const architecture = [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=992&q=80"
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1494959323928-ac0394595a78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
    },
  ];

  const arrayImagesOriginal = [
    {
      uri:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2965&q=80",
    },
    {
      uri:
        "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80",
    },
    {
      uri:
        "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2671&q=80",
    },
    {
      uri:
        "https://images.unsplash.com/photo-1494959323928-ac0394595a78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3022&q=80",
    },
  ];

  const [images, setImages] = useState(architecture);
  const [currentImageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imagesOriginal, setImagesOriginal] = useState();


  useEffect(() => {
    getDataForConfigToObj();
    return () => {
      //como se fosse o componentWillUnmount
    }

  }, []);

  const dataExtract = {
    'carteira_de_identidade': '',
    'cpf': '',
    'data_de_nascimento': '',
    'data_expedicao': '',
    'doc_origem': '',
    'estado': '',
    'filiacao': '',
    'filiacao_mae': '',
    'filiacao_pai': '',
    'instituto': '',
    'lei': '',
    'naturalidade': '',
    'nome_pessoa': '',
    'numeracao_espelho_a_direita_superior': '',
    'numeracao_espelho_a_esquerda_inferior': '',
    'numero_rg': '',
    'republica': '',
    'secretaria': '',
    'uf': '',
    'validade': '',
  };

// passing an empty array as second argument triggers the callback in useEffect only
// after the initial render thus replicating `componentDidMount` lifecycle behaviour
/**
 useEffect(() => {
     // action here
  }, [props.counter]); // checks for changes in the values in this array

 */



  async function getDataForConfig() {
    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');

    if (res) {
      console.log(`Status code: ${res.status}`);
      console.log(`Status text: ${res.statusText}`);
      console.log(`Request method: ${res.request.method}`);
      console.log(`Path: ${res.request.path}`);

      console.log(`Date: ${res.headers.date}`);
      console.log(`Data: ${res.data}`);
    }
  }

   /**
        let body = {
            "origin":true,
            "classification":true,
            "pre_processing":false,
            "data_extract":true,
            "data_validation":false,
            "certification":false,
            "score":true,
            "origin_image":false,
            "best_image":false,
            "binary_image":false,
            "binary_image_data_anchors":false,
            "ia_image_analisys_anchors":false,
            "list_img_to_analisys":false,
            "validate_img_anchors":false,
            "blur_validate_img_anchors":false
        }
        */
  async function getDataForConfigToObj() {
    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');

    if (res) {
      console.log('Data: ', res.data.data_extract.data_extract);
      console.log(`Data: ${res.data.data_extract.data_extract.carteira_de_identidade}`);
    }
  }

  const onSelect = (images, index) => {
    setImageIndex(index);
    setImagesOriginal(arrayImagesOriginal);
    setIsVisible(true);
  };

 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Visualizar Dados"/>
      </ContainerHeader>

      <ContainerMain>
        <Link onPress={ () => navigation.navigate('Photo')}>
            <LinkText>PHOTO 2</LinkText>
        </Link>

        {/**
        <SubmitButton onPress={getDataForConfig}>
            <SubmitText>Get DATA CONFIG</SubmitText>
        </SubmitButton>
          */}

      </ContainerMain>

      <SafeAreaView style={styles.root}>
        {/**
          <ImageList
            images={images.map((image) => image.thumbnail)}
            onPress={(index) => onSelect(travel, index)}
            shift={0.25}
          />
 */}
          <ImageList
            images={architecture.map((image) => image.thumbnail)}
            onPress={(index) => onSelect(architecture, index)}
            shift={0.75}
          />



          <ImageView
            images={imagesOriginal}
            imageIndex={currentImageIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
        </SafeAreaView>

      <ContainerFooter>
        <Footer titlePage="AIZON"/>
      </ContainerFooter>


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
});