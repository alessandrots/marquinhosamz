import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import PhotoService from '../../services/photo/PhotoService';

import FotoCmp from '../../components/FotoCmp';
//import PhotoMain  from '../../components/Photo';

import { Background, ContainerHeader } from '../Home/styles';
import { SubmitButton, SubmitText } from '../SignIn/styles';

export default function Home(props) {

  const { user } = useContext(AuthContext);

  const [imageBase64, setImageBase64] = useState();
  const [showPhoto, setShowPhoto] = useState(false);
  const [showPhotoSideOne, setShowPhotoSideOne] = useState(false);

  function showNewCompPhoto() {
    setShowPhoto(true);
  }

  function showNewCompPhotoSideOne() {
    setShowPhotoSideOne(true);
  }

  useEffect(() => {
    console.log('\n\n route PhotoView = ', props);



  }, []);

  //para atualizar a foto após ser retirado
  //const encodedData = 'R0lGODlhAQABAIAAAAAA...7';
  //<Image source={{uri: `data:image/gif;base64,${encodedData}`}} />
  //https://medium.com/@awesomejerry/image-with-react-native-98e7363f6dfe

 return (
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


      {showPhoto && (
          <FotoCmp side="0"/>
      )}


      {showPhotoSideOne && (
        <FotoCmp side="1"/>
      )}

    </Background>
  );
}