import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity,
  View, Text, ScrollView, Image } from 'react-native';
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

//const ImageSource = ImageURISource | ImageRequireSource;

export default function ViewData({ navigator, route }) {

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  let [responseData, setResponseData] = useState('');
  const [imageBase64, setImageBase64] = useState();


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

  async function getDataForConfigToObj() {
    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');

    if (res) {
      //console.log('Data: ', res.data.data_extract.data_extract);
      res.data.data_extract.data_extract['identificacaoDocumento'] = '6sn96FINoUghUbh';
      setResponseData(res.data.data_extract.data_extract);

      let img = await PhotoService.getImageBase64();
      //console.log(img);
      setImageBase64(img);

      /**
      dataExtract['identificacaoDocumento'] = '6sn96FINoUghUbh';
      //setIdentificacaoDocumento('6sn96FINoUghUbh');
      dataExtract['carteira_de_identidade'] = res.data.data_extract.data_extract.carteira_de_identidade;
      dataExtract['cpf'] = res.data.data_extract.data_extract.cpf;
      dataExtract['data_de_nascimento'] = res.data.data_extract.data_extract.data_de_nascimento;
      dataExtract['data_expedicao'] = res.data.data_extract.data_extract.data_expedicao;
      dataExtract['doc_origem'] = res.data.data_extract.data_extract.doc_origem;
      dataExtract['estado'] = res.data.data_extract.data_extract.estado;
      dataExtract['filiacao'] = res.data.data_extract.data_extract.filiacao;
      dataExtract['filiacao_mae'] = res.data.data_extract.data_extract.filiacao_mae;
      dataExtract['filiacao_pai'] = res.data.data_extract.data_extract.filiacao_pai;
      dataExtract['instituto'] = res.data.data_extract.data_extract.instituto;
      dataExtract['lei'] = res.data.data_extract.data_extract.lei;
      dataExtract['naturalidade'] = res.data.data_extract.data_extract.naturalidade;
      dataExtract['nome_pessoa'] = res.data.data_extract.data_extract.nome_pessoa;
      dataExtract['numeracao_espelho_a_direita_superior'] = res.data.data_extract.data_extract.numeracao_espelho_a_direita_superior;
      dataExtract['numeracao_espelho_a_esquerda_inferior'] = res.data.data_extract.data_extract.numeracao_espelho_a_esquerda_inferior;
      dataExtract['numero_rg'] = res.data.data_extract.data_extract.numero_rg;
      dataExtract['republica'] = res.data.data_extract.data_extract.republica;
      dataExtract['secretaria'] = res.data.data_extract.data_extract.secretaria;
      dataExtract['uf'] = res.data.data_extract.data_extract.uf;
      dataExtract['validade'] = res.data.data_extract.data_extract.validade;

      console.log('dataExtract = ', dataExtract);
      //setDataObj(dataExtract);
       */
    }
  }

  function getDataPopulate() {
    console.log(responseData);

    if (responseData) {
      return (
        <View style={styles.viewPrincipal}>
              <View style={styles.viewLine1}>
                <Text style={styles.textTitleFirst}>Identificação Doc.</Text>
                <Text style={styles.textTitleSecond}>UF</Text>
              </View>

              <View style={styles.viewLine2}>
                <Text  style={styles.textDataFirst}> {responseData.identificacaoDocumento }</Text>
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
    }

  }

 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Visualizar Dados"/>

      </ContainerHeader>

      <ContainerMain>

        <SafeAreaView style={styles.safeAreaViewCmp}>

          <ScrollView style={styles.scrollView}>
              {/**
              <TouchableOpacity onPress={() => getDataForConfigToObj()} style={styles.capture}>
                <Icon name="refresh" size={25} color={"#F0B42F"} />
              </TouchableOpacity>
              */}

              <View style={styles.viewCabecalho}>
                {imageBase64 && (
                        <Image
                          source={{uri: `${imageBase64}`}}
                          style={{
                            width: 51,
                            height: 51,
                            paddingBottom: 20,
                            resizeMode: 'contain'
                          }}
                          />
                      )}

                  <Text style={styles.textTitleMain}> Detalhes do Documento</Text>

              </View>

              {getDataPopulate()}

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