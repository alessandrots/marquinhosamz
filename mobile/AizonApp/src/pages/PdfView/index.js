import React, { useContext, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity,
  View, Text, ScrollView, ActivityIndicator, Image, Dimensions, TouchableHighlight,
  Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import PhotoService from '../../services/photo/PhotoService';
//import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';

import { Background, ContainerHeader, ContainerFooter, ContainerMain, Link, LinkText} from './styles';

export default function PdfView({ navigator, route }) {

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();

  let [responseData, setResponseData] = useState('');
  const [imageBase64, setImageBase64] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
  async function getDataForConfigToObj() {
    setImageBase64(null);
    setLoading(true);
    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');

    if (res) {
      setImageBase64('data:application/pdf;base64,' + res.data.certification);
      setLoading(false);
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

                    {imageBase64 && (
                        <View style={styles.containerRow}>
                            <TouchableHighlight
                              style={styles.openButton}
                              onPress={() => {
                                setModalVisible(true);
                              }}
                            >
                              <Text style={styles.textStyle}>Abrir PDF</Text>
                            </TouchableHighlight>
                            <Text style={styles.textStyleButton}>Certificado carregado!</Text>
                        </View>
                    )}
              </View>
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
  }

});