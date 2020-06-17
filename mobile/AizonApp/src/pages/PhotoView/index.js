import React, { useContext, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
//import Footer from '../../components/Footer';

import { Background, ContainerHeader, ContainerFooter, ContainerMain} from '../Home/styles';
import PhotoMain from '../../components/Photo';

export default function PhotoView({ navigator, route }) {

  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('\n\n route PhotoView = ', route);

    if (route && route.params?.side) {
      //setSidePhoto(route.params.side);
    }

  }, [route?.params?.side]);

  //para atualizar a foto após ser retirado
  //const encodedData = 'R0lGODlhAQABAIAAAAAA...7';
  //<Image source={{uri: `data:image/gif;base64,${encodedData}`}} />
  //https://medium.com/@awesomejerry/image-with-react-native-98e7363f6dfe

 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Foto de Documento"/>
      </ContainerHeader>


      <PhotoMain objParams={ {navigator:navigator, route:route} }/>




    </Background>
  );
}