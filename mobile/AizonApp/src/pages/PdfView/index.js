import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity,
  View, Text, ScrollView, ActivityIndicator, Image, Dimensions, TouchableHighlight,
  Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { alertMessage, loadStorageUpload} from '../../util/util';

import PhotoService from '../../services/photo/PhotoService';
//import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';

import { Background, ContainerHeader, ContainerFooter, ContainerMain, Link, LinkText} from './styles';

export default function PdfView(props) {

  //const { loadStorageUpload } = useContext(AuthContext);

  const navigation = useNavigation();

  let [responseData, setResponseData] = useState('');
  const [imageBase64, setImageBase64] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataErro, setDataErro] = useState(null);
  const [idUpload, setIdUpload] = useState(null);

  useEffect(() => {
    console.log('AIZONApp_ PdfView props = ', props);

    /**
    if (props?.route?.params?.base64Pdf) {
      setImageBase64('data:application/pdf;base64,' + props.route.params.base64Pdf);
    } else {
      //getDataForConfigToObj();
       */
      //pdfProcessCertify();
    //}

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
  async function getDataForConfigToObj() {
    setImageBase64(null);
    setLoading(true);

    const id = await loadStorageUpload();

    console.log('AIZONApp_ getDataForConfigToObj id = ', id);

    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', id);

    if (res && res.data) {
      if (res.data.data_extract) {
        setImageBase64('data:application/pdf;base64,' + res.data.certification);
        setLoading(false);
      } else if (res.data.Erro) {
        setLoading(false);
        setImageBase64(null);
        setDataErro(res.data.Erro)
        setIdUpload(id);
      }
    }
  }

  async function pdfProcessCertify() {

    setLoading(true);

    const id = await loadStorageUpload();

    console.log('AIZONApp_ PdfView pdfProcessCertify id = ', JSON.parse(id));

    const resposta = await PhotoService.processPipelineViaGet("/image/pdf_process_certify2", JSON.parse(id));

    console.log('AIZONApp_ pdfProcessCertify resposta = ', resposta);

    const res = resposta.res;

    if (!resposta.isErro) {
      setLoading(false);
      setModalVisible(true);

      let data = res.data;

      console.log('AIZONApp_ PdfView pdfProcessCertify base64 = ', data.pdf);

      setImageBase64('data:application/pdf;base64,' + data.pdf);
    } else {
      storageStatusProcessingImage(4);
      setLoading(false);
      alertMessage( 'Houve erro no pdfProcessCertify das imagens', null, null, 'AIZON-PROCESS');
    }
  }

  function getDataErro() {
    if (dataErro) {
      return (
        <SafeAreaView style={styles.safeAreaViewCmp}>

          <ScrollView style={styles.scrollView}>
            <View style={styles.viewPrincipal}>
              <View style={styles.viewLine2}>
                    <Text  style={styles.textDataFirst}> Documento: </Text>
                    <Text  style={styles.textDataFirst}> {idUpload}</Text>
              </View>
              <View style={styles.viewLine1}>
                <Text style={styles.textTitleError}> Problemas ao carregar dados! Erro: {dataErro}</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )
    }
  }


 return (
    <Background>
        <ContainerHeader>
          <Header titlePage="Certificado"/>

        </ContainerHeader>

      <ContainerMain>
        <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>


          <View style={styles.container}>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          Alert.alert("Modal has been closed.");
                        }}
                      >
                        <View style={styles.modalView}>
                            <Pdf
                                source={{ uri: imageBase64 }}
                                onLoadComplete={(numberOfPages, filePath) => {
                                    console.log(`number of pages: ${numberOfPages}`);
                                }}
                                onPageChanged={(page, numberOfPages) => {
                                    console.log(`current page: ${page}`);
                                }}
                                onError={error => {
                                    console.log(error);
                                }}
                                style={styles.pdf}
                            />
                        </View>
                          <TouchableHighlight
                            style={styles.closeButton}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                            }}
                          >
                            <Text style={styles.textStyle}>Fechar</Text>
                          </TouchableHighlight>

                      </Modal>


                          <View style={styles.containerRow}>
                              <TouchableHighlight
                                style={styles.openButton}
                                onPress={() => { pdfProcessCertify(); }}
                              >
                                <Text style={styles.textStyle}>Abrir PDF</Text>
                              </TouchableHighlight>
                              <Text style={styles.textStyleButton}>Certificado carregado!</Text>
                          </View>

                </View>

              {getDataErro()}

      </ContainerMain>

      <ContainerFooter>
        <Footer titlePage="AIZON"/>
      </ContainerFooter>

    </Background>
  );
}

const styles = StyleSheet.create({


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