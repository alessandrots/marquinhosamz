import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity,
  View, Text, ScrollView, ActivityIndicator, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import PhotoService from '../../services/photo/PhotoService';
import { WebView } from 'react-native-webview';

import { Background, ContainerHeader, ContainerFooter, ContainerMain, Link, LinkText} from './styles';

export default function PdfView({ navigator, route }) {

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  let [responseData, setResponseData] = useState('');
  const [imageBase64, setImageBase64] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataForConfigToObj();
    return () => {
      //como se fosse o componentWillUnmount
    }

  }, [dataExtract]);

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
  async function getDataForConfigToObj() {
    setLoading(true);
    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');

    //console.log('res = ', 'data:application/pdf;base64,' + res.data.certification);

    if (res) {
      //setResponseData(res.data.data_extract.data_extract);

      //let img = await PhotoService.getImageBase64();
      setImageBase64('data:application/pdf;base64,' + res.data.certification);
      setLoading(false);



      //setImageBase64(img);
    }
  }

  function getUriPdf() {
    if (!imageBase64) {
        alertMessageUpload('PDF não carregado', false);
    }

    /**
     * <WebView
                source={{
                    uri: `${imageBase64}`
                }}
                style={{ marginTop: 20 }}
            />
     */
    return (
        <Image source={{uri: `${imageBase64}`}} style={{ height: 400, width: 300, }} />
    )
    //console.log('res 2 = ', imageBase64);
    //return imageBase64
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

 return (
    <Background>
        <ContainerHeader>
        <Header titlePage="Certificado"/>

      </ContainerHeader>

      <ContainerMain>
        <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>

        <SafeAreaView style={styles.safeAreaViewCmp}>

          <ScrollView style={styles.scrollView}>
              <View style={styles.viewCabecalho}>
                  {/**
                {imageBase64 && (
                    <WebView
                        source={{
                            uri: `${imageBase64}`
                        }}
                        style={{ marginTop: 20 }}
                    />
                )}

                <Link onPress={ () => getUriPdf}>
                    <LinkText>PDF</LinkText>
                </Link>
                 */}


                {imageBase64 && (
                        <Image
                          source={{uri: `${imageBase64}`}}
                          style={{
                            width: 350,
                            height: 300,
                            resizeMode: 'contain'
                          }}
                          />
                    )}
              </View>

            </ScrollView>
          </SafeAreaView>
      </ContainerMain>

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

  safeAreaViewCmp: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
    marginTop: 10,
  },

  scrollView: {
    backgroundColor: "#FFF",
    marginHorizontal: 15,
  },

  viewPrincipal:{
    flex:1,
    flexDirection: "column",
  },

  viewCabecalho: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    ...Platform.select({
      android: { paddingTop: 10 },
      default: null,
    }),
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

  textTitleMain: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F0B42F",
    paddingLeft:20,
    paddingBottom: 10,
  },

  textTitleFirst: {
    fontSize: 14,
    color: "#F0B42F",
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 80,
  },

  textTitleSecond: {
    fontSize: 14,
    color: "#F0B42F",
    fontWeight: "bold",

  },
  textDataFirst: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,

  },
  textDataSecond: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 80,
    marginRight: 10,
  }

});