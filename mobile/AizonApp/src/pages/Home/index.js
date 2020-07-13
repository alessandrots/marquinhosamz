import React, { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import {  View, Text, StyleSheet, Image,
  Dimensions, TouchableHighlight, Modal} from 'react-native';

import Orientation from 'react-native-orientation-locker'

import Camera from '../../components/Camera'


import FotoCmp from '../../components/FotoCmp';
//import PhotoMain  from '../../components/Photo';

import { Background, ContainerHeader } from '../Home/styles';
import { SubmitButton, SubmitText } from '../SignIn/styles';

export default function Home(props) {

  useEffect(() => {
    Orientation.lockToPortrait()
  }, [])

  const { user } = useContext(AuthContext);

  const [imageBase64, setImageBase64] = useState();
  const [showPhoto, setShowPhoto] = useState(false);
  const [showPhotoSideOne, setShowPhotoSideOne] = useState(false);
  const [modalVisibleSideZero, setModalVisibleSideZero] = useState(false);
  const [modalVisibleSideUm, setModalVisibleSideUm] = useState(false);
  const [sidePhoto, setSidePhoto] = useState(0);

  function showNewCompPhoto() {
    //setShowPhoto(true);
    setSidePhoto(0);
    //setModalVisibleSideUm(false);
    setModalVisibleSideZero(true);
  }

  function showNewCompPhotoSideOne() {
    //setShowPhotoSideOne(true);
    setSidePhoto(1);
    //setModalVisibleSideZero(false);
    setModalVisibleSideUm(true);
  }

  useEffect(() => {
    console.log('\n\n route PhotoView = ', props);



  }, []);


  function getModalPhoto () {
    console.log('\n\n getModalPhoto modalVisibleSideUm = ', modalVisibleSideUm);

    console.log('\n\n getModalPhoto modalVisibleSideZero = ', modalVisibleSideZero);
    return  (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleSideZero || modalVisibleSideUm}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.modalView}>
          <FotoCmp side={sidePhoto} onClose= {() => {
              setModalVisibleSideUm(false);
              setModalVisibleSideZero(false);
            }}/>
        </View>

        </Modal>
    );
  }


  //para atualizar a foto após ser retirado
  //const encodedData = 'R0lGODlhAQABAIAAAAAA...7';
  //<Image source={{uri: `data:image/gif;base64,${encodedData}`}} />
  //https://medium.com/@awesomejerry/image-with-react-native-98e7363f6dfe

  {/**
      <Background>
        <ContainerHeader>
          <Header titlePage="Foto2 de Documento"/>
        </ContainerHeader>
        <SubmitButton onPress={showNewCompPhoto}>
            <SubmitText>Get PHOTO SIDE 0</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={showNewCompPhotoSideOne}>
            <SubmitText>Get PHOTO SIDE 1</SubmitText>
        </SubmitButton>

        {  getModalPhoto() }

        showPhotoSideOne && getModalPhoto(1)


        </Background>
      */ }
 return (
    <Camera />
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