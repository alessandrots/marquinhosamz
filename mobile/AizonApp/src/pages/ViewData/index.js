import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity,
  View, Text, ScrollView, Image, ActivityIndicator, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
//import ImageList from "../../components/ImageList/ImageList";

//import ImageView from "react-native-image-viewing";

import PhotoService from '../../services/photo/PhotoService';

//import { ImageURISource, ImageRequireSource } from "react-native";

import { Background, ContainerHeader, ContainerFooter, ContainerMain} from '../Home/styles';

import Icon from "react-native-vector-icons/MaterialIcons";
import { alertMessage } from '../../util/util';

//const ImageSource = ImageURISource | ImageRequireSource;

export default function ViewData({ navigator, route }) {

  const { loadStorageIdUpload } = useContext(AuthContext);

  const navigation = useNavigation();

  let [responseData, setResponseData] = useState(null);
  const [imageBase64, setImageBase64] = useState();
  const [loading, setLoading] = useState(false);
  const [dataErro, setDataErro] = useState(null);


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
    console.log('\n\n route ViewData = ', route);
    setLoading(true);
    setImageBase64(null);

    const id = await loadStorageIdUpload();

    if (!route.params) {
      alertMessage( 'Houve erro no detalhe do documento', null, null, 'AIZON-DETALHE');
      setLoading(false);
      return;
    }

    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', route.params.identificacaoDocumento);

    if (res) {
      console.log('\n\n res = ', res.data.data_extract);
      console.log('\n\n res = ', res.data.Erro);

      if (res.data) {
        if (res.data.data_extract) {
          setLoading(false);
          res.data.data_extract.data_extract['identificacaoDocumento'] = route.params.identificacaoDocumento;
          setResponseData(res.data.data_extract.data_extract);

          let img = await PhotoService.getImageBase64();
          setImageBase64(img);
        } else if (res.data.Erro) {
          setLoading(false);
          setDataErro(res.data.Erro)
        }
      }
    }
  }

  function getPdfButton() {
    if (responseData) {
      return (
        <View style={styles.viewRodape}>
            <TouchableOpacity onPress={() => navigation.navigate('PdfCertificate')}>
              <Image
                    source={require('../../assets/picture_as_pdf.png')}
                    style={{
                      width: 40,
                      height: 45,
                      resizeMode: 'contain'
                    }}
              />
            </TouchableOpacity>
        </View>
      );
    }
  }


  function getDataPopulate() {

    if (responseData) {
      return (
        <View style={styles.viewPrincipal}>
              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}>Identificação Doc.</Text>
                <Text style={styles.textTitleSecond}>UF</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text  style={styles.textDataFirst}> {route.params && route.params.identificacaoDocumento }</Text>
                <Text  style={styles.textDataSecond}> {responseData.uf }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> Registro Geral</Text>
                <Text style={styles.textTitleSecond}> Data de Expedição</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.numero_rg }</Text>
                <Text style={styles.textDataSecond}> {responseData.data_expedicao }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> Nome</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.nome_pessoa }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> Filiação</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.filiacao }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> Naturalidade</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.naturalidade }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> Nascimento</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.data_de_nascimento }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> Documento Origem</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.doc_origem }</Text>
              </View>

              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}> CPF</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text style={styles.textDataFirst}> {responseData.cpf }</Text>
              </View>
      </View>)
    } else if (dataErro) {
      return (
        <View style={styles.viewPrincipal}>
          <View style={styles.viewLine2}>
                <Text  style={styles.textDataFirst}> Documento: </Text>
                <Text  style={styles.textDataFirst}> {route.params.identificacaoDocumento }</Text>
         </View>
          <View style={styles.viewLine1}>
            <Text style={styles.textTitleError}> Problemas ao carregar dados! Erro: {dataErro}</Text>
          </View>
        </View>
      )
    }

  }

 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Visualizar Dados"/>

      </ContainerHeader>

      <ContainerMain>

        <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>

        <SafeAreaView style={styles.safeAreaViewCmp}>

          <ScrollView style={styles.scrollView}>
              <View style={styles.viewCabecalho}>
                {imageBase64 && (
                        <Image
                          source={{uri: `${imageBase64}`}}
                          style={{
                            width: 51,
                            height: 51,
                            paddingBottom: 40,
                            resizeMode: 'contain'
                          }}
                          />
                      )}

                        <Text style={styles.textTitleMain}> Detalhes do Documento</Text>

              </View>

              {getDataPopulate()}

              {getPdfButton()}


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
    alignItems: 'center',
    backgroundColor: "#FFF",
    ...Platform.select({
      android: { paddingTop: 10 },
      default: null,
    }),
  },

  viewRodape: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',

    backgroundColor: "#FFF",
    ...Platform.select({
      android: { paddingTop: 10, paddingBottom:10 },
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
  },
  textTitleError: {
    fontSize: 14,
    color: "#CC0000",
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 80,
  },

});